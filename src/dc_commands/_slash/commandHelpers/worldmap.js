const x768 = require('e4k-data').imageData;
const {loadImage, createCanvas} = require("canvas");
const path = require('path');
const pathToImages = require('e4k-data').imageBaseUrl;
const empire = require('./../../../empireClient');
const {Constants} = require("ggejs");
const axios = require('axios');

const images = {
    background: null,
    objectBackground: null,
    nameTag: null,
    mainCastles: [],
    moat: null,
    outposts: [],
    outpostBases: [],
    monuments: {horse: null, man: null},
    kingsTower: null,
    metropolis: null,
    capital: null
};
const imagesData = {
    background: x768.Background_Mapobject_Piece0_Classic.frames[0],
    objectBackground: x768.MapObjectBackground_Classic.frames[0],
    nameTag: null,
    mainCastles: [x768.Ruin_Mapobject_Classic.frames[0], x768.Castle_Mapobject_Level1_Classic.frames[0], x768.Castle_Mapobject_Level2_Classic.frames[0], x768.Castle_Mapobject_Level3_Classic.frames[0], x768.Castle_Mapobject_Level4_Classic.frames[0], x768.Castle_Mapobject_Level5_Classic.frames[0], x768.Castle_Mapobject_Level6_Classic.frames[0], x768.Castle_Mapobject_Level7_Classic.frames[0]],
    moat: x768.Castlepart_Moat_Classic.frames[0],
    outposts: [x768.Outpost_Empty.frames[0], x768.Outpost_Mapobject_Level1.frames[0], x768.Outpost_Mapobject_Level2.frames[0], x768.Outpost_Mapobject_Level3.frames[0], x768.Outpost_Mapobject_Level4.frames[0], x768.Outpost_Mapobject_Level5.frames[0], x768.Outpost_Mapobject_Level6.frames[0], x768.Outpost_Mapobject_Level6.frames[0]],
    outpostBases: [x768.Outpost_Mapobject_2_8_0.frames[0], x768.Outpost_Mapobject_2_6_0.frames[0], x768.Outpost_Mapobject_2_0_8.frames[0], x768.Outpost_Mapobject_2_0_6.frames[0], x768.Outpost_Mapobject_8_2_0.frames[0], x768.Outpost_Mapobject_6_2_0.frames[0], x768.Outpost_Mapobject_8_0_2.frames[0], x768.Outpost_Mapobject_6_0_2.frames[0]],
    monuments: {horse: x768.Monument_Mapobject_Horse.frames[0], man: x768.Monument_Mapobject_Man.frames[0]},
    kingsTower: x768.Royal_Tower_Classic.frames[0],
    metropolis: x768.Metropol_Mapobject_Basic.frames[0],
    capital: x768.Castle_Mapobject_Capital_Classic.frames[0]
};

module.exports = {
    loadImages: loadImages,
    getAllianceMap: getAllianceMap,
}

/**
 *
 * @param {string} relativeUrl Relative Url
 * @return {Promise<Buffer>}
 */
async function bufferFromUrl(relativeUrl){
    const url = path.join(pathToImages, relativeUrl)
    const response = await axios.get(url,  { responseType: 'arraybuffer' })
    return Buffer.from(response.data, "utf-8");
}

async function loadImages() {
    images.objectBackground = await loadImage(await bufferFromUrl(x768.MapObjectBackground_Classic.url));

    images.nameTag = await loadImage(path.join(__dirname, '../../../ingame_images', 'NameTag_Basic.png'));

    images.mainCastles = [null,
        await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Level1_Classic.url)),
        await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Level2_Classic.url)),
        await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Level3_Classic.url)),
        await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Level4_Classic.url)),
        await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Level5_Classic.url)),
        await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Level6_Classic.url)),
        await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Level6_Classic.url))];

    images.outposts = [await loadImage(await bufferFromUrl(x768.Outpost_Empty.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_Level1.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_Level2.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_Level3.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_Level4.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_Level5.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_Level6.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_Level6.url))];

    images.outpostBases = [await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_2_8_0.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_2_6_0.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_2_0_8.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_2_0_6.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_8_2_0.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_6_2_0.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_8_0_2.url)),
        await loadImage(await bufferFromUrl(x768.Outpost_Mapobject_6_0_2.url))];

    images.moat = await loadImage(await bufferFromUrl(x768.Castlepart_Moat_Classic.url));

    images.monuments.man = await loadImage(await bufferFromUrl(x768.Monument_Mapobject_Man.url));
    images.monuments.horse = await loadImage(await bufferFromUrl(x768.Monument_Mapobject_Horse.url));
    images.kingsTower = await loadImage(await bufferFromUrl(x768.Royal_Tower_Classic.url));
    images.metropolis = await loadImage(await bufferFromUrl(x768.Metropol_Mapobject_Basic.url));
    images.capital = await loadImage(await bufferFromUrl(x768.Castle_Mapobject_Capital_Classic.url));

    images.background = await loadImage(await bufferFromUrl(x768.Background_Mapobject_Piece0_Classic.url));
}

/**
 *
 * @param {Alliance} alliance
 * @param {number} kingdomId
 * @param {number} userCastleZoom
 * @param {number} userAskedZoom
 * @param {number} offsetBlocksX
 * @param {number} offsetBlocksY
 * @return {Promise<Buffer>}
 */
async function getAllianceMap(alliance, kingdomId = 0, userCastleZoom = 1, userAskedZoom = 1, offsetBlocksX = 0, offsetBlocksY = 0) {
    return new Promise(async (resolve, reject) => {
        try {
            if (images.background === null) await loadImages();
            userAskedZoom = Math.max(1, userAskedZoom);
            offsetBlocksX = Math.min(userAskedZoom - 1, offsetBlocksX);
            offsetBlocksY = Math.min(userAskedZoom - 1, offsetBlocksY);

            let minX = 10000;
            let maxX = -1000;
            let minY = 10000;
            let maxY = -1000;
            /** @type {CastleMapobject[] | CapitalMapobject[]}*/
            const allianceCastles = [];
            for (const member of alliance.memberList) {
                const player = await empire.client.players.getById(member.playerId);
                for (const castle of player.castles) {
                    if (castle.kingdomId !== kingdomId) continue;
                    allianceCastles.push(castle);
                    minX = Math.min(minX, castle.position.X);
                    maxX = Math.max(maxX, castle.position.X);
                    minY = Math.min(minY, castle.position.Y);
                    maxY = Math.max(maxY, castle.position.Y);
                }
                if (player.kingsTowers) {
                    for (const tower of player.kingsTowers) {
                        const castle = tower.kingstower;
                        if (castle.kingdomId !== kingdomId) continue;
                        allianceCastles.push(castle);
                        minX = Math.min(minX, castle.position.X);
                        maxX = Math.max(maxX, castle.position.X);
                        minY = Math.min(minY, castle.position.Y);
                        maxY = Math.max(maxY, castle.position.Y);
                    }
                }
                if (player.monuments) {
                    for (const monument of player.monuments) {
                        const castle = monument.monument;
                        if (castle.kingdomId !== kingdomId) continue;
                        allianceCastles.push(castle);
                        minX = Math.min(minX, castle.position.X);
                        maxX = Math.max(maxX, castle.position.X);
                        minY = Math.min(minY, castle.position.Y);
                        maxY = Math.max(maxY, castle.position.Y);
                    }
                }
            }
            allianceCastles.sort((a, b) => b.areaType - a.areaType);

            const diffX = 10 + maxX - minX;
            const diffY = 10 + maxY - minY;
            const maxDifSize = Math.max(diffX, diffY);
            const canvasSize = 40.96;
            const zoom = 100 / maxDifSize * userAskedZoom;
            const size = Math.max(1, maxDifSize / userAskedZoom * userCastleZoom / 100) * (canvasSize / 40.96) * 0.75 * zoom;

            let canvas = createCanvas(canvasSize * 100 * (diffX / maxDifSize), canvasSize * 100 * (diffY / maxDifSize));
            let context = canvas.getContext("2d");
            context.drawImage(images.background, 0, 0, canvasSize * 100, canvasSize * 100);

            let offsetX = userAskedZoom === 1 ? 0 : diffX * offsetBlocksX / userAskedZoom;
            let offsetY = userAskedZoom === 1 ? 0 : diffY * offsetBlocksY / userAskedZoom;

            for (let mapObject of allianceCastles) {
                let x = mapObject.position.X - minX - offsetX + 5;
                let y = mapObject.position.Y - minY - offsetY + 5;
                if (mapObject.areaType === Constants.WorldmapArea.MainCastle) {
                    if (!mapObject.objectId) continue;
                    let arr = [mapObject.towerLevel, mapObject.gateLevel, mapObject.keepLevel];
                    let castleImageLevel = Math.max(Math.round(arr.reduce((a, b) => a + b, 0) / arr.length), 1);
                    let hkData = imagesData.mainCastles[Math.min(Math.max(1, castleImageLevel), imagesData.mainCastles.length - 1)];
                    if (mapObject.moatLevel > 0) {
                        let moatData = x768.Castlepart_Moat_Classic.frames[0];
                        let moat_dx = x * canvasSize * zoom - size * moatData.w / 2;
                        let moat_dy = y * canvasSize * zoom - size * moatData.h / 2;
                        context.drawImage(images.moat, moat_dx + size * hkData.h * 0.05, moat_dy + size * hkData.h * 0.3625, size * moatData.w, size * moatData.h);
                    } else {
                        let __dx = x * canvasSize * zoom - size * imagesData.objectBackground.w / 2 + size * hkData.h * 0.05;
                        let __dy = y * canvasSize * zoom - size * imagesData.objectBackground.h / 2 + size * hkData.h * 0.3;
                        context.drawImage(images.objectBackground, __dx, __dy, size * imagesData.objectBackground.w, size * imagesData.objectBackground.h);
                    }
                    let image = images.mainCastles[Math.min(Math.max(1, castleImageLevel), images.mainCastles.length - 1)];
                    let _dx = x * canvasSize * zoom - size * hkData.w / 2;
                    let _dy = y * canvasSize * zoom - size * hkData.h / 2;
                    context.drawImage(image, _dx, _dy, size * hkData.w, size * hkData.h);
                    let _nameTag_w = size * hkData.w * 1.75;
                    let _nameTag_h = size * hkData.w * 0.45;
                    let _nameTag_dx = x * canvasSize * zoom - _nameTag_w * 0.475;
                    let _nameTag_dy = y * canvasSize * zoom + _nameTag_h * 1.15;
                    context.drawImage(images.nameTag, _nameTag_dx, _nameTag_dy, _nameTag_w, _nameTag_h);
                    let fontSize = 17.5 / 3 * size;
                    context.font = `${fontSize}pt 'Sans'`;
                    context.textAlign = 'center';
                    context.fillStyle = "#000";
                    context.fillText(mapObject.customName, _nameTag_dx + _nameTag_w * 0.4875, _nameTag_dy + _nameTag_h * 0.55);
                }
                if (mapObject.areaType === Constants.WorldmapArea.Outpost) {
                    let bpData;
                    if (mapObject.ownerId === -300) {
                        bpData = x768.Outpost_Empty.frames[0];
                    } else {
                        let arr = [mapObject.towerLevel, mapObject.gateLevel, mapObject.keepLevel];
                        let bpImageLevel = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
                        bpData = imagesData.outposts[Math.max(1, bpImageLevel)];
                    }
                    if (mapObject.outpostType % 2 === 1) {
                        let __dx = x * canvasSize * zoom - size * imagesData.objectBackground.w / 2 + size * bpData.h * 0.05;
                        let __dy = y * canvasSize * zoom - size * imagesData.objectBackground.h / 2 + size * bpData.h * 0.6;
                        context.drawImage(images.objectBackground, __dx, __dy, size * imagesData.objectBackground.w, size * imagesData.objectBackground.h);
                    }
                    let outpostBaseImage = images.outpostBases[mapObject.outpostType];
                    let baseData = imagesData.outpostBases[mapObject.outpostType];
                    let base_dx = x * canvasSize * zoom - size * baseData.w / 2;
                    let base_dy = y * canvasSize * zoom - size * baseData.h / 2 + size * bpData.h * 0.2 + (mapObject.outpostType % 2 === 1 ? size * bpData.h * 0.5 : 0);
                    context.drawImage(outpostBaseImage, base_dx, base_dy, size * baseData.w, size * baseData.h);
                    let _dx = x * canvasSize * zoom - size * bpData.w / 2;
                    let _dy = y * canvasSize * zoom - size * bpData.h / 2;
                    if (mapObject.ownerId === -300) {
                        context.drawImage(images.outposts[0], _dx, _dy, size * bpData.w, size * bpData.h);
                    } else {
                        let arr = [mapObject.towerLevel, mapObject.gateLevel, mapObject.keepLevel];
                        let bpImageLevel = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
                        let image = images.outposts[Math.max(1, bpImageLevel)];
                        context.drawImage(image, _dx, _dy, size * bpData.w, size * bpData.h);
                    }
                }
                if (mapObject.areaType === Constants.WorldmapArea.Capital) {
                    if (!mapObject.objectId) continue;
                    let data = imagesData.capital;
                    let __dx = x * canvasSize * zoom - size * imagesData.objectBackground.w / 2 + size * data.h * 0.05;
                    let __dy = y * canvasSize * zoom - size * imagesData.objectBackground.h / 2 + size * data.h * 0.3;
                    context.drawImage(images.objectBackground, __dx, __dy, size * imagesData.objectBackground.w, size * imagesData.objectBackground.h);
                    let image = images.capital;
                    let _dx = x * canvasSize * zoom - size * data.w / 2;
                    let _dy = y * canvasSize * zoom - size * data.h / 2;
                    context.drawImage(image, _dx, _dy, size * data.w, size * data.h);
                    let _nameTag_w = size * data.w * 1.75 * 0.75;
                    let _nameTag_h = size * data.w * 0.45 * 0.75;
                    let _nameTag_dx = x * canvasSize * zoom - _nameTag_w * 0.475;
                    let _nameTag_dy = y * canvasSize * zoom + _nameTag_h * 1.15;
                    context.drawImage(images.nameTag, _nameTag_dx, _nameTag_dy, _nameTag_w, _nameTag_h);
                    let fontSize = 17.5 / 3 * size;
                    context.font = `${fontSize}pt 'Sans'`;
                    context.textAlign = 'center';
                    context.fillStyle = "#000";
                    context.fillText(mapObject.customName, _nameTag_dx + _nameTag_w * 0.4875, _nameTag_dy + _nameTag_h * 0.55);
                }
                if (mapObject.areaType === Constants.WorldmapArea.Metropol) {
                    if (!mapObject.objectId) continue;
                    let data = imagesData.metropolis;
                    let __dx = x * canvasSize * zoom - size * imagesData.objectBackground.w / 2 + size * data.h * 0.05;
                    let __dy = y * canvasSize * zoom - size * imagesData.objectBackground.h / 2 + size * data.h * 0.3;
                    context.drawImage(images.objectBackground, __dx, __dy, size * imagesData.objectBackground.w, size * imagesData.objectBackground.h);
                    let image = images.metropolis;
                    let _dx = x * canvasSize * zoom - size * data.w / 2;
                    let _dy = y * canvasSize * zoom - size * data.h / 2;
                    context.drawImage(image, _dx, _dy, size * data.w, size * data.h);
                    let _nameTag_w = size * data.w * 1.75;
                    let _nameTag_h = size * data.w * 0.45;
                    let _nameTag_dx = x * canvasSize * zoom - _nameTag_w * 0.475;
                    let _nameTag_dy = y * canvasSize * zoom + _nameTag_h * 1.15;
                    context.drawImage(images.nameTag, _nameTag_dx, _nameTag_dy, _nameTag_w, _nameTag_h);
                    let fontSize = 17.5 / 3 * size;
                    context.font = `${fontSize}pt 'Sans'`;
                    context.textAlign = 'center';
                    context.fillStyle = "#000";
                    context.fillText(mapObject.customName, _nameTag_dx + _nameTag_w * 0.4875, _nameTag_dy + _nameTag_h * 0.55);
                }
                if (mapObject.areaType === Constants.WorldmapArea.Kingstower) {
                    if (!mapObject.objectId) continue;
                    let data = imagesData.kingsTower;
                    let __dx = x * canvasSize * zoom - size * imagesData.objectBackground.w / 2 + size * data.h * 0.05;
                    let __dy = y * canvasSize * zoom - size * imagesData.objectBackground.h / 2 + size * data.h * 0.3;
                    context.drawImage(images.objectBackground, __dx, __dy, size * imagesData.objectBackground.w, size * imagesData.objectBackground.h);
                    let image = images.kingsTower;
                    let _dx = x * canvasSize * zoom - size * data.w / 2;
                    let _dy = y * canvasSize * zoom - size * data.h / 2;
                    context.drawImage(image, _dx, _dy, size * data.w, size * data.h);
                    let _nameTag_w = size * data.w * 1.75 * 0.75;
                    let _nameTag_h = size * data.w * 0.45 * 0.75;
                    let _nameTag_dx = x * canvasSize * zoom - _nameTag_w * 0.475;
                    let _nameTag_dy = y * canvasSize * zoom + _nameTag_h * 1.15;
                    context.drawImage(images.nameTag, _nameTag_dx, _nameTag_dy, _nameTag_w, _nameTag_h);
                    let fontSize = 17.5 / 3 * size;
                    context.font = `${fontSize}pt 'Sans'`;
                    context.textAlign = 'center';
                    context.fillStyle = "#000";
                    context.fillText(mapObject.customName, _nameTag_dx + _nameTag_w * 0.4875, _nameTag_dy + _nameTag_h * 0.55);
                }
                if (mapObject.areaType === Constants.WorldmapArea.Monument) {
                    if (!mapObject.objectId) continue;
                    let data = mapObject.monumentType === 0 ? imagesData.monuments.man : imagesData.monuments.horse;
                    let __dx = x * canvasSize * zoom - size * imagesData.objectBackground.w / 2 + size * data.h * 0.05;
                    let __dy = y * canvasSize * zoom - size * imagesData.objectBackground.h / 2 + size * data.h * 0.3;
                    context.drawImage(images.objectBackground, __dx, __dy, size * imagesData.objectBackground.w, size * imagesData.objectBackground.h);
                    let image = mapObject.monumentType === 0 ? images.monuments.man : images.monuments.horse;
                    let _dx = x * canvasSize * zoom - size * data.w / 2;
                    let _dy = y * canvasSize * zoom - size * data.h / 2;
                    context.drawImage(image, _dx, _dy, size * data.w, size * data.h);
                    let _nameTag_w = size * data.w * 1.75 * 0.75;
                    let _nameTag_h = size * data.w * 0.45 * 0.75;
                    let _nameTag_dx = x * canvasSize * zoom - _nameTag_w * 0.475;
                    let _nameTag_dy = y * canvasSize * zoom + _nameTag_h * 1.15;
                    context.drawImage(images.nameTag, _nameTag_dx, _nameTag_dy, _nameTag_w, _nameTag_h);
                    let fontSize = 17.5 / 3 * size;
                    context.font = `${fontSize}pt 'Sans'`;
                    context.textAlign = 'center';
                    context.fillStyle = "#000";
                    context.fillText(mapObject.customName, _nameTag_dx + _nameTag_w * 0.4875, _nameTag_dy + _nameTag_h * 0.55);
                }
            }
            const buffer = canvas.toBuffer();

            resolve(buffer);
        } catch (e) {
            reject(e);
        }
    })
}