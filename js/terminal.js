class Terminal {
    constructor(d) {
        this.d = Object.assign(
            {
                dir: '/',
                fs: {
                    testdir: {
                        testfile: ['TYPE', 'conten adswgqwhyjd']
                    }
                }
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
        let node = typeof a[0] === 'string' ? document.createTextNode(a[0]) : a[0],
            l = this.term.children[this.term.childElementCount - 1];
        (l && l.classList.contains('prompt-result') && !a[0]?.classList?.contains('prompt') ? l : this.term).appendChild(node);
    }
    clear() {
        
    }
    createPrompt() {
        let prompt = document.createElement('form');
        prompt.classList.add('prompt');
        prompt.setAttribute('dir', this.d.dir);
        let input = document.createElement('input');
        input.classList.add('prompt-input');
        prompt.appendChild(input);

        prompt.onsubmit = this.handleInput.bind(this);

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
        this.handleCommand(this.input.value);
        let ne = this.createPrompt();
        this.term.removeChild(this.prompt);
        this.prompt = ne.prompt;
        this.input = ne.input;
        this.log(this.prompt);
        this.input.focus();
    }
    handleCommand(x) {
        this.log('insert output');
        console.log(x);
    }
}
