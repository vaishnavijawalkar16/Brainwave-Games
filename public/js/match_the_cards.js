const gameBoard = document.getElementById('game-board');
const levelSpan = document.getElementById('level');
const timerSpan = document.getElementById('timer');
const messageDiv = document.getElementById('message');

let level = 1;
let cardPairs = 2; 
let timer;
let time = 0;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

const cardImages = [
  '../../images/apple.jpg','../../images/ball.jpg','../../images/bee.jpg','../../images/book.jpg','../../images/boy.jpg',
  '../../images/bulb.jpg','../../images/car.jpg','../../images/cherry.jpg','../../images/clock.jpg','../../images/controller.jpg',
  '../../images/cow.jpg','../../images/dog1.jpg','../../images/dog2.jpg','../../images/duck.jpg','../../images/elephant1.jpg',
  '../../images/elephant2.jpg','../../images/fish.jpg','../../images/flower.jpg','../../images/fox.jpg','../../images/frog.jpg',
  '../../images/giraffe.jpg','../../images/girl.jpg','../../images/horse.jpg','../../images/umbrella.jpg','../../images/guitar2.jpg',
  '../../images/open_box.jpg','../../images/carrybag2.jpg','../../images/football.jpg','../../images/giant_air_balloon.jpg','../../images/wall_clock.jpg',
  '../../images/camera.jpg','../../images/key.jpg','../../images/letter.jpg','../../images/guitar1.jpg','../../images/closed_box.jpg',
  '../../images/bag.jpg','../../images/carrybag.jpg','../../images/rose.jpg','../../images/monitor.jpg','../../images/monkey.jpg',
  '../../images/owl.jpg','../../images/panda.jpg','../../images/pig.jpg','../../images/sunflower.jpg','../../images/teddybear.jpg',
  '../../images/tiger.jpg','../../images/tulip.jpg','../../images/watermelon.jpg','../../images/whack_the_mole_m.jpg','../../images/whack_the_mole_w.jpg',
  '../../images/white_flower.jpg','../../images/rabbit.jpg','../../images/sheep.jpg','../../images/ship.jpg','../../images/star.jpg',
  '../../images/sun.jpg'
];

// Time logic: more pairs → more time, but difficulty grows
function getTimeLimit(level, pairs) {
    if (level === 1) return 0; // no time for first level
    let base = pairs * 15;     // base time grows with pairs
    let penalty = Math.floor(level / 2) * 3; // every 2 levels, reduce by 3s
    let final = base - penalty;
    return final > 8 ? final : 8; // never go below 8 seconds
}

function startLevel() {
    messageDiv.textContent = '';
    flippedCards = [];
    matchedPairs = 0;

    time = getTimeLimit(level, cardPairs);
    timerSpan.textContent = time > 0 ? `Time: ${time}s` : 'Time: ∞';

    const shuffledImages = [...cardImages].sort(() => Math.random() - 0.5);
    const selectedImages = shuffledImages.slice(0, cardPairs);

    // Duplicate for pairs and shuffle
    cards = [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5);

    renderBoard(cards);

    levelSpan.textContent = `Level: ${level} (Pairs: ${cardPairs})`;

    clearInterval(timer);
    if (time > 0) {
        timer = setInterval(() => {
            time--;
            timerSpan.textContent = `Time: ${time}s`;
            if (time <= 0) {
                clearInterval(timer);
                messageDiv.textContent = '⏳ Time Up! Game Over!';
                disableBoard();
            }
        }, 1000);
    }
}

function renderBoard(cardsArray) {
    gameBoard.innerHTML = '';
    const cols = Math.ceil(Math.sqrt(cardsArray.length));
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    cardsArray.forEach(imgSrc => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imgSrc;

        const img = document.createElement('img');
        img.src = imgSrc;
        card.appendChild(img);

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.image === c2.dataset.image) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cards.length / 2) {
            clearInterval(timer);
            messageDiv.textContent = '🎉 Level Complete!';
            setTimeout(nextLevel, 1200);
        }
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
        }, 800);
    }
}

function nextLevel() {
    level++;

    if (level <= 3) {
        // Levels 1–3 always have 2 pairs (4 cards), just shorter times
        cardPairs = 2;
    } else {
        // From level 4 onwards, increase card pairs every 2 levels
        if (level % 2 === 0) {
            cardPairs++;
        }
    }

    // Prevent exceeding available images
    if (cardPairs > cardImages.length) {
        messageDiv.textContent = '🏆 Congratulations! You completed all levels!';
        return;
    }

    startLevel();
}

function disableBoard() {
    document.querySelectorAll('.card').forEach(card => {
        card.style.pointerEvents = "none";
    });
}

startLevel();
