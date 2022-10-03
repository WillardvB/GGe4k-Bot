const empire = require('./../../../empireClient');
const accountLinks = require('./../../../data/accountlinks.json');
const {
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const fs = require("fs");
const path = require('path');

module.exports = {
    name: 'speler link',
    description: 'Links the Empire(: Four Kingdoms) account to Discord account!',
    /**
     *
     * @param {ModalSubmitInteraction | ButtonInteraction} interaction
     */
    async execute(interaction) {
        try {
            let player_id = parseInt(interaction.customId.split(' ')[2]);
            let _filledInCode = "";
            if (interaction.isModalSubmit()) {
                _filledInCode = interaction.fields.getTextInputValue('verificationCode');
                if (accountLinks["linkCodes"][player_id.toString()].code === _filledInCode) {
                    accountLinks["linkAccounts"][interaction.user.id.toString()] = player_id.toString();
                    fs.writeFileSync(path.join(__dirname,'./../../../data/accountlinks.json'), JSON.stringify(accountLinks, null, 2));
                    const __messRow = new ActionRowBuilder();
                    __messRow.addComponents(
                        new ButtonBuilder()
                            .setLabel('naam - bondgenootschap')
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(`speler rename ${player_id} n-bg`),
                        new ButtonBuilder()
                            .setLabel('naam')
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(`speler rename ${player_id} n`)
                    )
                    let _player = await empire.client.players.getById(player_id);
                    let _roles = await interaction.guild.roles.fetch();
                    /** @type {Role}*/
                    let _role = _roles.find(x=>x.name === _player.allianceName);
                    if(_role === undefined){
                        _role = await interaction.guild.roles.create({name:_player.allianceName})
                    }
                    let __role = interaction.member.roles.cache.find(x=>x.name === _role.name);
                    if(__role === undefined) {
                        await interaction.member.roles.add(_role, "Account linking");
                    }
                    await interaction.reply({
                        content: "Verificatie voltooid!\n\nAls je je gebruikersnaam automatisch wil laten aanpassen aan je in-game naam en bondgenootschap, kies dan 1 van onderstaande knoppen",
                        ephemeral: true,
                        components: [__messRow],
                    });
                }
                return;
            }
            let player = await empire.client.players.getById(player_id);
            let code = (Math.floor(Math.random() * 900000) + 100000).toString();
            if (accountLinks["linkCodes"][player_id.toString()] === undefined || accountLinks["linkCodes"][player_id.toString()].date < Date.now()) {
                accountLinks["linkCodes"][player_id.toString()] = {
                    code: code,
                    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime()
                };
                fs.writeFileSync(path.join(__dirname,'./../../../data/accountlinks.json'), JSON.stringify(accountLinks, null, 2));
                let bericht = `${interaction.user.username}:${interaction.user.discriminator} heeft een verificatiecode aangevraagd voor het koppelen van het empire account aan zijn discord account. Deze koppeling maakt het gebruik van Commands op Discord makkelijker. Er komt hierbij géén extra (privé) informatie vrij.\n` +
                `De code is:\n\n${code}\n\nDeze code is een week geldig en er is geen maximum op het aantal gebruiken.`;
                empire.client.sendMail(player.playerName, "Link account code", bericht);
                let _components = [];
                const _messRow = new ActionRowBuilder();
                _messRow.addComponents(
                    new ButtonBuilder()
                        .setLabel('Verificatie code invullen')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`speler link ${player.playerId} to-modal`)
                )
                _components.push(_messRow);
                await interaction.editReply({
                    content: "Er is een verificatie code gestuurd naar je in-game mail.",
                    embeds: [],
                    ephemeral: true,
                    components: _components,
                });
            } else if (accountLinks["linkCodes"][player_id.toString()].date > Date.now()) {
                if (!interaction.isModalSubmit()) {
                    if(interaction.deferred || interaction.replied){
                        let _components = [];
                        const _messRow = new ActionRowBuilder();
                        _messRow.addComponents(
                            new ButtonBuilder()
                                .setLabel('Verificatie code invullen')
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId(`speler link ${player.playerId} to-modal`)
                        )
                        _components.push(_messRow);
                        await interaction.editReply({
                            content: "Eerder deze is er een verificatie code gestuurd naar je in-game mail. Vul die in bij onderstaande knop.",
                            embeds: [],
                            ephemeral: true,
                            components: _components,
                        });
                        return;
                    }
                    const verificationCodeModalInput = new TextInputBuilder()
                        .setCustomId('verificationCode')
                        .setLabel("Voer je verificatie code in:")
                        .setStyle(TextInputStyle.Short);
                    const row = new ActionRowBuilder().addComponents(verificationCodeModalInput);
                    const modal = new ModalBuilder()
                        .setCustomId(`speler link ${player_id} modal`)
                        .setTitle('Link account');
                    modal.addComponents(row);
                    await interaction.showModal(modal);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}