const gameBoard = document.getElementById('game-board');
const levelSpan = document.getElementById('level');
const timerSpan = document.getElementById('timer');
const messageDiv = document.getElementById('message');

let level = 1;        // Overall level
let cardPairs = 2;    // Starting number of pairs (4 cards)
let subLevel = 1;     // Sublevel for same number of pairs
let timer;
let time = 0;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Your 50 images in /images folder
const cardImages = [
    'images/img1.png','images/img2.png','images/img3.png','images/img4.png','images/img5.png',
    'images/img6.png','images/img7.png','images/img8.png','images/img9.png','images/img10.png',
    'images/img11.png','images/img12.png','images/img13.png','images/img14.png','images/img15.png',
    'images/img16.png','images/img17.png','images/img18.png','images/img19.png','images/img20.png',
    'images/img21.png','images/img22.png','images/img23.png','images/img24.png','images/img25.png',
    'images/img26.png','images/img27.png','images/img28.png','images/img29.png','images/img30.png',
    'images/img31.png','images/img32.png','images/img33.png','images/img34.png','images/img35.png',
    'images/img36.png','images/img37.png','images/img38.png','images/img39.png','images/img40.png',
    'images/img41.png','images/img42.png','images/img43.png','images/img44.png','images/img45.png',
    'images/img46.png','images/img47.png','images/img48.png','images/img49.png','images/img50.png'
];

// Time per sublevel: more pairs = more time
function getTimeLimit(pairs, sub) {
    if(sub === 1) return 0; // no time first sublevel
    let baseTime = pairs * 15; // 15 seconds per pair
    baseTime = baseTime - (sub-2)*5; // reduce 5s per higher sublevel
    return baseTime > 10 ? baseTime : 10; // minimum 10s
}

function startLevel() {
    messageDiv.textContent = '';
    flippedCards = [];
    matchedPairs = 0;

    // Time for this sublevel
    time = getTimeLimit(cardPairs, subLevel);
    timerSpan.textContent = time > 0 ? `Time: ${time}s` : 'Time: ∞';

    // Select required images for pairs
    const numPairs = cardPairs;
    const selectedImages = cardImages.slice(0, numPairs);

    // Duplicate and shuffle
    cards = [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5);

    renderBoard(cards);

    levelSpan.textContent = `Level: ${level} (Pairs: ${cardPairs}, SubLevel: ${subLevel})`;

    // Timer if time > 0
    clearInterval(timer);
    if(time > 0){
        timer = setInterval(()=>{
            time--;
            timerSpan.textContent = `Time: ${time}s`;
            if(time <= 0){
                clearInterval(timer);
                messageDiv.textContent = 'Time Up! Game Over!';
                disableBoard();
            }
        }, 1000);
    }
}

function renderBoard(cardsArray){
    gameBoard.innerHTML = '';
    let cols = Math.ceil(Math.sqrt(cardsArray.length));
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    cardsArray.forEach(imgSrc=>{
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imgSrc;

        const img = document.createElement('img');
        img.src = imgSrc;
        card.appendChild(img);

        card.addEventListener('click', ()=>flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card){
    if(flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if(flippedCards.length === 2) checkMatch();
}

function checkMatch(){
    const [c1, c2] = flippedCards;
    if(c1.dataset.image === c2.dataset.image){
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if(matchedPairs === cards.length/2){
            clearInterval(timer);
            messageDiv.textContent = 'Level Complete!';
            setTimeout(nextLevel, 1500);
        }
    } else {
        setTimeout(()=>{
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
        },1000);
    }
}

function nextLevel(){
    subLevel++;
    if(subLevel > 3){ // max 3 sublevels per card count
        subLevel = 1;
        cardPairs += 1; // increase number of pairs
        if(cardPairs > cardImages.length) {
            messageDiv.textContent = 'Congratulations! You completed all levels!';
            return;
        }
    }
    level++;
    startLevel();
}

function disableBoard(){
    document.querySelectorAll('.card').forEach(card=>{
        card.removeEventListener('click', flipCard);
    });
}

startLevel();
