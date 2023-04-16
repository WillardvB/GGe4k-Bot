module.exports = {
    secToDuration: function (num) {
        return secToTime(num);
    },
    timestampToDate: function (num, dagOfTijd) {
        return timeStampToDate(num, dagOfTijd);
    },
    dateToTimestamp: function (datum, tijd) {
        return dateToTimeStamp(datum, tijd);
    },
    isDST: function () {
        return isDst();
    }
};

function secToTime(sec) {
    let uren = Math.floor(sec / 3600);
    let minuten = Math.floor((sec % 3600) / 60);
    if (minuten < 10) {
        minuten = "0" + minuten;
    }
    let secondes = sec % 60;
    if (secondes < 10) {
        secondes = "0" + secondes;
    }
    let output = uren + ":" + minuten + ":" + secondes;
    let millisecond = sec - Math.floor(sec);
    if (millisecond !== 0 && millisecond != null) {
        millisecond = millisecond.toString().split(".")[1];
        output = output + "." + millisecond;
    }
    return output;
}

function timeStampToDate(timestamp, dateOrTime) {
    if (dateOrTime == null) {
        dateOrTime = "d&t";
    }
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 2);
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
    if (dateOrTime.trim().toLowerCase() === "d") {
        return datumTekst;
    }
    else if (dateOrTime.trim().toLowerCase() === "t") {
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
    else if (tijdDelen.length === 2) {
        tijdDelen.push("0");
    }
    const datumDelen = datum.trim().split("-");
    if (datumDelen.length < 3) {
        return NaN;
    }
    let d = new Date();
    if (datumDelen[0].length === 4) {
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

function isDst() {
    const zomertijdBeginData = { "2022": [27, 3], "2023": [26, 3], "2024": [31, 3], "2025": [30, 3], "2026": [29, 3] }
    const zomertijdEindData = { "2022": [30, 10], "2023": [29, 10], "2024": [27, 10], "2025": [26, 10], "2026": [25, 10] }
    const nu = new Date(Date.now());
    if (zomertijdBeginData[nu.getFullYear()][0] < nu.getDate() &&
        zomertijdBeginData[nu.getFullYear()][1] < nu.getMonth() + 1) {
        if (zomertijdEindData[nu.getFullYear()][0] > nu.getDate() &&
            zomertijdEindData[nu.getFullYear()][1] > nu.getMonth() + 1) {
            return true;
        }
    }
    return false;
}