$(document).ready(function() {
    var cnt51211 = 0,
        cnt51212 = 0,
        cnt51214 = 0,
        cnt51411 = 0,
        cnt51412 = 0,
        cnt51414 = 0,
        cnt513 = 0,
        cnt5221 = 0,
        cnt5224 = 0,
        cnt5232 = 0,
        cnt5233 = 0,
        cnt5234 = 0,
        cntasa = 0,
        id = 1,
        Q21 = 0,
        Q33 = 0,
        hd2 = 0,
        hd3 = 0,
        hd4 = 0,
        hd5 = 0,
        hd6 = 1,
        hrfhd = 0;

    $("#Q5-1-3Text").hide();
    $("#Q5-1-2-1-1Text,#Q5-1-2-1-2Text,#Q5-1-2-1-4Text").hide();
    $("#Q5-1-4-1-1Text,#Q5-1-4-1-2Text,#Q5-1-4-1-4Text").hide();
    $("#Q5-2-2-1Text,#Q5-2-2-4Text").hide();
    $("#Q5-2-3-2Text,#Q5-2-3-3Text,#Q5-2-3-4Text").hide();
    $("#Q5-3-1,#Q5-3-2,#Q5-3-3,#Q5-3-4,#Q5-3-5,#Q5-3-6").hide();
    $("#QT5-3-1,#QT5-3-2").hide();
    $("#QT5-3-3-1,#QT5-3-3-2,#QT5-3-3-3,#QT5-3-3-4,#QT5-3-3-5").hide();
    $("#QT5-3-4-1,#QT5-3-4-2,#QT5-3-4-3,#QT5-3-4-4,#QT5-3-4-5").hide();
    $("#QT5-3-5-1,#QT5-3-5-2,#QT5-3-5-3,#QT5-3-5-4,#QT5-3-5-5").hide();
    $("#Q5-6-4-2Text,#Q5-6-4-1Text").hide();
    $("#QC5-4-1-1SEL1,#QC5-4-1-1SEL2,#QC5-4-1-1SEL3").show();
    $("#FF9-1Btn").hide();
    $("#QQ5-6").hide("fast");



    $("#btnQF1-1").addClass("active");
    $("#QF1-1").prop("checked", true);
    $("#btnQF2-1").addClass("active");
    $("#QF2-1").prop("checked", true);
    $("#btnQF3-1").addClass("active");
    $("#QF3-1").prop("checked", true);
    $("#btnQF4-1").addClass("active");
    $("#QF4-1").prop("checked", true);
    $("#btnQF5-1").addClass("active");
    $("#QF5-1").prop("checked", true);
    $("#btnQF6-1").addClass("active");
    $("#QF6-1").prop("checked", true);
    $("#btnQF7-1").addClass("active");
    $("#QF7-1").prop("checked", true);
    $("#btnQF8-1").addClass("active");
    $("#QF8-1").prop("checked", true);
    $("#btnQF11-1").addClass("active");
    $("#QF11-1").prop("checked", true);



    //-----------------------------------------------------------------------------------------
    //開啟資料庫
    var db;
    var hhtemp = 0;
    var htemp = window.location.href.split("=");
    var patient_info = { "date": "", "病歷號": "", "姓名": "", "病房": "", "性別": "", "年齡": "", "診斷": "" };
    var time = 0;
    var request = indexedDB.open("TestDatabase");
    request.onerror = function(event) {
        alert("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = function(event) {
        db = event.target.result;
        console.log(db);
        var transaction = db.transaction(["mList"]);
        var objectStore = transaction.objectStore("mList");

        if (htemp[1].search("-") != -1) {
            hhtemp = htemp[1];
            //historyDB = 1;
            var htemp1 = htemp[1].split("-");

            if (htemp1[1] == "2") {
                htemp[1] = htemp1[0];
            } else {
                htemp[1] = htemp1[0] + "-" + (parseInt(htemp1[1]) - 1);
            }

        }

        var request = objectStore.get(htemp[1]);
        request.onerror = function(event) {
            // Handle errors!
            alert("not found!");
        };
        request.onsuccess = function(event) {

            var Today = new Date();
            $("#Qtime1").html((Today.getMonth() + 1) + " 月 " + Today.getDate() + " 日");
            $("#Qtime2").html(Today.getHours() + " 點 " + Today.getMinutes() + " 分");
            $("#ss01").attr("value", request.result.姓名);
            $("#ss02").attr("value", request.result.病房);
            $("#ss03").attr("value", request.result.性別);
            $("#ss04").attr("value", request.result.年齡);
            $("#ss07").attr("value", request.result.術式);

            patient_info["病歷號"] = request.result.病歷號;
            patient_info['診斷'] = request.result.診斷;
            //=================================================================================
            var request1 = indexedDB.open("Form2Database");
            request1.onerror = function(event) {
                alert("Why didn't you allow my web app to use IndexedDB?!");
            };
            request1.onsuccess = function(event) {
                db = event.target.result;
                console.log(db);

                var transaction1 = db.transaction(["mList"]);
                var objectStore1 = transaction1.objectStore("mList");
                var request2 = objectStore1.get(patient_info['病歷號']);
                request2.onerror = function(event) {
                    alert("not found!");
                };
                request2.onsuccess = function(event) {
                    if (request2.result != undefined)
                        patient_info = request2.result;
                    console.log(patient_info);


                    olddbload();

                    var request1 = indexedDB.open("Form2Database");
                    request1.onerror = function(event) {
                        alert("Why didn't you allow my web app to use IndexedDB?!");
                    };
                    request1.onsuccess = function(event) {
                        db = event.target.result;
                        //console.log(db);
                    };

                };

            };
            // This event is only implemented in recent browsers
            request1.onupgradeneeded = function(event) {
                db = event.target.result;
                // Create an objectStore for this database
                var objectStore1 = db.createObjectStore("mList", {
                    keyPath: "病歷號"
                });
            };
            //=================================================================================

        };
    };

    //=================================================================================

    function olddbload() {
        //=================================================================================
        var request2 = indexedDB.open("olddb");
        request2.onerror = function(event) {
            alert("Why didn't you allow my web app to use IndexedDB?!");
        };
        request2.onsuccess = function(event) {
            db = event.target.result;
            console.log(db);

            var transaction2 = db.transaction(["mList"]);
            var objectStore2 = transaction2.objectStore("mList");

            var olddata = objectStore2.get(htemp[1]);
            objectStore2.getAll().onsuccess = function(event) {
                console.log(event.target.result);
                var resdata = event.target.result;
                //===============

                var lastdata;
                var datanumber = [];
                //time = 0;
                for (var i = 0; i < resdata.length; i++) {
                    //console.log(resdata[i].病歷號.indexOf(patient_info["病歷號"]));
                    //lastdata = 0;
                    if (resdata[i].病歷號.indexOf(patient_info["病歷號"].substring(0, 7)) >= 0) {
                        //console.log(resdata[i].病歷號);
                        datanumber[time] = i;
                        lastdata = resdata[i];
                        time++;
                    }
                }

                console.log(lastdata);

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
                document.getElementById("StartDate").value = info07;

                for (var x = 2; x <= time; x++) {
                    $("#carousel-innerQ5-6").append('<div class="item"><br><p>日　期: <span id="olddata' + x + '-1"></span></p><p>時　間: <span id="olddata' + x + '-2"></span></p><p>頭　暈: <span id="olddata' + x + '-3"></span></p><p>噁　心: <span id="olddata' + x + '-4"></span></p><p>嘔　吐: <span id="olddata' + x + '-5"></span></p><p>癢　疹: <span id="olddata' + x + '-6"></span></p><p>嗜　睡: <span id="olddata' + x + '-7"></span></p><p>難　尿: <span id="olddata' + x + '-8"></span></p><p>頭　痛: <span id="olddata' + x + '-9"></span></p><p>腳　麻: <span id="olddata' + x + '-10"></span></p><p>處　置: <span id="olddata' + x + '-11"></span></p><p>EA 導管: <span id="olddata' + x + '-12"></span></p><p>衛　教: <span id="olddata' + x + '-13"></span></p><br><div class="carousel-caption"></div></div>');
                }
                for (x = 2; x <= time; x++) {
                    $("#carousel-innerQ3-2").append('<div class="item"><TEXTAREA cols=35 rows=8 id="olddata' + x + '-14"></TEXTAREA><div class="carousel-caption"></div></div>');
                }
                for (x = 2; x <= time; x++) {
                    $('#carousel-innerQ3-3').append('<div class="item"><br><p id="olddata' + x + '-15">U1126：</p></div>');
                }
                if (time < 2) {
                    $('.carousel-indicators, .carousel-control').hide();
                }
                if (time > 0) {
                    $("#ss01").attr("value", lastdata.姓名);
                    $("#ss02").attr("value", lastdata.病房);
                    $("#ss03").attr("value", lastdata.性別);
                    $("#ss04").attr("value", lastdata.年齡);
                    $("#ss07").attr("value", lastdata.術式);
                    $("#ss08").attr("value", lastdata.身高);
                    $("#ss09").attr("value", lastdata.體重);
                    $("#ss06").attr("value", lastdata.Cre);

                    if (lastdata.個人史.indexOf("藥物過敏") != -1) {
                        $("#btnQ5-2-2-1").attr("class", "btn btn-primary Large-Width active");
                        $("#Q5-2-2-1").attr("checked", "checked");
                        $("#Q5-2-2-1Text").show();
                        cnt5221 = 1;
                        $("#QT5-2-2-1").attr("value", lastdata["藥物過敏"]);
                    }
                    if (lastdata.個人史.indexOf("腸胃潰瘍史") != -1) {
                        $("#btnQ5-2-2-2").attr("class", "btn btn-primary Large-Width active");
                        $("#Q5-2-2-2").attr("checked", "checked");
                    }
                    if (lastdata.個人史.indexOf("藥癮/毒癮患者") != -1) {
                        $("#btnQ5-2-2-3").attr("class", "btn btn-primary Large-Width active");
                        $("#Q5-2-2-3").attr("checked", "checked");
                    }
                    if (lastdata.個人史.indexOf("長期使用opioids") != -1) {
                        $("#btnQ5-2-2-4").attr("class", "btn btn-primary Large-Width active");
                        $("#Q5-2-2-4").attr("checked", "checked");
                        $("#Q5-2-2-4Text").show();
                        cnt5224 = 1;
                        $("#QT5-2-2-4").attr("value", lastdata["長期使用opioids"]);
                    }
                    if (lastdata.個人史.indexOf("洗腎") != -1) {
                        $("#btnQ5-2-2-5").attr("class", "btn btn-primary Large-Width active");
                        $("#Q5-2-2-5").attr("checked", "checked");
                    }

                    switch (lastdata.使用原因) {
                        case "術後急性疼痛":
                            $("#btnQ5-2-3-1").attr("class", "btn btn-primary Large-Width active");
                            $("#Q5-2-3-1").attr("checked", "checked");

                            break;
                        case "剖腹產":
                            $("#btnQ5-2-3-2").attr("class", "btn btn-primary Large-Width active");
                            $("#Q5-2-3-2").attr("checked", "checked");
                            $("#Q5-2-3-2Text").show();
                            $("#QT5-2-3-2").attr("value", lastdata["使用原因-剖腹產：胎次"]);

                            break;
                        case "減痛分娩":
                            $("#btnQ5-2-3-3").attr("class", "btn btn-primary Large-Width active");
                            $("#Q5-2-3-3").attr("checked", "checked");
                            $("#Q5-2-3-3Text").show();
                            $("#QT5-2-3-3").attr("value", lastdata["使用原因-減痛分娩：胎次"]);

                            break;
                        case "癌症疼痛":
                            $("#btnQ5-2-3-5").attr("class", "btn btn-primary Large-Width active");
                            $("#Q5-2-3-5").attr("checked", "checked");

                            break;
                        case "其他":
                            $("#btnQ5-2-3-4").attr("class", "btn btn-primary Large-Width active");
                            $("#Q5-2-3-4").attr("checked", "checked");
                            $("#Q5-2-3-4Text").show();
                            $("#QT5-2-3-4").attr("value", lastdata["使用原因-其他"]);

                            break;
                    }

                    var EndHour = lastdata.麻醉結束時間.substring(0, 2);
                    var EndMin = lastdata.麻醉結束時間.substring(3, 5);
                    $("#EndHour option[value=" + EndHour + "]").attr("selected", "selected");
                    $("#EndMin option[value=" + EndMin + "]").attr("selected", "selected");


                    var StartDate = lastdata.預計使用期間.substring(0, 10);
                    var ToEndDate = lastdata.預計使用期間.substring(13, 23);
                    $("#StartDate").attr("value", StartDate);
                    $("#ToEndDate").attr("value", ToEndDate);

                    var Zfran = lastdata["已知用藥-Zfran"].substr(0, 1);
                    $("#Q5-1-1 option[value=" + Zfran + "]").attr("selected", "selected");

                    if (lastdata["已知用藥-OR"].indexOf("無") != -1) {
                        $("#btnQ5-1-2-1-5").attr("class", "btn btn-primary active");
                        $("#Q5-1-2-1-5").attr("checked", "checked");
                    } else {
                        var OR = lastdata["已知用藥-OR"].split("+");
                        if (lastdata["已知用藥-OR"].indexOf("morphine") != -1) {
                            $("#btnQ5-1-2-1-1").attr("class", "btn btn-primary active");
                            $("#Q5-1-2-1-1").attr("checked", "checked");
                            $("#Q5-1-2-1-1Text").show();
                            cnt51211 = 1;
                            if (OR.length == 1) {
                                $("#QT5-1-2-1-1").attr("value", OR[0].substring(9, (OR[0].length - 3)));
                            } else {
                                $("#QT5-1-2-1-1").attr("value", OR[0].substring(9, (OR[0].length - 4)));
                            }
                        }
                        if (lastdata["已知用藥-OR"].indexOf("keto") != -1) {
                            $("#btnQ5-1-2-1-2").attr("class", "btn btn-primary active");
                            $("#Q5-1-2-1-2").attr("checked", "checked");
                            $("#Q5-1-2-1-2Text").show();
                            cnt51212 = 1;
                            var keto2 = 0;
                            for (var keto = 0; keto < (OR.length - 1); keto++) {
                                if (OR[keto].indexOf("keto") > 0) {
                                    keto2 = keto;
                                }
                            }
                            if (keto2 == 0) {
                                $("#QT5-1-2-1-2").attr("value", OR[0].substring(5, (OR[0].length - 3)));
                            } else {
                                $("#QT5-1-2-1-2").attr("value", OR[keto2].substring(6, (OR[keto2].length - 4)));
                            }
                        }
                        if (lastdata["已知用藥-OR"].indexOf("Tencam 1支") != -1) {
                            $("#btnQ5-1-2-1-3").attr("class", "btn btn-primary active");
                            $("#Q5-1-2-1-3").attr("checked", "checked");
                        }
                        if (OR[OR.length - 1].indexOf("morphine") == -1 && OR[OR.length - 1].indexOf("keto") == -1 && OR[OR.length - 1].indexOf("Tencam 1支") == -1) {
                            $("#btnQ5-1-2-1-4").attr("class", "btn btn-primary active");
                            $("#Q5-1-2-1-4").attr("checked", "checked");
                            $("#Q5-1-2-1-4Text").show();
                            cnt51214 = 1;
                            if (OR.length == 1) {
                                $("#QT5-1-2-1-3").attr("value", OR[OR.length - 1].substr(0, OR[OR.length - 1].length));
                            } else {
                                $("#QT5-1-2-1-3").attr("value", OR[OR.length - 1].substr(1, OR[OR.length - 1].length));
                            }
                        }
                    }

                    if (lastdata["已知用藥-POR"].indexOf("無") != -1) {
                        $("#btnQ5-1-4-1-5").attr("class", "btn btn-primary active");
                        $("#Q5-1-2-1-5").attr("checked", "checked");
                    } else {
                        var POR = lastdata["已知用藥-POR"].split("+");
                        if (lastdata["已知用藥-POR"].indexOf("morphine") != -1) {
                            $("#btnQ5-1-4-1-1").attr("class", "btn btn-primary active");
                            $("#Q5-1-4-1-1").attr("checked", "checked");
                            $("#Q5-1-4-1-1Text").show();
                            cnt51411 = 1;
                            if (POR.length == 1) {
                                $("#QT5-1-4-1-1").attr("value", POR[0].substring(9, (POR[0].length - 3)));
                            } else {
                                $("#QT5-1-4-1-1").attr("value", POR[0].substring(9, (POR[0].length - 4)));
                            }
                        }
                        if (lastdata["已知用藥-POR"].indexOf("keto") != -1) {
                            $("#btnQ5-1-4-1-2").attr("class", "btn btn-primary active");
                            $("#Q5-1-4-1-2").attr("checked", "checked");
                            $("#Q5-1-4-1-2Text").show();
                            cnt51412 = 1;
                            var keto2 = 0;
                            for (var keto = 0; keto < (POR.length - 1); keto++) {
                                if (POR[keto].indexOf("keto") > 0) {
                                    keto2 = keto;
                                }
                            }
                            if (keto2 == 0) {
                                $("#QT5-1-4-1-2").attr("value", POR[0].substring(5, (POR[0].length - 3)));
                            } else {
                                $("#QT5-1-4-1-2").attr("value", POR[keto2].substring(6, (POR[keto2].length - 4)));
                            }
                        }
                        if (lastdata["已知用藥-POR"].indexOf("Tencam 1支") != -1) {
                            $("#btnQ5-1-4-1-3").attr("class", "btn btn-primary active");
                            $("#Q5-1-4-1-3").attr("checked", "checked");
                        }
                        if (POR[POR.length - 1].indexOf("morphine") == -1 && POR[POR.length - 1].indexOf("keto") == -1 && POR[POR.length - 1].indexOf("Tencam 1支") == -1) {
                            $("#btnQ5-1-4-1-4").attr("class", "btn btn-primary active");
                            $("#Q5-1-4-1-4").attr("checked", "checked");
                            $("#Q5-1-4-1-4Text").show();
                            cnt51414 = 1;
                            if (POR.length == 1) {
                                $("#QT5-1-4-1-4").attr("value", POR[POR.length - 1].substr(0, POR[POR.length - 1].length));
                            } else {
                                $("#QT5-1-4-1-4").attr("value", POR[POR.length - 1].substr(1, POR[POR.length - 1].length));
                            }
                        }
                    }

                    $("#Q5-3-1-1").attr("value", lastdata.機號);
                    $("#Q5-3-1-2").attr("value", lastdata.鎖牌號碼);
                    switch (lastdata.止痛方式) {
                        case "IVPCA":
                            $("#btnQ5-3-2-1").attr("class", "btn btn-primary active");
                            $("#Q5-3-2-1").attr("checked", "checked");
                            $("#Q5-3-1").show();
                            if (lastdata.止痛藥物.length > 0) {
                                switch (lastdata.止痛藥物) {
                                    case "Morphine 1mg/ml":
                                        $("#btnQ5-3-3-1").attr("class", "btn btn-primary active");
                                        $("#Q5-3-3-1").attr("checked", "checked");
                                        break;
                                    case "Fentanyl 10mcg/ml":
                                        $("#btnQ5-3-3-2").attr("class", "btn btn-primary active");
                                        $("#Q5-3-3-2").attr("checked", "checked");
                                        break;
                                    default:
                                        $("#btnQ5-3-3-3").attr("class", "btn btn-primary active");
                                        $("#Q5-3-3-3").attr("checked", "checked");
                                        $("#QT5-3-1").show();
                                        $("#Q5-3-3-3-1").attr("value", lastdata.止痛藥物);
                                }
                            }
                            if (lastdata["機器設定-Loading dose"].length > 0 || lastdata["機器設定-PCA dose"].length > 0 || lastdata["機器設定-Infusion dose"].length > 0 || lastdata["機器設定-Lock-out interval"].length > 0 || lastdata["機器設定-4-hr limit"].length > 0) {
                                if (lastdata["機器設定-Loading dose"] == "3 mg" && lastdata["機器設定-PCA dose"] == "1 mg" && lastdata["機器設定-Infusion dose"] == "0 mg" && lastdata["機器設定-Lock-out interval"] == "5 min" && lastdata["機器設定-4-hr limit"] == "20 mg") {
                                    $("#btnQ5-3-4-1").attr("class", "btn btn-primary active");
                                    $("#Q5-3-4-1").attr("checked", "checked");
                                } else if (lastdata["機器設定-Loading dose"] == "3 mg" && lastdata["機器設定-PCA dose"] == "2 mg" && lastdata["機器設定-Infusion dose"] == "0 mg" && lastdata["機器設定-Lock-out interval"] == "10 min" && lastdata["機器設定-4-hr limit"] == "30 mg") {
                                    $("#btnQ5-3-4-2").attr("class", "btn btn-primary active");
                                    $("#Q5-3-4-2").attr("checked", "checked");
                                } else if (lastdata["機器設定-Loading dose"] == "2 mg" && lastdata["機器設定-PCA dose"] == "1 mg" && lastdata["機器設定-Infusion dose"] == "0 mg" && lastdata["機器設定-Lock-out interval"] == "5 min" && lastdata["機器設定-4-hr limit"] == "15 mg") {
                                    $("#btnQ5-3-4-3").attr("class", "btn btn-primary active");
                                    $("#Q5-3-4-3").attr("checked", "checked");
                                } else {
                                    $("#btnQ5-3-4-4").attr("class", "btn btn-primary active");
                                    $("#Q5-3-4-4").attr("checked", "checked");
                                    $("#QT5-3-3-1,#QT5-3-3-2,#QT5-3-3-3,#QT5-3-3-4,#QT5-3-3-5").show();
                                    $("#Q5-3-4-4-1").attr("value", lastdata["機器設定-Loading dose"].substring(0, (lastdata["機器設定-Loading dose"].length - 3)));
                                    $("#Q5-3-4-4-2").attr("value", lastdata["機器設定-PCA dose"].substring(0, (lastdata["機器設定-PCA dose"].length - 3)));
                                    $("#Q5-3-4-4-3").attr("value", lastdata["機器設定-Infusion dose"].substring(0, (lastdata["機器設定-Infusion dose"].length - 3)));
                                    $("#Q5-3-4-4-4").attr("value", lastdata["機器設定-Lock-out interval"].substring(0, (lastdata["機器設定-Lock-out interval"].length - 4)));
                                    $("#Q5-3-4-4-5").attr("value", lastdata["機器設定-4-hr limit"].substring(0, (lastdata["機器設定-4-hr limit"].length - 3)));
                                }
                            }
                            break;
                        case "PCEA":
                            $("#btnQ5-3-2-2").attr("class", "btn btn-primary active");
                            $("#Q5-3-2-2").attr("checked", "checked");
                            $("#Q5-3-2").show();
                            $("#Q5-3-3").show();
                            $("#Q5-3-6").show();
                            if (lastdata.止痛藥物.length > 0) {
                                switch (lastdata.止痛藥物) {
                                    case "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL":
                                        $("#btnQ5-3-5-1").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-1").attr("checked", "checked");
                                        break;
                                    case "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL":
                                        $("#btnQ5-3-5-2").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-2").attr("checked", "checked");
                                        break;
                                    case "Marcaine 0.66 mg/mL + Morphine 0.01 mg/mL: 400mL":
                                        $("#btnQ5-3-5-3").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-3").attr("checked", "checked");
                                        break;
                                    case "Marcaine 1 mg/mL: 400mL":
                                        $("#btnQ5-3-5-4").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-4").attr("checked", "checked");
                                        break;
                                    case "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL":
                                        $("#btnQ5-3-5-5").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-5").attr("checked", "checked");
                                        break;
                                    case "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL":
                                        $("#btnQ5-3-5-6").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-6").attr("checked", "checked");
                                        break;
                                    case "Chirocaine 1 mg/mL: 400mL":
                                        $("#btnQ5-3-5-7").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-7").attr("checked", "checked");
                                        break;
                                    default:
                                        $("#btnQ5-3-5-8").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-8").attr("checked", "checked");
                                        $("#QT5-3-2").show();
                                        $("#QT5-3-5-8-1").attr("value", lastdata.止痛藥物);
                                }
                            }
                            if (lastdata["機器設定-Loading dose"].length > 0 || lastdata["機器設定-PCA dose"].length > 0 || lastdata["機器設定-Infusion dose"].length > 0 || lastdata["機器設定-Lock-out interval"].length > 0 || lastdata["機器設定-4-hr limit"].length > 0) {
                                if (lastdata["機器設定-Loading dose"] == "0 ml" && lastdata["機器設定-PCA dose"] == "3 ml" && lastdata["機器設定-Infusion dose"] == "4 ml" && lastdata["機器設定-Lock-out interval"] == "20 min" && lastdata["機器設定-4-hr limit"] == "35 mg") {
                                    $("#btnQ5-3-6-1").attr("class", "btn btn-primary active");
                                    $("#Q5-3-6-1").attr("checked", "checked");
                                } else if (lastdata["機器設定-Loading dose"] == "0 ml" && lastdata["機器設定-PCA dose"] == "6 ml" && lastdata["機器設定-Infusion dose"] == "6 ml" && lastdata["機器設定-Lock-out interval"] == "15 min" && lastdata["機器設定-4-hr limit"] == "80 mg") {
                                    $("#btnQ5-3-6-2").attr("class", "btn btn-primary active");
                                    $("#Q5-3-6-2").attr("checked", "checked");
                                } else {
                                    $("#btnQ5-3-6-3").attr("class", "btn btn-primary active");
                                    $("#Q5-3-6-3").attr("checked", "checked");
                                    $("#QT5-3-4-1,#QT5-3-4-2,#QT5-3-4-3,#QT5-3-4-4,#QT5-3-4-5").show();
                                    $("#Q5-3-6-3-1").attr("value", lastdata["機器設定-Loading dose"].substring(0, (lastdata["機器設定-Loading dose"].length - 3)));
                                    $("#Q5-3-6-3-2").attr("value", lastdata["機器設定-PCA dose"].substring(0, (lastdata["機器設定-PCA dose"].length - 3)));
                                    $("#Q5-3-6-3-3").attr("value", lastdata["機器設定-Infusion dose"].substring(0, (lastdata["機器設定-Infusion dose"].length - 3)));
                                    $("#Q5-3-6-3-4").attr("value", lastdata["機器設定-Lock-out interval"].substring(0, (lastdata["機器設定-Lock-out interval"].length - 4)));
                                    $("#Q5-3-6-3-5").attr("value", lastdata["機器設定-4-hr limit"].substring(0, (lastdata["機器設定-4-hr limit"].length - 3)));
                                }
                            }
                            $("#Q5-3-8-1").attr("value", lastdata.位置);
                            $("#Q5-3-8-2").attr("value", lastdata.fix);
                            $("#Q5-3-8-3").attr("value", lastdata.施打者);

                            break;
                        case "PCEA+PIB":
                            $("#btnQ5-3-2-3").attr("class", "btn btn-primary active");
                            $("#Q5-3-2-3").attr("checked", "checked");
                            $("#Q5-3-2").show();
                            $("#Q5-3-4").show();
                            $("#Q5-3-6").show();
                            if (lastdata.止痛藥物.length > 0) {
                                switch (lastdata.止痛藥物) {
                                    case "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL":
                                        $("#btnQ5-3-5-1").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-1").attr("checked", "checked");
                                        break;
                                    case "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL":
                                        $("#btnQ5-3-5-2").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-2").attr("checked", "checked");
                                        break;
                                    case "Marcaine 0.66 mg/mL + Morphine 0.01 mg/mL: 400mL":
                                        $("#btnQ5-3-5-3").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-3").attr("checked", "checked");
                                        break;
                                    case "Marcaine 1 mg/mL: 400mL":
                                        $("#btnQ5-3-5-4").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-4").attr("checked", "checked");
                                        break;
                                    case "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL":
                                        $("#btnQ5-3-5-5").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-5").attr("checked", "checked");
                                        break;
                                    case "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL":
                                        $("#btnQ5-3-5-6").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-6").attr("checked", "checked");
                                        break;
                                    case "Chirocaine 1 mg/mL: 400mL":
                                        $("#btnQ5-3-5-7").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-7").attr("checked", "checked");
                                        break;
                                    default:
                                        $("#btnQ5-3-5-8").attr("class", "btn btn-primary active");
                                        $("#Q5-3-5-8").attr("checked", "checked");
                                        $("#QT5-3-2").show();
                                        $("#QT5-3-5-8-1").attr("value", lastdata.止痛藥物);
                                }
                            }
                            if (lastdata["機器設定-Loading dose"].length > 0 || lastdata["機器設定-PCA dose"].length > 0 || lastdata["機器設定-Infusion dose"].length > 0 || lastdata["機器設定-Lock-out interval"].length > 0 || lastdata["機器設定-4-hr limit"].length > 0) {
                                if (lastdata["機器設定-Loading dose"] == "0 ml" && lastdata["機器設定-PCA dose"] == "3 ml" && lastdata["機器設定-Infusion dose"] == "4 ml" && lastdata["機器設定-Lock-out interval"] == "20 min" && lastdata["機器設定-4-hr limit"] == "40 mg") {
                                    $("#btnQ5-3-7-1").attr("class", "btn btn-primary active");
                                    $("#Q5-3-7-1").attr("checked", "checked");
                                } else if (lastdata["機器設定-Loading dose"] == "0 ml" && lastdata["機器設定-PCA dose"] == "6 ml" && lastdata["機器設定-Infusion dose"] == "8 ml" && lastdata["機器設定-Lock-out interval"] == "15 min" && lastdata["機器設定-4-hr limit"] == "80 mg") {
                                    $("#btnQ5-3-7-2").attr("class", "btn btn-primary active");
                                    $("#Q5-3-7-2").attr("checked", "checked");
                                } else {
                                    $("#btnQ5-3-7-3").attr("class", "btn btn-primary active");
                                    $("#Q5-3-7-3").attr("checked", "checked");
                                    $("#QT5-3-5-1,#QT5-3-5-2,#QT5-3-5-3,#QT5-3-5-4,#QT5-3-5-5").show();
                                    $("#Q5-3-7-3-1").attr("value", lastdata["機器設定-Loading dose"].substring(0, (lastdata["機器設定-Loading dose"].length - 3)));
                                    $("#Q5-3-7-3-2").attr("value", lastdata["機器設定-PCA dose"].substring(0, (lastdata["機器設定-PCA dose"].length - 3)));
                                    $("#Q5-3-7-3-3").attr("value", lastdata["機器設定-Infusion dose"].substring(0, (lastdata["機器設定-Infusion dose"].length - 3)));
                                    $("#Q5-3-7-3-4").attr("value", lastdata["機器設定-Lock-out interval"].substring(0, (lastdata["機器設定-Lock-out interval"].length - 4)));
                                    $("#Q5-3-7-3-5").attr("value", lastdata["機器設定-4-hr limit"].substring(0, (lastdata["機器設定-4-hr limit"].length - 3)));
                                }
                            }
                            $("#Q5-3-8-1").attr("value", lastdata.位置);
                            $("#Q5-3-8-2").attr("value", lastdata.fix);
                            $("#Q5-3-8-3").attr("value", lastdata.施打者);

                            break;
                        case "C/S(8-8)":
                            $("#btnQ5-3-2-4").attr("class", "btn btn-primary active");
                            $("#Q5-3-2-4").attr("checked", "checked");
                            $("#Q5-3-5").show();
                            $("#Q5-3-6").show();

                            $("#Q5-3-8-1").attr("value", lastdata.位置);
                            $("#Q5-3-8-2").attr("value", lastdata.fix);
                            $("#Q5-3-8-3").attr("value", lastdata.施打者);

                            break;
                    }

                    var c = "2017-11-02 11:15";
                    if (lastdata.下床時間 == "尚未發生") {
                        $("#btnnone1").attr("class", "btn btn-primary active");
                        $("#none1").attr("checked", "checked");
                    } else {
                        var OutbedTimeyear = lastdata.下床時間.substring(0, 4);
                        var OutbedTimemonth = lastdata.下床時間.substring(5, 7);
                        var OutbedTimeday = lastdata.下床時間.substring(8, 10);
                        var dbedhour = lastdata.下床時間.substring(11, 13);
                        var dbedmin = lastdata.下床時間.substring(14, 16);
                        $("#OutbedTime").attr("value", OutbedTimeyear + "-" + OutbedTimemonth + "-" + OutbedTimeday);
                        $("#dbedhour option[value=" + dbedhour + "]").attr("selected", "selected");
                        $("#dbedmin option[value=" + dbedmin + "]").attr("selected", "selected");
                        $("#btnnone1").attr("class", "btn btn-primary");
                        $("#none1").attr("checked", false);
                    }

                    if (lastdata.排氣時間 == "尚未發生") {
                        $("#btnnone2").attr("class", "btn btn-primary active");
                        $("#none2").attr("checked", "checked");
                    } else {
                        var GasTimeyear = lastdata.排氣時間.substring(0, 4);
                        var GasTimemonth = lastdata.排氣時間.substring(5, 7);
                        var GasTimeday = lastdata.排氣時間.substring(8, 10);
                        var blhour = lastdata.排氣時間.substring(11, 13);
                        var blmin = lastdata.排氣時間.substring(14, 16);
                        $("#GasTime").attr("value", GasTimeyear + "-" + GasTimemonth + "-" + GasTimeday);
                        $("#blhour option[value=" + blhour + "]").attr("selected", "selected");
                        $("#blmin option[value=" + blmin + "]").attr("selected", "selected");
                        $("#btnnone2").attr("class", "btn btn-primary");
                        $("#none2").attr("checked", false);
                    }

                    if (lastdata.PCA同意書確認 == "已確認") {
                        $("#btnQn5-6-2").addClass("active");
                        $("#Qn5-6-2-1").attr("checked", "check");
                    } else {
                        $("#btnQn5-6-2").attr("class", "btn btn-primary");
                        $("#Qn5-6-2-1").attr("checked", false);
                    }


                    if (lastdata["PFE(PCA)"].indexOf("術訪") != -1) {
                        $("#btnQn5-6-3-1").attr("class", "btn btn-primary active");
                        $("#Qn5-6-3-1").attr("checked", "check");
                    }
                    if (lastdata["PFE(PCA)"].indexOf("完成") != -1) {
                        $("#btnQn5-6-3-2").attr("class", "btn btn-primary active");
                        $("#Qn5-6-3-2").attr("checked", "check");
                    }


                    $("#Qtime3").attr("value", lastdata.已輸液量);
                    $("#Qtime4").attr("value", lastdata.有效次數);
                    $("#Qtime5").attr("value", lastdata.請求次數);

                    $("#Qtime6 option[value=" + lastdata["VAS(動)"] + "]").attr("selected", "selected");
                    $("#Qtime7 option[value=" + lastdata["VAS(靜)"] + "]").attr("selected", "selected");
                    $("#Qtime8 option[value=" + lastdata["VAS(宮縮)"] + "]").attr("selected", "selected");

                    for (var i = time; i > 0; i--) {
                        var j = time - i;
                        var olddata14 = resdata[datanumber[j]]["病人狀況-日期"] + " " + resdata[datanumber[j]]["病人狀況-時間"] + "\n\n" + resdata[datanumber[j]].其他交班事項 + "\n\n備袋：" + resdata[datanumber[j]].備袋;
                        $("#olddata" + i + "-1").append(resdata[datanumber[j]]["病人狀況-日期"]);
                        $("#olddata" + i + "-2").append(resdata[datanumber[j]]["病人狀況-時間"]);
                        $("#olddata" + i + "-3").append(resdata[datanumber[j]].頭暈);
                        $("#olddata" + i + "-4").append(resdata[datanumber[j]].噁心);
                        $("#olddata" + i + "-5").append(resdata[datanumber[j]].嘔吐);
                        $("#olddata" + i + "-6").append(resdata[datanumber[j]].癢疹);
                        $("#olddata" + i + "-7").append(resdata[datanumber[j]].嗜睡);
                        $("#olddata" + i + "-8").append(resdata[datanumber[j]].難尿);
                        $("#olddata" + i + "-9").append(resdata[datanumber[j]].頭痛);
                        $("#olddata" + i + "-10").append(resdata[datanumber[j]].腳麻);
                        $("#olddata" + i + "-11").append(resdata[datanumber[j]].處置);
                        $("#olddata" + i + "-12").append(resdata[datanumber[j]].EA導管);
                        $("#olddata" + i + "-13").append(resdata[datanumber[j]].衛教);
                        $("#olddata" + i + "-14").append(olddata14);
                        $("#olddata" + i + "-15").append(resdata[datanumber[j]].U1126);
                    }


                    if (lastdata.備袋狀況 == "無備袋") {
                        $("#btnQ3-1").attr("class", "btn btn-primary active");
                        $("#Q3-1").attr("checked", "check");
                    } else if (lastdata.備袋狀況 == "已用") {
                        $("#btnQ3-2").attr("class", "btn btn-primary active");
                        $("#Q3-2").attr("checked", "check");
                    } else if (lastdata.備袋狀況 == "已取回") {
                        $("#btnQ3-3").attr("class", "btn btn-primary active");
                        $("#Q3-3").attr("checked", "check");
                    }


                    if (lastdata.用藥資料單完成 == "用藥資料單完成") {
                        $("#btnQ5-1").addClass("active");
                        $("#Q5-1").attr("checked", "check");
                    } else {
                        $("#btnQ5-1").attr("class", "btn btn-primary");
                        $("#Q5-1").attr("checked", false);
                    }
                }
                //===============
            };

        };
        // This event is only implemented in recent browsers
        request2.onupgradeneeded = function(event) {
            db = event.target.result;
            // Create an objectStore for this database
            var objectStore2 = db.createObjectStore("mList", {
                keyPath: "病歷號"
            });
        };
        //=================================================================================

    }



    function RadioCkeck(QNum) {
        var valtemp = $('input[name=Q' + QNum + ']:checked').val();
        if (valtemp != undefined) {
            t = $('#btnQ' + QNum + '-' + valtemp).html().split(">");
            t1 = t[1].split("\n");
            return t1[0];
        } else {
            return "";
        }
    }

    function CheckboxCkeck(QNum) {
        var n = $('input[name=Q' + QNum + ']:checked').length;
        var rt = "";
        if (n > 0) {
            $('input[name=Q' + QNum + ']:checked').each(function() {
                var valtemp = $(this).val();
                //console.log(valtemp);
                if (valtemp != undefined) {
                    t = $('#btnQ' + QNum + '-' + valtemp).html().split(">");
                    t1 = t[1].split("\n");
                    if (rt != "")
                        rt = rt + "|" + t1[0];
                    else
                        rt = t1[0];
                }
            });
            return rt;
        }

    }

    function RadioSet(QNum) {
        $('#Q' + QNum).prop('checked', "true");
        $('#btnQ' + QNum).addClass('active');
        //console.log($('input[name=Q1-1]:checked').val());
    }

    function SetText(Sid, TextNum, SText, QText, RText) {

        if (QText == "" || QText == undefined || QText == "undefined") {} else {
            if (QText.search(RText) != -1) {
                //console.log(Sid);
                $("#" + TextNum).val(SText);
                $("#" + Sid).show();
            }
        }
    }

    function SelectRadio(QNum, Qtext, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10) {

        var TNum = 0;
        //console.log(Qtext);
        if (Qtext == "" || Qtext == undefined || Qtext == "undefined") {} else {
            switch (Qtext) {
                case c1:
                    TNum = 1;
                    break;
                case c2:
                    TNum = 2;
                    break;
                case c3:
                    TNum = 3;
                    break;
                case c4:
                    TNum = 4;
                    break;
                case c5:
                    TNum = 5;
                    break;
                case c6:
                    TNum = 6;
                    break;
                case c7:
                    TNum = 7;
                    break;
                case c8:
                    TNum = 8;
                    break;
                case c9:
                    TNum = 9;
                    break;
                case c10:
                    TNum = 10;
                    break;
                default:
                    TNum = 99;
            }
            RadioSet((QNum + "-" + TNum));
        }
    }

    function SelectCheckbox(QNum, Qtext, c1, c2, c3, c4, c5, c6, c7) {

        //var TNum = 0;
        //console.log(Qtext);
        if (Qtext == "" || Qtext == undefined || Qtext == "undefined") {} else {


            if (Qtext.search(c1) != -1)
                RadioSet((QNum + "-1"));
            if (Qtext.search(c2) != -1)
                RadioSet((QNum + "-2"));
            if (Qtext.search(c3) != -1)
                RadioSet((QNum + "-3"));
            if (Qtext.search(c4) != -1)
                RadioSet((QNum + "-4"));
            if (Qtext.search(c5) != -1)
                RadioSet((QNum + "-5"));
            if (Qtext.search(c6) != -1)
                RadioSet((QNum + "-6"));
            if (Qtext.search(c7) != -1)
                RadioSet((QNum + "-7"));
        }
    }


    $("#saveinfo").click(function(event) {
        var Today = new Date();


        if (hhtemp != 0 && hhtemp != undefined) {
            patient_info["病歷號"] = hhtemp;
        } else {
            patient_info["病歷號"] = htemp[1];
        }
        //event.preventDefault();        

        patient_info['姓名'] = $("#ss01").val();
        patient_info['病房'] = $("#ss02").val();
        patient_info['性別'] = $("#ss03").val();
        patient_info['年齡'] = $("#ss04").val();
        patient_info['術式'] = $("#ss07").val();

        patient_info["身高"] = $("#ss08").val();
        patient_info["體重"] = $("#ss09").val();
        patient_info["Cre"] = $("#ss06").val();


        var pertemp = "",
            pertemp1 = "",
            pertemp2 = "",
            pertemp3 = "";
        if ($("#Q5-2-2-1").prop('checked')) {
            pertemp = "藥物過敏";
            pertemp1 = $("#QT5-2-2-1").val();
        } else {
            pertemp = "";
            pertemp1 = "";
        }
        if ($("#Q5-2-2-2").prop('checked')) {
            if (pertemp == "")
                pertemp = "腸胃潰瘍史";
            else
                pertemp = pertemp + "|腸胃潰瘍史";
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-2-2-3").prop('checked')) {
            if (pertemp == "")
                pertemp = "藥癮/毒癮患者";
            else
                pertemp = pertemp + "|藥癮/毒癮患者";
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-2-2-4").prop('checked')) {
            pertemp2 = $("#QT5-2-2-4").val();
            if (pertemp == "")
                pertemp = "長期使用opioids";
            else
                pertemp = pertemp + "|長期使用opioids";
        } else {
            pertemp = pertemp + "";
            pertemp2 = "";
        }
        if ($("#Q5-2-2-5").prop('checked')) {
            if (pertemp == "")
                pertemp = "洗腎";
            else
                pertemp = pertemp + "|洗腎";
        } else {
            pertemp = pertemp + "";
        }
        patient_info["個人史"] = pertemp;
        patient_info["藥物過敏"] = pertemp1;
        patient_info["長期使用opioids"] = pertemp2;


        pertemp = "", pertemp1 = "", pertemp2 = "", pertemp3 = "";
        if ($("#Q5-2-3-1").prop('checked')) {
            pertemp = "術後急性疼痛";
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-2-3-2").prop('checked')) {
            pertemp1 = $("#QT5-2-3-2").val();
            if (pertemp == "")
                pertemp = "剖腹產";
            else
                pertemp = pertemp + "|剖腹產";
        } else {
            pertemp = pertemp + "";
            pertemp1 = "";
        }
        if ($("#Q5-2-3-3").prop('checked')) {
            pertemp2 = $("#QT5-2-3-3").val();
            if (pertemp == "")
                pertemp = "減痛分娩";
            else
                pertemp = pertemp + "|減痛分娩";
        } else {
            pertemp = pertemp + "";
            pertemp2 = "";
        }
        if ($("#Q5-2-3-5").prop('checked')) {
            if (pertemp == "")
                pertemp = "癌症疼痛";
            else
                pertemp = pertemp + "|癌症疼痛";
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-2-3-4").prop('checked')) {
            pertemp3 = $("#QT5-2-3-4").val();
            if (pertemp == "")
                pertemp = "其他";
            else
                pertemp = pertemp + "|其他";
        } else {
            pertemp = pertemp + "";
            pertemp3 = "";
        }
        patient_info["使用原因"] = pertemp;
        patient_info["使用原因-剖腹產：胎次"] = pertemp1;
        patient_info["使用原因-減痛分娩：胎次"] = pertemp2;
        patient_info["使用原因-其他"] = pertemp3;


        patient_info["麻醉結束時間"] = $("#EndHour").find(":selected").text() + ":" + $("#EndMin").find(":selected").text();
        patient_info["預計使用期間"] = $("#StartDate").val() + " 至 " + $("#ToEndDate").val();

        patient_info["已知用藥-Zfran"] = $("#Q5-1-1").find(":selected").text() + "mg";

        pertemp = "";
        if ($("#Q5-1-2-1-1").prop('checked')) {
            pertemp = "morphine " + $("#QT5-1-2-1-1").val() + " mg";
        } else {
            pertemp = "";
        }
        if ($("#Q5-1-2-1-2").prop('checked')) {
            if (pertemp == "") {
                pertemp = "keto " + $("#QT5-1-2-1-2").val() + " mg";
            } else {
                pertemp = pertemp + " + keto " + $("#QT5-1-2-1-2").val() + " mg";
            }
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-1-2-1-3").prop('checked')) {
            if (pertemp == "") {
                pertemp = "Tencam 1支";
            } else {
                pertemp = pertemp + " + Tencam 1支";
            }
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-1-2-1-4").prop('checked')) {
            if (pertemp == "") {
                pertemp = $("#QT5-1-2-1-3").val();
            } else {
                pertemp = pertemp + " + " + $("#QT5-1-2-1-3").val();
            }
        } else {
            pertemp = pertemp + "";
        }
        if (pertemp == "") {
            pertemp = "無";
        } else {
            pertemp = pertemp;
        }
        patient_info["已知用藥-OR"] = pertemp;


        pertemp = "";
        if ($("#Q5-1-4-1-1").prop('checked')) {
            pertemp = "morphine " + $("#QT5-1-4-1-1").val() + " mg";
        } else {
            pertemp = "";
        }
        if ($("#Q5-1-4-1-2").prop('checked')) {
            if (pertemp == "") {
                pertemp = "keto " + $("#QT5-1-4-1-2").val() + " mg";
            } else {
                pertemp = pertemp + " + keto " + $("#QT5-1-4-1-2").val() + " mg";
            }
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-1-4-1-3").prop('checked')) {
            if (pertemp == "") {
                pertemp = "Tencam 1支";
            } else {
                pertemp = pertemp + " + Tencam 1支";
            }
        } else {
            pertemp = pertemp + "";
        }
        if ($("#Q5-1-4-1-4").prop('checked')) {
            if (pertemp == "") {
                pertemp = $("#QT5-1-4-1-4").val();
            } else {
                pertemp = pertemp + " + " + $("#QT5-1-4-1-4").val();
            }
        } else {
            pertemp = pertemp + "";
        }
        if (pertemp == "") {
            pertemp = "無";
        } else {
            pertemp = pertemp;
        }
        patient_info["已知用藥-POR"] = pertemp;


        if (cnt513 == 1) {
            patient_info["臨時上機"] = "臨時上機";
            patient_info["臨時上機-時間"] = $("#p5").html();
            patient_info["臨時上機-地點"] = $("#Place5-3-1").find(":selected").text();
        } else {
            patient_info["臨時上機"] = "";
            patient_info["臨時上機-時間"] = "";
            patient_info["臨時上機-地點"] = "";
        }

        patient_info["機號"] = $("#Q5-3-1-1").val();
        patient_info["鎖牌號碼"] = $("#Q5-3-1-2").val();

        pertemp = "", pertemp1 = "", pertemp2 = "";
        if ($("#Q5-3-2-1").prop('checked')) {
            patient_info["止痛方式"] = $("#Q5-3-2-1").val();
            if ($("#Q5-3-3-1").prop('checked')) {
                patient_info["止痛藥物"] = $("#Q5-3-3-1").val();
            } else if ($("#Q5-3-3-2").prop('checked')) {
                patient_info["止痛藥物"] = $("#Q5-3-3-2").val();
            } else if ($("#Q5-3-3-3").prop('checked')) {
                patient_info["止痛藥物"] = $("#Q5-3-3-3-1").val();
            } else {
                patient_info["止痛藥物"] = "";
            }

            if ($("#Q5-3-4-1").prop('checked')) {
                patient_info["機器設定-Loading dose"] = "3 mg";
                patient_info["機器設定-PCA dose"] = "1 mg";
                patient_info["機器設定-Infusion dose"] = "0 mg";
                patient_info["機器設定-Lock-out interval"] = "5 min";
                patient_info["機器設定-4-hr limit"] = "20 mg";
            } else if ($("#Q5-3-4-2").prop('checked')) {
                patient_info["機器設定-Loading dose"] = "3 mg";
                patient_info["機器設定-PCA dose"] = "2 mg";
                patient_info["機器設定-Infusion dose"] = "0 mg";
                patient_info["機器設定-Lock-out interval"] = "10 min";
                patient_info["機器設定-4-hr limit"] = "30 mg";
            } else if ($("#Q5-3-4-3").prop('checked')) {
                patient_info["機器設定-Loading dose"] = "2 mg";
                patient_info["機器設定-PCA dose"] = "1 mg";
                patient_info["機器設定-Infusion dose"] = "0 mg";
                patient_info["機器設定-Lock-out interval"] = "5 min";
                patient_info["機器設定-4-hr limit"] = "15 mg";
            } else if ($("#Q5-3-4-4").prop('checked')) {
                patient_info["機器設定-Loading dose"] = $("#Q5-3-4-4-1").val() + " mg";
                patient_info["機器設定-PCA dose"] = $("#Q5-3-4-4-2").val() + " mg";
                patient_info["機器設定-Infusion dose"] = $("#Q5-3-4-4-3").val() + " mg";
                patient_info["機器設定-Lock-out interval"] = $("#Q5-3-4-4-4").val() + " min";
                patient_info["機器設定-4-hr limit"] = $("#Q5-3-4-4-5").val() + " mg";
            } else {
                patient_info["機器設定-Loading dose"] = "";
                patient_info["機器設定-PCA dose"] = "";
                patient_info["機器設定-Infusion dose"] = "";
                patient_info["機器設定-Lock-out interval"] = "";
                patient_info["機器設定-4-hr limit"] = "";
            }
            patient_info["位置"] = "";
            patient_info["fix"] = "";
            patient_info["施打者"] = "";
        } else if ($("#Q5-3-2-2").prop('checked')) {
            patient_info["止痛方式"] = $("#Q5-3-2-2").val();
            if ($("#Q5-3-5-1").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL";
            } else if ($("#Q5-3-5-2").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL";
            } else if ($("#Q5-3-5-3").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 0.66 mg/mL + Morphine 0.01 mg/mL: 400mL";
            } else if ($("#Q5-3-5-4").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 1 mg/mL: 400mL";
            } else if ($("#Q5-3-5-5").prop('checked')) {
                patient_info["止痛藥物"] = "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL";
            } else if ($("#Q5-3-5-6").prop('checked')) {
                patient_info["止痛藥物"] = "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL";
            } else if ($("#Q5-3-5-7").prop('checked')) {
                patient_info["止痛藥物"] = "Chirocaine 1 mg/mL: 400mL";
            } else if ($("#Q5-3-5-8").prop('checked')) {
                patient_info["止痛藥物"] = $("#QT5-3-5-8-1").val();
            } else {
                patient_info["止痛藥物"] = "";
            }

            if ($("#Q5-3-6-1").prop('checked')) {
                patient_info["機器設定-Loading dose"] = "0 ml";
                patient_info["機器設定-PCA dose"] = "3 ml";
                patient_info["機器設定-Infusion dose"] = "4 ml";
                patient_info["機器設定-Lock-out interval"] = "20 min";
                patient_info["機器設定-4-hr limit"] = "35 mg";
            } else if ($("#Q5-3-6-2").prop('checked')) {
                patient_info["機器設定-Loading dose"] = "0 ml";
                patient_info["機器設定-PCA dose"] = "6 ml";
                patient_info["機器設定-Infusion dose"] = "6 ml";
                patient_info["機器設定-Lock-out interval"] = "15 min";
                patient_info["機器設定-4-hr limit"] = "80 mg";
            } else if ($("#Q5-3-6-3").prop('checked')) {
                patient_info["機器設定-Loading dose"] = $("#Q5-3-6-3-1").val() + " ml";
                patient_info["機器設定-PCA dose"] = $("#Q5-3-6-3-2").val() + " ml";
                patient_info["機器設定-Infusion dose"] = $("#Q5-3-6-3-3").val() + " ml";
                patient_info["機器設定-Lock-out interval"] = $("#Q5-3-6-3-4").val() + " min";
                patient_info["機器設定-4-hr limit"] = $("#Q5-3-6-3-5").val() + " mg";
            } else {
                patient_info["機器設定-Loading dose"] = "";
                patient_info["機器設定-PCA dose"] = "";
                patient_info["機器設定-Infusion dose"] = "";
                patient_info["機器設定-Lock-out interval"] = "";
                patient_info["機器設定-4-hr limit"] = "";
            }
            patient_info["位置"] = $("#Q5-3-8-1").val();
            patient_info["fix"] = $("#Q5-3-8-2").val();
            patient_info["施打者"] = $("#Q5-3-8-3").val();
        } else if ($("#Q5-3-2-3").prop('checked')) {
            patient_info["止痛方式"] = $("#Q5-3-2-3").val();
            if ($("#Q5-3-5-1").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL";
            } else if ($("#Q5-3-5-2").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL";
            } else if ($("#Q5-3-5-3").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 0.66 mg/mL + Morphine 0.01 mg/mL: 400mL";
            } else if ($("#Q5-3-5-4").prop('checked')) {
                patient_info["止痛藥物"] = "Marcaine 1 mg/mL: 400mL";
            } else if ($("#Q5-3-5-5").prop('checked')) {
                patient_info["止痛藥物"] = "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL: 400mL";
            } else if ($("#Q5-3-5-6").prop('checked')) {
                patient_info["止痛藥物"] = "Chirocaine 0.66 mg/mL + Fentanyl 1.25 mcg/mL + Morphine 0.01 mg/mL: 400mL";
            } else if ($("#Q5-3-5-7").prop('checked')) {
                patient_info["止痛藥物"] = "Chirocaine 1 mg/mL: 400mL";
            } else if ($("#Q5-3-5-8").prop('checked')) {
                patient_info["止痛藥物"] = $("#QT5-3-5-8-1").val();
            } else {
                patient_info["止痛藥物"] = "";
            }

            if ($("#Q5-3-7-1").prop('checked')) {
                patient_info["機器設定-Loading dose"] = "0 ml";
                patient_info["機器設定-PCA dose"] = "3 ml";
                patient_info["機器設定-Infusion dose"] = "4 ml";
                patient_info["機器設定-Lock-out interval"] = "20 min";
                patient_info["機器設定-4-hr limit"] = "40 mg";
            } else if ($("#Q5-3-7-2").prop('checked')) {
                patient_info["機器設定-Loading dose"] = "0 ml";
                patient_info["機器設定-PCA dose"] = "6 ml";
                patient_info["機器設定-Infusion dose"] = "8 ml";
                patient_info["機器設定-Lock-out interval"] = "15 min";
                patient_info["機器設定-4-hr limit"] = "80 mg";
            } else if ($("#Q5-3-7-3").prop('checked')) {
                patient_info["機器設定-Loading dose"] = $("#Q5-3-7-3-1").val() + " ml";
                patient_info["機器設定-PCA dose"] = $("#Q5-3-7-3-2").val() + " ml";
                patient_info["機器設定-Infusion dose"] = $("#Q5-3-7-3-3").val() + " ml";
                patient_info["機器設定-Lock-out interval"] = $("#Q5-3-7-3-4").val() + " min";
                patient_info["機器設定-4-hr limit"] = $("#Q5-3-7-3-5").val() + " mg";
            } else {
                patient_info["機器設定-Loading dose"] = "";
                patient_info["機器設定-PCA dose"] = "";
                patient_info["機器設定-Infusion dose"] = "";
                patient_info["機器設定-Lock-out interval"] = "";
                patient_info["機器設定-4-hr limit"] = "";
            }
            patient_info["位置"] = $("#Q5-3-8-1").val();
            patient_info["fix"] = $("#Q5-3-8-2").val();
            patient_info["施打者"] = $("#Q5-3-8-3").val();
        } else if ($("#Q5-3-2-4").prop('checked')) {
            patient_info["止痛方式"] = $("#Q5-3-2-4").val();
            patient_info["止痛藥物"] = "Morphine 2 mg";
            patient_info["機器設定-Loading dose"] = "";
            patient_info["機器設定-PCA dose"] = "";
            patient_info["機器設定-Infusion dose"] = "";
            patient_info["機器設定-Lock-out interval"] = "";
            patient_info["機器設定-4-hr limit"] = "";
            patient_info["位置"] = $("#Q5-3-8-1").val();
            patient_info["fix"] = $("#Q5-3-8-2").val();
            patient_info["施打者"] = $("#Q5-3-8-3").val();
        } else {
            patient_info["止痛方式"] = "";
            patient_info["止痛藥物"] = "";
            patient_info["機器設定-Loading dose"] = "";
            patient_info["機器設定-PCA dose"] = "";
            patient_info["機器設定-Infusion dose"] = "";
            patient_info["機器設定-Lock-out interval"] = "";
            patient_info["機器設定-4-hr limit"] = "";
            patient_info["位置"] = "";
            patient_info["fix"] = "";
            patient_info["施打者"] = "";
        }

        if ($("#none1").prop('checked') || $("#OutbedTime").val() == "") {
            patient_info["下床時間"] = "尚未發生";
        } else {
            patient_info["下床時間"] = $("#OutbedTime").val() + " " + $("#dbedhour").find(":selected").text() + ":" + $("#dbedmin").find(":selected").text();
        }

        if ($("#none2").prop('checked') || $("#GasTime").val() == "") {
            patient_info["排氣時間"] = "尚未發生";
        } else {
            patient_info["排氣時間"] = $("#GasTime").val() + " " + $("#blhour").find(":selected").text() + ":" + $("#blmin").find(":selected").text();
        }

        if ($("#Qn5-6-2-1").prop('checked')) {
            patient_info["PCA同意書確認"] = "已確認";
        } else {
            patient_info["PCA同意書確認"] = "未確認";
        }

        pertemp = "";

        if ($("#Qn5-6-3-1").prop('checked')) {
            pertemp = "已術訪";
        }

        if ($("#Qn5-6-3-2").prop('checked')) {
            if (pertemp == "") {
                pertemp = "已完成";
            } else {
                pertemp += "|已完成";
            }
        }
        patient_info["PFE(PCA)"] = pertemp;


        patient_info["病人狀況-日期"] = $("#Qtime1").html();
        patient_info["病人狀況-時間"] = $("#Qtime2").html();
        patient_info["已輸液量"] = $("#Qtime3").val();
        patient_info["有效次數"] = $("#Qtime4").val();
        patient_info["請求次數"] = $("#Qtime5").val();
        patient_info["VAS(動)"] = $("#Qtime6").find(":selected").text();
        patient_info["VAS(靜)"] = $("#Qtime7").find(":selected").text();
        patient_info["VAS(宮縮)"] = $("#Qtime8").find(":selected").text();

        patient_info["頭暈"] = RadioCkeck("F1");
        patient_info["噁心"] = RadioCkeck("F2");
        patient_info["嘔吐"] = RadioCkeck("F3");
        patient_info["癢疹"] = RadioCkeck("F4");
        patient_info["嗜睡"] = RadioCkeck("F5");
        patient_info["難尿"] = RadioCkeck("F6");
        patient_info["頭痛"] = RadioCkeck("F7");
        patient_info["腳麻"] = RadioCkeck("F8");
        patient_info["處置"] = RadioCkeck("F11");

        pertemp = "";
        if ($("#FF9-1-1").prop('checked')) {
            pertemp = "有滲濕，" + "小於3x3";
        } else if ($("#FF9-1-2").prop('checked')) {
            pertemp = "有滲濕，" + "大於3x3";
        } else {
            pertemp = $("#FF9-2").val();
        }
        if ($("#FF9-1-3").prop('checked')) {
            pertemp = pertemp + "，需加壓";
        } else {
            pretemp = pertemp + "";
        }
        if ($("#FF9-3").prop('checked')) {
            pertemp = pertemp + "，需換藥重貼";
        } else {
            pretemp = pertemp + "";
        }
        patient_info["EA導管"] = pertemp;



        patient_info["衛教"] = CheckboxCkeck("F10");

        var Year = Today.getFullYear();
        var Month = Today.getMonth() + 1;
        var Day = Today.getDate();
        var Hours = Today.getHours();
        var Minutes = Today.getMinutes();
        var Second = Today.getSeconds();
        if (Month < 10) Month = "0" + Month;
        if (Day < 10) Day = "0" + Day;
        if (Hours < 10) Hours = "0" + Hours;
        if (Minutes < 10) Minutes = "0" + Minutes;
        if (Second < 10) Second = "0" + Second;
        patient_info["date"] = Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes + ":" + Second;

        patient_info["其他交班事項"] = $("#TQ1").val();
        patient_info["備袋"] = $("#p2").html();
        patient_info["備袋狀況"] = RadioCkeck("3");
        patient_info["U1126"] = $("#p4").html();
        patient_info["用藥資料單完成"] = RadioCkeck("5");


        var transaction = db.transaction(["mList"], "readwrite");
        transaction.oncomplete = function(event) {
            console.log("done");
        };
        transaction.onerror = function(event) {
            console.log("add error");
            //===================================
            var transaction1 = db.transaction(["mList"], "readwrite");
            var objectStore1 = transaction1.objectStore("mList");
            var request1 = objectStore1.get(patient_info['病歷號']);
            request1.onsuccess = function(event) {
                console.log("Updating : ");
                //console.log(request1.result);
                //request1.result = patient_info;
                objectStore1.put(patient_info);
            };
            //===================================
        };

        var objectStore = transaction.objectStore("mList");

        var request = objectStore.add(patient_info);
        request.onsuccess = function(event) {
            // event.target.result == customerData[i].ssn;
        };
        console.log(patient_info);


        if (time == 0) {
            patient_info['病歷號'] = htemp[1];
        } else {
            patient_info['病歷號'] = htemp[1].substring(0, 7) + "-" + (time);
        }
        var request2 = indexedDB.open("olddb");
        request2.onerror = function(event) {
            alert("Why didn't you allow my web app to use IndexedDB?!");
            console.log("error");
        };
        request2.onsuccess = function(event) {
            db = event.target.result;

            var transaction2 = db.transaction(["mList"], "readwrite");
            var objectStore2 = transaction2.objectStore("mList");

            var request2 = objectStore2.add(patient_info);
            transaction2.oncomplete = function(event) {
                console.log("done");

                location.href = "ControlPanel2.html";
            };
            transaction2.onerror = function(event) {
                console.log("add error");

                location.href = "ControlPanel2.html";
            };

        };
    });

    $("#dontsave").click(function(event) {
        var hreftemp = location.href.split("?");
        var hreftemp2 = hreftemp[1].split("&");
        location.href = "ControlPanel2.html?" + hreftemp2[0] + "&savefile=nosave";
    });

    $("#Q5-1-2-1-1").change(function() {
        if (cnt51211 == 0) {
            cnt51211 = 1;
            $("#Q5-1-2-1-1Text").show();
            $("#Q5-1-2-1-5").prop("checked", false);
            $('#btnQ5-1-2-1-5').removeClass('active');
        } else {
            cnt51211 = 0;
            $("#Q5-1-2-1-1Text").hide();
        }
    });

    $("#Q5-1-2-1-2").change(function() {
        if (cnt51212 == 0) {
            cnt51212 = 1;
            $("#Q5-1-2-1-2Text").show();
            $("#Q5-1-2-1-5").prop("checked", false);
            $('#btnQ5-1-2-1-5').removeClass('active');
        } else {
            cnt51212 = 0;
            $("#Q5-1-2-1-2Text").hide();
        }
    });

    $("#Q5-1-2-1-3").change(function() {
        $("#Q5-1-2-1-5").prop("checked", false);
        $('#btnQ5-1-2-1-5').removeClass('active');
    });

    $("#Q5-1-2-1-4").change(function() {
        if (cnt51214 == 0) {
            cnt51214 = 1;
            $("#Q5-1-2-1-4Text").show();
            $("#Q5-1-2-1-5").prop("checked", false);
            $('#btnQ5-1-2-1-5').removeClass('active');
        } else {
            cnt51214 = 0;
            $("#Q5-1-2-1-4Text").hide();
        }
    });

    $("#Q5-1-2-1-5").change(function() {
        cnt51211 = 0, cnt51212 = 0, cnt51214 = 0;
        $("#Q5-1-2-1-5").prop("checked", true);
        $('#Q5-1-2-1-1,#Q5-1-2-1-2,#Q5-1-2-1-3,#Q5-1-2-1-4').prop('checked', false);
        $("#Q5-1-2-1-1Text,#Q5-1-2-1-2Text,#Q5-1-2-1-4Text").hide();
        $('#btnQ5-1-2-1-1,#btnQ5-1-2-1-2,#btnQ5-1-2-1-3,#btnQ5-1-2-1-4').removeClass('active');
        $('#btnQ5-1-2-1-5').attr('class', 'btn btn-primary active');
    });

    $("#Q5-1-4-1-1").change(function() {
        if (cnt51411 == 0) {
            cnt51411 = 1;
            $("#Q5-1-4-1-1Text").show();
            $("#Q5-1-4-1-5").prop("checked", false);
            $('#btnQ5-1-4-1-5').removeClass('active');
        } else {
            cnt51411 = 0;
            $("#Q5-1-4-1-1Text").hide();
        }
    });

    $("#Q5-1-4-1-2").change(function() {
        if (cnt51412 == 0) {
            cnt51412 = 1;
            $("#Q5-1-4-1-2Text").show();
            $("#Q5-1-4-1-5").prop("checked", false);
            $('#btnQ5-1-4-1-5').removeClass('active');
        } else {
            cnt51412 = 0;
            $("#Q5-1-4-1-2Text").hide();
        }
    });

    $("#Q5-1-4-1-3").change(function() {
        $("#Q5-1-4-1-5").prop("checked", false);
        $('#btnQ5-1-4-1-5').removeClass('active');
    });

    $("#Q5-1-4-1-4").change(function() {
        if (cnt51414 == 0) {
            cnt51414 = 1;
            $("#Q5-1-4-1-4Text").show();
            $("#Q5-1-4-1-5").prop("checked", false);
            $('#btnQ5-1-4-1-5').removeClass('active');
        } else {
            cnt51414 = 0;
            $("#Q5-1-4-1-4Text").hide();
        }
    });

    $("#Q5-1-4-1-5").change(function() {
        cnt51411 = 0, cnt51412 = 0, cnt51414 = 0;
        $("#Q5-1-4-1-5").prop("checked", true);
        $('#Q5-1-4-1-1,#Q5-1-4-1-2,#Q5-1-4-1-3,#Q5-1-4-1-4').prop('checked', false);
        $("#Q5-1-4-1-1Text,#Q5-1-4-1-2Text,#Q5-1-4-1-4Text").hide();
        $('#btnQ5-1-4-1-1,#btnQ5-1-4-1-2,#btnQ5-1-4-1-3,#btnQ5-1-4-1-4').removeClass('active');
        $('#btnQ5-1-4-1-5').attr('class', 'btn btn-primary active');
    });

    $("#Q5-1-3").click(function() {
        if (cnt513 == 0) {
            cnt513 = 1;
            $("#Q5-1-3").attr("class", "btn btn-danger");
            $("#Q5-1-3Text").show();
            var Today = new Date();
            $("#p5").html(Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + Today.getDate() + "  " + Today.getHours() + ":" + Today.getMinutes());
        } else {
            cnt513 = 0;
            $("#Q5-1-3").attr("class", "btn btn-primary");
            $("#Q5-1-3Text").hide();
            $("#p5").html("");
        }
    });

    $("#Q5-2-2-1").change(function() {
        if (cnt5221 == 0) {
            cnt5221 = 1;
            $("#Q5-2-2-1Text").show();
        } else {
            cnt5221 = 0;
            $("#Q5-2-2-1Text").hide();
        }
    });

    $("#Q5-2-2-4").change(function() {
        if (cnt5224 == 0) {
            cnt5224 = 1;
            $("#Q5-2-2-4Text").show();
        } else {
            cnt5224 = 0;
            $("#Q5-2-2-4Text").hide();
        }
    });
    $("#btnQ5-2-3-1").click(function() {

        $("#Q5-2-3-2Text").hide();
        $("#Q5-2-3-3Text").hide();
        $("#Q5-2-3-4Text").hide();

    });
    $("#btnQ5-2-3-5").click(function() {

        $("#Q5-2-3-2Text").hide();
        $("#Q5-2-3-3Text").hide();
        $("#Q5-2-3-4Text").hide();

    });
    $("#btnQ5-2-3-2").click(function() {

        $("#Q5-2-3-2Text").show();
        $("#Q5-2-3-3Text").hide();
        $("#Q5-2-3-4Text").hide();

    });

    $("#btnQ5-2-3-3").click(function() {
        $("#Q5-2-3-3Text").show();
        $("#Q5-2-3-2Text").hide();
        $("#Q5-2-3-4Text").hide();
    });

    $("#btnQ5-2-3-4").click(function() {

        $("#Q5-2-3-4Text").show();
        $("#Q5-2-3-3Text").hide();
        $("#Q5-2-3-2Text").hide();
    });

    $("#Q5-3-2-1").change(function() {
        $("#Q5-3-1").show();
        $("#Q5-3-2").hide();
        $("#Q5-3-3").hide();
        $("#Q5-3-4").hide();
        $("#Q5-3-5").hide();
        $("#Q5-3-6").hide();
        $("#unIVPCA").hide();
        $(window).resize();
    });

    $("#Q5-3-2-2").change(function() {
        $("#Q5-3-1").hide();
        $("#Q5-3-2").show();
        $("#Q5-3-3").show();
        $("#Q5-3-4").hide();
        $("#Q5-3-5").hide();
        $("#Q5-3-6").show();
        $(window).resize();
    });

    $("#Q5-3-2-3").change(function() {
        $("#Q5-3-1").hide();
        $("#Q5-3-2").show();
        $("#Q5-3-3").hide();
        $("#Q5-3-4").show();
        $("#Q5-3-5").hide();
        $("#Q5-3-6").show();
        $(window).resize();
    });

    $("#Q5-3-2-4").change(function() {
        $("#Q5-3-1").hide();
        $("#Q5-3-2").hide();
        $("#Q5-3-3").hide();
        $("#Q5-3-4").hide();
        $("#Q5-3-5").show();
        $("#Q5-3-6").show();
        $(window).resize();
    });

    $("#Q5-3-3-3").change(function() {
        $("#QT5-3-1").show();
        $(window).resize();
    });
    $("#Q5-3-3-1,#Q5-3-3-2").change(function() {
        $("#QT5-3-1").hide();
        $(window).resize();
    });

    $("#Q5-3-5-8").change(function() {
        $('#btnQ5-3-5-1,#btnQ5-3-5-2,#btnQ5-3-5-3,#btnQ5-3-5-4,#btnQ5-3-5-5,#btnQ5-3-5-6,#btnQ5-3-5-7').attr('class', 'btn btn-primary');
        $("#QT5-3-2").show();
        $(window).resize();
    });
    $("#Q5-3-5-1").change(function() {
        $('#btnQ5-3-5-2,#btnQ5-3-5-3,#btnQ5-3-5-4,#btnQ5-3-5-5,#btnQ5-3-5-6,#btnQ5-3-5-7,#btnQ5-3-5-8').attr('class', 'btn btn-primary');
        $("#QT5-3-2").hide();
        $(window).resize();
    });
    $("#Q5-3-5-2").change(function() {
        $('#btnQ5-3-5-1,#btnQ5-3-5-3,#btnQ5-3-5-4,#btnQ5-3-5-5,#btnQ5-3-5-6,#btnQ5-3-5-7,#btnQ5-3-5-8').attr('class', 'btn btn-primary');
        $("#QT5-3-2").hide();
        $(window).resize();
    });
    $("#Q5-3-5-3").change(function() {
        $('#btnQ5-3-5-1,#btnQ5-3-5-2,#btnQ5-3-5-4,#btnQ5-3-5-5,#btnQ5-3-5-6,#btnQ5-3-5-7,#btnQ5-3-5-8').attr('class', 'btn btn-primary');
        $("#QT5-3-2").hide();
        $(window).resize();
    });
    $("#Q5-3-5-4").change(function() {
        $('#btnQ5-3-5-1,#btnQ5-3-5-2,#btnQ5-3-5-3,#btnQ5-3-5-5,#btnQ5-3-5-6,#btnQ5-3-5-7,#btnQ5-3-5-8').attr('class', 'btn btn-primary');
        $("#QT5-3-2").hide();
        $(window).resize();
    });
    $("#Q5-3-5-5").change(function() {
        $('#btnQ5-3-5-1,#btnQ5-3-5-2,#btnQ5-3-5-3,#btnQ5-3-5-4,#btnQ5-3-5-6,#btnQ5-3-5-7,#btnQ5-3-5-8').attr('class', 'btn btn-primary');
        $("#QT5-3-2").hide();
        $(window).resize();
    });
    $("#Q5-3-5-6").change(function() {
        $('#btnQ5-3-5-1,#btnQ5-3-5-2,#btnQ5-3-5-3,#btnQ5-3-5-4,#btnQ5-3-5-5,#btnQ5-3-5-7,#btnQ5-3-5-8').attr('class', 'btn btn-primary');
        $("#QT5-3-2").hide();
        $(window).resize();
    });
    $("#Q5-3-5-7").change(function() {
        $('#btnQ5-3-5-1,#btnQ5-3-5-2,#btnQ5-3-5-3,#btnQ5-3-5-4,#btnQ5-3-5-5,#btnQ5-3-5-6,#btnQ5-3-5-8').attr('class', 'btn btn-primary');
        $("#QT5-3-2").hide();
        $(window).resize();
    });

    $("#Q5-3-4-1").change(function() {
        $('#btnQ5-3-4-2,#btnQ5-3-4-3,#btnQ5-3-4-4').attr('class', 'btn btn-primary');
        $("#QT5-3-3-1,#QT5-3-3-2,#QT5-3-3-3,#QT5-3-3-4,#QT5-3-3-5").hide();
        $(window).resize();
    });

    $("#Q5-3-4-2").change(function() {
        $('#btnQ5-3-4-1,#btnQ5-3-4-3,#btnQ5-3-4-4').attr('class', 'btn btn-primary');
        $("#QT5-3-3-1,#QT5-3-3-2,#QT5-3-3-3,#QT5-3-3-4,#QT5-3-3-5").hide();
        $(window).resize();
    });

    $("#Q5-3-4-3").change(function() {
        $('#btnQ5-3-4-1,#btnQ5-3-4-2,#btnQ5-3-4-4').attr('class', 'btn btn-primary');
        $("#QT5-3-3-1,#QT5-3-3-2,#QT5-3-3-3,#QT5-3-3-4,#QT5-3-3-5").hide();
        $(window).resize();
    });

    $("#Q5-3-4-4").change(function() {
        $('#btnQ5-3-4-1,#btnQ5-3-4-2,#btnQ5-3-4-3').attr('class', 'btn btn-primary');
        $("#QT5-3-3-1,#QT5-3-3-2,#QT5-3-3-3,#QT5-3-3-4,#QT5-3-3-5").show();
        $(window).resize();
    });

    $("#Q5-3-6-3").change(function() {
        $('#btnQ5-3-6-1,#btnQ5-3-6-2').attr('class', 'btn btn-primary');
        $("#QT5-3-4-1,#QT5-3-4-2,#QT5-3-4-3,#QT5-3-4-4,#QT5-3-4-5").show();
        $(window).resize();
    });
    $("#Q5-3-6-1").change(function() {
        $('#btnQ5-3-6-2,#btnQ5-3-6-3').attr('class', 'btn btn-primary');
        $("#QT5-3-4-1,#QT5-3-4-2,#QT5-3-4-3,#QT5-3-4-4,#QT5-3-4-5").hide();
        $(window).resize();
    });
    $("#Q5-3-6-2").change(function() {
        $('#btnQ5-3-6-1,#btnQ5-3-6-3').attr('class', 'btn btn-primary');
        $("#QT5-3-4-1,#QT5-3-4-2,#QT5-3-4-3,#QT5-3-4-4,#QT5-3-4-5").hide();
        $(window).resize();
    });

    $("#Q5-3-7-3").change(function() {
        $('#btnQ5-3-7-1,#btnQ5-3-7-2').attr('class', 'btn btn-primary');
        $("#QT5-3-5-1,#QT5-3-5-2,#QT5-3-5-3,#QT5-3-5-4,#QT5-3-5-5").show();
        $(window).resize();
    });
    $("#Q5-3-7-1").change(function() {
        $('#btnQ5-3-7-2,#btnQ5-3-7-3').attr('class', 'btn btn-primary');
        $("#QT5-3-5-1,#QT5-3-5-2,#QT5-3-5-3,#QT5-3-5-4,#QT5-3-5-5").hide();
        $(window).resize();
    });
    $("#Q5-3-7-2").change(function() {
        $('#btnQ5-3-7-1,#btnQ5-3-7-3').attr('class', 'btn btn-primary');
        $("#QT5-3-5-1,#QT5-3-5-2,#QT5-3-5-3,#QT5-3-5-4,#QT5-3-5-5").hide();
        $(window).resize();
    });

    $("#Q2-1").change(function() {
        if (Q21 == 0) {

            var Today = new Date();
            $("#p2").html(Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + Today.getDate() + "  " + Today.getHours() + ":" + Today.getMinutes());

            Q21 = 1;
        } else if (Q21 == 1) {
            $("#p2").html("");
            Q21 = 0;
        }
    });
    $("#Q4-1").change(function() {
        if (Q33 == 0) {

            var Today = new Date();
            $("#p4").html(Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + Today.getDate() + "  " + Today.getHours() + ":" + Today.getMinutes());
            Q33 = 1;
        } else if (Q33 == 1) {
            $("#p4").html("");
            Q33 = 0;
        }
    });

    $("#QF11-0,#QF11-2,#QF11-3,#QF11-4,#QF11-5,#QF11-6,#QF11-7,#QF11-8,#QF11-9,#QF11-10").change(function() {
        $("#QF11-1").prop("checked", false);
        $('#btnQF11-1').removeClass('active');
    });
    $("#QF11-1").change(function() {
        $("#QF11-1").prop("checked", true);
        $('#QF11-0,#QF11-2,#QF11-3,#QF11-4,#QF11-5,#QF11-6,#QF11-7,#QF11-8,#QF11-9,#QF11-10').prop('checked', false);
        $('#btnQF11-0,#btnQF11-2,#btnQF11-3,#btnQF11-4,#btnQF11-5,#btnQF11-6,#btnQF11-7,#btnQF11-8,#btnQF11-9,#btnQF11-10').removeClass('active');
        $('#btnQF11-1').attr('class', 'btn btn-primary Large-Width active');
    });


    $("#FF9-1").change(function() {
        $("#FF9-1Btn").show();
        $(window).resize();
    });

    $("#FF9-2").change(function() {
        $("#FF9-1Btn").hide();
        $(window).resize();
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

    $("#hide2").click(function() {
        if (hd2 == 0) {
            $("#QQ5-2").hide("fast");
            hd2 = 1;
        } else {
            $("#QQ5-2").show("fast");
            hd2 = 0;
        }
    });
    $("#hide3").click(function() {
        if (hd3 == 0) {
            $("#QQ5-3").hide("fast");
            hd3 = 1;
        } else {
            $("#QQ5-3").show("fast");
            hd3 = 0;
        }
    });
    $("#hide4").click(function() {
        if (hd4 == 0) {
            $("#QQ5-4").hide("fast");
            hd4 = 1;
        } else {
            $("#QQ5-4").show("fast");
            hd4 = 0;
        }
    });
    $("#hide5").click(function() {
        if (hd5 == 0) {
            $("#QQ5-5").hide("fast");
            hd5 = 1;
        } else {
            $("#QQ5-5").show("fast");
            hd5 = 0;
        }
    });
    $("#hide6").click(function() {
        if (hd6 == 0) {
            $("#QQ5-6").hide("fast");
            hd6 = 1;
        } else {
            $("#QQ5-6").show("fast");
            hd6 = 0;
        }
    });
    $("#btnQF11-0").click(function() {

        if (hrfhd == 0) {
            $('html,body').animate({ scrollTop: $("#QQ5-2").offset().top }, 1);
            hrfhd = 1;
        } else {
            hrfhd = 0;
        }


    });


});

$(document).on('click', '.navbar-collapse.in', function(e) {
    if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
        $(this).collapse('hide');
    }
});