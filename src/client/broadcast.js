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
    let li = document.createElement("li");
    li.innerHTML = broadcast;
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
