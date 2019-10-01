const sql = require('mssql');

const config = {
    user: 'sa',
    password: '01695402297',
    server: 'localhost',
    database: 'BT_QLSV_2'
}

function readData() {

    sql.connect(config, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        var request = new sql.Request();
        request.query('SELECT * FROM SINHVIEN', function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
            sql.close();
        });
    });

    // const pool = new sql.ConnectionPool({
    //     user: 'sa',
    //     password: '01695402297',
    //     server: 'localhost',
    //     database: 'BT_QLSV_2'
    // });
    // pool.connect(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     var request = new sql.Request('SELECT * FROM SINHVIEN', function(err, data) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log(data);
    //         }
    //     })
    // })
}

readData();