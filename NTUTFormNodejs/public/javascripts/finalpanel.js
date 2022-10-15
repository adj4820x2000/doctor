function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function ValidateNumber(e, pnumber) {
    if (!/^\d+$/.test(pnumber)) {
        var newValue = /^\d+/.exec(e.value);
        if (newValue != null) {
            e.value = newValue;
        } else {
            e.value = "";
        }
    }
    return false;
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
                v: data[R][C]
            };
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({
                c: C,
                r: R
            });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}


function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
$(document).ready(function() {
    var font = 14;
    $("#fontbig").click(function() {
        font = font + 1;
        $("#body").attr("style", "font-size:" + font + "px;");

    });

    $("#fontsmall").click(function() {
        if (font >= 14) {
            font = font - 1;
            $("#body").attr("style", "font-size:" + font + "px;");
        }
    });

    var RowCnt = 0;
    var wstemp = new Array();
    var tojosntmp;
    var wstemp2;

    $("#Show1").hide();
    $("#Show0").hide();
    $("#Show1btn").hide();
    $("#Show2btn").hide();

    $("#Q0-1-1").change(function() {
        $("#Show1").hide();
        $("#Show1btn").hide();
        $("#Show0").show();
    });
    $("#Q0-1-2").change(function() {
        $("#Show0").hide();
        $("#Show1").show();
        $("#Show1btn").show();
    });

    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        return result;
    }
    $('#excel-file').change(function(e) {
        console.log('start');
        var files = e.target.files;

        var fileReader = new FileReader();

        fileReader.onload = function(ev) {
            var data = ev.target.result

            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            tojosntmp = to_json(workbook);

            var result = [];
            //workbook.SheetNames.forEach(function(sheetName) {

            var wstemp1 = XLSX.write(workbook, {
                sheet: "form2",
                type: 'binary',
                bookType: 'csv'
            });

            wstemp2 = XLSX.write(workbook, {
                sheet: "form3",
                type: 'binary',
                bookType: 'csv'
            });

            console.log(wstemp1);
            RowCnt = -1;

            var wwstemp = wstemp1.split("\n");
            var wwstemp2 = wstemp2.split("\n");
            var ptmp = new Array(100);
            var pcnt = 0;

            htmlstr = "<table><tr id='T1'><td>病歷號</td><td>姓名</td><td>病房</td><td>性別</td><td>年齡</td><td>預計使用期間</td></tr>";
            for (var t = 1; t < wwstemp.length - 1; t++) {
                var wwwstemp = wwstemp[t].split(",");
                var noadd = 0;
                for (var i = 0; i < pcnt; i++) {
                    if (wwwstemp[1].indexOf(ptmp[i]) >= 0) {
                        noadd = 1;
                        console.log("same");
                    }
                }
                //var ck = "";
                if (noadd == 0) {
                    ptmp[pcnt] = wwwstemp[1];
                    pcnt++;

                    htmlstr += "<tr id='T" + (pcnt + 1) + "'>" +
                        "<td>" + wwwstemp[1] + "</td>" +
                        "<td>" + wwwstemp[2] + "</td>" +
                        "<td>" + wwwstemp[3] + "</td>" +
                        "<td>" + wwwstemp[4] + "</td>" +
                        "<td>" + wwwstemp[5] + "</td>" +
                        "<td>" + wwwstemp[19] + "</td>" +
                        "</tr>";



                    //document.getElementById("myCheck").checked = true;
                }
            }


            document.getElementById('htmlout').innerHTML = htmlstr + "</table>";

            console.log($("#htmlout").html());
            //});
            $("#Show2btn").show();

            RowCnt = -1;
            while ($("#T" + (RowCnt + 2)).length == 1) {
                RowCnt++;
            }
            console.log(RowCnt);
        };

        fileReader.readAsBinaryString(files[0]);

    });



    $("#Showbtn2").click(function() {
        $.ajax({
            type: 'post',
            url: '/somepaths',
            dataType: 'json',
            data: tojosntmp,
            success: function(data) {
                console.log("123");

                var PatientEnd = { "0": 0 };
                /*
                for (i = 2; i <= RowCnt + 2; i++) {
                    if ($("#R" + i).prop('checked')) {
                        var sp1 = $("#T" + i).html().split("</td>");
                        var sp2 = sp1[1].split("<td>");

                        PatientEnd[(i - 1)] = sp2[1];
                    } else {
                        //console.log(i + "do nothing");
                    }
                }
                */

                var wwstemp2 = wstemp2.split("\n");

                for (var i = 1; i < wwstemp2.length; i++) {
                    var tmp = wwstemp2[i].split(",");
                    if (tmp[1] == "未結案") {
                        console.log(tmp[0] + " : 未結案");
                    } else if (tmp[1] == "結案") {
                        console.log(tmp[0] + " : 結案");
                        PatientEnd[i] = tmp[0];
                    }
                }

                console.log(PatientEnd);
                $.ajax({
                    type: 'post',
                    url: '/somepathss',
                    dataType: 'json',
                    data: PatientEnd,
                    success: function(data) {
                        console.log("123");
                        window.alert("已成功上傳至資料庫");
                    },
                    error: function(data) {
                        console.log("345");
                    }
                })

            },
            error: function(data) {
                console.log("4456");
            }
        })

    });

});