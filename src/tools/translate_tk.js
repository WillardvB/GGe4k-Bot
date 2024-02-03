// noinspection EqualityComparisonWithCoercionJS,ES6ConvertVarToLetConst,CommaExpressionJS,SpellCheckingInspection

//# sourceURL=/_/translate_http/_/js/k=translate_http.tr.nl.yQapHGOhvkI.O/d=1/rs=AN8SPfoz94J-l0Sp3c--JgyrTk2lOFGa6Q/m=el_conf
const dq = {
    _ctkk: '470100.1060754937'
};

function $p(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" === b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" === b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
}

function aq() {
    function a(d) {
        return function () {
            return d
        }
    }

    let b = String.fromCharCode(107), c = a(String.fromCharCode(116));
    b = a(b);
    c = [c(), c()];
    c[1] = b();
    return dq["_c" + c.join(b())] || ""
}

function Do(a) {
    for (var b = [], c = 0, d = 0; d < a.length; d++) {
        var e = a.charCodeAt(d);
        128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (55296 == (e & 64512) && d + 1 < a.length && 56320 == (a.charCodeAt(d + 1) & 64512) ? (e = 65536 + ((e & 1023) << 10) + (a.charCodeAt(++d) & 1023), b[c++] = e >> 18 | 240, b[c++] = e >> 12 & 63 | 128) : b[c++] = e >> 12 | 224, b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128)
    }
    return b
}

function bq(a) {
    var b = aq().split("."), c = Number(b[0]) || 0;
    a = Do(a);
    for (var d = c, e = 0; e < a.length; e++) {
        d += a[e];
        d = $p(d, "+-a^+6");
    }
    d = $p(d, "+-3^+b+-f");
    d ^= Number(b[1]) || 0;
    0 > d && (d = (d & 2147483647) + 2147483648);
    b = d % 1E6;
    return b.toString() + "." + (b ^ c)
}

/**
 *
 * @param {string[]} val
 * @return {string}
 */
module.exports.getTK = function (val) {
    return bq(val.join(""));
}