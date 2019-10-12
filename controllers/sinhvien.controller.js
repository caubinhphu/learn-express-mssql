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

module.exports.getInfo = function(req, res, next) {
    var query = req.query;
    res.redirect(`/sinhvien/${query.request}/${query.sv}`);
};

module.exports.infoSinhVien = async function(req, res, next) {
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
    res.render('sinhvien/info', {
        title: 'Thông tin sinh viên',
        sinhVien: result.recordset[0],
        user: req.app.locals.user
    });
    pool.close(); // important
};

module.exports.resultSinhVien = function(req, res, next) {
    // res.send(req.params.id);
};

function checkGT(gt) {
    if (gt.toLowerCase().localeCompare('nam', 'en', {sensitivity: 'base'}) === 0)
        return 1;
    else if (gt.localeCompare('nu', 'en', { sensitivity: 'base' }) === 0)
        return 0;
    return '';
}

module.exports.search = async function(req, res, next) {
    var query = req.query;
    if (query.searchBy === 'GIOITINH') {
        query.value = checkGT(query.value);
    }

    await pool.connect();
    var request = new sql.Request(pool);
    try {
        var result;
        if (query.value === '') {
            result = await request.query('EXECUTE TIMKIEM_SINHVIEN_2');
        } else if (query.searchBy === 'GIOITINH') {
            result = await request.query(`EXECUTE TIMKIEM_SINHVIEN_2 @${query.searchBy} = ${query.value}`);
        } else {
            result = await request.query(`EXECUTE TIMKIEM_SINHVIEN_2 @${query.searchBy} = N'${query.value}'`);
        }
    } catch(err) {
        pool.close();
        next(err);
    }
    res.render('sinhvien/index', {
        title: 'Sinh viên',
        dsSinhVien: result.recordset,
        user: req.app.locals.user,
        query: query
    });
    pool.close();
};

module.exports.bancansulopIndex = async function(req, res, next) {
    await pool.connect();
    var request = new sql.Request(pool);
    try {
        var result = await request.query("SELECT LOP.MALOP, LOPTRUONG, HOLOT + ' ' + TEN AS HOTEN, DIENTHOAI, NOICUTRU\
        FROM LOP LEFT JOIN SINHVIEN ON LOPTRUONG = MSSV")
    } catch (err) {
        pool.close();
        next(err);
    }
    res.render('sinhvien/bancansulop/index', {
        title: 'Ban cán sự lớp',
        dsBCS: result.recordset,
        userName: req.app.locals.user
    });
    pool.close();
};

module.exports.bancansulopSearch = async function(req, res, next) {
    var query = req.query;
    await pool.connect();
    var requset = new sql.Request(pool);
    var result;
    try {
        if (query.value === '') {
            result = await requset.query(`EXECUTE TIMKIEM_BANCANSULOP`);
        } else {
            result = await requset.query(`EXECUTE TIMKIEM_BANCANSULOP @${query.searchBy} = N'${query.value}'`);
        }
    } catch(err) {
        pool.close();
        next(err);
    }
    res.render('sinhvien/bancansulop/index', {
        title: 'Ban cán sự lớp',
        dsBCS: result.recordset,
        userName: req.app.locals.user,
        query: query
    });
    pool.close();
};