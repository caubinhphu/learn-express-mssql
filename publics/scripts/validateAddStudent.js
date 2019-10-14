const mssv = document.getElementById('mssv');
const holot = document.getElementById('holot');
const ten = document.getElementById('ten');
const cmnd = document.getElementById('cmnd');
const ngaysinh = document.getElementById('ngaysinh');
const gioitinh = document.getElementById('gioitinh');
const quequan = document.getElementById('quequan');
const lop = document.getElementById('lop');
const cutru = document.getElementById('noicutru');
const dienthoai = document.getElementById('dienthoai');
const btnSubmit = document.getElementById('btn-submit');

const arrayField = [mssv, holot, ten, cmnd, ngaysinh, gioitinh, quequan, cutru, lop, dienthoai];

const arrayInput = document.getElementsByClassName('field');
const emErr = document.getElementsByClassName('err');

var ok = true;

function checkErr() {
    var err = arrayField.map(function(filed, index) {
        if (filed.value === '') {
            if (index === 7 || index === 9) {
                return ''
            } else {
                ok = false;
                return 'Chưa nhập thông tin';
            }
        } else if (filed.value.match(/[<>!@#$%^&*<>()?+]/gim)) {
            ok = false;
            return 'Có kí tự không hợp lệ';
        } else {
            return '';
        }
    });
    for (let i = 0; i < emErr.length; i++) {
        emErr[i].innerHTML = err[i];
        if (err[i] !== '') {
            arrayInput[i].style.borderColor = 'red';
        } else {
            arrayInput[i].style.borderColor = '#ced4da';
        }

    }
}

btnSubmit.addEventListener('click', function() {
    checkErr();
    if (ok) btnSubmit.type = 'submit';
    else ok = true;
});