require('dotenv').config({path: './config.env'});
const express = require('express'),
app = express(),
//packages
helmet = require('helmet'),
cors = require('cors'),
port = process.env.PORT || 3000,
db = require('./db/controller/main');

const logger = require('./base/logger');

app.use(express.json(), cors({
    origin: '*',
    optionsSuccessStatus: 200
}), helmet()).use((err, req, res, nex) => {
   res.status(500);
   return res.json({
       error: true,
       message: err.message
   });
});

db.connectDB().on('error', (e) => logger.fatal(`Mongo error: ${e.message}`));
app.listen(port, () => logger.info(`Running: http://localhost:${port}`));