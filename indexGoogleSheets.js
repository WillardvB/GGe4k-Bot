const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const googleApiData = require('./data/client_secret.json');
// If modifying these scopes, delete token.json.
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = __dirname + '/data/token.json';
var auth = new google.auth.OAuth2();

module.exports = {
    getAuth: function () {
        authorize(googleApiData);
        return auth;
    }
};

// Load client secrets from a local file.
fs.readFile(__dirname + '/data/client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content));
});

/*
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
    const { redirect_uris } = credentials.installed;
    let oAuth2Client = new google.auth.OAuth2(
        process.env['client_id_googleAPI'],
        process.env['client_secret_googleAPI'],
        redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            return getNewToken(oAuth2Client);
        }
        oAuth2Client.setCredentials({
            refresh_token: process.env.refresh_token_google,
            expiry_date: token.expiry_date
        });
        auth = oAuth2Client;
    });
}

/*
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error(
                    'Error while trying to retrieve access token',
                    err
                );
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            auth = oAuth2Client;
        });
    });
}
