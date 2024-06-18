
function changePlayer() {
    if (playerGo === 'black') {
      reverseIds();
      playerGo = 'white';
      playerDisplay.textContent = 'white';
    } else {
      revertIds();
      playerGo = 'black';
      playerDisplay.textContent = 'black';
    }
  }
  
  function reverseIds() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) =>
      square.setAttribute('square-id', width * width - 1 - i)
    );
  }
  
  function revertIds() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => square.setAttribute('square-id', i));
  }