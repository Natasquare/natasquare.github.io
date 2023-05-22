strt = Date.now();
sgame = send = sin = 0;
sdir = 'right';

escape = (x) => x?.replace(/</g, '&lt;')?.replace(/>/g, '&gt;')?.replace(/"/g, '&quot;');
unescape = (x) =>
    x
        ?.replace(/&lt;/g, '<')
        ?.replace(/&gt;/g, '>')
        ?.replace(/&quot;/g, '"');

imgs = [];

for (const i of $('.icons i')) i.onclick = () => (location.href = '');
for (const i of ['logo.png', 'h.gif']) {
    const img = new Image();
    img.src = 'assets/' + i;
    img.onload = () => imgs.push(img);
}

timeCon = (n) => {
    const s = (i) => (i === 1 ? '' : 's'),
        res = [],
        d = {
            min: 6e4,
            hour: 36e5,
            day: 864e5
        };
    if (n < d.min) return `${(n / 1e3).toFixed(1)} sec${s(~~(n / 1e3))}`;
    const days = Math.trunc(n / d.day);
    if (days > 0) {
        res.push(days + ` day${s(days)},`);
        n -= days * d.day;
    }
    const hours = Math.trunc(n / d.hour);
    if (hours > 0) {
        res.push(hours + ` hour${s(hours)},`);
        n -= hours * d.hour;
    }
    const mins = Math.trunc(n / d.min);
    if (mins > 0) {
        res.push(mins + ` min${s(mins)},`);
        n -= mins * d.min;
    }
    return res.join(' ').slice(0, -1);
};

input = document.querySelector('input');
input.oninput = (e) => {
    let k = e.data?.[e.data.length - 1];
    if (k && sgame) sdir = k === 'w' ? 'up' : k === 's' ? 'down' : k === 'a' ? 'left' : k === 'd' ? 'right' : sdir;
    input.style.width = `${input.value.length}ch`;
};
document.onclick = (e) => {
    if (e.composedPath().includes(document.querySelector('.header'))) return;
    input.focus();
};

cache = [0, 0];
setInterval(() => {
    const cursor = document.querySelector('.cursor'),
        cur = [input.selectionStart, input.selectionEnd];
    if (cache.some((x, i) => x !== cur[i])) {
        cache = cur;
        cursor.style.animation = 'none';
        cursor.offsetHeight;
        cursor.style.animation = null;
        cursor.innerHTML = '&nbsp;'.repeat(cur[1] - cur[0] || 1);
        cursor.style.left = `calc(${cur[0] + 3 + path.length}ch + 15px)`;
    }
}, 1000);

path = '/';
f = (p) => p?.replace(/^\//, '~');
terminal = {};
scrollIndex = -1;

terminal.log = (text, safe = true) => {
    if (!text) return;
    text = safe ? document.createTextNode(text) : text.replace(/\/bl\/(.*?)\/b\//g, '<span style="color: var(--main)">$1</span>');
    $('.display').append(text);
};
terminal.clear = () => $('.display').text('');

lg = (value) => {
    const div = document.createElement('div');
    div.innerHTML = `<span class="path">${f(path)}</span> $ <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" autofocus="" style="width: ${value.length}ch;" value="${escape(value)}" disabled>`;
    $('.display').append(div);
};

fs = {
    '/': ['about.txt', 'contact.txt', 'images', 'skills.txt'],
    '/images': ['logo.png', 'me.jpg']
};

types = {
    folders: ['images'],
    files: ['about.txt', 'contact.txt', 'skills.txt', 'logo.png', 'me.jpg']
};

content = {
    'about.txt': `I'm Natasquare, a random unbased dude you usually see on the internet.
I like learning new things and making cool stuff. I'm a developer, but I also like to play games and watch anime.
My interests in programming are mostly in the backend, but I also like to code the frontend.
I'm currently learning... I'm not even sure right now, but I like to make things with Javascript or Node.js best.
Besides programming, I'm also an artist and a huge music fan.`,
    'contact.txt': `You can contact me on Discord: <a href="https://discord.com/users/696698254770831421">Natasquare#8297</a>, or on Twitter: <a href="https://twitter.com/natasquare_">@natasquare_</a>.
You can also find me on GitHub: <a href="//github.com/Natasquare">Natasquare</a> and contact me by email: <a href="mailto:nat.devvv@gmail.com">nat.devvv@gmail.com</a>.`,
    'skills.txt': `+------------+-------------+
|  /bl/Language/b/  | /bl/Skill level/b/ |
+------------+-------------+
| Node.js    | Strong      |
| Javascript | Proficient  |
| HTML5      | Proficient  |
| CSS3       | Proficient  |
| Typescript | Competent   |
| Dart       | Competent   |
| Svelte     | Beginner    |
+------------+-------------+`
};

isValidPath = (path) => {
    if (!path) return false;
    if (path === '/') return true;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.endsWith('/')) path = path.slice(0, -1);
    if (path.split('/').every((x) => Object.values(types).flat(Infinity).includes(x))) return true;
    return false;
};

parsePath = (pth) => {
    if (pth === '..') {
        if (path === '/') return '/';
        pth = path.split('/').slice(0, -1).join('/');
    } else if (pth === '.') pth = path;
    if (!isValidPath(pth)) return false;
    if (pth.startsWith('/')) return pth;
    return path + '/' + pth;
};

cmds = [];

commands = [
    {
        name: 'cat',
        execute: (args) => {
            if (!args[0]) return;
            let pth = parsePath(args[0]),
                split = pth?.split?.('/') || [],
                dir = split[split.length - 2] || '/',
                file = split[split.length - 1];
            if (!pth || !file || !fs[dir.startsWith('/') ? dir : '/' + dir]?.includes(file)) return terminal.log('cat: no such file or directory: ' + args[0]);
            if (!types.files.includes(file)) return terminal.log('cat: read error: is a directory');
            if (file.endsWith('.txt')) return terminal.log(content[file], false);
            file = file === 'me.jpg' ? 'h.gif' : file;
            const img = imgs.find((x) => x.src.includes(file));
            open('', '_blank', `toolbar=no,scrollbars=no,resizable=no,width=${img.width / 3 - 4.6},height=${img.height / 3 - 10.3},left=${visualViewport.width / 2 + img.width / 6},top=${visualViewport.height / 2 - img.height / 6}`).document.write(`<head><title>ntsq@portfolio: ${f(pth)}</title><link rel="icon" href="//${location.host}/assets/icon.png" /></head><body style="overflow:hidden;background-color:#101215;margin:0"><img src="//${location.host}/assets/${file}" width="${img.width / 3}" height="${img.height / 3}" /></body>`);
        }
    },
    {
        name: 'cd',
        execute: (args) => {
            const pth = parsePath(args[0] || path);
            if (!pth) return terminal.log('cd: no such file or directory: ' + args[0]);
            if (types.files.includes(pth.slice(pth.lastIndexOf('/') + 1))) return terminal.log('cd: not a directory');
            path = pth;
        }
    },
    {
        name: 'clear',
        execute: terminal.clear
    },
    {
        name: 'date',
        execute: () => terminal.log(new Date().toLocaleString())
    },
    {
        name: 'dir',
        execute: (args) => commands.find((x) => x.name === 'ls').execute(args)
    },
    {
        name: 'echo',
        execute: (args) => {
            let str = args
                .join(' ')
                .replace(/\$USER/g, 'ntsq')
                .replace(/\$(PATH|PWD)/g, path)
                .replace(/\$HOME/g, '/');
            if ((str.split('"').length - str.split('\\"').length) % 2) return terminal.log('echo: syntax error: unterminated quote string');
            terminal.log(
                str
                    .match(/(?<!\\)".*?(?<!\\)"/g)
                    ?.map((x) => x.slice(1, -1)?.replace(/\\"/g, '"'))
                    ?.join(' ') || str
            );
        }
    },
    {
        name: 'exit',
        execute: () => (location.href = '')
    },
    {
        name: 'help',
        execute: () => terminal.log('Available commands:\n' + commands.map((x) => x.name).join(', '))
    },
    {
        name: 'history',
        execute: (args) => {
            terminal.log(
                cmds
                    .reverse()
                    .map((x, i) => `${(i + 1).toString().padEnd(cmds.length.toString().length)}  ${x}`)
                    .slice(cmds.length - (Number(args[0]) || cmds.length))
                    .join('\n')
            );
            cmds.reverse();
        }
    },
    {
        name: 'ls',
        execute: (args) => {
            const dir = parsePath(args[0] || path.slice(1) || '/'),
                files = fs[dir],
                name = dir.slice(dir.lastIndexOf('/') + 1);
            if (!dir || (!files && types.folders.includes(name))) return terminal.log('ls: No such file or directory: ' + args[0]);
            if (types.files.includes(name)) return terminal.log(name);
            terminal.log(
                files
                    .sort((a, b) => {
                        const c = (x) => types.folders.includes(x);
                        if (c(a) && c(b)) return a < b ? -1 : 1;
                        if (c(a)) return -1;
                        if (c(b)) return 1;
                        return a < b ? -1 : 1;
                    })
                    .map((x) => (types.files.includes(x) ? x : `/bl/${x}/b/`))
                    .join('<br>'),
                false
            );
        }
    },
    {
        name: 'neofetch',
        execute: () =>
            terminal.log(
                `/bl/              %%%%%%%%%/b/
/bl/              %%%%%%%%%/b/
/bl/#             %%%%%%%%%/b/   <span style="text-decoration:underline">/bl/ntsq/b/@/bl/portfolio/b/</span>
/bl/%%#           %%%%%%%%%   Host:/b/ ${location.host}
/bl/%%%%%         %%%%%%%%%   OS:/b/ ${navigator.userAgentData.platform}
/bl/%%%%%%%       %%%%%%%%%   Resolution:/b/ ${screen.width}x${screen.height}
/bl/%%%%%%%%%     %%%%%%%%%   Shell:/b/ ntsq-wb
/bl/%%%%%%%%%     %%%%%%%%%   Theme:/b/ ntsq
/bl/%%%%%%%%%       %%%%%%%   Uptime:/b/ ${timeCon(Date.now() - strt)}
/bl/%%%%%%%%%         %%%%%   License:/b/ MIT
/bl/%%%%%%%%%           ,%%   Author:/b/ Natasquare
/bl/%%%%%%%%%/b/ 
/bl/%%%%%%%%%/b/`,
                false
            )
    },
    {
        name: 'pwd',
        execute: () => terminal.log(path.slice(1) || path)
    },
    {
        name: 'snake',
        execute: () => {
            $('.command-line').css('opacity', '0');
            terminal.clear();
            sgame = new Snake(15, 15, {
                head: '<span class="snake-head">&#9608;&#9608;</span>',
                body: '<span class="snake-body">&#9608;&#9608;</span>',
                food: '<span class="snake-food">&#9608;&#9608;</span>',
                empty: '<span class="snake-empty">&#9608;&#9608;</span>'
            });
            sin = setInterval(() => {
                terminal.clear();
                if ((!sgame.move(sdir) && sdir) || send) {
                    terminal.log(`snake: game over, score: /bl/${sgame.score}/b/`, false);
                    clearInterval(sin);
                    $('.command-line').css('opacity', '1');
                    input.value = '';
                    input.style.width = '1ch';
                    return (sgame = 0);
                }
                terminal.log(`score: /bl/${sgame.score}/b/\n${sgame.getBoard()}`, false);
            }, 200);
        }
    },
    {
        name: 'sudo',
        execute: (args) => {
            const [cmd, ...argv] = args,
                command = commands.find((x) => x.name === cmd);
            if (!command && cmd) return terminal.log(`sudo: ${args[0]}: command not found`);
            if (command) command.execute(argv);
        }
    },
    {
        name: 'whoami',
        execute: () => terminal.log('ntsq')
    }
];

document.onkeydown = (e) => {
    const apb = 'abcdefghijklmnopqrstuvwxyz'.split('');
    if (!['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key) && !(e.ctrlKey && apb.includes(e.key))) return;
    if (e.key === 'Enter') {
        let err;
        const value = input.value.trim();
        cmds.unshift(value);
        scrollIndex = -1;
        input.value = '';
        input.style.width = '1ch';
        const [cmd, ...args] = value.split(' '),
            command = commands.find((x) => x.name === cmd);
        if (!command && cmd) err = cmd + ': not found';
        lg(value);
        if (command) command.execute(args);
        if (err) terminal.log(err);
        $('.command-line .path').text(f(path));
        $('.header .path').text(f(path));
        $('title').text('ntsq@portfolio: ' + f(path));
    } else if (e.ctrlKey && apb.includes(e.key)) {
        if (e.key === 'c' && sgame) send = true;
        e.preventDefault();
        input.value += '^' + e.key.toUpperCase();
        input.style.width = input.value.length + 'ch';
        if (e.key === 'c') {
            scrollIndex = -1;
            lg(input.value);
            input.value = '';
            input.style.width = '1ch';
        }
    } else {
        e.preventDefault();
        scrollIndex = Math.max(Math.min(scrollIndex + e.key === 'ArrowUp' ? 1 : -1, cmds.length - 1), 0);
        input.value = cmds[scrollIndex];
        input.style.width = `${input.value.length || 1}ch`;
    }
};

terminal.log(
    `        _               
 _ __  | |_  ___   __ _ 
| '_ \\ | __|/ __| / _\` |
/bl/| | | || |_ \\__ \\| (_| |/b/
|_| |_| \\__||___/ \\__, |
                     |_|

Hii! I'm /bl/Natasquare/b/, and this is my portfolio.
You can type /bl/"help"/b/ to see all commands.
Copyright © 2022 Natasquare.`,
    false
);
