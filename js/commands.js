/* global commands */
commands = {};

const CACHE = {};

commands.echo = async(term, args) => (term.log(args[0] || ''), true);
commands.clear = async(term) => term.clear();

commands.cd = async(term, args) => {
    if (!args[0]) return true;
    const read = term.d.fs.read(args[0], term.d.dir);
    if (!read) return term.log('cd: no such file or directory: ' + args[0]);
    if (read[0]) return term.log('cd: not a directory');
    if (args[0] === '/') term.d.dir = '/';
    else term.d.dir = term.d.fs.parseRelativePath(args[0] + '/', term.d.dir);
    return true;
};

commands.ls = async(term, args) => {
    let target = args[0];
    target ??= '.';
    const read = term.d.fs.read(target, term.d.dir);
    if (!read) return term.log('ls: no such file or directory: ' + target);
    if (read[0]) return term.log('ls: not a directory');
    const typeIcons = {
        txt: '',
        'txt/md': '',
        UNKNOWN: ''
    };
    term.log(
        Object.entries(read)
            .map((f) => `${Array.isArray(f[1]) ? typeIcons[f[1][0] || 'UNKNOWN'] : ''}  ${f[0]}`)
            .sort((a, b) =>
                a.startsWith('') && b.startsWith('') ? 0 : a.startsWith('') ? -1 : 1
            )
            .join('\n')
    );
    return true;
};

commands.cat = async(term, args) => {
    if (!args[0]) return true;
    const read = term.d.fs.read(args[0], term.d.dir);
    if (!read) return term.log('cat: no such file or directory: ' + args[0]);
    if (!read[0]) return term.log('cat: is a directory');
    term.log(read[1]);
    return true;
};

commands.commands = async(term) => {
    term.log(Object.keys(commands).sort().join(', '));
    return true;
};

commands.date = async(term) => (term.log(new Date().toLocaleString()), true);

commands.pwd = async(term) => (term.log(term.d.dir), true);

commands.wttr = async(term, args) => {
    const API = `https://wttr.in/${args[0] || ''}?0AFT`,
        res = await fetch(API),
        txt = await res.text();
    term.log(txt);
    return true;
};

commands.fetch = async(term, args) => {
    const d = {
        discord: async() => {
            const API = 'https://api.lanyard.rest/v1/users/696698254770831421',
                res = await fetch(API),
                {data} = await res.json();
            term.log(`󰓹  ${data.discord_user.username}#${data.discord_user.discriminator}
────── ──  ─
󰀉  ${data.discord_user.id}
󰐰  ${data.discord_status[0].toUpperCase() + data.discord_status.slice(1)} (${
    ['web', 'mobile', 'desktop']
        .filter((x) => data[`active_on_discord_${x}`])
        .join(' - ') || 'Probably sleeping'
})
󰐌  Activit${data.activities.length > 1 ? 'ies' : 'y'}
${
    data.activities
        .map(
            (x) =>
                `|  ${
                    [
                        '󰊗  Playing',
                        '󰑋  Streaming',
                        '󰝚  Listening to',
                        '󰑈  Watching',
                        '󰦨 ',
                        '󱐋  Competing in'
                    ][x.type]
                } ${x.name}${[x.details, x.state]
                    .filter(Boolean)
                    .map((y) => `\n|  |  ${y}`)
                    .join('')}`
        )
        .join('\n') || '| Procrastinating'
}
`);
        },
        browser: async() =>
            term.log(`󰓹  ${getBrowser()}
────── ──  ─
󰔃  Screen
|  󰆾  ${screen.width}x${screen.height}
|  󰉼  ${screen.colorDepth} bits
󰞂  Navigator
|  󰆘  Cookies ${navigator.cookieEnabled ? 'enabled' : 'disabled'}
|  󰀉  ${navigator.userAgent
        .match(/\(.+\)|.+? +?/g)
        .map((x) => x.trim())
        .join('\n|  |  ')}
|    ${navigator.language}`),
        fm: async() => {
            const d = await getFmData();
            if (!d.recent && !d.data) {
                return term.log('fetch: could not fetch any data');
            }
            if (args[1] !== 'recent') {
                if (!d.data) {
                    return term.log(
                        'fetch: could not fetch data' +
                            (d.recent ? ', try `fetch fm recent` for recent tracks' : '')
                    );
                }
                const cur = d.recent.find((x) => x.timestamp[0] === 'Scrobbling now');
                console.log(d.recent, cur);
                term.log(
                    `󰓹  Natasquare
────── ──  ─
󰠃  Artists
|  ${d.data.artists}
󰣐  Loved tracks
|  ${d.data.loved_tracks}
󰐌  Scrobbles
|  ${d.data.scrobbles}${
    d.data.topTrack
        ? `
󰓎  Weekly top track
|  󰝚  ${d.data.topTrack.title}
|  󰠃  ${d.data.topTrack.artist}`
        : ''
}${
    cur
        ? `
󰋋  Current track
|  󰝚  ${cur.title
        .match(/\(.+\)|[^(]+/g)
        .map((x) => x.trim())
        .join('\n|  ')}
|  󰠃  ${cur.artist}
`
        : ''
}`
                );
            } else {
                if (!d.recent) return term.log('fetch: could not fetch recent data');
                term.log(
                    `󰓎  Recent tracks
────── ──  ─ 
${d.recent
        .map(
            (x) => `${x.loved ? '󰣐' : '󱢠'}  ${x.title
                .match(/\(.+\)|[^(]+/g)
                .map((x) => x.trim())
                .join('\n|  ')}
󰠃  ${x.artist}
󰥔  ${x.timestamp.join('\n|  ')}
────── ──  ─`
        )
        .join('\n')}`
                );
            }
        },
        /**
         * @request 637648484979441706
         */
        girls: async() =>
            term.log(`󰀨  Girls not detected
|  No bitches? :megamind:`)
    };
    if (!args[0] || !d[args[0]]) {
        return term.log(
            `fetch: choose an option from this list: \`${Object.keys(d).sort().join('`, `')}\``
        );
    }
    await d[args[0]]();
    return true;
};

/**
 * @link https://stackoverflow.com/a/5918791/18412379
 */
function getBrowser() {
    const ua = navigator.userAgent;
    let tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

commands.history = async(term, args) => {
    /* global TERM_HISTORY */
    term.log(
        TERM_HISTORY.map(
            (x, i) => `${(i + 1).toString().padEnd(TERM_HISTORY.length.toString().length)}  ${x}`
        )
            .slice(Number(args[0]) - 1 || 0)
            .join('\n')
    );
    return true;
};

/* shoutout to bard for giving me the idea */
async function getFmData() {
    let recent = null,
        data = null,
        d = await fetch(
            // eslint-disable-next-line max-len
            'https://953a29d3-dd81-419a-98da-b9660425be7d.id.repl.co/fuckcors?q=https://last.fm/user/natasquare'
        );
    d = await d.text();

    const doc = document.createElement('div');
    doc.innerHTML = d.replace(/<head>[^]+<\/head>/g, '').replace(/<script>[^]+<\/script>/);

    const tracklistDiv = doc.querySelector('.chartlist'),
        topTrackDiv = doc.querySelector('.header-featured-track'),
        statDiv = doc.querySelector('.header-metadata');

    if (tracklistDiv) {
        recent = [];
        const tracks = tracklistDiv.querySelectorAll('.chartlist-row');

        for (const track of tracks) {
            const artist = track.querySelector('.chartlist-artist').textContent.trim(),
                title = track.querySelector('.chartlist-name').textContent.trim(),
                cover = track.querySelector('.cover-art img').src,
                loved =
                    track
                        .querySelector('.chartlist-loved div')
                        .getAttribute('data-toggle-button-current-state') === 'loved';
            let timestamp = track.querySelector('.chartlist-timestamp span');
            timestamp = [timestamp.title, timestamp.textContent.trim()].filter(Boolean);

            recent.push({title, artist, cover, timestamp, loved});
        }
    }
    if (!topTrackDiv && !statDiv) return {recent, data};
    data = {};
    if (topTrackDiv) {
        const title = topTrackDiv.querySelector('.featured-item-name').textContent.trim(),
            artist = topTrackDiv.querySelector('.featured-item-artist').textContent.trim(),
            cover = topTrackDiv.querySelector('.cover-art img').src;
        data.topTrack = {title, artist, cover};
    }
    if (statDiv) {
        for (const item of statDiv.querySelectorAll('.header-metadata-item')) {
            const key = item
                    .querySelector('.header-metadata-title')
                    .textContent.trim()
                    .toLowerCase()
                    .replace(/ +/g, '_'),
                value = item.querySelector('.header-metadata-display').textContent.trim();
            data[key] = value;
        }
    }
    return {recent, data};
}

/**
 * @link https://stackoverflow.com/a/7394787/18412379
 */
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

/**
 * @request 714721111258169355
 */
commands.uwu = async(term, args) => {
    if (!args[0]) term.log('uwu');
    else {
        const faces = ['OwO', 'UwU', '>w<', 'uWu', ':3', 'ÙwÚ', 'QwQ', 'uwu', 'owo'];
        term.log(
            args[0]
                .toLowerCase()
                .replace(/[lr]/g, 'w')
                .replace(/[LR]/g, 'W')
                .replace(/n([aeiou])/g, 'ny$1')
                .replace(/N([aeiou])/g, 'Ny$1')
                .replace(/N([AEIOU])/g, 'Ny$1')
                .replace(/ove/g, 'uv')
                .replace(
                    /([!.,]+)/g,
                    (_, x) =>
                        ` ${faces[Math.floor(Math.random() * faces.length)]}${','.repeat(
                            x.length * ~~({'!': 2, '.': 1.5}[x[x.length - 1]] || 1) +
                                (x[x.length - 1] !== ',')
                        )}`
                )
        );
    }
    return true;
};
