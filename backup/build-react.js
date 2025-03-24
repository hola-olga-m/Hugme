const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure directories exist
const publicDir = path.join(__dirname, 'public');
const staticDir = path.join(publicDir, 'static');
const jsDir = path.join(staticDir, 'js');
const cssDir = path.join(staticDir, 'css');

// Create directories if they don't exist
[publicDir, staticDir, jsDir, cssDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('Starting React build process...');

// Create webpack config file
const webpackConfigPath = path.join(__dirname, 'webpack.config.js');
fs.writeFileSync(webpackConfigPath, `
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'static/js/[name].[contenthash:8].bundle.js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:8][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    },
    runtimeChunk: {
      name: entrypoint => \`runtime-\${entrypoint.name}\`
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};`);

// Install required dependencies if not already installed
try {
  console.log('Installing required dependencies...');
  execSync('npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react css-loader mini-css-extract-plugin html-webpack-plugin', { stdio: 'inherit' });

  // Run webpack to build the project
  console.log('Building React application...');
  execSync('npx webpack --config webpack.config.js', { stdio: 'inherit' });

  console.log('React build completed successfully!');

  // Clean up webpack config after build
  fs.unlinkSync(webpackConfigPath);

  console.log(`
Build output:
- JS files: ${jsDir}
- CSS files: ${cssDir}
- HTML: ${publicDir}/index.html
  `);
} catch (error) {
  console.error('Error during build process:', error.message);
  process.exit(1);
}