const sql = require('mssql');

const pool = require('../connectDB');

module.exports.index = async function(req, res, next) {
    await pool.connect();
    var requests = new sql.Request(pool);
    var data = await requests.query("SELECT * FROM SINHVIEN");
    res.render('sinhvien/index', {
        title: 'Sinh vien',
        dsSinhVien: data.recordsets[0]
    });
    pool.close();
}