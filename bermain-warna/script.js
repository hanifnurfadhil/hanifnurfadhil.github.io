const darkButton = document.getElementById("dark");
darkButton.addEventListener("click", function () {
  const rDark = 26;
  const gDark = 26;
  const bDark = 29;
  document.body.style.backgroundColor =
    "rgb(" + rDark + "," + gDark + "," + bDark + ")";
  document.body.style.color = "#e0d9d9";
  redText.innerHTML = rDark;
  greenText.innerHTML = gDark;
  blueText.innerHTML = bDark;
  sRed.value = rDark;
  sGreen.value = gDark;
  sBlue.value = bDark;
});

const lightButton = document.getElementById("light");
lightButton.addEventListener("click", function () {
  const rLight = 224;
  const gLight = 217;
  const bLight = 217;
  document.body.style.backgroundColor =
    "rgb(" + rLight + "," + gLight + "," + bLight + ")";
  document.body.style.color = "#1a1a1d";
  redText.innerHTML = rLight;
  greenText.innerHTML = gLight;
  blueText.innerHTML = bLight;
  sRed.value = rLight;
  sGreen.value = gLight;
  sBlue.value = bLight;
});

const randomButton = document.getElementById("randomButton");
randomButton.addEventListener("click", function () {
  rRandom = Math.round(Math.random() * 255 + 1);
  gRandom = Math.round(Math.random() * 255 + 1);
  bRandom = Math.round(Math.random() * 255 + 1);
  const randomColor = "rgb(" + rRandom + "," + gRandom + "," + bRandom + ")";
  document.body.style.backgroundColor = randomColor;
  redText.innerHTML = rRandom;
  greenText.innerHTML = gRandom;
  blueText.innerHTML = bRandom;
  sRed.value = rRandom;
  sGreen.value = gRandom;
  sBlue.value = bRandom;
});

const redText = document.querySelector(".red");
const sRed = document.querySelector("input[name=sRed]");
sRed.addEventListener("input", function () {
  const r = sRed.value;
  const g = sGreen.value;
  const b = sBlue.value;
  document.body.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
  redText.innerHTML = sRed.value;
});

const greenText = document.querySelector(".green");
const sGreen = document.querySelector("input[name=sGreen]");
sGreen.addEventListener("input", function () {
  const r = sRed.value;
  const g = sGreen.value;
  const b = sBlue.value;
  document.body.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
  greenText.innerHTML = sGreen.value;
});

const blueText = document.querySelector(".blue");
const sBlue = document.querySelector("input[name=sBlue]");
sBlue.addEventListener("input", function () {
  const r = sRed.value;
  const g = sGreen.value;
  const b = sBlue.value;
  document.body.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
  blueText.innerHTML = sBlue.value;
});
