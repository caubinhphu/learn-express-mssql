const sql = require('mssql');
const fs = require('fs');
// const importXlsx = require('convert-excel-to-json');
const xlsx = require('xlsx');

const pool = require('../connectDB');

const avatarDefault = '/images/avatar.png';

module.exports.index = async function(req, res, next) {
  try {  
    await pool.connect();
    var requests = new sql.Request(pool);
    var result = await requests.query("SELECT MSSV, HOLOT + ' ' + TEN AS HOTEN, CONVERT(VARCHAR, NGAYSINH, 103) AS NGAYSINH, CASE WHEN GIOITINH = 1 THEN N'Nam' ELSE N'Nữ' END AS GT, DIENTHOAI, MALOP FROM SINHVIEN");
  } catch (err) {
    next(err);
  } finally {
    await pool.close();
  }
  res.render('sinhvien/index', {
    title: 'Sinh vien',
    dsSinhVien: result.recordset,
    user: req.app.locals.user
  });
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
          DIENTHOAI, TENNGANH, TENKHOA, AVATAR\
          FROM SINHVIEN SV INNER JOIN LOP LO ON SV.MALOP = LO.MALOP\
            INNER JOIN NGANH NG ON LO.MANGANH = NG.MANGANH\
            INNER JOIN KHOA KH ON NG.MAKHOA = KH.MAKHOA\
          WHERE MSSV = @mssv");
    } catch(err) {
        next(err);
    } finally { await pool.close(); }
    res.render('sinhvien/info', {
        title: 'Thông tin sinh viên',
        sinhVien: result.recordset[0],
        user: req.app.locals.user
    });
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
      next(err);
    } finally { await pool.close(); }
    res.render('sinhvien/index', {
        title: 'Sinh viên',
        dsSinhVien: result.recordset,
        user: req.app.locals.user,
        query: query
    });
};

module.exports.bancansulopIndex = async function(req, res, next) {
    await pool.connect();
    var request = new sql.Request(pool);
    try {
      var result = await request.query("SELECT LOP.MALOP, LOPTRUONG, HOLOT + ' ' + TEN AS HOTEN, DIENTHOAI, NOICUTRU\
      FROM LOP LEFT JOIN SINHVIEN ON LOPTRUONG = MSSV")
    } catch (err) {
      next(err);
    } finally { await pool.close(); }
    res.render('sinhvien/bancansulop/index', {
      title: 'Ban cán sự lớp',
      dsBCS: result.recordset,
      userName: req.app.locals.user
    });
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
    next(err);
  } finally { await pool.close(); }
  res.render('sinhvien/bancansulop/index', {
    title: 'Ban cán sự lớp',
    dsBCS: result.recordset,
    userName: req.app.locals.user,
    query: query
  });
};

module.exports.postEdit = async function(req, res, next) {
  await pool.connect();
  var sv = req.params.sv;
  var requset = new sql.Request(pool);
  var result;

  try {
    if (!req.file) {
      result = await requset.query(`UPDATE SINHVIEN SET NOICUTRU = N'${req.body.cutru}', \
          DIENTHOAI = '${req.body.dienthoai}' WHERE MSSV = '${sv}'`);
    } else {
      var sinhvien = await requset.query(`SELECT AVATAR FROM SINHVIEN WHERE MSSV = '${sv}'`);
      if (sinhvien.recordset[0].AVATAR !== avatarDefault) {
        fs.unlink(`./publics${sinhvien.recordset[0].AVATAR}`, (err) => { if (err) throw err });
      }
      result = await requset.query(`UPDATE SINHVIEN SET NOICUTRU = N'${req.body.cutru}', \
        DIENTHOAI = '${req.body.dienthoai}', AVATAR = '/uploads/${req.file.filename}' WHERE MSSV = '${sv}'`)
    }
  } catch(err) {
    next(err);
  } finally { await pool.close(); }
  res.redirect(`/sinhvien/info/${sv}`);
};

module.exports.addIndex = function(req, res, next) {
  res.render('sinhvien/create', {
    title: 'Thêm sinh viên'
  });
};

module.exports.postAddOne = async function(req, res, next) {
  var data = req.body;
  if (!req.file) {
    data.avatar = avatarDefault;
  } else {
    data.avatar = `/uploads/${req.file.filename}`;
  }
  data.gioitinh = checkGT(data.gioitinh);
  await pool.connect();
  var request = new sql.Request(pool);
  try {
    var result = await request.query(`INSERT INTO SINHVIEN \
        VALUES ('${data.mssv}', N'${data.holot}', N'${data.ten}', '${data.ngaysinh}', '${data.cmnd}', \
                N'${data.quequan}', N'${data.noicutru}', '${data.dienthoai}', '${data.lop}', \
                ${data.gioitinh}, '${data.avatar}')`);
  } catch(err) {
    next(err);
  } finally { await pool.close(); }

  res.redirect('/sinhvien');
};

module.exports.addIndexJson = function(req, res, next) {
  res.render('sinhvien/createJson', {
    title: 'Thêm sinh viên'
  });
};

function readFile (path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, {encoding: 'utf8'}, function(err, data) {
      if (err)
          reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

module.exports.postAddJson = async function(req, res, next) {
  if (!req.file) {
    res.redirect('/sinhvien');
  } else {
    await pool.connect();
    let request = new sql.Request(pool);
    try {
      let data = await readFile(`./${req.file.path}`);

      // Tạo chuỗi truy vấn
      let str = 'INSERT INTO SINHVIEN VALUES ';
      let valueArray = data.map(function(sv) {
          return `('${sv.MSSV}', N'${sv.HOLOT}', N'${sv.TEN}', '${sv.NGAYSINH}', '${sv.CMND}', \
          N'${sv.QUEQUAN}', N'${sv.NOICUTRU}', '${sv.DIENTHOAI}', '${sv.LOP}', \
          ${sv.GIOITINH}, '${avatarDefault}'),`
      });
      let valueStr = valueArray.join(' ');
      str += valueStr.slice(0, -1);
      let result = await request.query(str);
    } catch(err) {
      next(err);
    } finally {
      fs.unlink(`./${req.file.path}`, (err) => { if (err) throw err;});
      await pool.close();
    }
    res.redirect('/sinhvien');
  }
};

module.exports.addIndexXlsx = function(req, res, next) {
    res.render('sinhvien/createXlsx', {
        title: 'Thêm sinh viên'
    });
};

// module.exports.postAddXlsx = function(req, res, next) {
//   const result = importXlsx({
//     sourceFile: `./${req.file.path}`,
//     header: {rows: 1},
//     columnToKey: {
//       A: 'MSSV',
//       B: 'HOLOT',
//       C: 'TEN',
//       D: 'CMND',
//       E: 'NGAYSINH',
//       F: 'GIOITINH',
//       G: 'QUEQUAN',
//       H: 'NOICUTRU',
//       I: 'DIENTHOAI',
//       J: 'LOP'
//     }
//   });
//   res.json(result);
// };

module.exports.postAddXlsx = async function(req, res, next) {
  if (!req.file) {
    res.redirect('/sinhvien');
  } else {
    try {
      let workBook = xlsx.readFile(`./${req.file.path}`, {cellDates: true});

      let data = workBook.SheetNames.map(function(sheet) {
        return xlsx.utils.sheet_to_json(workBook.Sheets[sheet], { defval: '' });
      }); // [ [ {}, {} ], [ {}, {} ] ]

      let data2 = [];
      for (let sheetData of data)
        data2.push(...sheetData); // [ {}, {}. {}. {} ]
      let newData = data2.map(function(record) {
        let ngaySinh = record.NGAYSINH;
        ngaySinh.setDate(ngaySinh.getDate() + 1);
        record.NGAYSINH = ngaySinh.toLocaleDateString('en');
        record.GIOITINH = checkGT(record.GIOITINH);
        return record;
      });
      let inputSQL = 'INSERT INTO SINHVIEN VALUES ';
      let arrInput = newData.map(function(record) {
        return `('${record.MSSV}', N'${record.HOLOT}', N'${record.TEN}', '${record.NGAYSINH}', '${record.CMND}', \
        N'${record.QUEQUAN}', N'${record.NOICUTRU}', '${record.DIENTHOAI}', '${record.LOP}', \
        ${record.GIOITINH}, '${avatarDefault}'),`;
      });
      let strInput = arrInput.join(' ');
      inputSQL += strInput.slice(0, -1);
      await pool.connect();
      let request = new sql.Request(pool);
      let result = await request.query(inputSQL);
    } catch(err) {
      next(err);
    } finally {
      fs.unlink(`./${req.file.path}`, err => { if (err) throw err });
      await pool.close();
    }
    res.redirect('/sinhvien');
  }
};
