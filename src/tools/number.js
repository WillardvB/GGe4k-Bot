module.exports = {
    /**
     *
     * @param {any} num
     * @returns {boolean}
     */
    isNum: function (num) {
        return isNumeric(num);
    },
    /**
     *
     * @param {number} num
     * @returns {string}
     */
    formatNum: function (num) {
        return formatNumber(num);
    }
};

function isNumeric(num) {
    num = "" + num;
    return !isNaN(num) && !isNaN(parseFloat(num));
}

function formatNumber(num) {
    let output = "";
    num *= 1;
    if (num >= 1000000000000) {
        let triljWaarde = Math.floor(num / 1000000000000);
        let miljWaarde = Math.floor((num - triljWaarde * 1000000000000) / 1000000000);
        if (miljWaarde < 100) {
            if (miljWaarde < 10) {
                miljWaarde = "0" + miljWaarde;
            }
            miljWaarde = "0" + miljWaarde;
        }
        let mWaarde = Math.floor((num - triljWaarde * 1000000000000 - miljWaarde * 1000000000) / 1000000);
        if (mWaarde < 100) {
            if (mWaarde < 10) {
                mWaarde = "0" + mWaarde;
            }
            mWaarde = "0" + mWaarde;
        }
        let dWaarde = Math.floor((num - triljWaarde * 1000000000000 - miljWaarde * 1000000000 - mWaarde * 1000000) / 1000);
        if (dWaarde < 100) {
            if (dWaarde < 10) {
                dWaarde = "0" + dWaarde;
            }
            dWaarde = "0" + dWaarde;
        }
        let uWaarde = Math.floor(num % 1000);
        if (uWaarde < 100) {
            if (uWaarde < 10) {
                uWaarde = "0" + uWaarde;
            }
            uWaarde = "0" + uWaarde;
        }
        output = triljWaarde + "." + miljWaarde + "." + mWaarde + "." + dWaarde + "." + uWaarde;
        let kWaarde = num - Math.floor(num);
        if (kWaarde !== 0) {
            output = output + "," + kWaarde.split(".")[1];
        }
    }
    else if (num >= 1000000000) {
        let miljWaarde = Math.floor(num / 1000000000);
        let mWaarde = Math.floor((num - miljWaarde * 1000000000) / 1000000);
        if (mWaarde < 100) {
            if (mWaarde < 10) {
                mWaarde = "0" + mWaarde;
            }
            mWaarde = "0" + mWaarde;
        }
        let dWaarde = Math.floor((num - miljWaarde * 1000000000 - mWaarde * 1000000) / 1000);
        if (dWaarde < 100) {
            if (dWaarde < 10) {
                dWaarde = "0" + dWaarde;
            }
            dWaarde = "0" + dWaarde;
        }
        let uWaarde = Math.floor(num % 1000);
        if (uWaarde < 100) {
            if (uWaarde < 10) {
                uWaarde = "0" + uWaarde;
            }
            uWaarde = "0" + uWaarde;
        }
        output = miljWaarde + "." + mWaarde + "." + dWaarde + "." + uWaarde;
        let kWaarde = num - Math.floor(num);
        if (kWaarde !== 0) {
            output = output + "," + kWaarde.split(".")[1];
        }
    }
    else if (num >= 1000000) {
        let mWaarde = Math.floor(num / 1000000);
        let dWaarde = Math.floor((num - mWaarde * 1000000) / 1000);
        if (dWaarde < 100) {
            if (dWaarde < 10) {
                dWaarde = "0" + dWaarde;
            }
            dWaarde = "0" + dWaarde;
        }
        let uWaarde = num % 1000;
        if (uWaarde < 100) {
            if (uWaarde < 10) {
                uWaarde = "0" + uWaarde;
            }
            uWaarde = "0" + uWaarde;
        }
        output = mWaarde + "." + dWaarde + "." + uWaarde;
        let kWaarde = num - Math.floor(num);
        if (kWaarde !== 0) {
            output = output + "," + kWaarde.split(".")[1];
        }
    }
    else if (num > 1000) {
        let dWaarde = Math.floor(num / 1000);
        let uWaarde = num % 1000;
        if (uWaarde < 100) {
            if (uWaarde < 10) {
                uWaarde = "0" + uWaarde;
            }
            uWaarde = "0" + uWaarde;
        }
        output = dWaarde + "." + uWaarde;
        let kWaarde = num - Math.floor(num);
        if (kWaarde !== 0) {
            output = output + "," + kWaarde.split(".")[1];
        }
    }
    else {
        output = num;
    }
    return output;
}