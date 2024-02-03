module.exports = {
    /**
     *
     * @param {any} num
     * @returns {boolean}
     */
    isNum: function (num) {
        num = "" + num;
        return !isNaN(num) && !isNaN(parseFloat(num));
    }, /**
     *
     * @param {number} num
     * @param {Locale} locale
     * @returns {string}
     */
    formatNum: function (num, locale) {
        return num.toLocaleString(locale);
    }
}