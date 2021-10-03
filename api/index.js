const express = require('express'),
app = express(),
//packages
helmet = require('helmet'),
cors = require('cors'),
port = process.env.PORT || 3000;

const logger = require('./base/logger');

app.use(express.json(), cors({
    origin: '*',
    optionsSuccessStatus: 200
}), helmet()).use((err, req, res, nex) => {
   return res.status(500).json({
       error: true,
       message: err.message
   });
});

app.listen(port, () => logger.info(`Running: http://localhost:${port}`));