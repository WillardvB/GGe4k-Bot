const raw_data_url = "https://raw.githubusercontent.com/vanBrusselGames/E4K-data/main/data/";
/** @param {string} fileName */
module.exports.getRawDataUrl = (fileName) => `${raw_data_url}${fileName}.json`;