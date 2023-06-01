/* global $ */
$ = {
    create: (...a) => document.createElement(...a),
    q: (...a) => document.querySelector(...a),
    qa: (...a) => document.querySelectorAll(...a),
    addClass: (e, a) => e.classList.add(...a.split(' '))
};

let wcounter = 0;

/* global terminal, Terminal, commands */
terminal = new Terminal({commands});

const eawh = createDragElement('ntsq@portfolio: /', terminal.term);
terminal.win = eawh;
document.body.append(eawh.e);

$.q('#runt').onclick = () => {
    terminal = new Terminal({commands});

    const termel = createDragElement('ntsq@portfolio: /', terminal.term);
    terminal.win = termel;
    document.body.append(termel.e);
};

$.qa('.button').forEach((x) =>
    x.addEventListener('click', () => {
        x.classList.add('button-click');
        setTimeout(() => x.classList.remove('button-click'), 200); // too lazy to change this to the css var
    })
);

function createDragElement(name = 'unnamed', content) {
    const dpos = [0, 0, 0, 0],
        rpos = [0, 0, 0, 0];

    content ??= $.create('div');

    const el = $.create('div'),
        header = $.create('div'),
        close = $.create('span'),
        max = $.create('span'),
        resize = $.create('div');

    el.style.setProperty('--starting-width', `calc(${name.length}ch + 74px + 2em)`); // gotta love hardcoding
    el.style.zIndex = ++wcounter;

    $.addClass(el, 'window window-movable');

    $.addClass(header, 'header');
    $.addClass(close, 'fas fa-window-close close');
    $.addClass(max, 'far fa-window-maximize max');

    $.addClass(resize, 'resize');

    $.addClass(content, 'content');

    el.onmousedown = () => focus(el);

    function setName(ne) {
        name = ne;
        focus(el);
        header.innerHTML = name;
        header.append(max, close);
    }

    function focus(w, full) {
        $.qa('.window').forEach((x) => x.classList.remove('window-active'));
        $.addClass(w, 'window-active');
        if (full) {
            w.classList.add('window-transitioning');
            const rm = w.classList.contains('window-full');
            if (rm) w.classList.remove('window-full');
            else $.addClass(w, 'window-full');
            setTimeout(() => w.classList.remove('window-transitioning'), 200);
        }
        if (Number(w.style.zIndex) < wcounter) w.style.zIndex = ++wcounter;
        if (document.title !== name) document.title = name;
    }

    el.style.top = el.style.left =
        Math.floor(
            (Math.random() *
                Math.min(
                    document.documentElement.clientWidth,
                    document.documentElement.clientHeight
                )) /
                10 +
                10
        ) + 'px';

    setName(name);

    close.onclick = () => {
        el.style.opacity = 0;
        setTimeout(() => document.body.removeChild(el), 200);
    };
    max.onclick = () => {
        focus(el, true);
    };

    el.append(header, resize, content);

    header.onmousedown = (e) => {
        e = e || window.event;
        e.preventDefault();
        dpos[3] = e.clientX;
        dpos[4] = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        dpos[1] = dpos[3] - e.clientX;
        dpos[2] = dpos[4] - e.clientY;
        dpos[3] = e.clientX;
        dpos[4] = e.clientY;
        el.style.top = el.offsetTop - dpos[2] + 'px';
        el.style.left = el.offsetLeft - dpos[1] + 'px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    resize.onmousedown = (e) => {
        e = e || window.event;
        e.preventDefault();
        rpos[3] = 0;
        rpos[4] = 0;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementResize;
    };

    function elementResize(e) {
        e = e || window.event;
        e.preventDefault();
        const width = el.offsetWidth,
            height = el.offsetHeight;

        rpos[1] = e.clientX - width - el.offsetLeft;
        rpos[2] = e.clientY - height - el.offsetTop;

        el.style.width = width + rpos[1] + 'px';
        el.style.height = height + rpos[2] + 'px';
    }

    return {e: el, header, content, close, name, setName};
}
