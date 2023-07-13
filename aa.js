const http = require('http');
const fs = require('fs');
const axios = require('axios');
const ngrok = require('ngrok');

const url = 'http://hskshbsksjkahskaj73846181.onrender.com/';

// Route: / - Show main directory files
const showDirectoryFiles = (req, res) => {
  const files = fs.readdirSync(__dirname);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(files.join('\n'));
};

// Route: /aa - Create a randomNamed file with no content
const createRandomFile = (req, res) => {
  const fileName = `randomFile_${Math.floor(Math.random() * 1000)}.txt`;
  fs.writeFileSync(fileName, '');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Created file: ${fileName}`);
};

// Create HTTP server and define routes
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    showDirectoryFiles(req, res);
  } else if (req.url === '/aa') {
    createRandomFile(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Start the server on port 3000
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  
  // Connect ngrok to the listening port
  ngrok.connect({proto:'tcp',addr:port,authtoken:'2SR50N2o46aXHCVx1vP88iCRuRH_5eYWHPgRCwFKRniE8Y52G'})
    .then((url) => {
      console.log(`ngrok tunnel created: ${url}`);
      
      // Send GET request to the specified URL every 10 seconds
      setInterval(() => {
        axios.get(url)
          .then((response) => {
            console.log(`GET request successful: ${url}`);
          })
          .catch((error) => {
            console.error(`GET request failed: ${error.message}`);
          });
      }, 10000);
    })
    .catch((error) => {
      console.error(`ngrok connection failed: ${error.message}`);
    });
});
