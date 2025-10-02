const gameBoard = document.getElementById("game-board");
const levelSpan = document.getElementById("level");
const timerSpan = document.getElementById("timer");
const messageDiv = document.getElementById("message");
const targetSpan = document.getElementById("target");
const scoreSpan = document.getElementById("score");

let level = 1;
let score = 0;
let time = 30;
let target = 3;
let timer;
let moleTimeout;

function getLevelSettings(level) {
    const maxColumns = 6; 
    const columns = Math.min(2 + level, maxColumns);
    const rows = Math.ceil((2 + level) / 2);
    const totalHoles = columns * rows;

    return {
        columns,
        rows,
        holes: totalHoles,
        moleTime: Math.max(1200 - (level - 1) * 60, 500),
        target: 3 + (level - 1) * 2,
        totalTime: 30
    };
}

function createBoard(level) {
    gameBoard.innerHTML = "";
    const settings = getLevelSettings(level);

    const holeGrid = document.createElement("div");
    holeGrid.classList.add("hole-grid");
    holeGrid.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;
    holeGrid.style.gridTemplateRows = `repeat(${settings.rows}, 1fr)`;

    // Calculate hole size based on number of columns and rows
    const boardWidth = gameBoard.clientWidth * 0.95;
    const boardHeight = gameBoard.clientHeight * 0.95;

    let holeWidth = boardWidth / settings.columns - (settings.columns - 1) * 6;
    let holeHeight = boardHeight / settings.rows - (settings.rows - 1) * 6;

    let baseHoleSize = Math.min(holeWidth, holeHeight);
    baseHoleSize = Math.max(Math.min(baseHoleSize, 120), 40); // limits

    for (let i = 0; i < settings.holes; i++) {
        const hole = document.createElement("div");
        hole.classList.add("hole");
        hole.style.width = `${baseHoleSize}px`;
        hole.style.height = `${baseHoleSize}px`;

        const mole = document.createElement("img");
        mole.src = "../images/mole.png";
        mole.classList.add("mole");
        mole.style.width = `${baseHoleSize * 0.8}px`; // mole smaller than hole

        hole.appendChild(mole);
        holeGrid.appendChild(hole);
    }

    gameBoard.appendChild(holeGrid);
}

function startGame() {
    const settings = getLevelSettings(level);
    score = 0;
    time = settings.totalTime;
    target = settings.target;

    levelSpan.textContent = `Level: ${level}`;
    scoreSpan.textContent = `Score: ${score}`;
    targetSpan.textContent = `Target: ${target}`;
    timerSpan.textContent = `Time: ${time}s`;
    messageDiv.textContent = "";

    createBoard(level);
    timer = setInterval(updateTimer, 1000);
    popMole();
}

function updateTimer() {
    time--;
    timerSpan.textContent = `Time: ${time}s`;

    if (time < 10) {
        clearInterval(timer);
        clearTimeout(moleTimeout);
        messageDiv.textContent = `❌ Game Over! Time dropped below 10s. Final Score: ${score}`;
        return;
    }

    if (score >= target) {
        clearInterval(timer);
        clearTimeout(moleTimeout);

        if (getLevelSettings(level).columns >= 6) {
            messageDiv.textContent = `🏆 You completed all levels! Final Score: ${score}`;
            return;
        }

        messageDiv.textContent = `🎉 Level ${level} Completed!`;
        level++;
        setTimeout(startGame, 1500);
    }
}

function popMole() {
    const moles = document.querySelectorAll(".mole");
    const mole = moles[Math.floor(Math.random() * moles.length)];
    const settings = getLevelSettings(level);

    mole.classList.add("up");

    mole.onclick = () => {
        if (mole.classList.contains("up")) {
            score++;
            scoreSpan.textContent = `Score: ${score}`;
            mole.classList.remove("up");
        }
    };

    moleTimeout = setTimeout(() => {
        mole.classList.remove("up");
        if (time > 0 && score < target) {
            popMole();
        }
    }, settings.moleTime);
}

startGame();
