var express = require('express');
var router = express.Router();
//var nodeExcel = require('excel-export');

/* GET home page. */
router.get('/', function(req, res, next) {

    var db = req.con;
    var data = "";

    db.query('SELECT * FROM doctor_name', function(err, rows) {
        if (err) {
            //console.log(err);
        }
        var data = rows;

        // use index.ejs
        db.query('SELECT * FROM patient', function(err, rows) {
            if (err) {
                //console.log(err);
            }
            var data2 = rows;

            // use index.ejs
            res.render('index', { data: data, data2: data2 });
        });
    });




});

router.get('/index1', function(req, res, next) {

    var db = req.con;
    var data = "";

    db.query('SELECT * FROM patient', function(err, rows) {
        if (err) {
            //console.log(err);
        }
        var data = rows;

        // use index.ejs
        res.render('index1', { data: data });
    });


});

// add post
router.post('/somepath', function(req, res, next) {

    var db = req.con;
    var change2text = {
        "c1": "機號",
        "c2": "刀序1",
        "c3": "刀序2",
        "c4": "姓名",
        "c5": "病房",
        "c6": "病歷號",
        "c7": "性別",
        "c8": "年齡",
        "c9": "診斷",
        "c10": "術式",
        "c11": "天數",
        "c12": "麻VS",
        "c13": "備註",
        "c14": "入帳"
    }

    var sql = {
        "機號": req.body.c1,
        "刀序1": req.body.c2,
        "刀序2": req.body.c3,
        "姓名": req.body.c4
    };

    var i = 0;
    var pdata = new Array();
    var cnt = 0;

    //console.log(req.body);
    for (var k in req.body) {
        //console.log(req.body[k]);
        var str = "c" + ((i % 14) + 1);
        sql[change2text[str]] = req.body[k];
        i++;

        if (i % 14 == 0 && i != 0) {
            console.log(sql);
            pdata[cnt] = new Array();
            pdata[cnt] = sql[change2text["c6"]];
            cnt++;
            try {
                var qur = db.query('INSERT INTO patient SET ?', sql, function(err, rows) {
                    if (err) {
                        console.log(err);
                    }
                });
            } catch (error) {}

        }
    }

    var selectstr = 'SELECT * FROM form2 WHERE ( 病歷號 = ';

    for (var k in pdata) {
        if (k != (pdata.length - 1))
            selectstr += pdata[k] + ' or 病歷號 = ';
        else
            selectstr += pdata[k];

    }
    //console.log(selectstr);

    selectstr += ') and ( 結案 = 0 )';

    //console.log(selectstr);

    db.query(selectstr, function(err, row1s) {
        if (err) {
            //console.log(err);
        }
        db.query("SELECT * FROM doctor_name", function(err, row2s) {
            if (err) {
                return callback(err);
            }
            //console.log(row1s);
            //console.log(row2s);
            var rows = { row1s, row2s };
            res.send(rows);
        });
    });


});

router.get('/testcallback', function(req, res, next) {

    var db = req.con;

    db.query("SELECT * FROM doctor_name", function(err, row1s) {
        if (err) {
            return callback(err);
        }

        db.query("SELECT * FROM doctor_name", function(err, row2s) {
            if (err) {
                return callback(err);
            }
            console.log(row1s);
            console.log(row2s);
            var rows = { row1s, row2s };
            res.send(rows);

        });

    });

});

// add post64
router.post('/somepaths', function(req, res, next) {

    var db = req.con;

    var sql = {
        病歷號: req.body.c1
    };
    var sql2 = {
        c1: req.body.c1
    };
    var i = 0;
    //console.log(req.body);
    var ptmp = new Array(100);
    var pcnt = 0;
    var noadd = 0;

    for (var k in req.body) {
        //console.log(k);

        if (k.indexOf("病歷號") >= 0) {
            noadd = 0;
            for (var i = 0; i < pcnt; i++) {
                if (req.body[k].indexOf(ptmp[i]) >= 0) {
                    noadd = 1;
                    //console.log("same");
                }
            }
            if (noadd == 0) {
                ptmp[pcnt] = req.body[k];
                pcnt++;
            }
        }



        if (k.indexOf("病歷號") >= 0) {
            sql2["c1"] = req.body[k];
        } else if (k.indexOf("姓名") >= 0) {
            sql2["c2"] = req.body[k];
        } else if (k.indexOf("性別") >= 0) {
            sql2["c3"] = req.body[k];
        } else if (k.indexOf("年齡") >= 0) {
            sql2["c4"] = req.body[k];
        }

        if (k.indexOf("年齡") >= 0) {
            if (noadd == 0) {
                //console.log(sql2);
                try {
                    var qur = db.query('INSERT INTO patient SET ?', sql2, function(err, rows) {
                        if (err) {

                        }
                    });
                } catch (error) {}
            }
        }

    }

    for (var k in req.body) {
        //console.log(k);
        var str = k.split("][");
        //console.log(str[1]);
        var str1 = str[1].split("]");
        //console.log(str1[0]);
        if (str1[0] == "病歷號") {
            if (req.body[k].indexOf("-") > 0) {
                var str2 = req.body[k].split("-");
                sql[str1[0]] = str2[0];
            } else {
                sql[str1[0]] = req.body[k];
            }
        } else {
            sql[str1[0]] = req.body[k];
        }

        i++;
        if (str1[0] == "用藥資料單完成") { //(i % 65 == 0 && i != 0) {
            try {
                //console.log(sql);
                var qur = db.query('INSERT INTO form2 SET ?', sql, function(err, rows) {
                    if (err) {
                        //console.log(err);
                    }

                });
            } catch (error) {

            }
        }
    }
    res.send({ "ok": "1" });
    //res.setHeader('Content-Type', 'application/json');
    //res.redirect('/');

});

router.post('/somepathss', function(req, res, next) {

    var db = req.con;
    var pdata = req.body;

    var selectstr = 'UPDATE form2 SET 結案=1 WHERE 病歷號 = ';
    var deletestr = 'DELETE FROM patient WHERE 病歷號 = ';
    var lastnum;
    console.log(pdata);
    for (var k in pdata) {
        lastnum = k;
    }

    console.log(lastnum);

    for (var k in pdata) {
        if (k != 0) {
            if (k != lastnum) {
                selectstr += pdata[k] + ' or 病歷號 = ';
                deletestr += pdata[k] + ' or 病歷號 = ';
            } else {
                selectstr += pdata[k];
                deletestr += pdata[k];
            }
        }


    }
    //UPDATE `ntut`.`form2` SET `結案`='1' WHERE `病歷號`='3234567';

    console.log(selectstr);
    console.log(deletestr);
    db.query(selectstr, function(err, rows) {
        if (err) {
            console.log(err);
        }

        db.query(deletestr, function(err, rows) {
            if (err) {
                console.log(err);
            }
        });

    });


    //DELETE FROM `ntut`.`patient` WHERE `c1`='1234567';

    res.send({ "ok": "1" });
});

module.exports = router;