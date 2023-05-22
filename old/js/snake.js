class Snake {
    constructor(width, height, emojis) {
        this.emojis = emojis;
        this.size = [width, height];
        this.snake = [{x: ~~(width / 2), y: ~~(height / 2)}];
        this.food = {x: 0, y: 0};
        this.score = 0;
        this.board = new Array(width * height).fill(0);
        this.generateFood();
    }
    getBoard() {
        let board = '';
        for (let y = 0; y < this.size[1]; y++) {
            for (let x = 0; x < this.size[0]; x++) {
                if (this.snake.find((s) => s.x == x && s.y == y)) board += this.snake[0].x == x && this.snake[0].y == y ? this.emojis.head : this.emojis.body;
                else if (this.food.x == x && this.food.y == y) board += this.emojis.food;
                else board += this.emojis.empty;
            }
            board += '\n';
        }
        return board;
    }
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.size[0]),
            y: Math.floor(Math.random() * this.size[1])
        };
        while (this.snake.some((x) => x.x === this.food.x && x.y === this.food.y)) this.generateFood();
    }
    move(direction) {
        const head = this.snake[0];
        const next = {
            x: head.x,
            y: head.y
        };
        if (direction === 'left') {
            let nx = next.x - 1;
            if (nx < 0) nx = this.size[0] - 1;
            next.x = nx;
        } else if (direction === 'right') {
            let nx = next.x + 1;
            if (nx > this.size[0] - 1) nx = 0;
            next.x = nx;
        } else if (direction === 'up') {
            let ny = next.y - 1;
            if (ny < 0) ny = this.size[1] - 1;
            next.y = ny;
        } else if (direction === 'down') {
            let ny = next.y + 1;
            if (ny > this.size[1] - 1) ny = 0;
            next.y = ny;
        }
        if (this.snake.some((x) => x.x === next.x && x.y === next.y)) return false;
        this.snake.unshift(next);
        if (this.food.x === next.x && this.food.y === next.y) {
            this.score++;
            this.generateFood();
        }
        if (this.snake.length - 1 > this.score) this.snake.pop();
        return true;
    }
}
