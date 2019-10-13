const express = require('express');
const multer = require('multer');

const controller = require('../controllers/sinhvien.controller');
const upload = multer( {dest: './publics/uploads'} );

const router = express.Router();

router.get('/', controller.index);

router.get('/info', controller.getInfo);

router.get('/search', controller.search);

router.get('/bancansulop', controller.bancansulopIndex);

router.get('/bancansulop/search', controller.bancansulopSearch)

router.post('/edit/:sv', upload.single('avatar'), controller.postEdit);

router.get('/info/:id', controller.infoSinhVien);

router.get('/result/:id', controller.resultSinhVien);


module.exports = router;