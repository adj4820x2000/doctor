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

        var Today = new Date();
        var datee;
        var monthh;

        if (Today.getDate().toString().length <= 1) {
            datee = "0" + Today.getDate();
        } else {
            datee = Today.getDate();
        }
        if (Today.getMonth().toString().length <= 1) {
            monthh = "0" + (Today.getMonth() + 1);
        } else {
            monthh = (Today.getMonth() + 1);
        }

        var info07 = Today.getFullYear() + "-" + monthh + "-" + datee;
        console.log(info07);
        document.getElementById("info07").value = info07;
        var RowCnt = 0;

        var db;
        //var TableDB;

        var ArrForm1 = new Array();
        var ArrForm2 = new Array();
        var ArrForm3 = new Array();



        db = opendb("TestDatabase", "病歷號");
       
        //console.log(db);

        //================================================
        function opendb(dbname, KeyPathStr) {
            var request = indexedDB.open(dbname);
            request.onerror = function(event) {
                alert("Why didn't you allow my web app to use IndexedDB?!");
            };
            request.onsuccess = function(event) {
                db = event.target.result;
                //console.log(db);
                //=======================================
                var transaction = db.transaction(["mList"]);
                var objectStore = transaction.objectStore("mList");
                var request1 = objectStore.get("HTML");
                request1.onerror = function(event) {
                    // Handle errors!
                    alert("not found!");
                };
                request1.onsuccess = function(event) {
                    //console.log(request1.result);
                    if (request1.result != undefined) {
                        $("#htmlout").html(request1.result.HtmlTemp);
                        $("#btnQ0-1-1").hide();
                        
                        var savefile = window.location.href.split("=");        
                        if(savefile[1] == "nosave"){
                            var hreftemp = window.location.href.split("?");
                            var hreftemp2 = hreftemp[1].split("&");
                            var herftemp3 = hreftemp2[0].split("n");
                            var herftemp4 = herftemp3[1].split("a");
                            $("#" + hreftemp2[0]).attr("class", "btn btn-danger2 navbar-btn");
                            $("#" + hreftemp2[0]).html("未填");
                            $("#Closurebtn" + herftemp4[0]).attr("class", "btn btn-danger disabled");
                        }
                    }
                    //console.log(db);
                    //=======================================
                    var transaction2 = db.transaction(["nList"]);
                    var objectStore2 = transaction2.objectStore("nList");
                    var request2 = objectStore2.getAll();
                    request2.onerror = function(event) {
                        // Handle errors!
                        alert("not found!");
                    };
                    request2.onsuccess = function(event) {
                        //console.log("get ok");
                        //console.log(event.target.result[0].doctor);
                        if (event.target.result[0] != undefined) {
                            var htmlstr1 = event.target.result[0].doctor;
                            var sptmp = htmlstr1.split("\n");
                            //console.log(sptmp);

                            for (var t in sptmp) {
                                if (sptmp[t].indexOf(",") >= 0) {
                                    var sptmp2 = sptmp[t].split(",");
                                    $("#info18").append("<option value='" + sptmp2[1] + "'>" + sptmp2[1] + "</option>");
                                }
                            }
                        }

                    };
                    //=======================================
                };
                //=======================================

            };
            request.onupgradeneeded = function(event) {
                db = event.target.result;
                var objectStore1 = db.createObjectStore("nList", { keyPath: "doctor" });
                var objectStore = db.createObjectStore("mList", { keyPath: KeyPathStr });

            };
            
            
        }
        //================================================
        function write_to_db(vardb, data) {
            //console.log(vardb);
            var transaction = vardb.transaction(["mList"], "readwrite");
            //console.log(data);
            // Do something when all the data is added to the database.
            transaction.oncomplete = function(event) {
                console.log("done");
                //alert("All done!");
            };

            transaction.onerror = function(event) {
                // Don't forget to handle errors!
                console.log("add error");

            };

            var objectStore = transaction.objectStore("mList");
            for (var i in data) {
                var request = objectStore.add(data[i]);
                request.onsuccess = function(event) {
                    // event.target.result == customerData[i].ssn;
                };
            }
        }
        //================================================
        function write_temp_html(vardb, data, curl) {
            //console.log(vardb);
            var transaction = vardb.transaction(["mList"], "readwrite");
            //console.log(data);
            // Do something when all the data is added to the database.
            transaction.oncomplete = function(event) {
                console.log("done");
                //alert("All done!");
            };

            transaction.onerror = function(event) {
                // Don't forget to handle errors!
                console.log("add error");

                //===================================
                var transaction1 = db.transaction(["mList"], "readwrite");
                var objectStore1 = transaction1.objectStore("mList");
                var request1 = objectStore1.get("HTML");
                request1.onsuccess = function(event) {
                    console.log("Updating : ");
                    console.log(request1.result);
                    request1.result.HtmlTemp = data.HtmlTemp;
                    objectStore1.put(data);
                    //$("#excel-file").hide();
                    RowCnt = -1;
                    while ($("#T" + (RowCnt + 1)).length == 1) {
                        RowCnt++;
                    }
                    location.assign(curl);
                };
                //===================================

            };

            var objectStore = transaction.objectStore("mList");

            var request = objectStore.add(data);
            request.onsuccess = function(event) {
                // event.target.result == customerData[i].ssn;
                location.assign(curl);
            };

        }
        //================================================



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


        $("#Show1").hide();
        $("#Show0").hide();
        $("#Show1btn").hide();
        $("#info13").hide();

        $("#division").change(function() {
            var id = $("#division").find(':selected').data('id');

            if (id == 1) {
                $("#division1Text").remove();
                $("#division3Text").remove();
                $("#Textdivision2").append('<span id="division2Text"><select name="bigout"><option value="1">一般外科</option><option value="2">胸腔外科</option><option value="3">神經外科</option><option value="4">整形外科</option><option value="5">乳房外科</option><option value="6">心臟外科</option><option value="7">小兒外科</option></select></span>');

            }
            if (id == 2) {
                $("#division1Text").remove();
                $("#division2Text").remove();
                $("#Textdivision3").append('<span id="division3Text"><select name="bigout"><option value="1">骨科</option><option value="2">泌尿科</option><option value="3">耳鼻喉科</option><option value="4">牙科</option><option value="5">皮膚科</option><option value="6">疼痛科</option></select></span>');
            }
        });
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
        $("#Showbtn1").click(function() {
            RowCnt = -1;
            while ($("#T" + (RowCnt + 1)).length == 1) {
                RowCnt++;
            }
            //"<a class='btn btn-default navbar-btn' id='Plusbtn" + RowCnt + ">+</a>"
            //console.log(RowCnt);
            if (RowCnt == -1) {
                $("#htmlout").html("<table><tr id='T0'><td></td><td>姓名</td><td>年齡</td><td>病歷號</td><td>病房</td><td>止痛訪視</td></tr></table>");
                RowCnt++;
            }
            RowCnt++;
            $("table").html($("table").html() +
                "<tr id='T" + RowCnt + "'>" +
                "<td>" + "<a class='btn btn-default navbar-btn' id='Plusbtn" + RowCnt + "'>+</a>" + "</td>" +
                "<td>" + $("#info01").val() + "</td>" +
                "<td>" + $("#info03").val() + "</td>" +
                "<td>" + $("#info04").val() + "</td>" +
                "<td>" + $("#info05").val() + "</td>" +
                //"<td><a class='btn btn-danger1 navbar-btn' id='Fbtn" + RowCnt + "a1' href='index.html?ssn=" + $("#info04").val() + "'>未填</a></td>" +
                "<td><a class='btn btn-danger2 navbar-btn' id='Fbtn" + RowCnt + "a2' href='index1.html?ssn=" + $("#info04").val() + "'>未填</a></td>" +
                "</tr>");
            //console.log(RowCnt);

            var wstemp = [{
                "機號": "",
                "刀序1": "",
                "刀序2": "",
                "姓名": $("#info01").val(),
                "病房": $("#info05").val(),
                "病歷號": $("#info04").val(),
                "性別": Mfunction(),
                "年齡": $("#info03").val(),
                "診斷": $("#info08").val(),
                "術式": $("#info09").val(),
                "天數": "",
                "麻VS": $("#info18").find(":selected").text(),
                "備註": "",
                "入帳": "",
            }];

            write_to_db(db, wstemp);
        });

        function Mfunction() {
            if ($("#gender").val() == 1)
                return ("M");
            else
                return ("F");
        }

        $('#excel-file').change(function(e) {
            //console.log('start');
            var files = e.target.files;
            //console.log(files);
            var fileReader = new FileReader();

            fileReader.onload = function(ev) {
                var data = ev.target.result

                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                //document.getElementById('htmlout').innerHTML = "";
                var result = [];

                //=========================================================================
                //html顯示表格
                var htmlstr = XLSX.write(workbook, {
                    sheet: "personal_information",
                    type: 'binary',
                    bookType: 'html'
                });
                var htmlstr1 = XLSX.write(workbook, {
                    sheet: "doctor_name",
                    type: 'binary',
                    bookType: 'csv'
                });
                //console.log(db);
                //=======================================
                var transaction = db.transaction(["nList"], "readwrite");
                var objectStore = transaction.objectStore("nList"); //vardb.transaction(["mList"], "readwrite");
                var doctmp = { "doctor": htmlstr1 };
                var request = objectStore.add(doctmp);
                request.onsuccess = function(event) {
                    // event.target.result == customerData[i].ssn;
                    //location.assign(curl);
                    console.log("save ok");
                };
                //=======================================


                var sptmp = htmlstr1.split("\n");
                console.log(sptmp);

                for (var t in sptmp) {
                    if (sptmp[t].indexOf(",") >= 0) {
                        var sptmp2 = sptmp[t].split(",");
                        $("#info18").append("<option value='" + sptmp2[1] + "'>" + sptmp2[1] + "</option>");
                    }
                }


                RowCnt = -1;
                while ($("#T" + (RowCnt + 1)).length == 1) {
                    RowCnt++;
                }

                //document.getElementById('htmlout').innerHTML = htmlstr;
                //console.log(RowCnt);

                var temp = htmlstr.split("</td>");
                //console.log(temp);
                var temp2 = temp[0].split("<td>");

                if (RowCnt == -1) {
                    htmlstr = temp2[0] + "<td></td><td>姓名</td>" + "<td>年齡</td>" + "<td>病歷號</td>" + "<td>病房</td><td>止痛訪視</td>" + "<td>結案</td>";
                    RowCnt++;
                } else {
                    var temp5 = $("#htmlout").html().split("</table>");
                    htmlstr = temp5[0];
                }
                //console.log(temp);
                var i = 0;

                for (i = 15; i < temp.length - 1; i = i + 15) {
                    //console.log(i);
                    var temp3 = temp[i].split("<td>");
                    var temp4 = temp[i + 6].split("<td>");
                    RowCnt++;
                    htmlstr += temp3[0];
                    htmlstr += "<td>" + "<a class='btn btn-default navbar-btn' id='Plusbtn" + RowCnt + "'>+</a>" + "</td>";
                    htmlstr += temp[i + 4] + "</td>" + temp[i + 8] + "</td>" + temp[i + 6] + "</td>" + temp[i + 5] + "</td>";
                    //htmlstr += "<td><a class='btn btn-danger1 navbar-btn' id='Fbtn" + RowCnt + "a1' href='index.html?ssn=" + temp4[1] + "'>未填</a></td>"; //tssn[Math.floor(i / 14)]
                    htmlstr += "<td><a class='btn btn-danger2 navbar-btn' id='Fbtn" + RowCnt + "a2' href='index1.html?Fbtn" + RowCnt + "a2&ssn=" + temp4[1] + "'>未填</a></td>";
                    htmlstr += "<td><div class='btn-group-toolbar' data-toggle='buttons'><lable class='btn btn-danger disabled' id='Closurebtn" + RowCnt + "'><input type='checkbox' id='Closure" + RowCnt + "' name='Closure' value='" + temp4[1] + "'>結案</lable></div></td>";
                }
                htmlstr += temp[temp.length - 1];
                //console.log(temp[temp.length - 1]);
                document.getElementById('htmlout').innerHTML = htmlstr;
                $("#s0").height("auto");
                //console.log(htmlstr);
                //=======================================
                var transaction5 = db.transaction(["mList"], "readwrite");
                var objectStore5 = transaction5.objectStore("mList"); //vardb.transaction(["mList"], "readwrite");
                var doctmp5 = { "HtmlTemp": htmlstr, "病歷號": "HTML" };
                var request5 = objectStore5.add(doctmp5);
                request5.onsuccess = function(event) {
                    // event.target.result == customerData[i].ssn;
                    //location.assign(curl);
                    console.log("html save ok");
                };
                //=======================================


                //=========================================================================
                //儲存病人資訊至DB
                var patient_info = to_json(workbook);

                //write_to_db(db, patient_info.personal_information);
                var datacnt = { "123456": 1, "223456": 1 };
                if (patient_info.form != undefined) {
                    for (var i = 0; i < (patient_info.form.length - 1); i++) {
                        for (var j = i + 1; j < patient_info.form.length; j++) {
                            if (patient_info.form[i].病歷號 == patient_info.form[j].病歷號) {
                                if (datacnt[patient_info.form[j].病歷號] == undefined)
                                    datacnt[patient_info.form[j].病歷號] = 1;
                                patient_info.form[j].病歷號 = patient_info.form[j].病歷號 + "-" + datacnt[patient_info.form[j].病歷號];
                                datacnt[patient_info.form[j].病歷號]++;
                            }
                        }
                    }

                    console.log(patient_info.form);
                }

                //write_to_db(db, patient_info.SheetJS);
                //console.log(vardb);
                var transaction = db.transaction(["mList"], "readwrite");
                //console.log(data);
                // Do something when all the data is added to the database.
                transaction.oncomplete = function(event) {
                    console.log("done");
                    //=========================================================================
                    var requestF1 = indexedDB.open("olddb");

                    requestF1.onerror = function(event) {
                        alert("Why didn't you allow my web app to use IndexedDB?!");
                    };
                    requestF1.onsuccess = function(event) {
                        db = event.target.result;
                        console.log(db);


                        //===============


                        var transaction = db.transaction(["mList"], "readwrite");
                        //console.log(data);
                        // Do something when all the data is added to the database.
                        transaction.oncomplete = function(event) {
                            console.log("done");
                            //alert("All done!");
                            db = opendb("TestDatabase", "病歷號");
                        };

                        transaction.onerror = function(event) {
                            // Don't forget to handle errors!
                            console.log("add error");

                        };

                        var objectStore = transaction.objectStore("mList");
                        for (var i in patient_info.form) {
                            var request = objectStore.add(patient_info.form[i]);
                            request.onsuccess = function(event) {
                                // event.target.result == customerData[i].ssn;
                            };
                        }

                    };
                    // This event is only implemented in recent browsers
                    requestF1.onupgradeneeded = function(event) {
                        db = event.target.result;
                        // Create an objectStore for this database
                        var objectStore = db.createObjectStore("mList", {
                            keyPath: "病歷號"
                        });
                    };
                    //===========================================
                };
                transaction.onerror = function(event) {
                    // Don't forget to handle errors!
                    console.log("add error");

                };
                var objectStore = transaction.objectStore("mList");
                for (var i in patient_info.personal_information) {
                    var request = objectStore.add(patient_info.personal_information[i]);
                    request.onsuccess = function(event) {
                        // event.target.result == customerData[i].ssn;
                    };
                }
                //=========================================================================


            }; //fileReader.onload

            fileReader.readAsBinaryString(files[0]);
        });


        function ReadF2db(people_id) {            
            
            //----------------------opendb----------------------------
            //
            var Form2db = new Array(people_id.length);
            var requestF1 = indexedDB.open("Form2Database");
            var Fcnt = 0;
            
            requestF1.onerror = function(event) {
                alert("Why didn't you allow my web app to use IndexedDB?!");
            };
            requestF1.onsuccess = function(event) {
                db = event.target.result;
                console.log(db);
                //var objectStore = db.transaction(["mList"], "readwrite").objectStore("mList");
                //var requestF1 = objectStore.add(Closure);
                var transaction = db.transaction(["mList"], "readonly");                
                var resource = transaction.objectStore("mList").openCursor();
                
                resource.onsuccess = function(event) {                    
                    
                    var cursor = event.target.result;
                    //console.log(cursor);
                    if (cursor) {
                        if (cursor.value.病歷號 != "HTML") {
                            Form2db[Fcnt] = (cursor.value);                                                       
                            Fcnt++;
                        }
                        cursor.continue();
                    } else {
                        var f2cnt = 0;
                        for (var f2db1 in Form2db[0]) {
                            ArrForm2[0][f2cnt] = f2db1;
                            f2cnt++;
                        }
                        var f2cnt1 = 1;
                        var f2cnt2 = 0;

                        for (var f2db in Form2db) {
                            ArrForm2[f2cnt1] = new Array();
                            for (var f2db1 in Form2db[f2db]) {
                                //console.log(Form1db[f1db][f1db1]);

                                ArrForm2[f2cnt1][f2cnt2] = Form2db[f2db][f2db1];
                                f2cnt2++;
                            }
                            f2cnt1++;
                            f2cnt2 = 0;
                        }
                        
                        ArrForm3[0][0] = "病歷號";
                        ArrForm3[0][1] = "結案";
                        var Closcnt = 0;
                        for(var z=0; z < ($("input[name='Closure']").length); z++){
                            ArrForm3[Closcnt+1] = new Array();
                            if($("#Fbtn" + (z+1) + "a2").attr("class").indexOf("disabled") > 0){
                                if($("#Closure" + (z+1)).prop('checked')){
                                    ArrForm3[Closcnt+1][0] = $("#Closure" + (z+1)).val();
                                    ArrForm3[Closcnt+1][1] = "結案";              
                                }else {
                                    ArrForm3[Closcnt+1][0] = $("#Closure" + (z+1)).val();
                                    ArrForm3[Closcnt+1][1] = "未結案";                
                                }
                                Closcnt++;
                            }
                        } 
                        
                        db = opendb("TestDatabase", "病歷號");

                        //var ws_name1 = "form1";
                        var ws_name2 = "form2";
                        var ws_name3 = "form3";

                        var wb = new Workbook(),
                            //ws1 = sheet_from_array_of_arrays(ArrForm1),
                            ws2 = sheet_from_array_of_arrays(ArrForm2),
                            ws3 = sheet_from_array_of_arrays(ArrForm3);

                        //add worksheet to workbook
                        //wb.SheetNames.push(ws_name1);
                        //wb.Sheets[ws_name1] = ws1;
                        console.log(ArrForm2);
                        wb.SheetNames.push(ws_name2);
                        wb.Sheets[ws_name2] = ws2;

                        wb.SheetNames.push(ws_name3);
                        wb.Sheets[ws_name3] = ws3;

                        var wbout = XLSX.write(wb, {
                            bookType: 'xlsx',
                            bookSST: true,
                            type: 'binary'
                        });

                        saveAs(new Blob([s2ab(wbout)], {
                            type: "application/octet-stream"
                        }), "finall.xlsx")

                        window.indexedDB.deleteDatabase("TestDatabase");
                        //window.indexedDB.deleteDatabase("Form1Database");
                        window.indexedDB.deleteDatabase("Form2Database");
                        window.indexedDB.deleteDatabase("olddb");
                        //window.indexedDB.deleteDatabase("From3Database");
                        location.assign("ControlPanel2.html");
                        //ReadF3db(people_id);

                    }
                };

                resource.onerror = function(event) { //出现错误给出提示
                    alert("can't create database,error:" + resource.error);
                };
            };

            // This event is only implemented in recent browsers
            requestF1.onupgradeneeded = function(event) {
                db = event.target.result;
                // Create an objectStore for this database
                var objectStore = db.createObjectStore("mList", {
                    keyPath: "病歷號"
                });
            };
            //===========================================
        }

        $("#Showbtn3").click(function() {
            //console.log('start');
            //var files = e.target.files;
            //console.log(files);
            var fileReader = new FileReader();

            fileReader.onload = function(ev) {
                var data = ev.target.result

                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                //document.getElementById('htmlout').innerHTML = "";
                var result = [];
                //workbook.SheetNames.forEach(function(sheetName) {
                //=========================================================================
                //html顯示表格
                var htmlstr = XLSX.write(workbook, {
                    sheet: "personal_information",
                    type: 'binary',
                    bookType: 'html'
                });
                RowCnt = -1;
                while ($("#T" + (RowCnt + 1)).length == 1) {
                    RowCnt++;
                }

                //document.getElementById('htmlout').innerHTML = htmlstr;

                //console.log(RowCnt);

                var temp = htmlstr.split("</td>");
                //console.log(temp);
                var temp2 = temp[0].split("<td>");

                if (RowCnt == -1) {
                    htmlstr = temp2[0] + "<td></td><td>姓名</td>" + "<td>年齡</td>" + "<td>病歷號</td>" + "<td>病房</td><td>止痛訪視</td>" + "<td>結案</td>";
                    RowCnt++;
                } else {
                    var temp5 = $("#htmlout").html().split("</table>");
                    htmlstr = temp5[0];
                }
                //console.log(temp);
                var i = 0;

                for (i = 15; i < temp.length - 1; i = i + 15) {
                    //console.log(i);
                    var temp3 = temp[i].split("<td>");
                    var temp4 = temp[i + 6].split("<td>");
                    RowCnt++;
                    htmlstr += temp3[0];
                    htmlstr += "<td>" + "<a class='btn btn-default navbar-btn' id='Plusbtn" + RowCnt + "'>+</a>" + "</td>";
                    htmlstr += temp[i + 4] + "</td>" + temp[i + 8] + "</td>" + temp[i + 6] + "</td>" + temp[i + 5] + "</td>";
                    //htmlstr += "<td><a class='btn btn-danger1 navbar-btn' id='Fbtn" + RowCnt + "a1' href='index.html?ssn=" + temp4[1] + "'>未填</a></td>"; //tssn[Math.floor(i / 14)]
                    htmlstr += "<td><a class='btn btn-danger2 navbar-btn' id='Fbtn" + RowCnt + "a2' href='index1.html?Fbtn" + RowCnt + "a2&ssn=" + temp4[1] + "'>未填</a></td>";
                    htmlstr += "<td><div class='btn-group-toolbar' data-toggle='buttons'><lable class='btn btn-danger disabled' id='Closurebtn" + RowCnt + "'><input type='checkbox' id='Closure" + RowCnt + "' name='Closure' value='" + temp4[1] + "'>結案</lable></div></td>";

                }
                htmlstr += temp[temp.length - 1];
                //console.log(temp[temp.length - 1]);
                document.getElementById('htmlout').innerHTML = htmlstr;
                $("#s0").height("auto");                
                console.log(htmlstr);
                //console.log(htmlstr);

                //=========================================================================
                //儲存病人資訊至DB
                var patient_info = to_json(workbook);

                var datacnt = { "123456": 1, "223456": 1 };

                for (var i = 0; i < (patient_info.form.length - 1); i++) {
                    for (var j = i + 1; j < patient_info.form.length; j++) {
                        if (patient_info.form[i].病歷號 == patient_info.form[j].病歷號) {
                            if (datacnt[patient_info.form[j].病歷號] == undefined)
                                datacnt[patient_info.form[j].病歷號] = 1;
                            patient_info.form[j].病歷號 = patient_info.form[j].病歷號 + "-" + datacnt[patient_info.form[j].病歷號];
                            datacnt[patient_info.form[j].病歷號]++;
                        }
                    }
                }

                console.log(patient_info.form);

                //write_to_db(db, patient_info.SheetJS);
                //console.log(vardb);
                var transaction = db.transaction(["mList"], "readwrite");
                //console.log(data);
                // Do something when all the data is added to the database.
                transaction.oncomplete = function(event) {
                    console.log("done");
                    //=========================================================================
                    var requestF1 = indexedDB.open("olddb");

                    requestF1.onerror = function(event) {
                        alert("Why didn't you allow my web app to use IndexedDB?!");
                    };
                    requestF1.onsuccess = function(event) {
                        db = event.target.result;
                        console.log(db);


                        //===============


                        var transaction = db.transaction(["mList"], "readwrite");
                        //console.log(data);
                        // Do something when all the data is added to the database.
                        transaction.oncomplete = function(event) {
                            console.log("done");
                            //alert("All done!");
                            db = opendb("TestDatabase", "病歷號");
                        };

                        transaction.onerror = function(event) {
                            // Don't forget to handle errors!
                            console.log("add error");

                        };

                        var objectStore = transaction.objectStore("mList");
                        for (var i in patient_info.form) {
                            var request = objectStore.add(patient_info.form[i]);
                            request.onsuccess = function(event) {
                                // event.target.result == customerData[i].ssn;
                            };
                        }

                    };
                    // This event is only implemented in recent browsers
                    requestF1.onupgradeneeded = function(event) {
                        db = event.target.result;
                        // Create an objectStore for this database
                        var objectStore = db.createObjectStore("mList", {
                            keyPath: "病歷號"
                        });
                    };
                    //===========================================
                };
                transaction.onerror = function(event) {
                    // Don't forget to handle errors!
                    console.log("add error");

                };
                var objectStore = transaction.objectStore("mList");
                for (var i in patient_info.personal_information) {
                    var request = objectStore.add(patient_info.personal_information[i]);
                    request.onsuccess = function(event) {
                        // event.target.result == customerData[i].ssn;
                    };
                }
                //===========================================================================


                //}); //workbook.SheetNames.forEach
            }; //fileReader.onload

            var oReq = new XMLHttpRequest();

            oReq.open("GET", "https://pandelaz.github.io/NTUTForm/ControlPanel2_TestFile2.xlsx", true);
            oReq.responseType = "blob";
            oReq.onload = function(e) {
                var bbuffer = oReq.response; // not responseText
                //console.log(bbuffer);
                fileReader.readAsBinaryString(bbuffer);                
            }
            oReq.send();

        });


        $("#Showbtn2").click(function() {

            //console.log($("#htmlout").html());

            var htmlsplit = $("#htmlout").html().split("</tr>"); //頭尾無效 1~length-2
            var people_id = new Array(htmlsplit.length - 2);
            for (var icnt = 1; icnt <= htmlsplit.length - 2; icnt++) {
                var htmlsplit2 = htmlsplit[icnt].split("</td>");
                var htmlsplit3 = htmlsplit2[2].split("<td>");
                people_id[icnt - 1] = htmlsplit3[1];
            }
            //console.log(people_id);

            //var Form1db = new Array(people_id.length);
            var Form2db = new Array(people_id.length);
            //var Form3db = new Array(people_id.length);
            var Fcnt = 0;

            //ArrForm1[0] = new Array();
            ArrForm2[0] = new Array();
            ArrForm3[0] = new Array();

            ReadF2db(people_id);

        });      
               
        
        
        $('body').on("click", function(e) {
            //console.log(e.target.id);
            //=========================================================================
            //儲存表單填寫狀況
            //excel-file
            //btnQ0-1-1
            //btnQ0-1-2
            //Showbtn1
            //Showbtn2
            //if (e.target.id == "excel-file" || e.target.id == "btnQ0-1-1" || e.target.id == "btnQ0-1-2" || e.target.id == "Showbtn1" || e.target.id == "Showbtn2") {

            //} else {
            //console.log(e.target.id.search("Fbtn"));
            if (e.target.id.search("Fbtn") >= 0) {
                e.preventDefault();
                var Today = new Date();
                $("#" + e.target.id).html((Today.getMonth() + 1) + "/" + Today.getDate() + "  " + Today.getHours() + ":" + Today.getMinutes());
                var etemp = e.target.id.split("n");
                var etemp2 = etemp[1].split("a");
                $("#T" + etemp2[0]).html($("#T" + etemp2[0]).html().replace(("btn-danger" + etemp2[1]), "btn-default disabled"));
                $("#Closurebtn" + etemp2[0]).attr("class", "btn btn-danger2");
                console.log($("#htmlout").html());
                //console.log($("#"+e.target.id).html());
                //var htemp = new Array();
                //var htemp[0] = new Array();
                var htemp = [{
                    "病歷號": "HTML",
                    "HtmlTemp": $("#htmlout").html()
                }];
                //console.log(htemp[0]);
                write_temp_html(db, htemp[0], $("#" + e.target.id).attr('href'));
                console.log($("#" + e.target.id).attr('href'));

                //=============================================================



                //=============================================================
            } else if (e.target.id.search("Plusbtn") >= 0) {
                var temp = e.target.id.split("Plusbtn");
                if ($("#" + e.target.id).attr("disabled")) {
                    return 0;
                }
                $("#" + e.target.id).attr("disabled", true);



                //console.log($("#T" + temp[1]).html().split("</td>"));

                var temp0 = $("#T" + temp[1]).html().split("</td>")

                var temp1 = temp0[1].split("<td>");
                var temp2 = temp0[2].split("<td>");
                var temp3 = temp0[3].split("<td>");

                //=======================================
                var transaction = db.transaction(["mList"]);
                var objectStore = transaction.objectStore("mList");
                var request1 = objectStore.get(temp3[1]);
                request1.onerror = function(event) {
                    // Handle errors!
                    alert("not found!");
                };
                request1.onsuccess = function(event) {
                    //request1.result
                    if (temp3[1].search("-") == -1) {
                        temp3[1] = temp3[1] + "-2";
                    } else {
                        var temp31 = temp3[1].split("-");
                        temp3[1] = temp31[0] + "-" + (parseInt(temp31[1]) + 1);
                    }

                    var temp4 = temp0[4].split("<td>");
                    RowCnt = -1;
                    while ($("#T" + (RowCnt + 1)).length == 1) {
                        RowCnt++;
                    }

                    RowCnt++;
                    $("table").html($("table").html() +
                        "<tr id='T" + RowCnt + "'>" +
                        "<td>" + "<a class='btn btn-default navbar-btn' id='Plusbtn" + RowCnt + "'>+</a>" + "</td>" +
                        "<td>" + temp1[1] + "</td>" +
                        "<td>" + temp2[1] + "</td>" +
                        "<td>" + temp3[1] + "</td>" +
                        "<td>" + temp4[1] + "</td>" +
                        //"<td><a class='btn btn-danger1 navbar-btn' id='Fbtn" + RowCnt + "a1' href='index.html?ssn=" + temp3[1] + "'>未填</a></td>" +
                        "<td><a class='btn btn-danger2 navbar-btn' id='Fbtn" + RowCnt + "a2' href='index1.html?Fbtn" + RowCnt + "a2&ssn=" + temp3[1] + "'>未填</a></td>" +
                        "<td></td>" +
                        "</tr>");

                    var wstemp = [{
                        "機號": request1.result.機號,
                        "刀序1": request1.result.刀序1,
                        "刀序2": request1.result.刀序2,
                        "姓名": temp1[1],
                        "病房": temp4[1],
                        "病歷號": temp3[1],
                        "性別": request1.result.性別,
                        "年齡": temp2[1],
                        "診斷": request1.result.診斷,
                        "術式": request1.result.術式,
                        "天數": request1.result.天數,
                        "麻VS": request1.result.麻VS,
                        "備註": request1.result.備註,
                        "入帳": request1.result.入帳,
                    }];

                    write_to_db(db, wstemp);

                };
                //=======================================

            } else if (e.target.id.search("Closure") >= 0) {
                var Closuretemp = e.target.id.split("btn");
                if($("#Fbtn" + Closuretemp[1] + "a2").attr("class").indexOf("disabled") > 0){
                    if($("#" + e.target.id).attr("class").search("default") == -1){
                        $("#" + e.target.id).attr("class", "btn btn-default");
                        $("#Closure" + Closuretemp[1]).attr("checked", "checked");
                    }else{
                        $("#" + e.target.id).attr("class", "btn btn-danger2");
                        $("#Closure" + Closuretemp[1]).attr("checked", false);
                    } 
                }
            }
        });

        $("#info11").change(function() {
            id = $("#info11").find(':selected').data('id');
            //或是以下方式也可以
            //id= $(this).find(':selected').attr('data-id');              

            if (id == 1) {
                //$("#division1Text").remove();
                //$("#division3Text").remove();
                $("#info13").hide();
                $("#info12").show();
            }
            if (id == 2) {
                $("#info12").hide();
                $("#info13").show();

                //$("#division2Text").remove();
                //$("#Textdivision3").append('<span id="division3Text"><select name="bigout"><option value="1">骨科</option><option value="2">泌尿科</option><option value="3">耳鼻喉科</option><option value="4">牙科</option><option value="5">皮膚科</option><option value="6">疼痛科</option></select></span>');
            }
        });      
        
    });

    