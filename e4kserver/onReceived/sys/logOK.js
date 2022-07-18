module.exports = {
    name: "logOK",
    execute(xml) {
        let _userId = xml.body.login.$.id;
        let _isMod = xml.body.login.$.mod;
        let _username = xml.body.login.$.n;
        console.log("Succesfully logged in! Username: " + _username);
        getRoomList();
    }
}