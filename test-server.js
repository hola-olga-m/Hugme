import express from 'express';
const app = express();
const port = 5001;

app.get('/', (req, res) => {
  res.send('Hello World! Test server is working.');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server listening at http://0.0.0.0:${port}`);
});