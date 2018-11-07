// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server responds to all requests with a string
const server = http.createServer((req, res) => {

  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true);


  // Get the path
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });

  req.on('end', function() {
    buffer += decoder.end();

    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    const data = {
      trimmedPath,
      'payload' : buffer
    };

    chosenHandler(data, (payload) => {
      payload = typeof(payload) == 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.setHeader('Content-Type', 'application/json');
      res.end(payloadString);
      console.log(`This is the response: ${payloadString}`);
    });

  });
});

// Start the server and have it listen to port
const port = 4000;
server.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});


// Define a handler
const handlers = {};

handlers.hello = (data, callback) => {
  callback({message: 'Welcome to the page!'});
};

handlers.notFound = (data, callback) => {
  callback({warning: 'Please try other pages.'});
};

// Define a request router
const router = {
  'hello' : handlers.hello
};
