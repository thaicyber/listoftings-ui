const cookieParser = require('cookie-parser');
const compression = require('compression');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.json();

/* Routes */
const indexRoute = require('./routes/page/home')(app);
const lawyerSpecialityRoute = require('./routes/page/lawyer-specialty')(app);
const lawyerRoute = require('./routes/page/lawyer')(app);

const lawyersRoute = require('./routes/page/lawyers')(app);
const prefixLawNewZealandRoute = require('./routes/page/prefix-lawyers-new-zealand')(app);
const searchLawyersRoute = require('./routes/page/search-lawyers-by-speciality')(app);
const findALawyerOnAMap = require('./routes/page/find-a-lawyer-on-a-map')(app);
const pitchAProjectRoute = require('./routes/page/pitch-a-project-for-a-lawyer')(app, csrfProtection);
const pitchProjectSendRoute = require('./routes/rest/send')(parseForm, csrfProtection);
const getTotalResultsRoute = require('./routes/rest/get-total-results');

app.prepare().then(() => {
  const server = express();
  server.use(helmet());
  server.use(cookieParser());
  server.use(compression());

  /* page response routes */
  server.use('/', indexRoute);
  server.use('/', prefixLawNewZealandRoute);
  server.use('/', lawyerRoute);
  server.use('/', lawyersRoute);
  server.use('/', lawyerSpecialityRoute);
  server.use('/', findALawyerOnAMap);
  server.use('/', pitchAProjectRoute);
  server.use('/', searchLawyersRoute);

  /* JSON response routes */
  server.use('/', pitchProjectSendRoute);
  server.use('/', getTotalResultsRoute);

  server.get('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 8080;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`
      > Ready on http://localhost:${PORT}
      > With elasticSearch host ${process.env.ES_HOST}
    `);
  });
});
