// @ts-nocheck
import { buildASTSchema } from 'graphql';

const schemaAST = {
  "kind": "Document",
  "definitions": [
    {
      "kind": "SchemaDefinition",
      "operationTypes": [
        {
          "kind": "OperationTypeDefinition",
          "operation": "query",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          }
        },
        {
          "kind": "OperationTypeDefinition",
          "operation": "mutation",
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Mutation"
            }
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The root query type which gives access points into the data universe.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "Query"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Exposes the root query type nested one level down. This is helpful for Relay 1\nwhich can only query top level fields if they are in a particular form.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Query"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Fetches an object given its globally unique `ID`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "node"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The globally unique `ID`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "nodeId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Node"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "allFriendships"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Friendship`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "FriendshipsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "FriendshipCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "FriendshipsConnection"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "allHugRequests"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `HugRequest`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugRequestsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "HugRequestCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequestsConnection"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "allHugs"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Hug`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "HugCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugsConnection"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Migration`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "allMigrations"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Migration`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MigrationsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "MigrationCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MigrationsConnection"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Mood`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "allMoods"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Mood`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MoodsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "MoodCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MoodsConnection"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `User`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "allUsers"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `User`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "UsersOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "UserCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UsersConnection"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "friendshipById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UUID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Friendship"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "friendshipByRequesterIdAndRecipientId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "requesterId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UUID"
                  }
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "recipientId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UUID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Friendship"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "hugRequestById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UUID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequest"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "hugById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UUID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Hug"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "migrationById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "Int"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Migration"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "migrationByName"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "name"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "String"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Migration"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "moodById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UUID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Mood"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "userById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "id"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UUID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "userByUsername"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "username"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "String"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "userByEmail"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "name": {
                "kind": "Name",
                "value": "email"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "String"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `Friendship` using its globally unique `ID`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendship"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The globally unique `ID` to be used in selecting a single `Friendship`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "nodeId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Friendship"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `HugRequest` using its globally unique `ID`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequest"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The globally unique `ID` to be used in selecting a single `HugRequest`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "nodeId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequest"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `Hug` using its globally unique `ID`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hug"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The globally unique `ID` to be used in selecting a single `Hug`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "nodeId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Hug"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `Migration` using its globally unique `ID`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migration"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The globally unique `ID` to be used in selecting a single `Migration`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "nodeId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Migration"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `Mood` using its globally unique `ID`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "mood"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The globally unique `ID` to be used in selecting a single `Mood`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "nodeId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Mood"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` using its globally unique `ID`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "user"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The globally unique `ID` to be used in selecting a single `User`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "nodeId"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "ID"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [
        {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Node"
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "InterfaceTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "An object with a globally unique `ID`.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "Node"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": [],
      "interfaces": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A connection to a list of `Friendship` values.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "FriendshipsConnection"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of `Friendship` objects.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodes"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "Friendship"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of edges which contains the `Friendship` and cursor to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "edges"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "FriendshipsEdge"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Information to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "pageInfo"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "PageInfo"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The count of *all* `Friendship` you could get from the connection.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "totalCount"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "name": {
        "kind": "Name",
        "value": "Friendship"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "followsMood"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Boolean"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Datetime"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [
        {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Node"
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "ScalarTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UUID"
      },
      "directives": []
    },
    {
      "kind": "ScalarTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A point in time as described by the [ISO\n8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "Datetime"
      },
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A user of the application",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "User"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The primary unique identifier for the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The username used to login",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "username"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The email address of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "email"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The display name of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "password"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "avatarUrl"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this user is anonymous",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isAnonymous"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Boolean"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Datetime"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Datetime"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Mood`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "moodsByUserId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Mood`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MoodsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "MoodCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MoodsConnection"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugsBySenderId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Hug`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "HugCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugsConnection"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugsByRecipientId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Hug`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "HugCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugsConnection"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequestsByRequesterId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `HugRequest`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugRequestsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "HugRequestCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugRequestsConnection"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequestsByRecipientId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `HugRequest`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugRequestsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "HugRequestCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugRequestsConnection"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipsByRequesterId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Friendship`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "FriendshipsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "FriendshipCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "FriendshipsConnection"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads and enables pagination through a set of `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipsByRecipientId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the first `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "first"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Only read the last `n` values of the set.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "last"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Skip the first `n` values from our `after` cursor, an alternative to cursor\nbased pagination. May not be used with `last`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "offset"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Int"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set before (above) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "before"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "Read all values in the set after (below) this cursor.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "after"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "Cursor"
                }
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Friendship`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "FriendshipsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            },
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "A condition to be used in determining which values should be returned by the collection.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "condition"
              },
              "type": {
                "kind": "NamedType",
                "name": {
                  "kind": "Name",
                  "value": "FriendshipCondition"
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "FriendshipsConnection"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [
        {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Node"
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A connection to a list of `Mood` values.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MoodsConnection"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of `Mood` objects.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodes"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "Mood"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of edges which contains the `Mood` and cursor to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "edges"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "MoodsEdge"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Information to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "pageInfo"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "PageInfo"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The count of *all* `Mood` you could get from the connection.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "totalCount"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A mood entry recorded by a user",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "Mood"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The mood score from 1-10",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "score"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "note"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this mood entry is publicly visible",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isPublic"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Boolean"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "userId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Datetime"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Mood`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByUserId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [
        {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Node"
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A `Mood` edge in the connection.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MoodsEdge"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A cursor for use in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "cursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Mood` at the end of the edge.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "node"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Mood"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ScalarTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A location in a connection that can be used for resuming pagination.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "Cursor"
      },
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Information about pagination in a connection.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "PageInfo"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "When paginating forwards, are there more items?",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hasNextPage"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Boolean"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "When paginating backwards, are there more items?",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hasPreviousPage"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Boolean"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "When paginating backwards, the cursor to continue.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "startCursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "When paginating forwards, the cursor to continue.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "endCursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Methods to use when ordering `Mood`.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MoodsOrderBy"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NATURAL"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "SCORE_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "SCORE_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NOTE_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NOTE_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_PUBLIC_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_PUBLIC_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "USER_ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "USER_ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_DESC"
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A condition to be used against `Mood` object types. All fields are tested for equality and combined with a logical ‘and.’",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MoodCondition"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `id` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `score` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "score"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `note` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "note"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `isPublic` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isPublic"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `userId` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `createdAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A connection to a list of `Hug` values.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugsConnection"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of `Hug` objects.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodes"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "Hug"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of edges which contains the `Hug` and cursor to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "edges"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "HugsEdge"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Information to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "pageInfo"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "PageInfo"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The count of *all* `Hug` you could get from the connection.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "totalCount"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A virtual hug sent from one user to another",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "Hug"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The type of hug (QUICK, WARM, SUPPORTIVE, etc)",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "type"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "senderId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether the recipient has read the hug",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isRead"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Boolean"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Datetime"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userBySenderId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [
        {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Node"
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A `Hug` edge in the connection.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugsEdge"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A cursor for use in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "cursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Hug` at the end of the edge.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "node"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Hug"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Methods to use when ordering `Hug`.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugsOrderBy"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NATURAL"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "TYPE_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "TYPE_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "MESSAGE_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "MESSAGE_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "SENDER_ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "SENDER_ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RECIPIENT_ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RECIPIENT_ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_READ_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_READ_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_DESC"
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A condition to be used against `Hug` object types. All fields are tested for equality and combined with a logical ‘and.’",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugCondition"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `id` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `type` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "type"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `message` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `senderId` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "senderId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `recipientId` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `isRead` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isRead"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `createdAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A connection to a list of `HugRequest` values.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugRequestsConnection"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of `HugRequest` objects.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodes"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "HugRequest"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of edges which contains the `HugRequest` and cursor to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "edges"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "HugRequestsEdge"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Information to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "pageInfo"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "PageInfo"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The count of *all* `HugRequest` you could get from the connection.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "totalCount"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A request for a hug from another user or the community",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugRequest"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this is a request to the community rather than a specific user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isCommunityRequest"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Boolean"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED)",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Datetime"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "respondedAt"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [
        {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Node"
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A `HugRequest` edge in the connection.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugRequestsEdge"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A cursor for use in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "cursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `HugRequest` at the end of the edge.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "node"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugRequest"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Methods to use when ordering `HugRequest`.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugRequestsOrderBy"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NATURAL"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "MESSAGE_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "MESSAGE_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "REQUESTER_ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "REQUESTER_ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RECIPIENT_ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RECIPIENT_ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_COMMUNITY_REQUEST_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_COMMUNITY_REQUEST_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "STATUS_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "STATUS_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RESPONDED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RESPONDED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_DESC"
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A condition to be used against `HugRequest` object types. All fields are tested\nfor equality and combined with a logical ‘and.’",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugRequestCondition"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `id` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `message` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `requesterId` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `recipientId` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `isCommunityRequest` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isCommunityRequest"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `status` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `createdAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `respondedAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "respondedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Methods to use when ordering `Friendship`.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "FriendshipsOrderBy"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NATURAL"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "REQUESTER_ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "REQUESTER_ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RECIPIENT_ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "RECIPIENT_ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "STATUS_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "STATUS_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "FOLLOWS_MOOD_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "FOLLOWS_MOOD_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "UPDATED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "UPDATED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_DESC"
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A condition to be used against `Friendship` object types. All fields are tested\nfor equality and combined with a logical ‘and.’",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "FriendshipCondition"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `id` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `requesterId` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `recipientId` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `status` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `followsMood` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "followsMood"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `createdAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `updatedAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A `Friendship` edge in the connection.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "FriendshipsEdge"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A cursor for use in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "cursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Friendship` at the end of the edge.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "node"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Friendship"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A connection to a list of `Migration` values.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MigrationsConnection"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of `Migration` objects.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodes"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "Migration"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of edges which contains the `Migration` and cursor to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "edges"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "MigrationsEdge"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Information to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "pageInfo"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "PageInfo"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The count of *all* `Migration` you could get from the connection.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "totalCount"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "name": {
        "kind": "Name",
        "value": "Migration"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "appliedAt"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [
        {
          "kind": "NamedType",
          "name": {
            "kind": "Name",
            "value": "Node"
          }
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A `Migration` edge in the connection.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MigrationsEdge"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A cursor for use in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "cursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Migration` at the end of the edge.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "node"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Migration"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Methods to use when ordering `Migration`.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MigrationsOrderBy"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NATURAL"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NAME_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NAME_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "APPLIED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "APPLIED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_DESC"
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A condition to be used against `Migration` object types. All fields are tested\nfor equality and combined with a logical ‘and.’",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MigrationCondition"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `id` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `name` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `appliedAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "appliedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A connection to a list of `User` values.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UsersConnection"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of `User` objects.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodes"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "User"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A list of edges which contains the `User` and cursor to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "edges"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "ListType",
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UsersEdge"
                  }
                }
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Information to aid in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "pageInfo"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "PageInfo"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The count of *all* `User` you could get from the connection.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "totalCount"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A `User` edge in the connection.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UsersEdge"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "A cursor for use in pagination.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "cursor"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Cursor"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `User` at the end of the edge.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "node"
          },
          "arguments": [],
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "User"
              }
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "EnumTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Methods to use when ordering `User`.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UsersOrderBy"
      },
      "values": [
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NATURAL"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "ID_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "USERNAME_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "USERNAME_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "EMAIL_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "EMAIL_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NAME_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "NAME_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PASSWORD_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PASSWORD_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "AVATAR_URL_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "AVATAR_URL_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_ANONYMOUS_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "IS_ANONYMOUS_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "CREATED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "UPDATED_AT_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "UPDATED_AT_DESC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_ASC"
          },
          "directives": []
        },
        {
          "kind": "EnumValueDefinition",
          "name": {
            "kind": "Name",
            "value": "PRIMARY_KEY_DESC"
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UserCondition"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `id` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `username` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "username"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `email` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "email"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `name` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `password` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "password"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `avatarUrl` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "avatarUrl"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `isAnonymous` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isAnonymous"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `createdAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Checks for equality with the object’s `updatedAt` field.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The root mutation type which contains root level fields which mutate data.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "Mutation"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Creates a single `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createFriendship"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "CreateFriendshipInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "CreateFriendshipPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Creates a single `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createHugRequest"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "CreateHugRequestInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "CreateHugRequestPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Creates a single `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createHug"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "CreateHugInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "CreateHugPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Creates a single `Migration`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createMigration"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "CreateMigrationInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "CreateMigrationPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Creates a single `Mood`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createMood"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "CreateMoodInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "CreateMoodPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Creates a single `User`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "createUser"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "CreateUserInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "CreateUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Friendship` using its globally unique id and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateFriendship"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateFriendshipInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateFriendshipPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Friendship` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateFriendshipById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateFriendshipByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateFriendshipPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Friendship` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateFriendshipByRequesterIdAndRecipientId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateFriendshipByRequesterIdAndRecipientIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateFriendshipPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `HugRequest` using its globally unique id and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateHugRequest"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateHugRequestInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateHugRequestPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `HugRequest` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateHugRequestById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateHugRequestByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateHugRequestPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Hug` using its globally unique id and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateHug"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateHugInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateHugPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Hug` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateHugById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateHugByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateHugPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Migration` using its globally unique id and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateMigration"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateMigrationInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateMigrationPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Migration` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateMigrationById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateMigrationByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateMigrationPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Migration` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateMigrationByName"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateMigrationByNameInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateMigrationPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Mood` using its globally unique id and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateMood"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateMoodInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateMoodPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `Mood` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateMoodById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateMoodByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateMoodPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `User` using its globally unique id and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateUser"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateUserInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `User` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateUserById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateUserByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `User` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateUserByUsername"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateUserByUsernameInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Updates a single `User` using a unique key and a patch.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "updateUserByEmail"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "UpdateUserByEmailInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UpdateUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Friendship` using its globally unique id.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteFriendship"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteFriendshipInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteFriendshipPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Friendship` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteFriendshipById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteFriendshipByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteFriendshipPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Friendship` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteFriendshipByRequesterIdAndRecipientId"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteFriendshipByRequesterIdAndRecipientIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteFriendshipPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `HugRequest` using its globally unique id.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteHugRequest"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteHugRequestInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteHugRequestPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `HugRequest` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteHugRequestById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteHugRequestByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteHugRequestPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Hug` using its globally unique id.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteHug"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteHugInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteHugPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Hug` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteHugById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteHugByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteHugPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Migration` using its globally unique id.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteMigration"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteMigrationInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteMigrationPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Migration` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteMigrationById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteMigrationByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteMigrationPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Migration` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteMigrationByName"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteMigrationByNameInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteMigrationPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Mood` using its globally unique id.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteMood"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteMoodInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteMoodPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `Mood` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteMoodById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteMoodByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteMoodPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `User` using its globally unique id.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteUser"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteUserInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `User` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteUserById"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteUserByIdInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `User` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteUserByUsername"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteUserByUsernameInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteUserPayload"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Deletes a single `User` using a unique key.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "deleteUserByEmail"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "input"
              },
              "type": {
                "kind": "NonNullType",
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "DeleteUserByEmailInput"
                  }
                }
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "DeleteUserPayload"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our create `Friendship` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateFriendshipPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Friendship` that was created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendship"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Friendship"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Friendship`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Friendship`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "FriendshipsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "FriendshipsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the create `Friendship` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateFriendshipInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Friendship` to be created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendship"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "FriendshipInput"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "An input for mutations affecting `Friendship`",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "FriendshipInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "followsMood"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our create `HugRequest` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateHugRequestPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `HugRequest` that was created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequest"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequest"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `HugRequest`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequestEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `HugRequest`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugRequestsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequestsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the create `HugRequest` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateHugRequestInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `HugRequest` to be created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequest"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugRequestInput"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "An input for mutations affecting `HugRequest`",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugRequestInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this is a request to the community rather than a specific user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isCommunityRequest"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED)",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "respondedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our create `Hug` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateHugPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Hug` that was created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hug"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Hug"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userBySenderId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Hug`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Hug`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the create `Hug` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateHugInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Hug` to be created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hug"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugInput"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "An input for mutations affecting `Hug`",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The type of hug (QUICK, WARM, SUPPORTIVE, etc)",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "type"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "senderId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether the recipient has read the hug",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isRead"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our create `Migration` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateMigrationPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Migration` that was created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migration"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Migration"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Migration`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migrationEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Migration`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MigrationsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MigrationsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the create `Migration` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateMigrationInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Migration` to be created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migration"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MigrationInput"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "An input for mutations affecting `Migration`",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MigrationInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "appliedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our create `Mood` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateMoodPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Mood` that was created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "mood"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Mood"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Mood`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByUserId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Mood`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "moodEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Mood`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MoodsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MoodsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the create `Mood` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateMoodInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Mood` to be created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "mood"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MoodInput"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "An input for mutations affecting `Mood`",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MoodInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The mood score from 1-10",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "score"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "note"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this mood entry is publicly visible",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isPublic"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "userId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our create `User` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateUserPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `User` that was created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "user"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `User`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `User`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "UsersOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UsersEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the create `User` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "CreateUserInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `User` to be created by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "user"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UserInput"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "An input for mutations affecting `User`",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UserInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The primary unique identifier for the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The username used to login",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "username"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The email address of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "email"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The display name of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "password"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "avatarUrl"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this user is anonymous",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isAnonymous"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our update `Friendship` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateFriendshipPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Friendship` that was updated by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendship"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Friendship"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Friendship`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Friendship`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "FriendshipsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "FriendshipsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateFriendship` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateFriendshipInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Friendship` to be updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Friendship` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "FriendshipPatch"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Represents an update to a `Friendship`. Fields that are set will be updated.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "FriendshipPatch"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "followsMood"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateFriendshipById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateFriendshipByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Friendship` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "FriendshipPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateFriendshipByRequesterIdAndRecipientId` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateFriendshipByRequesterIdAndRecipientIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Friendship` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "FriendshipPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our update `HugRequest` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateHugRequestPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `HugRequest` that was updated by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequest"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequest"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `HugRequest`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequestEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `HugRequest`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugRequestsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequestsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateHugRequest` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateHugRequestInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `HugRequest` to be updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `HugRequest` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequestPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugRequestPatch"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Represents an update to a `HugRequest`. Fields that are set will be updated.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugRequestPatch"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this is a request to the community rather than a specific user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isCommunityRequest"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED)",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "status"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "respondedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateHugRequestById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateHugRequestByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `HugRequest` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequestPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugRequestPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our update `Hug` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateHugPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Hug` that was updated by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hug"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Hug"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userBySenderId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Hug`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Hug`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateHug` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateHugInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Hug` to be updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Hug` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugPatch"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Represents an update to a `Hug`. Fields that are set will be updated.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "HugPatch"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The type of hug (QUICK, WARM, SUPPORTIVE, etc)",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "type"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "message"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "senderId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether the recipient has read the hug",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isRead"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateHugById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateHugByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Hug` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "HugPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our update `Migration` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateMigrationPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Migration` that was updated by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migration"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Migration"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Migration`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migrationEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Migration`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MigrationsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MigrationsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateMigration` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateMigrationInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Migration` to be updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Migration` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migrationPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MigrationPatch"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Represents an update to a `Migration`. Fields that are set will be updated.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MigrationPatch"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "appliedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateMigrationById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateMigrationByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Migration` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migrationPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MigrationPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateMigrationByName` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateMigrationByNameInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Migration` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migrationPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MigrationPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our update `Mood` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateMoodPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Mood` that was updated by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "mood"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Mood"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Mood`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByUserId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Mood`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "moodEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Mood`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MoodsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MoodsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateMood` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateMoodInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Mood` to be updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Mood` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "moodPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MoodPatch"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Represents an update to a `Mood`. Fields that are set will be updated.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "MoodPatch"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The mood score from 1-10",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "score"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Int"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "note"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this mood entry is publicly visible",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isPublic"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "userId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateMoodById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateMoodByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `Mood` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "moodPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "MoodPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our update `User` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateUserPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `User` that was updated by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "user"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `User`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `User`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "UsersOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UsersEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateUser` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateUserInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `User` to be updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `User` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UserPatch"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "Represents an update to a `User`. Fields that are set will be updated.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UserPatch"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The primary unique identifier for the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UUID"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The username used to login",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "username"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The email address of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "email"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The display name of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "password"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "avatarUrl"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Whether this user is anonymous",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "isAnonymous"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Boolean"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "createdAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "updatedAt"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Datetime"
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateUserById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateUserByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `User` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UserPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The primary unique identifier for the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateUserByUsername` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateUserByUsernameInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `User` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UserPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The username used to login",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "username"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `updateUserByEmail` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "UpdateUserByEmailInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An object where the defined keys will be set on the `User` being updated.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userPatch"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UserPatch"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The email address of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "email"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our delete `Friendship` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteFriendshipPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Friendship` that was deleted by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendship"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Friendship"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "deletedFriendshipId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Friendship`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Friendship`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "friendshipEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Friendship`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "FriendshipsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "FriendshipsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteFriendship` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteFriendshipInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Friendship` to be deleted.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteFriendshipById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteFriendshipByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteFriendshipByRequesterIdAndRecipientId` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteFriendshipByRequesterIdAndRecipientIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "requesterId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "recipientId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our delete `HugRequest` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteHugRequestPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `HugRequest` that was deleted by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequest"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequest"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "deletedHugRequestId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRequesterId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `HugRequest`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `HugRequest`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugRequestEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `HugRequest`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugRequestsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugRequestsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteHugRequest` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteHugRequestInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `HugRequest` to be deleted.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteHugRequestById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteHugRequestByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our delete `Hug` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteHugPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Hug` that was deleted by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hug"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Hug"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "deletedHugId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userBySenderId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Hug`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByRecipientId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Hug`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "hugEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Hug`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "HugsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "HugsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteHug` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteHugInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Hug` to be deleted.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteHugById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteHugByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our delete `Migration` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteMigrationPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Migration` that was deleted by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migration"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Migration"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "deletedMigrationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Migration`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "migrationEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Migration`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MigrationsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MigrationsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteMigration` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteMigrationInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Migration` to be deleted.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteMigrationById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteMigrationByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "Int"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteMigrationByName` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteMigrationByNameInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "name"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our delete `Mood` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteMoodPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `Mood` that was deleted by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "mood"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Mood"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "deletedMoodId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Reads a single `User` that is related to this `Mood`.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userByUserId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `Mood`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "moodEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `Mood`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "MoodsOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "MoodsEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteMood` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteMoodInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `Mood` to be deleted.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteMoodById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteMoodByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "ObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "The output of our delete `User` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteUserPayload"
      },
      "fields": [
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The exact same `clientMutationId` that was provided in the mutation input,\nunchanged and unused. May be used by a client to track mutations.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The `User` that was deleted by this mutation.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "user"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "User"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "deletedUserId"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "ID"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "Our root query field type. Allows us to run any query from our mutation payload.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "query"
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "Query"
            }
          },
          "directives": []
        },
        {
          "kind": "FieldDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An edge for our `User`. May be used by Relay 1.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "userEdge"
          },
          "arguments": [
            {
              "kind": "InputValueDefinition",
              "description": {
                "kind": "StringValue",
                "value": "The method to use when ordering `User`.",
                "block": true
              },
              "name": {
                "kind": "Name",
                "value": "orderBy"
              },
              "type": {
                "kind": "ListType",
                "type": {
                  "kind": "NonNullType",
                  "type": {
                    "kind": "NamedType",
                    "name": {
                      "kind": "Name",
                      "value": "UsersOrderBy"
                    }
                  }
                }
              },
              "defaultValue": {
                "kind": "ListValue",
                "values": [
                  {
                    "kind": "EnumValue",
                    "value": "PRIMARY_KEY_ASC"
                  }
                ]
              },
              "directives": []
            }
          ],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "UsersEdge"
            }
          },
          "directives": []
        }
      ],
      "interfaces": [],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteUser` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteUserInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The globally unique `ID` which will identify a single `User` to be deleted.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "nodeId"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "ID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteUserById` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteUserByIdInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The primary unique identifier for the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "id"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "UUID"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteUserByUsername` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteUserByUsernameInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The username used to login",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "username"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    },
    {
      "kind": "InputObjectTypeDefinition",
      "description": {
        "kind": "StringValue",
        "value": "All input for the `deleteUserByEmail` mutation.",
        "block": true
      },
      "name": {
        "kind": "Name",
        "value": "DeleteUserByEmailInput"
      },
      "fields": [
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "An arbitrary string value with no semantic meaning. Will be included in the\npayload verbatim. May be used to track mutations by the client.",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "clientMutationId"
          },
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String"
            }
          },
          "directives": []
        },
        {
          "kind": "InputValueDefinition",
          "description": {
            "kind": "StringValue",
            "value": "The email address of the user",
            "block": true
          },
          "name": {
            "kind": "Name",
            "value": "email"
          },
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": {
                "kind": "Name",
                "value": "String"
              }
            }
          },
          "directives": []
        }
      ],
      "directives": []
    }
  ]
};

export default buildASTSchema(schemaAST, {
  assumeValid: true,
  assumeValidSDL: true
});