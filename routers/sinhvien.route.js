const express = require('express');

const controller = require('../controllers/sinhvien.controller');

const router = express.Router();

router.get('/', controller.index);
router.get('/ps', controller.perparedStatement);
router.get('/filter', controller.filter);

module.exports = router;