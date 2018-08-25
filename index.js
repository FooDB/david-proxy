const express = require('express');
const app = express();
const proxy = require('http-proxy-middleware');
const path = require('path');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET');
  next();
});

app.use(express.static(path.join(__dirname, './public')));
app.use('/restaurant/:id/', express.static('./public'));

// photos proxy
app.use('/api/restaurant/:id/photos', proxy({ target: 'http://ec2-34-201-243-233.compute-1.amazonaws.com/' }));

// menu proxy
app.use('api/restaurant/:id', proxy({ target:  'http://ec2-54-172-30-13.compute-1.amazonaws.com/' }));

// overview proxy
app.use('/restaurant/:id/general', proxy({ target: 'http://ec2-18-188-170-47.us-east-2.compute.amazonaws.com/' }));

// review proxy
app.use('/restaurant/:id/filterKeywords', proxy({ target: 'http://ec2-34-207-216-56.compute-1.amazonaws.com/' }));
app.use('/restaurant/:id/lovedFor', proxy({ target: 'http://ec2-34-207-216-56.compute-1.amazonaws.com/' }));
app.use('/restaurant/:id/reviews', proxy({ target: 'http://ec2-34-207-216-56.compute-1.amazonaws.com/' }));
app.use('/restaurant/:id/info', proxy({ target: 'http://ec2-34-207-216-56.compute-1.amazonaws.com/' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running at: http://127.0.0.1:${port}`);
});