const sql = require('mssql');

const pool = require('../connectDB');

module.exports.index = async function(req, res, next) {
    await pool.connect();
    var requests = new sql.Request(pool);
    var result = await requests.query("SELECT MSSV, HOLOT + ' ' + TEN AS HOTEN, CONVERT(VARCHAR, NGAYSINH, 103) AS NGAYSINH, CASE WHEN GIOITINH = 1 THEN N'Nam' ELSE N'Nữ' END AS GT, DIENTHOAI, MALOP FROM SINHVIEN");
    res.render('sinhvien/index', {
        title: 'Sinh vien',
        dsSinhVien: result.recordset,
        user: req.app.locals.user
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
};

module.exports.getInfo = function(req, res, next) {
    var query = req.query;
    res.redirect(`/sinhvien/${query.request}/${query.sv}`);
};

module.exports.infoSinhVien = async function(req, res, next) {
    // res.send(req.params.id);
    await pool.connect();
    var requset = new sql.Request(pool);
    requset.input('mssv', sql.VarChar, req.params.id);
    try {
        var result = await requset.query("SELECT MSSV, HOLOT + ' ' + TEN AS HOTEN,\
            CASE WHEN GIOITINH = 1 THEN N'Nam' ELSE N'Nữ' END AS GT,\
            CONVERT(VARCHAR, NGAYSINH, 103) as NGAYSINH, SV.MALOP, CMND, QUEQUAN, NOICUTRU,\
            DIENTHOAI, TENNGANH, TENKHOA\
            FROM SINHVIEN SV INNER JOIN LOP LO ON SV.MALOP = LO.MALOP\
	        INNER JOIN NGANH NG ON LO.MANGANH = NG.MANGANH\
	        INNER JOIN KHOA KH ON NG.MAKHOA = KH.MAKHOA\
            WHERE MSSV = @mssv");
    } catch(err) {
        next(err);
    }
    //console.log(result);
    res.render('sinhvien/info', {
        title: 'Thông tin sinh viên',
        sinhVien: result.recordset[0],
        user: req.app.locals.user
    });
    pool.close();
};

module.exports.resultSinhVien = function(req, res, next) {
    // res.send(req.params.id);
};

module.exports.search = async function(req, res, next) {
    var query = req.query;
    await pool.connect();
    var request = new sql.Request(pool);
    request.input('key', sql.VarChar, query.searchBy);
    request.input('value', sql.VarChar, query.value);
    try {
        var result = await request.query(`SELECT MSSV, HOLOT + ' ' + TEN AS HOTEN,\
        CASE WHEN GIOITINH = 1 THEN N'Nam' ELSE N'Nữ' END AS GT,\
        CONVERT(VARCHAR, NGAYSINH, 103) as NGAYSINH, SV.MALOP, CMND, QUEQUAN, NOICUTRU,\
        DIENTHOAI, TENNGANH, TENKHOA\
        FROM SINHVIEN SV INNER JOIN LOP LO ON SV.MALOP = LO.MALOP\
        INNER JOIN NGANH NG ON LO.MANGANH = NG.MANGANH\
        INNER JOIN KHOA KH ON NG.MAKHOA = KH.MAKHOA\
        WHERE ${query.searchBy} = ${query.value}`)
    } catch(err) {
        next(err);
    }
    res.render('sinhvien/index', {
        title: 'Sinh viên',
        dsSinhVien: result.recordset,
        user: req.app.locals.user,
        query: query
    })
    pool.close();
};