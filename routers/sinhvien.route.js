const express = require('express');
const multer = require('multer');

const controller = require('../controllers/sinhvien.controller');
const addStudentMiddleware = require('../middlewares/addStudent.middleware');

const upload = multer( {dest: './publics/uploads'} );

const router = express.Router();

router.get('/', controller.index);

router.get('/info', controller.getInfo);

router.get('/search', controller.search);

router.get('/bancansulop', controller.bancansulopIndex);

router.get('/bancansulop/search', controller.bancansulopSearch)

router.post('/edit/:sv', upload.single('avatar'), controller.postEdit);

router.get('/addOne', controller.addIndex);

router.post('/addOne', upload.single('avatar'), addStudentMiddleware.postAddStudent, controller.postAddOne);

router.get('/err', function(req, res, next) {
    try {
        var err = new Error('Loi roi ban oi!');
        throw err;
        res.send('qua loi');
    } catch(err) {
        next(err);
    }
});

router.get('/info/:id', controller.infoSinhVien);


router.get('/result/:id', controller.resultSinhVien);


module.exports = router;