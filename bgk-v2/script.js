function getCom() {
  com = Math.random();
  if (com < 0.34) {
    com = "batu";
    comPic.setAttribute("src", "img/" + com + ".png");
    return com;
  } else if (com < 0.67) {
    com = "gunting";
    comPic.setAttribute("src", "img/" + com + ".png");
    return com;
  } else {
    com = "kertas";
    comPic.setAttribute("src", "img/" + com + ".png");
    return com;
  }
}

function acakAnimate() {
  const pic = ["batu", "gunting", "kertas"];
  let i = 0;
  const interval = setInterval(() => {
    comPic.setAttribute("src", "img/" + pic[i] + ".png");
    i++;
    if (i == pic.length) {
      i = 0;
    }
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
    getCom();
  }, 1000);
}

function reset() {
  comPic.setAttribute("src", "img/question.png");
  pPic.setAttribute("src", "img/question.png");
}

function updateResult(result) {
  infoHasil.innerHTML = result;
}

function updateScore(scoreP, scoreC) {
  scorePlayerInfo.innerHTML = scoreP;
  scoreComInfo.innerHTML = scoreC;
}

function disableButton() {
  pBatu.style.pointerEvents = "none";
  pGunting.style.pointerEvents = "none";
  pKertas.style.pointerEvents = "none";
  pBatu.style.opacity = "0.5";
  pGunting.style.opacity = "0.5";
  pKertas.style.opacity = "0.5";
}

function enableButton() {
  pBatu.style.pointerEvents = "auto";
  pGunting.style.pointerEvents = "auto";
  pKertas.style.pointerEvents = "auto";
  pBatu.style.opacity = "1";
  pGunting.style.opacity = "1";
  pKertas.style.opacity = "1";
}

const infoHasil = document.querySelector(".info-area");
const scorePlayerInfo = document.querySelector(".score-p");
const scoreComInfo = document.querySelector(".score-c");
const comPic = document.querySelector(".comPic");
const pPic = document.querySelector(".pPic");
const pBatu = document.querySelector(".batu");

let scoreP = 0;
let scoreC = 0;

pBatu.addEventListener("click", function () {
  let player = "batu";
  pPic.setAttribute("src", "img/" + player + ".png");
  acakAnimate();
  disableButton();
  setTimeout(() => {
    if (player === com) {
      result = "SERI!";
      updateResult(result);
    } else if (com === "gunting") {
      result = "MENANG!";
      updateResult(result);
      scoreP++;
      updateScore(scoreP, scoreC);
    } else if (com === "kertas") {
      result = "KALAH!";
      updateResult(result);
      scoreC++;
      updateScore(scoreP, scoreC);
    }
  }, 1050);

  setTimeout(() => {
    infoHasil.innerHTML = "NEXT";
    infoHasil.classList.toggle("animate-bounce");
  }, 2500);
});

const pGunting = document.querySelector(".gunting");
pGunting.addEventListener("click", function () {
  let player = "gunting";
  pPic.setAttribute("src", "img/" + player + ".png");
  acakAnimate();
  disableButton();
  setTimeout(() => {
    if (player === com) {
      result = "SERI!";
      updateResult(result);
    } else if (com === "kertas") {
      result = "MENANG!";
      updateResult(result);
      scoreP++;
      updateScore(scoreP, scoreC);
    } else if (com === "batu") {
      result = "KALAH!";
      updateResult(result);
      scoreC++;
      updateScore(scoreP, scoreC);
    }
  }, 1050);
  setTimeout(() => {
    infoHasil.innerHTML = "NEXT";
    infoHasil.classList.toggle("animate-bounce");
  }, 2500);
});

const pKertas = document.querySelector(".kertas");
pKertas.addEventListener("click", function () {
  let player = "kertas";
  pPic.setAttribute("src", "img/" + player + ".png");
  acakAnimate();
  disableButton();
  setTimeout(() => {
    if (player === com) {
      result = "SERI!";
      updateResult(result);
    } else if (com === "batu") {
      result = "MENANG!";
      updateResult(result);
      scoreP++;
      updateScore(scoreP, scoreC);
    } else if (com === "gunting") {
      result = "KALAH!";
      updateResult(result);
      scoreC++;
      updateScore(scoreP, scoreC);
    }
  }, 1050);

  setTimeout(() => {
    infoHasil.innerHTML = "NEXT";
    infoHasil.classList.toggle("animate-bounce");
  }, 2500);
});

infoHasil.addEventListener("click", function () {
  infoHasil.classList.toggle("animate-bounce");
  infoHasil.innerHTML = "---";
  reset();
  enableButton();
});
