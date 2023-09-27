document.addEventListener('DOMContentLoaded', () =>{
    const width = 10;
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    let borders = Array.from(document.querySelectorAll('#border'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    let timerId;
    let score = 0;

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

    const colours = ["#0F6CF2", "#EB0045", "#B231F0", "#3DCA31", "#21CDFF"];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let random = Math.floor(Math.random()*theTetrominoes.length);

    let currentPosition = 4;
    let currentRotation = 0;
    let current = theTetrominoes[random][currentRotation];
    let nextRandom = 0;

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colours[random];
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = "";
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
        [displayWidth + 1, 2*displayWidth + 1, 3*displayWidth + 1, displayWidth + 2],
        [2*displayWidth+1, 2*displayWidth + 2, displayWidth + 2, 3*displayWidth+1],
        [2*displayWidth + 1, 3*displayWidth, 3*displayWidth + 1, 3*displayWidth + 2],
        [3*displayWidth + 1, 3*displayWidth + 2, 2*displayWidth + 1, 2*displayWidth+2],
        [1, displayWidth+1, 2*displayWidth+1, 3*displayWidth+1]
    ];

    function displayShape() {
        displaySquares.forEach(square => square.classList.remove('tetromino'))
        displaySquares.forEach(square => square.style.backgroundColor = '')
        upNextTetrominoes[nextRandom].forEach(index => displaySquares[index].classList.add('tetromino'));
        upNextTetrominoes[nextRandom].forEach(index => displaySquares[index].style.backgroundColor = colours[nextRandom]);
    }

    startBtn.addEventListener('click', () => {
        if (startBtn.innerHTML === "Start") {
            squares.forEach(square => {
                square.classList.remove('tetromino');
                square.classList.remove('taken');
                square.style.backgroundColor = "";
            })

            score = 0;
            scoreDisplay.innerHTML = score;

            borders.forEach(square => {square.classList.add('taken')});
        }
        if (timerId) {
            startBtn.innerHTML = "Resume";
            clearInterval(timerId);
            timerId = null;
        }
        else {
            startBtn.innerHTML = "Pause";
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
                row.forEach(index => squares[index].style.backgroundColor = "");
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
            startBtn.innerHTML = "Start";
        }
    }
})

