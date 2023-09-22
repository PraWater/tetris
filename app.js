document.addEventListener('DOMContentLoaded', () =>{
    const width = 10;
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    let timerId;
    let score = 0;

    //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, 2*width+2],
        [1, width+1, 2*width, 2*width+1],
        [width, 2*width, 2*width+1, 2*width+2]
    ]

    const zTetromino = [
        [width+1, width+2, 2*width, 2*width+1],
        [0, width, width+1, 2*width+1],
        [width+1, width+2, 2*width, 2*width+1],
        [0, width, width+1, 2*width+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, 2*width+1, width+2],
        [width, width+1, width+2, 2*width +1],
        [1, width, width+1, 2*width+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, 2*width+1, 3*width+1],
        [width, width+1, width+2, width+3],
        [1, width+1, 2*width+1, 3*width+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let random = Math.floor(Math.random()*theTetrominoes.length);

    let currentPosition = 4;
    let currentRotation = 0;
    let current = theTetrominoes[random][currentRotation];
    let nextRandom = 0;

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    document.addEventListener('keyup', control);

    function control(e) {
        if (e.keyCode === 37) moveLeft()
        else if (e.keyCode === 39) moveRight()
        else if (e.keyCode === 40) moveDown()
        else if (e.keyCode === 38) rotate()
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if(current.some(index => squares[index + currentPosition + width].classList.contains('taken'))) {
            current.forEach(index => squares[index + currentPosition].classList.add('taken'));
            currentPosition = 4;
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => ((index + currentPosition)%10 === 0) || squares[index + currentPosition - 1].classList.contains('taken'));
        if (!isAtLeftEdge) currentPosition -= 1;
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => ((index + currentPosition + 1)%10 === 0) || squares[index + currentPosition + 1].classList.contains('taken'));
        if (!isAtRightEdge) currentPosition += 1;
        draw();
    }

    function rotate() {
        undraw();
        ++currentRotation;
        if (currentRotation === current.length) currentRotation = 0
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    const displaySquares = Array.from(document.querySelectorAll('.mini-grid div'));
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [displayWidth+1, displayWidth+2, 2*displayWidth, 2*displayWidth+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, 2*displayWidth+1, 3*displayWidth+1]
    ];

    function displayShape() {
        displaySquares.forEach(square => square.classList.remove('tetromino'))
        upNextTetrominoes[nextRandom].forEach(index => displaySquares[index].classList.add('tetromino'));
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        else {
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            timerId = setInterval(moveDown, 1000);
            displayShape();
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i +=width) {
            let row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if (row.every(index => squares[index].classList.contains('tetromino'))){
                row.forEach(index => squares[index].classList.remove('taken'));
                row.forEach(index => squares[index].classList.remove('tetromino'));
                score += 10;
                scoreDisplay.innerHTML = score;
                let removedSquares = squares.splice(i, width);
                squares = removedSquares.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }
    function gameOver() {
        if (current.some(index => squares[index+currentPosition].classList.contains('taken'))) {
            score = "Game Over";
            scoreDisplay.innerHTML =score;
            clearInterval(timerId);
            timerId = null;
        }
    }
})

