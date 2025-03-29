/**
 * Direct Postgres Proxy
 * This completely bypasses GraphQL and PostGraphile to fetch data directly from PostgreSQL
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import pg from 'pg';

// Configuration
const PORT = process.env.DIRECT_PROXY_PORT || 5006; // Use environment variable with fallback to port 5006
const POSTGRES_URL = process.env.DATABASE_URL;
const SERVICE_NAME = 'DirectPostgresProxy';

// Create a PostgreSQL client
const pool = new pg.Pool({
  connectionString: POSTGRES_URL
});

// Create Express app with zero GraphQL dependencies
const app = express();

// Setup middleware
app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${SERVICE_NAME}] ${req.method} ${req.url}`);
  next();
});

// Direct Query endpoint - bypasses GraphQL entirely
app.post('/query', async (req, res) => {
  const { 
    entity, 
    limit = 10, 
    id, 
    userId, 
    filter, 
    order,
    offset = 0,
    includeRelated = false,
    operations = [] 
  } = req.body;
  
  if (!entity) {
    return res.status(400).json({
      errors: [{
        message: 'Missing entity parameter',
        service: SERVICE_NAME
      }]
    });
  }
  
  try {
    // Basic validation to prevent SQL injection
    const validEntities = ['moods', 'users', 'hugs', 'mood_streaks', 'friends'];
    if (!validEntities.includes(entity.toLowerCase())) {
      return res.status(400).json({
        errors: [{
          message: `Invalid entity: ${entity}. Allowed entities: ${validEntities.join(', ')}`,
          service: SERVICE_NAME
        }]
      });
    }
    
    // Directly use SQL instead of GraphQL
    let query;
    let params = [];
    let paramCounter = 1; // For dynamic parameter numbering
    
    // Start building the query
    let selectClause = `SELECT * FROM ${entity}`;
    let whereClause = '';
    let orderClause = '';
    let limitOffsetClause = '';
    
    // Handle WHERE conditions
    const whereConditions = [];
    
    if (id) {
      whereConditions.push(`id = $${paramCounter++}`);
      params.push(id);
    }
    
    if (userId) {
      whereConditions.push(`user_id = $${paramCounter++}`);
      params.push(userId);
    }
    
    // Add custom filters if provided
    if (filter && typeof filter === 'object') {
      Object.entries(filter).forEach(([key, value]) => {
        // Basic SQL injection prevention - only allow alphanumeric and underscore in column names
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          if (value === null) {
            whereConditions.push(`${key} IS NULL`);
          } else if (typeof value === 'object' && value.operator && value.value !== undefined) {
            // Support for operators like >, <, LIKE, etc.
            // Validate operator to prevent injection
            const validOperators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN'];
            if (validOperators.includes(value.operator.toUpperCase())) {
              whereConditions.push(`${key} ${value.operator} $${paramCounter++}`);
              params.push(value.value);
            }
          } else {
            whereConditions.push(`${key} = $${paramCounter++}`);
            params.push(value);
          }
        }
      });
    }
    
    if (whereConditions.length > 0) {
      whereClause = ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Handle ordering
    if (order && typeof order === 'object') {
      const orderParts = [];
      Object.entries(order).forEach(([key, direction]) => {
        // Prevent SQL injection in column names
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          // Validate direction
          const validDirection = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
          orderParts.push(`${key} ${validDirection}`);
        }
      });
      
      if (orderParts.length > 0) {
        orderClause = ` ORDER BY ${orderParts.join(', ')}`;
      }
    }
    
    // Add limit and offset
    limitOffsetClause = ` LIMIT $${paramCounter++} OFFSET $${paramCounter++}`;
    params.push(limit);
    params.push(offset);
    
    // Build the complete query
    query = selectClause + whereClause + orderClause + limitOffsetClause;
    
    // Execute the query directly
    const result = await pool.query(query, params);
    
    // Handle related entities if requested
    let relatedData = {};
    if (includeRelated) {
      if (entity === 'users' && result.rows.length > 0) {
        // Fetch related moods for users
        const userIds = result.rows.map(user => user.id);
        const moodsResult = await pool.query(
          'SELECT * FROM moods WHERE user_id = ANY($1) ORDER BY created_at DESC',
          [userIds]
        );
        
        relatedData.moods = moodsResult.rows;
      } else if (entity === 'moods' && result.rows.length > 0) {
        // Fetch user info for moods
        const userIds = [...new Set(result.rows.map(mood => mood.user_id))];
        const usersResult = await pool.query(
          'SELECT id, username, avatar_url FROM users WHERE id = ANY($1)',
          [userIds]
        );
        
        relatedData.users = usersResult.rows;
      }
    }
    
    // Process any operations if specified
    let operationsData = {};
    if (operations && operations.length > 0) {
      for (const op of operations) {
        if (op.type === 'count' && op.entity) {
          // Count operation - e.g., count all moods for a user
          if (validEntities.includes(op.entity)) {
            let countQuery = `SELECT COUNT(*) FROM ${op.entity}`;
            let countParams = [];
            let countWhere = [];
            let countParamIndex = 1;
            
            if (op.filter) {
              Object.entries(op.filter).forEach(([key, value]) => {
                if (/^[a-zA-Z0-9_]+$/.test(key)) {
                  countWhere.push(`${key} = $${countParamIndex++}`);
                  countParams.push(value);
                }
              });
            }
            
            if (countWhere.length > 0) {
              countQuery += ` WHERE ${countWhere.join(' AND ')}`;
            }
            
            const countResult = await pool.query(countQuery, countParams);
            operationsData[`${op.entity}Count`] = parseInt(countResult.rows[0].count);
          }
        } else if (op.type === 'aggregate' && op.entity && op.function) {
          // Aggregate operations - e.g., average mood rating
          if (validEntities.includes(op.entity) && /^[a-zA-Z0-9_]+$/.test(op.column)) {
            const validFunctions = ['AVG', 'SUM', 'MIN', 'MAX'];
            const func = op.function.toUpperCase();
            
            if (validFunctions.includes(func)) {
              let aggQuery = `SELECT ${func}(${op.column}) FROM ${op.entity}`;
              let aggParams = [];
              let aggWhere = [];
              let aggParamIndex = 1;
              
              if (op.filter) {
                Object.entries(op.filter).forEach(([key, value]) => {
                  if (/^[a-zA-Z0-9_]+$/.test(key)) {
                    aggWhere.push(`${key} = $${aggParamIndex++}`);
                    aggParams.push(value);
                  }
                });
              }
              
              if (aggWhere.length > 0) {
                aggQuery += ` WHERE ${aggWhere.join(' AND ')}`;
              }
              
              const aggResult = await pool.query(aggQuery, aggParams);
              operationsData[`${op.entity}${func}`] = aggResult.rows[0][func.toLowerCase()];
            }
          }
        }
      }
    }
    
    // Add live query metadata for clients
    return res.json({
      data: {
        [`all${entity.charAt(0).toUpperCase() + entity.slice(1)}`]: {
          nodes: result.rows,
          pageInfo: {
            hasNextPage: result.rows.length === limit,
            hasPreviousPage: offset > 0,
            totalCount: operationsData[`${entity}Count`] || result.rows.length
          }
        },
        ...(Object.keys(relatedData).length > 0 ? { related: relatedData } : {}),
        ...(Object.keys(operationsData).length > 0 ? { operations: operationsData } : {})
      },
      extensions: {
        proxy: {
          service: SERVICE_NAME,
          timestamp: new Date().toISOString(),
          type: 'direct-postgres'
        },
        liveQuery: {
          isLiveQuery: req.query.live === 'true',
          pollInterval: 2000,
          supportedOperations: ['query']
        }
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      errors: [{
        message: `Database error: ${error.message}`,
        service: SERVICE_NAME,
        stack: error.stack
      }]
    });
  }
});

// Extract the query handler logic into a separate function
async function handleQuery(req, res, forceLive = false) {
  const { 
    entity, 
    limit = 10, 
    id, 
    userId, 
    filter, 
    order,
    offset = 0,
    includeRelated = false,
    operations = [] 
  } = req.body;
  
  if (!entity) {
    return res.status(400).json({
      errors: [{
        message: 'Missing entity parameter',
        service: SERVICE_NAME
      }]
    });
  }
  
  try {
    // Basic validation to prevent SQL injection
    const validEntities = ['moods', 'users', 'hugs', 'mood_streaks', 'friends'];
    if (!validEntities.includes(entity.toLowerCase())) {
      return res.status(400).json({
        errors: [{
          message: `Invalid entity: ${entity}. Allowed entities: ${validEntities.join(', ')}`,
          service: SERVICE_NAME
        }]
      });
    }
    
    // Directly use SQL instead of GraphQL
    let query;
    let params = [];
    let paramCounter = 1; // For dynamic parameter numbering
    
    // Start building the query
    let selectClause = `SELECT * FROM ${entity}`;
    let whereClause = '';
    let orderClause = '';
    let limitOffsetClause = '';
    
    // Handle WHERE conditions
    const whereConditions = [];
    
    if (id) {
      whereConditions.push(`id = $${paramCounter++}`);
      params.push(id);
    }
    
    if (userId) {
      whereConditions.push(`user_id = $${paramCounter++}`);
      params.push(userId);
    }
    
    // Add custom filters if provided
    if (filter && typeof filter === 'object') {
      Object.entries(filter).forEach(([key, value]) => {
        // Basic SQL injection prevention - only allow alphanumeric and underscore in column names
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          if (value === null) {
            whereConditions.push(`${key} IS NULL`);
          } else if (typeof value === 'object' && value.operator && value.value !== undefined) {
            // Support for operators like >, <, LIKE, etc.
            // Validate operator to prevent injection
            const validOperators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN'];
            if (validOperators.includes(value.operator.toUpperCase())) {
              whereConditions.push(`${key} ${value.operator} $${paramCounter++}`);
              params.push(value.value);
            }
          } else {
            whereConditions.push(`${key} = $${paramCounter++}`);
            params.push(value);
          }
        }
      });
    }
    
    if (whereConditions.length > 0) {
      whereClause = ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Handle ordering
    if (order && typeof order === 'object') {
      const orderParts = [];
      Object.entries(order).forEach(([key, direction]) => {
        // Prevent SQL injection in column names
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          // Validate direction
          const validDirection = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
          orderParts.push(`${key} ${validDirection}`);
        }
      });
      
      if (orderParts.length > 0) {
        orderClause = ` ORDER BY ${orderParts.join(', ')}`;
      }
    }
    
    // Add limit and offset
    limitOffsetClause = ` LIMIT $${paramCounter++} OFFSET $${paramCounter++}`;
    params.push(limit);
    params.push(offset);
    
    // Build the complete query
    query = selectClause + whereClause + orderClause + limitOffsetClause;
    
    // Execute the query directly
    const result = await pool.query(query, params);
    
    // Handle related entities if requested
    let relatedData = {};
    if (includeRelated) {
      if (entity === 'users' && result.rows.length > 0) {
        // Fetch related moods for users
        const userIds = result.rows.map(user => user.id);
        const moodsResult = await pool.query(
          'SELECT * FROM moods WHERE user_id = ANY($1) ORDER BY created_at DESC',
          [userIds]
        );
        
        relatedData.moods = moodsResult.rows;
      } else if (entity === 'moods' && result.rows.length > 0) {
        // Fetch user info for moods
        const userIds = [...new Set(result.rows.map(mood => mood.user_id))];
        const usersResult = await pool.query(
          'SELECT id, username, avatar_url FROM users WHERE id = ANY($1)',
          [userIds]
        );
        
        relatedData.users = usersResult.rows;
      }
    }
    
    // Process any operations if specified
    let operationsData = {};
    if (operations && operations.length > 0) {
      for (const op of operations) {
        if (op.type === 'count' && op.entity) {
          // Count operation - e.g., count all moods for a user
          if (validEntities.includes(op.entity)) {
            let countQuery = `SELECT COUNT(*) FROM ${op.entity}`;
            let countParams = [];
            let countWhere = [];
            let countParamIndex = 1;
            
            if (op.filter) {
              Object.entries(op.filter).forEach(([key, value]) => {
                if (/^[a-zA-Z0-9_]+$/.test(key)) {
                  countWhere.push(`${key} = $${countParamIndex++}`);
                  countParams.push(value);
                }
              });
            }
            
            if (countWhere.length > 0) {
              countQuery += ` WHERE ${countWhere.join(' AND ')}`;
            }
            
            const countResult = await pool.query(countQuery, countParams);
            operationsData[`${op.entity}Count`] = parseInt(countResult.rows[0].count);
          }
        } else if (op.type === 'aggregate' && op.entity && op.function) {
          // Aggregate operations - e.g., average mood rating
          if (validEntities.includes(op.entity) && /^[a-zA-Z0-9_]+$/.test(op.column)) {
            const validFunctions = ['AVG', 'SUM', 'MIN', 'MAX'];
            const func = op.function.toUpperCase();
            
            if (validFunctions.includes(func)) {
              let aggQuery = `SELECT ${func}(${op.column}) FROM ${op.entity}`;
              let aggParams = [];
              let aggWhere = [];
              let aggParamIndex = 1;
              
              if (op.filter) {
                Object.entries(op.filter).forEach(([key, value]) => {
                  if (/^[a-zA-Z0-9_]+$/.test(key)) {
                    aggWhere.push(`${key} = $${aggParamIndex++}`);
                    aggParams.push(value);
                  }
                });
              }
              
              if (aggWhere.length > 0) {
                aggQuery += ` WHERE ${aggWhere.join(' AND ')}`;
              }
              
              const aggResult = await pool.query(aggQuery, aggParams);
              operationsData[`${op.entity}${func}`] = aggResult.rows[0][func.toLowerCase()];
            }
          }
        }
      }
    }
    
    // Add live query metadata for clients
    return res.json({
      data: {
        [`all${entity.charAt(0).toUpperCase() + entity.slice(1)}`]: {
          nodes: result.rows,
          pageInfo: {
            hasNextPage: result.rows.length === limit,
            hasPreviousPage: offset > 0,
            totalCount: operationsData[`${entity}Count`] || result.rows.length
          }
        },
        ...(Object.keys(relatedData).length > 0 ? { related: relatedData } : {}),
        ...(Object.keys(operationsData).length > 0 ? { operations: operationsData } : {})
      },
      extensions: {
        proxy: {
          service: SERVICE_NAME,
          timestamp: new Date().toISOString(),
          type: 'direct-postgres'
        },
        liveQuery: {
          isLiveQuery: forceLive || req.query.live === 'true',
          pollInterval: 2000,
          supportedOperations: ['query']
        }
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      errors: [{
        message: `Database error: ${error.message}`,
        service: SERVICE_NAME,
        stack: error.stack
      }]
    });
  }
}

// Direct Query endpoint - bypasses GraphQL entirely
app.post('/query', async (req, res) => {
  await handleQuery(req, res);
});

// Dedicated Live Query endpoint
app.post('/live-query', async (req, res) => {
  // Force live query mode regardless of query parameters
  await handleQuery(req, res, true);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    postgresUrl: POSTGRES_URL ? 'Connected' : 'Missing'
  });
});

// Mutations endpoint - direct database writes
app.post('/mutation', async (req, res) => {
  const { operation, entity, data, filter, returning = '*' } = req.body;
  
  if (!operation || !entity) {
    return res.status(400).json({
      errors: [{
        message: 'Missing required parameters: operation and entity',
        service: SERVICE_NAME
      }]
    });
  }
  
  try {
    // Basic validation to prevent SQL injection
    const validEntities = ['moods', 'users', 'hugs', 'mood_streaks', 'friends'];
    if (!validEntities.includes(entity.toLowerCase())) {
      return res.status(400).json({
        errors: [{
          message: `Invalid entity: ${entity}. Allowed entities: ${validEntities.join(', ')}`,
          service: SERVICE_NAME
        }]
      });
    }
    
    // Validate operation
    const validOperations = ['create', 'update', 'delete'];
    if (!validOperations.includes(operation.toLowerCase())) {
      return res.status(400).json({
        errors: [{
          message: `Invalid operation: ${operation}. Allowed operations: ${validOperations.join(', ')}`,
          service: SERVICE_NAME
        }]
      });
    }
    
    // Validate returning clause to prevent SQL injection
    const validReturning = returning === '*' || /^[a-zA-Z0-9_, ]+$/.test(returning);
    if (!validReturning) {
      return res.status(400).json({
        errors: [{
          message: `Invalid returning clause: ${returning}`,
          service: SERVICE_NAME
        }]
      });
    }
    
    let result;
    
    // Handle different operations
    if (operation.toLowerCase() === 'create') {
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'Missing or invalid data for create operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      // Extract column names and values, preventing SQL injection
      const columns = [];
      const values = [];
      const params = [];
      let paramCounter = 1;
      
      for (const [key, value] of Object.entries(data)) {
        // Basic SQL injection prevention - only allow alphanumeric and underscore in column names
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          columns.push(key);
          values.push(`$${paramCounter++}`);
          params.push(value);
        }
      }
      
      if (columns.length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'No valid columns provided for create operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      const query = `INSERT INTO ${entity} (${columns.join(', ')}) VALUES (${values.join(', ')}) RETURNING ${returning}`;
      result = await pool.query(query, params);
    } else if (operation.toLowerCase() === 'update') {
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'Missing or invalid data for update operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'Missing filter for update operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      // Build set clause
      const setClauses = [];
      const params = [];
      let paramCounter = 1;
      
      for (const [key, value] of Object.entries(data)) {
        // Basic SQL injection prevention
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          setClauses.push(`${key} = $${paramCounter++}`);
          params.push(value);
        }
      }
      
      if (setClauses.length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'No valid columns provided for update operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      // Build where clause
      const whereConditions = [];
      
      for (const [key, value] of Object.entries(filter)) {
        // Basic SQL injection prevention
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          whereConditions.push(`${key} = $${paramCounter++}`);
          params.push(value);
        }
      }
      
      if (whereConditions.length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'No valid filter conditions provided for update operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      const query = `UPDATE ${entity} SET ${setClauses.join(', ')} WHERE ${whereConditions.join(' AND ')} RETURNING ${returning}`;
      result = await pool.query(query, params);
    } else if (operation.toLowerCase() === 'delete') {
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'Missing filter for delete operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      // Build where clause
      const whereConditions = [];
      const params = [];
      let paramCounter = 1;
      
      for (const [key, value] of Object.entries(filter)) {
        // Basic SQL injection prevention
        if (/^[a-zA-Z0-9_]+$/.test(key)) {
          whereConditions.push(`${key} = $${paramCounter++}`);
          params.push(value);
        }
      }
      
      if (whereConditions.length === 0) {
        return res.status(400).json({
          errors: [{
            message: 'No valid filter conditions provided for delete operation',
            service: SERVICE_NAME
          }]
        });
      }
      
      const query = `DELETE FROM ${entity} WHERE ${whereConditions.join(' AND ')} RETURNING ${returning}`;
      result = await pool.query(query, params);
    }
    
    return res.json({
      data: {
        [`${operation}${entity.charAt(0).toUpperCase() + entity.slice(1)}`]: {
          returning: result.rows
        }
      },
      extensions: {
        proxy: {
          service: SERVICE_NAME,
          timestamp: new Date().toISOString(),
          type: 'direct-postgres'
        }
      }
    });
  } catch (error) {
    console.error('Database mutation error:', error);
    return res.status(500).json({
      errors: [{
        message: `Database mutation error: ${error.message}`,
        service: SERVICE_NAME,
        stack: error.stack
      }]
    });
  }
});

// Authentication endpoint (basic support)
app.post('/auth', async (req, res) => {
  const { operation, email, password, username, userData } = req.body;
  
  if (!operation) {
    return res.status(400).json({
      errors: [{
        message: 'Missing operation parameter',
        service: SERVICE_NAME
      }]
    });
  }
  
  try {
    // Handle different auth operations
    if (operation === 'register') {
      if (!email || !password || !username) {
        return res.status(400).json({
          errors: [{
            message: 'Missing required fields for registration',
            service: SERVICE_NAME
          }]
        });
      }
      
      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          errors: [{
            message: 'User with this email already exists',
            service: SERVICE_NAME
          }]
        });
      }
      
      // Create new user (in a real app, you'd hash the password)
      const newUser = await pool.query(
        'INSERT INTO users (email, password, username, name, created_at, updated_at) VALUES ($1, $2, $3, $3, NOW(), NOW()) RETURNING id, email, username, name, created_at',
        [email, password, username]
      );
      
      return res.json({
        data: {
          register: {
            user: newUser.rows[0],
            token: `mock-token-${newUser.rows[0].id}`
          }
        }
      });
    } else if (operation === 'login') {
      if (!email || !password) {
        return res.status(400).json({
          errors: [{
            message: 'Missing email or password',
            service: SERVICE_NAME
          }]
        });
      }
      
      // Check credentials (in a real app, you'd verify the hashed password)
      const user = await pool.query(
        'SELECT id, email, username, name, created_at FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );
      
      if (user.rows.length === 0) {
        return res.status(401).json({
          errors: [{
            message: 'Invalid email or password',
            service: SERVICE_NAME
          }]
        });
      }
      
      return res.json({
        data: {
          login: {
            user: user.rows[0],
            token: `mock-token-${user.rows[0].id}`
          }
        }
      });
    } else if (operation === 'me') {
      // Get user info from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          errors: [{
            message: 'Missing or invalid authorization token',
            service: SERVICE_NAME
          }]
        });
      }
      
      const token = authHeader.split(' ')[1];
      // In a real app, you would verify JWT. Here we just check the mock token format
      if (!token.startsWith('mock-token-')) {
        return res.status(401).json({
          errors: [{
            message: 'Invalid token',
            service: SERVICE_NAME
          }]
        });
      }
      
      const userId = token.replace('mock-token-', '');
      const user = await pool.query(
        'SELECT id, email, username, name, created_at FROM users WHERE id = $1',
        [userId]
      );
      
      if (user.rows.length === 0) {
        return res.status(404).json({
          errors: [{
            message: 'User not found',
            service: SERVICE_NAME
          }]
        });
      }
      
      return res.json({
        data: {
          me: user.rows[0]
        }
      });
    } else {
      return res.status(400).json({
        errors: [{
          message: `Unsupported auth operation: ${operation}`,
          service: SERVICE_NAME
        }]
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      errors: [{
        message: `Auth error: ${error.message}`,
        service: SERVICE_NAME,
        stack: error.stack
      }]
    });
  }
});

// Test endpoint
app.get('/test', async (req, res) => {
  try {
    // Test the database connection
    const result = await pool.query('SELECT NOW() as time');
    
    res.json({
      status: 'ok',
      timestamp: result.rows[0].time,
      note: "This proxy bypasses GraphQL entirely to avoid version conflicts",
      service: SERVICE_NAME
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      note: "Database connection failed"
    });
  }
});

// Start server
const server = http.createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ${SERVICE_NAME} running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Direct Postgres Query: http://0.0.0.0:${PORT}/query`);
  console.log(`🔄 Live Query Endpoint: http://0.0.0.0:${PORT}/live-query`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://0.0.0.0:${PORT}/test`);
});