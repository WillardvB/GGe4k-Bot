module.exports = {
    secToDuration: secToTime
};

/**
 *
 * @param {number} sec
 * @return {string}
 */
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