const express = require('express');

const controller = require('../controllers/sinhvien.controller');

const router = express.Router();

router.get('/', controller.index);
router.get('/ps', controller.perparedStatement);
router.get('/filter', controller.filter);
router.get('/info', controller.getInfo);
router.get('/search', controller.search)
router.get('/info/:id', controller.infoSinhVien);
router.get('/result/:id', controller.resultSinhVien);


module.exports = router;