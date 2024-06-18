
function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'));
    if (!kings.some((king) => king.firstChild.classList.contains('white'))) {
      infoDisplay.innerHTML = 'Black player wins!';
      const allSquares = document.querySelectorAll('.square');
      allSquares.forEach((square) =>
        square.firstChild?.setAttribute('draggable', false)
      );
    }
    if (!kings.some((king) => king.firstChild.classList.contains('black'))) {
      infoDisplay.innerHTML = 'White player wins!';
      const allSquares = document.querySelectorAll('.square');
      allSquares.forEach((square) =>
        square.firstChild?.setAttribute('draggable', false)
      );
    }
  }