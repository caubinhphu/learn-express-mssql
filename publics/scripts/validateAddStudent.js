const mssv = document.getElementById('mssv');
const holot = document.getElementById('holot');
const ten = document.getElementById('ten');
const cmnd = document.getElementById('cmnd');
const ngaysinh = document.getElementById('ngaysinh');
const gioitinh = document.getElementById('gioitinh');
const quequan = document.getElementById('quequan');
const lop = document.getElementById('lop');
const btnSubmit = document.getElementById('btn-submit');

const arrayField = [mssv, holot, ten, cmnd, ngaysinh, gioitinh, quequan, lop];

const arrayInput = document.getElementsByClassName('field');
const emErr = document.getElementsByClassName('err');

var ok = true;

function checkErr() {
    var err = arrayField.map(function(filed) {
        if (filed.value === '') {
            ok = false;
            return 'Chưa nhập thông tin';
        } else {
            return '';
        }
    });
    for (let i = 0; i < emErr.length; i++) {
        emErr[i].innerHTML = err[i];
        if (err[i] !== '') {
            arrayInput[i].style.borderColor = 'red';
        }
    }
}

btnSubmit.addEventListener('click', function() {
    checkErr();
    if (ok) btnSubmit.type = 'submit';
    else ok = true;
});