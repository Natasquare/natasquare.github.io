commands = {};

commands.echo = (term, args) => (term.log(args[0] || ''), true);

commands.cd = (term, args) => {
    let read = term.d.fs.read(args[0], term.d.dir);
    if (!read) return term.log('cd: no such file or directory: ' + args[0]);
    if (read[0]) return term.log('cd: not a directory');
    term.d.dir = term.d.fs.parseRelativePath(args[0] + '/', term.d.dir);
    return true;
};

commands.ls = (term, args) => {
    let target = args[0];
    target ??= '.';
    let read = term.d.fs.read(target, term.d.dir);
    if (!read) return term.log('ls: no such file or directory: ' + target);
    if (read[0]) return term.log('ls: not a directory');
    term.log(Object.entries(read).map(f => (f[1][0] ? '' : '/') + f[0]));
    return true;
};
