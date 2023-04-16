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
     * @returns {string}
     */
    formatNum: function (num) {
        return num.toLocaleString('nl-nl');
    }
}