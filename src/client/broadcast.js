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
  for (let broadcast of broadcasts) {
    let li = document.createElement("li");
    li.innerHTML = broadcast;
    ul.insertBefore(li, ul.firstChild);
  }

  // After 10 seconds, delete the <li> element
  for (let i = 0; i < broadcasts.length; i++) {
    setTimeout(function() {
      ul.removeChild(ul.lastChild);
    }, 10000);
  }
}
