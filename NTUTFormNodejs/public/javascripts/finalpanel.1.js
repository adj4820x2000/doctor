    function datenum(v, date1904) {
        if (date1904) v += 1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
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

        var RowCnt = 0;
        var wstemp;

        $("#Show0").hide();

        $("#Show2btn").hide();

        $("#Showbtn3").click(function() {

            console.log('start');

            var fileReader = new FileReader();

            fileReader.onload = function(ev) {
                var data = ev.target.result

                var workbook = XLSX.read(data, {
                    type: 'binary'
                });
                console.log(to_json(workbook));

                $.ajax({
                    type: 'post',
                    url: '/somepaths',
                    dataType: 'json',
                    data: to_json(workbook),
                    success: function(data) {
                        console.log(data);
                        //text.innerHTML = "Chinese : " + resulttxt + "\nEnglish : " + data.title;
                    }
                })

                document.getElementById('htmlout').innerHTML = "";
                var result = [];
                workbook.SheetNames.forEach(function(sheetName) {
                    var htmlstr = XLSX.write(workbook, {
                        sheet: sheetName,
                        type: 'binary',
                        bookType: 'html'
                    });
                    var wstemp1 = XLSX.write(workbook, {
                        sheet: sheetName,
                        type: 'binary',
                        bookType: 'csv'
                    });

                    wstemp = wstemp1.split("\n");

                    //var wstemp3 =   

                    document.getElementById('htmlout').innerHTML += htmlstr + '<br>';
                    //RowCnt++;
                    $("#T0").remove();
                    console.log(htmlstr);
                });
                $("#Show2btn").show();
                //document.getElementById('btn').innerHTML = "<br><br>"
                RowCnt = 0;

                while ($("#T" + (RowCnt + 2)).length == 1) {
                    RowCnt++;
                }
                console.log(RowCnt);

            };

            var oReq = new XMLHttpRequest();

            oReq.open("GET", "https://pandelaz.github.io/NTUTForm/FinalPanel_TestFile.xlsx", true);
            oReq.responseType = "blob";
            oReq.onload = function(e) {
                var bbuffer = oReq.response; // not responseText
                //console.log(bbuffer);
                fileReader.readAsBinaryString(bbuffer);
                /* ... */
            }
            oReq.send();





        });

        $("#Q0-1-1").change(function() {
            //$("#Show1").hide();
            //$("#Show1btn").hide();
            $("#Show0").show();
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
            //console.log(files[0]);
            var fileReader = new FileReader();

            fileReader.onload = function(ev) {
                var data = ev.target.result

                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                var obj = to_json(workbook);

                $.ajax({
                    type: 'post',
                    url: '/somepaths',
                    dataType: 'json',
                    data: obj,
                    success: function(data) {
                        console.log(data);
                        waitpost = 0;
                        //text.innerHTML = "Chinese : " + resulttxt + "\nEnglish : " + data.title;
                    }
                })

                document.getElementById('htmlout').innerHTML = "";
                var result = [];
                workbook.SheetNames.forEach(function(sheetName) {
                    var htmlstr = XLSX.write(workbook, {
                        sheet: sheetName,
                        type: 'binary',
                        bookType: 'html'
                    });
                    var wstemp1 = XLSX.write(workbook, {
                        sheet: sheetName,
                        type: 'binary',
                        bookType: 'csv'
                    });

                    wstemp = wstemp1.split("\n");

                    //var wstemp3 =   

                    document.getElementById('htmlout').innerHTML += htmlstr + '<br>';
                    //RowCnt++;
                    $("#T0").remove();
                    console.log(htmlstr);
                });
                $("#Show2btn").show();
                //document.getElementById('btn').innerHTML = "<br><br>"
                RowCnt = 0;

                while ($("#T" + (RowCnt + 2)).length == 1) {
                    RowCnt++;
                }
                console.log(RowCnt);

            };

            fileReader.readAsBinaryString(files[0]);

        });
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



    });