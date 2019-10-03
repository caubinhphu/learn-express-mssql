const sql = require('mssql');

const pool = require('../connectDB');

module.exports.index = async function(req, res, next) {
    var requests = new sql.Request(pool);
     await pool.connect();
    // try {
    //     //throw new Error('BROKEN');
    //     await requests.query("INSERT INTO KHOA VALUES('basd', N'Aasdf', 20)");
    // } catch(err) {
    //     next(err);
    // }
    var result = await requests.query("SELECT * FROM SINHVIEN");
    res.render('sinhvien/index', {
        title: 'Sinh vien',
        dsSinhVien: result.recordsets[0]
    });
    
    pool.close();
};

module.exports.perparedStatement = async function(req, res, next) {
    await pool.connect();
    var ps = new sql.PreparedStatement(pool);
    ps.input('param', sql.Int);
    try{
        await ps.prepare('select @param as value');
        var result = [];
        for (let i = 0; i <=10; i++)
        {
            let data = await ps.execute({param: i});
            result.push(data.recordset[0]);
        }
        res.send(result);
        await ps.unprepare();
    } catch(err) {
        next(err);
    }
    pool.close();
};

module.exports.filter = async function(req, res, next) {
    await pool.connect();
    var requset = new sql.Request(pool);
    requset.input('GT', sql.Bit, 0);
    try {
        var result = await requset.execute("SELECT_SINHVIEN_GT");
        res.render('sinhvien/index', {
            title: 'Sinh vien',
            dsSinhVien: result.recordsets[0]
        });
    } catch(err) {
        next(err);
    }
    pool.close();
}