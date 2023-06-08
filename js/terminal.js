/* global TERM_HISTORY */
TERM_HISTORY = [];
class Terminal {
    constructor(d) {
        this.d = Object.assign(
            {
                dir: '/',
                fs: new FS({
                    personal: {
                        'about.txt': [
                            'txt',
                            `I'm Natasquare. I like learning new things and making cool stuff.
I'm a programmer, but I procrastinate a lot. Besides, I'm also a progammer and a huge music fan.`,
                        ],
                        'links.md': [
                            'txt/md',
                            `[Github](//github.com/Natasquare/)
[Discord](//discord.com/users/696698254770831421)
[Wakatime](//wakatime.com/@ntsq)
[Last.fm](//www.last.fm/user/natasquare)
[Rickroll](//www.youtube.com/watch?v=dQw4w9WgXcQ)`,
                        ],
                        'skills.md': [
                            'txt/md',
                            `+------------+-------------+
|   **[#78aad8:Skills]**   |  **[#78aad8:Rating/10]**  |
+------------+-------------+
| JavaScript | NaN         |
| HTML       | 6u!joq      |
| CSS        |         7   |
|            | ++++++++++  |
| Brainfuck  | [->+++++<]  |
|            | >+++.       |
| Typescript | TS1112      |
| What am I  | doing with  |
| my life    | right now   |
| Lua        | nvim config |
+------------+-------------+`,
                        ],
                    },
                    'AMOGUS.txt': [
                        'txt',
                        `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠟⠉⠉⠉⠉⠉⠉⠉⠙⠻⢶⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡟⠀⣠⣶⠛⠛⠛⠛⠛⠛⠳⣦⡀⠀⠘⣿⡄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠁⠀⢹⣿⣦⣀⣀⣀⣀⣀⣠⣼⡇⠀⠀⠸⣷⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡏⠀⠀⠀⠉⠛⠿⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀⣿⡄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⠀
⠀⠀⠀⠀⠀⠀⠀⢸⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⠀
⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀
⠀⠀⠀⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀
⠀⠀⠀⠀⠀⠀⢰⣿⠀⠀⠀⠀⣠⡶⠶⠿⠿⠿⠿⢷⣦⠀⠀⠀⠀⠀⠀⠀⣿⠀
⠀⠀⣀⣀⣀⠀⣸⡇⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⣿⠀
⣠⡿⠛⠛⠛⠛⠻⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⠀⠀⠀⣿⠀
⢻⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡟⠀⠀⢀⣤⣤⣴⣿⠀⠀⠀⠀⠀⠀⠀⣿⠀
⠈⠙⢷⣶⣦⣤⣤⣤⣴⣶⣾⠿⠛⠁⢀⣶⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣆⡀⠀⠀⠀⠀⠀⠀⢀⣠⣴⡾⠃⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⢿⣿⣾⣿⡿⠿⠟⠋⠁⠀⠀⠀`,
                    ],
                }),
                commands: {},
                scrollIndex: 0,
            },
            d
        );
        this.term = document.createElement('div');
        this.init();
    }

    init() {
        const {prompt, input} = this.createPrompt();

        this.prompt = prompt;
        this.input = input;

        this.term.classList.add('content', 'terminal');
        this.log(this.prompt);
    }

    log(...a) {
        if (a.length > 1) return a.forEach((x) => this.log(x));
        const br = document.createElement('br'),
            node = a[0] instanceof Element ? a[0] : this.parseMd(a[0]),
            l = this.term.children[this.term.childElementCount - 1],
            target =
                l && l.classList.contains('prompt-result') && !a[0]?.classList?.contains('prompt')
                    ? l
                    : this.term;
        target.appendChild(node);
        if (!(a[0] instanceof Element)) target.appendChild(br);
    }

    parseMd(md) {
        const RULES = [
                [
                    /&lt;!(.*?)&gt;&lt;([^]*?)&gt;/g,
                    '<div class="inline-block" style="--block-height:$1em">$2</div>',
                ],
                [/\*\*(.*?)\*\*/g, '<strong>$1</strong>'],
                [/\*(.*?)\*/g, '<em>$1</em>'],
                [/`(.*?)`/g, '<code>$1</code>'],
                [/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">'],
                [/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>'],
                [/__(.*?)__/g, '<span class="underline">$1</span>'],
                [/~~(.*?)~~/g, '<span class="strikethrough">$1</span>'],
                [/\[(#[0-9abcdef]{3,8}):(.*?)\]/g, '<span style="color:$1">$2</span>'],
                [/&lt;center&gt;([^]*?)&lt;\/center&gt;/g, '<div class="center">$1</div>'],
            ],
            div = document.createElement('div');
        let txt = encodeHtml(md);
        for (const rule of RULES) {
            txt = txt.replace(rule[0], rule[1]);
        }
        div.innerHTML = txt;
        return div;
    }

    clear() {
        const parent = this.term.parentNode;
        parent.removeChild(this.term);
        this.term = document.createElement('div');
        this.init();
        parent.appendChild(this.term);
    }

    createPrompt() {
        const prompt = document.createElement('form');
        prompt.classList.add('prompt', 'prompt-caret');
        prompt.setAttribute('dir', this.d.dir);
        const input = document.createElement('input');
        input.classList.add('prompt-input');
        prompt.appendChild(input);

        prompt.onsubmit = async(...a) => await this.handleInput(...a);
        input.onselectionchange = () => {
            const pos = [input.selectionStart, input.selectionEnd],
                len = pos[1] - pos[0];
            let addBack;
            prompt.classList.remove('prompt-caret');
            if (pos[0] === input.value.length || len === 0) {
                // no other choices
                clearTimeout(addBack);
                addBack = setTimeout(() => prompt.classList.add('prompt-caret'), 1);
            }

            // ok i have NO CLUE why but removing the +0px misalign the caret
            prompt.style.setProperty('--selection-pos', `calc(${pos[0]}ch + 0px)`);
            prompt.style.setProperty('--selection-length', (len || 1) + 'ch');
        };
        input.onkeydown = (e) => {
            if (
                ['ArrowUp', 'ArrowDown'].indexOf(e.key) === -1 ||
                e.ctrlKey ||
                e.altKey ||
                e.metaKey ||
                e.shiftKey
            ) {
                return;
            }
            e.preventDefault();
            const scrollIndex = this.d.scrollIndex;
            this.d.scrollIndex = Math.max(
                Math.min(scrollIndex + (e.key === 'ArrowUp' ? -1 : 1), TERM_HISTORY.length - 1),
                0
            );
            input.value = TERM_HISTORY[this.d.scrollIndex];
        };

        return {prompt, input};
    }

    async handleInput(e) {
        e.preventDefault();
        this.prompt.onsubmit = (e) => e.preventDefault();
        if (this.input.value.trim()) {
            TERM_HISTORY.push(this.input.value);
            this.d.scrollIndex = TERM_HISTORY.length;
        }
        const wrapped = document.createElement('div'),
            {prompt, input} = this.createPrompt();
        input.value = this.input.value;
        input.disabled = true;
        wrapped.appendChild(prompt);
        wrapped.classList.add('prompt-result');
        wrapped.style.display = 'none';
        this.log(wrapped);
        const handled = await this.handleCommand(this.input.value),
            ne = this.createPrompt();
        wrapped.style.display = 'block';
        this.term.removeChild(this.prompt);
        this.prompt = ne.prompt;
        this.input = ne.input;
        if (!handled) wrapped.classList.add('error');
        if (handled === 'warn') wrapped.classList.add('warn');
        this.log(this.prompt);
        this.input.focus();
    }

    async handleCommand(x) {
        if (!x.trim()) return true;
        const args = this.parse(x);
        let res;
        for (let i = 0; i < args.data.length; ++i) {
            const d = args.data[i],
                m = args.multiple[i],
                cmd = this.d.commands[d[0]];
            if (!cmd) return this.log(`${d[0]}: command not found`);
            this.win.setName(d.join(' '));
            res = await cmd(this, d.slice(1));
            if (!args.data[i + 1] || (m === '&' && !res)) break;
        }
        this.win.setName(`ntsq@portfolio: ${this.d.dir}`);
        return res;
    }

    parse(str) {
        str = str.trim();
        const r = [],
            QUOTES = ['"', "'"];
        let more = false,
            multiple = false,
            reading = false,
            escaped = false,
            chunk = '';
        for (let i = 0; i < str.length; ++i) {
            const char = str[i];
            if (char === ' ' && !reading) {
                r.push(chunk);
                chunk = '';
            } else {
                if (char === '\\' && !escaped) {
                    escaped = true;
                    continue;
                } else if (
                    QUOTES.includes(char) &&
                    !escaped &&
                    (reading ? reading === char : true)
                ) {
                    if (!reading) reading = char;
                    else reading = false;
                } else if (['&', '|'].includes(char) && !escaped) {
                    if (i + 1 > str.length || str[i + 1] !== char) {
                        chunk += char;
                        continue;
                    }
                    multiple = char;
                    more = this.parse(str.slice(i + 2));
                    break;
                } else chunk += char;
                escaped = false;
            }
        }
        if (!reading && !escaped && chunk) r.push(chunk);
        return {
            data: more ? [].concat([r], more.data) : [r],
            multiple: more ? [].concat([multiple], more.multiple) : [multiple],
        };
    }
}

class FS {
    constructor(fs = {}) {
        this.fs = fs;
    }

    read(path, from = '/') {
        path = this.parseRelativePath(path, from);
        if (!path) return;
        if (path === '/') return this.fs;
        path = path.replace(/^\/?(.*?)\/?$/, '$1').split('/');
        let cur = this.fs;
        for (const part of path) {
            if (part in cur) cur = cur[part];
            else return;
        }
        return cur;
    }

    parseRelativePath(path, cur) {
        let abs = {};
        try {
            abs = new URL(path, 'http://f.s' + cur);
        } catch {}
        return abs.pathname;
    }
}

function encodeHtml(html) {
    const div = document.createElement('div'),
        node = document.createTextNode(html);
    div.append(node);
    return div.innerHTML;
}
