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
            term.log(`  ${data.discord_user.username}#${data.discord_user.discriminator}
────── ──  ─
  ID
|  ${data.discord_user.id}
  Status
|  ${data.discord_status[0].toUpperCase() + data.discord_status.slice(1)} (${
    ['web', 'mobile', 'desktop']
        .filter((x) => data[`active_on_discord_${x}`])
        .join(' - ') || 'Probably sleeping'
})
  Activit${data.activities.length > 1 ? 'ies' : 'y'}
${
    data.activities
        .map(
            (x) =>
                `|  ${
                    [
                        '  Playing',
                        '󰑋  Streaming',
                        '  Listening to',
                        '󰑈  Watching',
                        ' ',
                        '  Competing in'
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
            term.log(`  ${getBrowser()}
────── ──  ─
󰔃  Screen
|    Size
|  | ${screen.width}x${screen.height}
|    Color depth
|  | ${screen.colorDepth} bits
󰞂  Navigator
|  󰆘  Cookies
|  | ${navigator.cookieEnabled ? 'Enabled' : 'Disabled'}
|    User agent
|  | ${navigator.userAgent
        .match(/\(.+\)|.+? +?/g)
        .map((x) => x.trim())
        .join('\n|  | ')}
|    Language
|  | ${navigator.language}`)
    };
    if (!args[0] || !d[args[0]]) return term.log('fetch: choose between `browser` and `discord`');
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
