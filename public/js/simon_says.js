let gameSeq = [];
let userSeq = [];

let btns = ["yellow","red","green","purple"];

let started = false;
let level = 0;
let highestScore = 0;

let h2 = document.querySelector("h2");

document.addEventListener("keypress",function(){
    if (started == false){
        console.log("Game started");
        started = true;

        setTimeout(levelUp, 500); 
    }
});

// Start game on touch for mobile/tablet
document.addEventListener("touchstart", function() {
    if (!started) {
        console.log("Game started via touch");
        started = true;

        setTimeout(levelUp, 500);
    }
}, { once: true }); // ensures it only triggers once


function levelUp(){
    userSeq = [];
    level++;
    h2.innerHTML=`Level ${level}`;

    let randomIdx = Math.floor(Math.random() * btns.length);
    let randomColor = btns[randomIdx];
    let randbtn = document.querySelector(`.${randomColor}`);
    // console.log(randomIdx);
    // console.log(randomColor);
    // console.log(randbtn);
    gameSeq.push(randomColor);
    btnFlash(randbtn);
}
function checkAns(idx){
    if(userSeq[idx] === gameSeq[idx]){
        if (userSeq.length == gameSeq.length){
            setTimeout(levelUp,1000);
        }
    }else{
        h2.innerHTML = `Game over : Your score was <b>${level}</b><br>Press any key to start`;
        document.querySelector("body").style.backgroundColor='red';
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor='white';
        },1000);
        checkHighestScore();
        reset();
    }
}

function btnFlash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    },250);
}

function btnPress(){
    let btn = this;
    btnFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length-1); 
}

let allBtns = document.querySelectorAll(".btn");

for (btn of allBtns){
    btn.addEventListener("click",btnPress);
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

function checkHighestScore(){
    if (highestScore < level ){
        highestScore = level;
    }
    document.querySelector("h3").innerHTML = `Highest Score : ${highestScore}`;
}

function changeText(event, link) {
            link.textContent = link.textContent + " (clicked)";
            // Let the browser continue navigation after a short delay
            setTimeout(() => {
                window.location.href = link.getAttribute("href");
            }, 200);
            event.preventDefault(); // prevent immediate navigation
}