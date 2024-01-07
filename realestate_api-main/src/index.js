const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  if (config.env === "production") {
    const fs = require("fs");
    const https = require("https");

    var privateKey = fs.readFileSync("/etc/ssl/own/private.key").toString();
    var certificate = fs.readFileSync("/etc/ssl/own/certificate.crt").toString();
    var cabundle = fs.readFileSync("/etc/ssl/own/ca_bundle.crt").toString();

    var credentials = {
      key: privateKey,
      cert: certificate,
      ca: [
        cabundle
      ]
    };
    server = https.createServer(credentials, app);
    https.globalAgent.options.rejectUnauthorized = false;
  } else {
    server = require("http").Server(app);
  }
  server.listen(config.port || 3000, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  // server = app.listen(config.port || 3000, () => {
  //   logger.info(`Listening to port ${config.port}`);
  // });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
