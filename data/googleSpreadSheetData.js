const googleSheetScript = require('./../indexGoogleSheets.js');
const { google } = require('googleapis');
const logger = require('./../tools/Logger');
var gebouwData = [];
var titelData = [];
var rrData = [];
var rrAttData0 = [];
var rrAttData1 = [];
var rrAttData2 = [];
var rrAttData3 = [];

module.exports = {
    async gebouwData(client) {
        output = await krijgGebouwData(client);
        return output;
    },
    async titelData(client) {
        output = await krijgTitelData(client);
        return output;
    },
    async rrData(client) {
        output = await krijgRrData(client);
        return output;
    },
    async rrAttData(client, kID) {
        output = await krijgRrAttData(client, kID);
        return output;
    }
}

async function krijgGebouwData() {
    if (gebouwData != null && gebouwData.length != 0) {
        return gebouwData;
    }
    const auth = googleSheetScript.getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.get(
        {
            spreadsheetId: '1vpa0xvMRMuatETW_N6bH9fe0iASfXJIAnPSO-uKOdOY',
            range: 'a!A2:FA2400'
        },
        (err, res) => {
            if (err) {
                logger.logError(err);
                return;
            }
            return gebouwData = res.data.values;
        }
    )
}

async function krijgTitelData() {
    if (titelData != null && titelData.length != 0) {
        return titelData;
    }
    const auth = googleSheetScript.getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.get(
        {
            spreadsheetId: '19-fm2VbETcuIkPuYEhwFTmNY8asOA86BV8RU9KPAH8w',
            range: 'a!A2:BA100'
        },
        (err, res) => {
            if (err) {
                logger.logError(err);
                return;
            }
            return titelData = res.data.values;
        }
    )
}

async function krijgRrData() {
    if (rrData != null && rrData.length != 0) {
        return rrData;
    }
    const auth = googleSheetScript.getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.get(
        {
            spreadsheetId: '1bfHEW5Hu8W56UEvpCHWqd_vhNOAs1GHR59VNkW2A5AY',
            range: 'HetRRblad!H2:EM1635'
        },
        (err, res) => {
            if (err) {
                logger.logError(err);
                return;
            }
            return rrData = res.data.values;
        }
    )
}

async function krijgRrAttData(kID) {
    if (rrAttData3 != null && rrAttData3.length != 0 && rrAttData2.length != 0 && rrAttData1.length != 0 && rrAttData0.length != 0) {
        let tmpTactiek = "";
        switch (kID.toString()) {
            case '0': tmpTactiek = rrAttData0; break;
            case '1': tmpTactiek = rrAttData1; break;
            case '2': tmpTactiek = rrAttData2; break;
            case '3': tmpTactiek = rrAttData3; break;
        }
        return tmpTactiek;
    }
    const auth = googleSheetScript.getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const ranges = ['0!A4:K849', '1!A4:K116', '2!A4:K158', '3!A4:K116'];
    await sheets.spreadsheets.values.batchGet(
        {
            spreadsheetId: '1hdbKJPsHFPhE9rsPuGvweCCVUi0GcOpIq2oi8URmCqI',
            ranges: ranges
        },
        (err, res) => {
            if (err) {
                logger.logError(err);
                return;
            }
            rrAttData0 = res.data.valueRanges[0].values;
            rrAttData1 = res.data.valueRanges[1].values;
            rrAttData2 = res.data.valueRanges[2].values;
            rrAttData3 = res.data.valueRanges[3].values;
            return ".";
        }
    )
}