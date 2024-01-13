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
        UNKNOWN: '',
    };
    term.log(
        Object.entries(read)
            .map(
                (f) =>
                    `${
                        (Array.isArray(f[1]) ? typeIcons[f[1][0] || 'UNKNOWN'] : '') ||
                        typeIcons.UNKNOWN
                    }  ${f[0]}`
            )
            .sort((a, b) =>
                a.startsWith('') && b.startsWith('') ? 0 : a.startsWith('') ? -1 : 1
            )
            .map((x) => (x.startsWith('') ? `**[#78aad8:${x}]**` : x))
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
            if (!data?.discord_user?.username) return term.log('fetch: could not get info');
            console.log(data.discord_status);
            term.log(`[#78aad8:󰓹]  **${data.discord_user.username}**#${
                data.discord_user.discriminator
            }
[#232527:────── ──  ─]
[#78aad8:󰀉]  \`${data.discord_user.id}\`
${
    {
        online: '[#8ebc67:󰝥]  Online',
        idle: '[#ebcb8b:󰽧]  Idle',
        dnd: '[#bf616a:󰍶]  DND',
        offline: '[#eeeeee66:󰻃]  Dead', // this is hl2 btw
    }[data.discord_status]
} (${
    ['web', 'mobile', 'desktop']
        .filter((x) => data[`active_on_discord_${x}`])
        .join(' - ') || 'probably sleeping'
})
[#78aad8:󰐌]  Activit${data.activities.length > 1 ? 'ies' : 'y'}
${
    data.activities
        .map(
            (x) =>
                `|  ${
                    [
                        '[#78aad8:󰊗]  Playing',
                        '[#78aad8:󰑋]  Streaming',
                        '[#78aad8:󰝚]  Listening to',
                        '[#78aad8:󰑈]  Watching',
                        '[#78aad8:󰦨] ',
                        '[#78aad8:󱐋]  Competing in',
                    ][x.type]
                } **${x.name}**${[x.details, x.state]
                    .filter(Boolean)
                    .map((y) => `\n|  |  ${y}`)
                    .join('')}`
        )
        .join('\n') || '| Procrastinating'
}
`);
            return true;
        },
        browser: async() => (
            term.log(`[#78aad8:󰓹]  ${getBrowser()}
[#232527:────── ──  ─]
[#78aad8:󰔃]  Screen
|  [#78aad8:󰆾]  ${screen.width}x${screen.height}
|  [#78aad8:󰉼]  ${screen.colorDepth} bits
[#78aad8:󰞂]  Navigator
|  [#78aad8:󰆘]  Cookies ${navigator.cookieEnabled ? 'enabled' : 'disabled'}
|  [#78aad8:󰀉]  ${navigator.userAgent
                .match(/\(.+\)|.+? +?/g)
                .map((x) => x.trim())
                .join('\n|  |  ')}
|  [#78aad8:]  ${navigator.language}`),
            true
        ),
        fm: async() => {
            const d = await getFmData();
            if (!d.recent && !d.data) {
                return term.log('fetch: could not fetch any data');
            }
            console.log(d);
            if (args[1] !== 'recent') {
                if (!d.data) {
                    return term.log(
                        'fetch: could not fetch data' +
                            (d.recent ? ', try `fetch fm recent` for recent tracks' : '')
                    );
                }
                const cur = d.recent.find((x) => x.timestamp[0] === 'Scrobbling now');
                term.log(
                    `[#78aad8:󰓹]  **Natasquare**
[#232527:────── ──  ─]
[#78aad8:󰠃]  Artists
|  \`${d.data.artists}\`
[#78aad8:󰐌]  Scrobbles
|  \`${d.data.scrobbles}\`${
    d.data.topTrack
        ? `
<!${2 + d.data.topTrack.title.match(/\(.+\)|[^(]+/g).length}><[#ebcb8b:󰓎]  Weekly top track
|  [#78aad8:󰝚]  **${d.data.topTrack.title
        .match(/\(.+\)|[^(]+/g)
        .map((x) => x.trim())
        .join('\n|  ')}**
|  [#78aad8:󰠃]  ${d.data.topTrack.artist}><!${
    2 + d.data.topTrack.title.match(/\(.+\)|[^(]+/g).length
}><![](${d.data.topTrack.cover})>`
        : ''
}${
    cur
        ? `
<!${2 + cur.title.match(/\(.+\)|[^(]+/g).length}><[#8ebc67:󰋋]  Current track
|  [#78aad8:󰝚]  **${cur.title
        .match(/\(.+\)|[^(]+/g)
        .map((x) => x.trim())
        .join('\n|  ')}**
|  [#78aad8:󰠃]  ${cur.artist}><!${2 + cur.title.match(/\(.+\)|[^(]+/g).length}><![](${cur.cover})>`
        : ''
}${
    d.recent
        ? `
[#78aad8:󰋼]  Use \`fetch fm recent\`
|  for recent tracks`
        : ''
}`
                );
            } else {
                if (!d.recent) return term.log('fetch: could not fetch recent data');
                term.log(
                    `[#ebcb8b:󰓎]  **Recent tracks**
[#232527:────── ──  ─] 
${d.recent
        .map(
            (x) => `<!${1 + x.timestamp.length + x.title.match(/\(.+\)|[^(]+/g).length}><${
                x.loved ? '[#bf616a:󰣐]' : '[#bf616a:󱢠]'
            }  ${x.title
                .match(/\(.+\)|[^(]+/g)
                .map((x) => `**${x.trim()}**`)
                .join('\n|  ')}
[#78aad8:󰠃]  ${x.artist}
[#78aad8:󰥔]  ${x.timestamp.map((x) => `\`${x}\``).join('\n|  ')}><!${
    1 + x.timestamp.length + x.title.match(/\(.+\)|[^(]+/g).length
}><![](${x.cover})>
[#232527:────── ──  ─]`
        )
        .join('\n')}`
                );
            }
            return true;
        },
        /**
         * @request 637648484979441706
         */
        girls: async() =>
            new Promise((r) =>
                setTimeout(
                    () => term.log(`fetch: girls not detected, no bitches? :megamind:`) || r(),
                    Math.random() * 3e3
                )
            ),
        git: async() => {
            /**
             * @link https://github.com/shinnn/github-username-regex
             */
            let target = 'natasquare',
                type = 'users';
            if (args[1]) target = args[1];
            if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(target)) {
                return term.log('fetch: invalid username');
            }
            if (args[2]) {
                if (!/^[A-Za-z0-9_.-]{1,100}$/g.test(args[2])) {
                    return term.log('fetch: invalid repository name');
                }
                target += '/' + args[2];
                type = 'repos';
            }
            const API = `https://api.github.com/${type}/${target}`;
            let d = await fetch(API);
            d = await d.json();
            if (type === 'users') {
                if (!d.login) return term.log('fetch: user not found');
                term.log(`[#78aad8:󰓹]  ${d.login}${d.bio ? `\n|  ${d.bio}` : ''}
[#232527:────── ──  ─]
[#78aad8:󰀉]  ${d.id}${d.company ? '\n[#78aad8:󰅆]  ' + d.company : ''}${
    d.blog ? '\n[#78aad8:]  ' + d.blog : ''
}${d.location ? '\n[#78aad8:]  ' + d.location : ''}
[#78aad8:]  ${d.public_repos} public repos
[#78aad8:]  ${d.followers} followers
|  ${d.following} following`);
            } else {
                if (!d.name) return term.log('fetch: repository not found');
                term.log(`[#78aad8:󰓹]  ${d.name}${d.description ? '\n|  ' + d.description : ''}
[#232527:────── ──  ─]
[#78aad8:󰓎] ${d.stargazers_count} 󰧟 [#78aad8:󰐠] ${d.watchers_count} 󰧟 [#78aad8:] ${d.forks_count}${
    d.license ? '\n[#78aad8:󰿃]  ' + d.license.name : ''
}${d.language ? '\n[#78aad8:󰈮]  ' + d.language : ''}`);
            }
            return true;
        },
    };
    if (!args[0] || !d[args[0]]) {
        return term.log(
            `fetch: choose an option from this list: \`${Object.keys(d).sort().join('`, `')}\``
        );
    }
    return await d[args[0]]();
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
            'https://15dcbf41-bb8a-45f6-bb32-16be4553f06c.id.repl.co/fuckcors?q=https://last.fm/user/natasquare'
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
                cover = track.querySelector('.cover-art img').src.replace('/64s', ''),
                loved =
                    track
                        .querySelector('.chartlist-loved div')
                        .getAttribute('data-toggle-button-current-state') === 'loved';
            let timestamp = track.querySelector('.chartlist-timestamp span');
            timestamp = [timestamp.title, timestamp.textContent.trim()].filter(Boolean);
            if (timestamp.length === 1)
                timestamp.push(
                    '[A generated JSON playlist](//last.fm/player/station/user/natasquare/library)'
                );

            recent.push({title, artist, cover, timestamp, loved});
        }
    }
    if (!topTrackDiv && !statDiv) return {recent, data};
    data = {};
    if (topTrackDiv) {
        const title = topTrackDiv.querySelector('.featured-item-name').textContent.trim(),
            artist = topTrackDiv.querySelector('.featured-item-artist').textContent.trim(),
            cover = topTrackDiv.querySelector('.cover-art img').src.replace('/64s', '');
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

/**
 * @dedicated 1018304559355006998
 */
const sus = new Audio('assets/amogus.mp3');
commands.sus = async(term) => {
    commands.cat(term, ['/AMOGUS.txt']);
    await sus.play();
};

commands.touch = async(term, args) => {
    if (args[0]) term.d.fs.create(args[0], term.d.dir, [args[0].split('.').at(-1), '']);
    return true;
};

commands.mkdir = async(term, args) => {
    if (args[0]) term.d.fs.create(args[0], term.d.dir, {});
    return true;
};

commands.rm = async(term, args) => {
    if (!args[0]) return term.log('rm: no file specified');
    term.d.fs.remove(args[0], term.d.dir);
    return true;
};

commands.write = async(term, args) => {
    if (!args[0]) return term.log('write: no file specified');
    const read = term.d.fs.read(args[0], term.d.dir);
    if (!read[0]) return term.log('write: is a directory');
    if (!args[1]) return term.log('write: no content specified');
    term.d.fs.remove(args[0], term.d.dir);
    term.d.fs.create(args[0], term.d.dir, [read[0], args[1]]);
    return true;
};

commands.tts = async(term, args) => {
    if (!args[0]) return term.log('tts: nothing to speak');
    const audio = new Audio(
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
            args[0]
        )}&tl=en&client=tw-ob&ttsspeed=1`
    );
    await audio.play();
    return true;
};
