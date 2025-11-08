const inputPlayer = document.querySelector(".inputPlayerName");
const playerArea = document.querySelector(".playerArea");
const addPlayerButton = document.querySelector(".addPlayerButton");
const cardList = document.querySelector(".cardList");
const reset = document.querySelector(".reset");

function addPlayerElement(player) {
  const box = document.createElement("div");
  box.className = "box flex-none h-15 w-25 bg-amber-300 rounded-lg";
  const nameDiv = document.createElement("div");
  nameDiv.className = "pName text-center text-xs mt-0.5";
  nameDiv.textContent = player;
  pointDiv = document.createElement("div");
  pointDiv.className = "points text-center text-2xl mt-1";
  pointDiv.textContent = "0";
  box.append(nameDiv, pointDiv);
  playerArea.append(box);
}

cardList.addEventListener("click", function (e) {
  for (let i = 0; i <= 60; i++) {
    if (e.target.classList.contains("card" + i)) {
      const addPoint = document.querySelector(".addPoint");
      let p = parseInt(addPoint.innerHTML);
      p = p + i;
      addPoint.innerHTML = p;
    }
  }
});

inputPlayer.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    const player = inputPlayer.value;
    addPlayerElement(player);
    inputPlayer.value = "";
  }
});

addPlayerButton.addEventListener("click", function () {
  const player = inputPlayer.value;
  addPlayerElement(player);
  inputPlayer.value = "";
});

playerArea.addEventListener("click", function (e) {
  if (e.target.classList.contains("points")) {
    e.target.parentElement.classList.toggle("border-2");
    e.target.classList.toggle("addPoint");
  }
});

reset.addEventListener("click", function () {
  const point = document.querySelectorAll(".points");
  for (let i = 0; i < point.length; i++) {
    point[i].innerHTML = 0;
  }
});
