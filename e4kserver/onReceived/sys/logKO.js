module.exports = {
    name: "logKO",
    execute(xml) {
        console.log("[ERROR] LoginResponce failed!: " + xml.body.login.$.e);
    }
}