module.exports.postAddStudent = function(req, res, next) {
    let ok = true;
    let values = Object.values(req.body);
    let errors = values.map(function(value) {
        if (value === '') {
            ok = false;
            return 'Chưa nhập thông tin';
        } else if (value.match(/[<>!@#$%^&*<>()?+]/gim)) {
            ok = false;
            return 'Có kí tự không hợp lệ';
        } else {
            return '';
        }
    });
    if (!ok) {
        res.render('sinhvien/create', {
            title: 'Thêm sinh viên',
            errors: errors,
            values: req.body
        })
    } else {
        next();
    }
};