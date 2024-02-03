const {translate} = require("../tools/translate");

/**
 *
 * @param {"e4k" | "empire" | "bigfarm" | "bitlife"} game
 * @returns {Promise<{url: string, imageUrl: string}[]>}
 */
module.exports.fetchAnnouncements = async function (game) {
    try {
        const urlPage = game === 'e4k' ? 'e4k/all-posts/' : game === 'empire' ? 'empire/all-posts/' : game === 'bigfarm' ? 'bigfarm/all-posts/' : `${game}`
        const resp = await fetch(`https://communityhub.ggs-io.com/${urlPage}`);
        const text = (await resp.text()).split("\n").map(x => x.trim()).join("");
        /** @type {string} */
        const postsContainer = text.split('<div class="post-list">')[1].split('<a class="page-numbers"')[0];
        const posts = postsContainer.match(/(?:<div class="post-item">|^)(.*?)(?:<\/a><\/p><\/div><\/div>|$)/g)
        if (!posts) return [];
        return posts.map(p => {
            const href = p.match(/(?<=href=")(.*?)(?=")/g)
            if (!href) return null;
            const imgSrcUrl = p.split('<img')[1].match(/(?<= src=")(.*?)(?=(\?)|")/g)?.[0]
            return {url: href[0], imageUrl: imgSrcUrl};
        }).filter(v => v)
    } catch (e) {
        return []
    }
}

/**
 *
 * @param {string} url
 * @return {Promise<AnnouncementData>}
 */
module.exports.fetchAnnouncement = async function (url) {
    const resp = await fetch(url);
    if (resp.status !== 200) return null;
    try {
        const announcementData = {
            url: url, title: '', text: null, author: null, imageUrl: null, videoUrl: null, time: null, fields: null,
        }

        const announcementBody = (await resp.text()).split('</header>')[1].split('<footer ')[0];

        const title = announcementBody.match(/(?<=(<h[12] [A-z="\- ]*>)).*(?=<\/h[12]>)/g)[0];
        announcementData.title = decodeValue(await translate(title, 'en', 'nl'));

        let paragraphs = announcementBody.match(/((?<=(<p[A-z="\- ]*>)).*(?=<\/(p)>))|(<li>.*<\/li>)/g);
        paragraphs = paragraphs.slice(0, paragraphs.indexOf('·'));
        if (paragraphs && paragraphs.length > 0) {
            announcementData.author = paragraphs.pop();
            const _text = await translate(paragraphs, 'en', 'nl')
            announcementData.text = Array.isArray(_text) ? _text.join('\n') : _text
            const fieldNames = announcementData.text.match(/(?<=(\n))([^\nA-z])*<strong>.*<\/strong>(?=(( ?<br>)|\n))/g);
            if (fieldNames) {
                announcementData.fields = [];
                let fieldsText = announcementData.text.substring(announcementData.text.indexOf(`\n${fieldNames[0]}`) + 1 + fieldNames[0].length + 1);
                announcementData.text = announcementData.text.substring(0, announcementData.text.indexOf(`\n${fieldNames[0]}`)).trim();
                for (let i in fieldNames) {
                    i = parseInt(i);
                    const name = decodeValue(fieldNames[i]);
                    let value = fieldsText.split(`\n${fieldNames[i + 1]}`)[0];
                    fieldsText = fieldsText.substring(value.length + `\n${fieldNames[i + 1]}`.length).trim();
                    value = decodeValue(value);
                    if(value.trim().length === 0){
                        announcementData.text += `\n${name}`
                    }
                    else announcementData.fields.push({name: name, value: value})
                }
            }
            announcementData.text = decodeValue(announcementData.text);
        }

        const dateTime = announcementBody.match(/(?<=<time datetime=")[0-9\-T+:]*(?=">)/g);
        if (dateTime && dateTime[0]) announcementData.time = new Date(dateTime[0]);

        const imageData = announcementBody.match(/(?<=(<figure [A-z="\- ]*>)).*(?=<\/figure>)/g)?.[0];
        if (imageData) {
            const imageUrls = imageData.match(/https:\/\/[A-z0-9_\/\-.]*((\.jpg)|(\.png)|(\.webp))/g);
            if (imageUrls) {
                let s = imageUrls.find(_s => _s.match(/[A-z](?=((\.jpg)|(\.png)|(\.webp)))/g))
                if (s) announcementData.imageUrl = s; else {
                    const sizes = imageUrls.map(i => {
                        const y = i.match(/([0-9]*)(?=((\.jpg)|(\.png)|(\.webp)))/g)
                        return y ? parseInt(y) : 0
                    });
                    announcementData.imageUrl = imageUrls.find(_s => _s.includes(`${Math.max(...sizes)}.`))
                }
            }
        }

        const iframeData = announcementBody.match(/(?<=(<iframe )).*(?=><\/iframe>)/g)?.[0];
        if (iframeData) {
            announcementData.imageUrl = iframeData.match(/(?<=(data-placeholder-image="))https:\/\/[A-z0-9_\/\-.]*((\.jpg)|(\.png)|(\.webp))/g)?.pop();
            announcementData.videoUrl = iframeData.match(/(?<=(data-src-cmplz="))https:\/\/[A-z0-9_\/\-.]*(?=")/g)?.pop();
        }
        return announcementData
    } catch (e) {
        console.log(url)
        console.log(e)
        return null;
    }
}

/**
 *
 * @param {string} val
 * @return {string}
 */
function decodeValue(val) {
    val = fixHyperlink(val)
    return val.replaceAll('&#39;', '\'')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('<br>', '\n')
        .replaceAll('<li>', '- ')
        .replaceAll('</li>', '')
        .replaceAll(/<\/?em>/g, ' ')
        .replaceAll(/<\/?strong>/g, '**')
        .split('\n').map(s => s.trim()).join('\n').trim()
}

/**
 *
 * @param {string} val
 * @return {string}
 */
function fixHyperlink(val) {
    if (!val.includes("<a href=\"")) return val
    const matches = val.match(/<a href=".*?">.*?<\/a>/g)
    if (matches == null) return val
    matches.map(m => {
        const href = m.match(/(?<=<a href=").*?(?=">)/g)[0]
        const text = m.match(/(?<=<a href=".*?">).*?(?=<\/a>)/g)[0]
        if(href.trim() === text.trim()) val = val.replaceAll(m, href);
        else val = val.replaceAll(m, `[${text}](${href})`);
    })
    return val
}