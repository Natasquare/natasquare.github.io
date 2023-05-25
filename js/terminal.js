class Terminal {
    constructor(d) {
        this.d = Object.assign(
            {
                dir: '/',
                fs: new FS({
                    testdir: {
                        testfile: ['TYPE', 'conten adswgqwhyjd']
                    }
                }),
                commands: {}
            },
            d
        );
        this.term = document.createElement('div');
        this.init();
    }
    init() {
        let {prompt, input} = this.createPrompt();

        this.prompt = prompt;
        this.input = input;

        this.term.classList.add('content', 'terminal');
        this.log(this.prompt);
    }
    log(...a) {
        if (a.length > 1) return a.forEach((x) => this.log(x));
        let node = a[0] instanceof Element ? a[0] : document.createTextNode(a[0]),
            l = this.term.children[this.term.childElementCount - 1];
        (l && l.classList.contains('prompt-result') && !a[0]?.classList?.contains('prompt') ? l : this.term).appendChild(node);
    }
    clear() {
        let parent = this.term.parentNode;
        parent.removeChild(this.term);
        this.term = document.createElement('div');
        this.init();
        parent.appendChild(this.term);
    }
    createPrompt() {
        let prompt = document.createElement('form');
        prompt.classList.add('prompt', 'prompt-caret');
        prompt.setAttribute('dir', this.d.dir);
        let input = document.createElement('input');
        input.classList.add('prompt-input');
        prompt.appendChild(input);

        prompt.onsubmit = this.handleInput.bind(this);
        input.onselectionchange = () => {
            let pos = [input.selectionStart, input.selectionEnd],
                len = pos[1] - pos[0],
                addBack;
            prompt.classList.remove('prompt-caret');
            if (pos[0] === input.value.length || len === 0) {
                // no other choices
                clearTimeout(addBack);
                addBack = setTimeout(() => prompt.classList.add('prompt-caret'), 1);
            }

            // ok i have NO CLUE why but removing the +0px misalign the caret
            prompt.style.setProperty('--selection-pos', `calc(${pos[0]}ch + 0px)`);
            prompt.style.setProperty('--selection-length', (len ? len : 1) + 'ch');
        };

        return {prompt, input};
    }
    handleInput(e) {
        e.preventDefault();
        let wrapped = document.createElement('div'),
            {prompt, input} = this.createPrompt();
        input.value = this.input.value;
        input.disabled = true;
        wrapped.appendChild(prompt);
        wrapped.classList.add('prompt-result');
        this.log(wrapped);
        let handled = this.handleCommand(this.input.value),
            ne = this.createPrompt();
        this.term.removeChild(this.prompt);
        this.prompt = ne.prompt;
        this.input = ne.input;
        if (!handled) wrapped.classList.add('error');
        if (handled === 'warn') wrapped.classList.add('warn');
        this.log(this.prompt);
        this.input.focus();
    }
    handleCommand(x) {
        let args = this.parse(x),
            cmd = this.d.commands[args[0]];
        if (!cmd) return terminal.log(`${args[0]}: command not found`);
        return cmd(this, args.slice(1));
    }
    parse(str) {
        let r = [],
            reading = false,
            escaped = false,
            chunk = '';
        const QUOTES = ['"', "'"];
        for (let i = 0; i < str.length; ++i) {
            let char = str[i];
            if (char === ' ' && !reading) {
                r.push(chunk);
                chunk = '';
            } else {
                if (char === '\\' && !escaped) {
                    escaped = true;
                    continue;
                } else if (QUOTES.includes(char) && !escaped && (reading ? reading === char : true)) {
                    if (!reading) reading = char;
                    else reading = false;
                } else chunk += char;
                escaped = false;
            }
        }
        if (!reading && !escaped) r.push(chunk);
        return r;
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
