const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swagger');

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpecs, { explorer: true }));

module.exports = router;