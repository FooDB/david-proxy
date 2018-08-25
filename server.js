const express = require('express')
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
const clientBundles = './public/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

// see: https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf
const renderComponents = (components, props = {}) => {
  console.log(props);
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    console.log('This is component: ', component);
    return ReactDom.renderToString(component);
  });
};

app.get('/restaurant/:id', function(req, res) {
  axios.get(`http://sdc-menu-ELB-v3-814b6c76fb456a85.elb.us-east-2.amazonaws.com/api/restaurant/${req.params.id}`).then((response) => {
  let props = {data: response.data}
  console.log('this is props: ', props);
  let components = renderComponents(services, props);
  console.log('second component: ', components);
    res.end(Layout(
      'Open Table Clone',
      App(...components),
      Scripts(Object.keys(services, props))
    ));
  }).catch((err) => {
    console.log('this is the error: ', err);
  })
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});