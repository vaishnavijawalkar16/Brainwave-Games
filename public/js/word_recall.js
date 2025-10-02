let message = document.querySelector("#message");
let timerSpan = document.querySelector("#timer");
let levelSpan = document.querySelector("#level");
let gameBoard = document.querySelector("#game-board");

let allWords = [];
let selectedWords = [];
let viewTime;
let recallTime;
let level = 1;
let wordsCount = 3;
let recallInterval;

fetch("../images/words.txt")
  .then(response => response.text())
  .then(data => {
    allWords = data.split("\n").map(word => word.trim()).filter(Boolean);
    startLevel();
  })
  .catch(error => console.error("Error loading dataset:", error));

function getTime(wordsCount){
    let baseViewTime = 8;
    let baseRecallTime = 5;
    let minViewTime = 3;
    let minRecallTime = 2;
    viewTime = Math.max(baseViewTime - (wordsCount - 3) * 0.5, minViewTime);
    recallTime = Math.max(baseRecallTime - (wordsCount - 3) * 0.3, minRecallTime) * wordsCount;
    return [viewTime, recallTime];
}

function startLevel(){
    clearInterval(recallInterval);
    message.textContent = '';
    let shuffled = [...allWords].sort(() => Math.random() - 0.5);
    selectedWords = shuffled.slice(0, wordsCount);
    [viewTime, recallTime] = getTime(wordsCount);
    levelSpan.textContent = `Level: ${level} (Words: ${wordsCount})`;
    startViewTimer(selectedWords, viewTime);
}

function startViewTimer(words, duration){
    gameBoard.innerHTML = '';
    const cols = Math.ceil(Math.sqrt(words.length));
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    words.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.textContent = word;
        gameBoard.appendChild(wordDiv);
    });

    let timeLeft = Math.ceil(duration);
    timerSpan.textContent = `View Time: ${timeLeft}s`;
    let viewInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = `View Time: ${timeLeft}s`;
        if(timeLeft <= 0){
            clearInterval(viewInterval);
            displayRecallInput(words);
        }
    }, 1000);
}

function displayRecallInput(words){
    gameBoard.innerHTML = '';
    let recallOptions = [...words];
    let distractors = allWords.filter(w => !words.includes(w));
    distractors.sort(() => Math.random() - 0.5);
    recallOptions.push(...distractors.slice(0, words.length));
    recallOptions.sort(() => Math.random() - 0.5);

    document.querySelector("#task").textContent = `Select the words you saw:`;

    recallOptions.forEach(word => {
        const btn = document.createElement('button');
        btn.textContent = word;
        btn.className = 'recall-word';
        btn.onclick = () => handleRecallClick(btn, words);
        gameBoard.appendChild(btn);
    });

    let timeLeft = Math.ceil(recallTime);
    timerSpan.textContent = `Recall Time: ${timeLeft}s`;
    recallInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = `Recall Time: ${timeLeft}s`;
        if(timeLeft <= 0){
            clearInterval(recallInterval);
            endGame(false, "Time's up!");
        }
    }, 1000);
}

function handleRecallClick(btn, correctWords){
    if(btn.classList.contains('selected')) return; // prevent double click
    if(correctWords.includes(btn.textContent)){
        btn.classList.add('selected');
        btn.style.borderColor = "green";
        // check if all correct words selected
        let selectedCorrect = Array.from(document.querySelectorAll('.recall-word.selected'))
                                   .map(b => b.textContent);
        if(selectedCorrect.length === correctWords.length){
            clearInterval(recallInterval);
            message.textContent = "Correct! Moving to next level";
            level++;
            wordsCount++;
            setTimeout(startLevel, 1500);
        }
    } else {
        btn.style.borderColor = "red";
        clearInterval(recallInterval);
        endGame(false, `Game Over! You selected a wrong word. You reached level ${level}`);
    }
}

function endGame(success, msg){
    message.textContent = msg;
    gameBoard.innerHTML = '';
    timerSpan.textContent = '';
    levelSpan.textContent = '';
}
