const moment = require("moment.js");

module.exports = {
    secToDuration: function (num) {
        return secToTime(num);
    },
    timestampToDate: function (num, dagOfTijd) {
        return timeStampToDate(num, dagOfTijd);
    },
    dateToTimestamp: function (datum, tijd) {
        return dateToTimeStamp(datum, tijd);
    }
};

function secToTime(sec) {
    let uren = Math.floor(sec / 3600);
    var minuten = Math.floor((sec % 3600) / 60);
    if (minuten < 10) {
        minuten = "0" + minuten;
    }
    var secondes = sec % 60;
    if (secondes < 10) {
        secondes = "0" + secondes;
    }
    output = uren + ":" + minuten + ":" + secondes;
    let milisec = sec - Math.floor(sec);
    if (milisec != 0 && milisec != null) {
        milisec = milisec.toString().split(".")[1];
        output = output + "." + milisec;
    }
    return output;
}

function timeStampToDate(timestamp, dateOrTime) {
    if (dateOrTime == null) {
        dateOrTime = "d&t";
    }
    const date = new Date(timestamp);
    let wintertijdUur = 0;
    if (moment(date).isDST()) {
        wintertijdUur += 1;
        console.log(moment(date).isDST());
        console.log(moment(new Date(2021, 6, 15, 1, 1, 1, 1)).isDST())
    }
    date.setHours(date.getHours() + 1 + wintertijdUur);
    let maand = date.getMonth() + 1;
    if (maand < 10) {
        maand = "0" + maand;
    }
    let dag = date.getDate();
    if (dag < 10) {
        dag = "0" + dag;
    }
    const datumTekst = dag + "-" + maand + "-" + date.getFullYear();
    let uur = date.getHours();
    if (uur < 10) {
        uur = "0" + uur;
    }
    let minuut = date.getMinutes();
    if (minuut < 10) {
        minuut = "0" + minuut;
    }
    let seconde = date.getSeconds();
    if (seconde < 10) {
        seconde = "0" + seconde;
    }
    const tijd = uur + ":" + minuut + ":" + seconde;
    if (dateOrTime.trim().toLowerCase() == "d") {
        return datumTekst;
    }
    else if (dateOrTime.trim().toLowerCase() == "t") {
        return tijd;
    }
    else {
        return datumTekst + " " + tijd;
    }
}

function dateToTimeStamp(datum, tijd) {
    const tijdDelen = tijd.trim().split(":");
    if (tijdDelen.length < 2) {
        return NaN;
    }
    else if (tijdDelen.length == 2) {
        tijdDelen.push("0");
    }
    const datumDelen = datum.trim().split("-");
    if (datumDelen.length < 3) {
        return NaN;
    }
    let d = new Date();
    if (datumDelen[0].length == 4) {
        d = new Date(datum);
    }
    else {
        d.setFullYear(datumDelen[2]);
        d.setMonth(parseInt(datumDelen[1]) - 1);
        d.setDate(datumDelen[0]);
    }
    d.setHours(tijdDelen[0].trim());
    d.setMinutes(tijdDelen[1].trim());
    d.setSeconds(tijdDelen[2].trim());
    return d.getTime();
}