const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT ;
//server listening
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
  })