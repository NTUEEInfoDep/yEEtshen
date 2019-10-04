const Utils = require('../shared/utils');

const broadcastBoard = document.getElementById('broadcast-board');
const ul = broadcastBoard.children[0]; // The <ul> element

export function setBroadcastBoardHidden(hidden) {
  if (hidden) {
    broadcastBoard.classList.add('hidden');
  } else {
    broadcastBoard.classList.remove('hidden');
  }
}

export function addBroadcast(broadcasts) {
  // Note: `liInterval` MUST be the multiple of `dx`
  const liInterval = 35; // The distance between two <li> elements
  const dx = 1; // The distance to move down in every interval

  for (let broadcast of broadcasts) {
    const { playerName, beKilledName } = broadcast;
    // Create <li> element
    let li = document.createElement("li");
    const playerNameBold = document.createElement('b');
    playerNameBold.textContent = playerName;
    const beKilledNameBold = document.createElement('b');
    beKilledNameBold.textContent = beKilledName;
    li.appendChild(playerNameBold);
    li.appendChild(document.createTextNode(" is killed by "));
    li.appendChild(beKilledNameBold);
    li.appendChild(document.createTextNode("."));

    li.topNum = 0; // The variable that store "style.top" in type of Number
    ul.insertBefore(li, ul.firstChild);

    for (let i = 1; i < ul.children.length; i++) {
      const child = ul.children[i];
      child.style.top = child.topNum.toString() + "px";

      // move down
      setTimeout(moveDown, 10);

      function moveDown() {
        child.topNum += dx;
        child.style.top = child.topNum.toString() + "px";
        if (child.topNum % liInterval !== 0) {
          setTimeout(moveDown, 10);
        }
      }
    }
  }

  // After 10 seconds, delete the <li> element
  for (let i = 0; i < broadcasts.length; i++) {
    setTimeout(function() {
      ul.removeChild(ul.lastChild);
    }, 10000);
  }
}
