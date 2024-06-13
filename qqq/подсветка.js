function getPossibleMoves(piece, position) {
  const moves = [];
  const row = Math.floor(position / 8);
  const col = position % 8;
  const playerClass = piece.includes('white') ? 'white' : 'black';
  const direction = playerClass === 'white' ? -1 : 1;
  const startRow = playerClass === 'white' ? 6 : 1;

  switch (piece) {
    case 'pawn':
      // Move forward one square
      case 'pawn':
        // Move forward one square
        if (document.querySelector(`[square-id="${position + 8 * direction}"]`)?.innerHTML.trim() === '') {
            moves.push(position + 8 * direction);
            // Move forward two squares if on start row
            if (row === startRow && document.querySelector(`[square-id="${position + 16 * direction}"]`)?.innerHTML.trim() === '') {
              moves.push(position + 16 * direction);
            }
          }
          // Capture diagonally
          if (col < 7 && document.querySelector(`[square-id="${position + 8 * direction + 1}"]`)?.firstChild?.classList.contains(playerClass === 'white' ? 'black' : 'white')) {
            moves.push(position + 8 * direction + 1);
          }
          if (col > 0 && document.querySelector(`[square-id="${position + 8 * direction - 1}"]`)?.firstChild?.classList.contains(playerClass === 'white' ? 'black' : 'white')) {
            moves.push(position + 8 * direction - 1);
          }
          break;
    case 'knight':
      const knightMoves = [
        position + 2 * 8 + 1, position + 2 * 8 - 1,
        position - 2 * 8 + 1, position - 2 * 8 - 1,
        position + 8 + 2, position + 8 - 2,
        position - 8 + 2, position - 8 - 2
      ];
      knightMoves.forEach(move => {
        if (move >= 0 && move < 64 && Math.abs(Math.floor(move / 8) - row) <= 2 && Math.abs(move % 8 - col) <= 2) {
          if (!document.querySelector(`[square-id="${move}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(move);
          }
        }
      });
      break;
    case 'rook':
      for (let i = 1; i < 8; i++) {
        const moveRow = position + i * 8;
        const moveCol = position + i;
        if (moveRow < 64 && document.querySelector(`[square-id="${moveRow}"]`)?.innerHTML.trim() === '') {
          moves.push(moveRow);
        } else {
          if (moveRow < 64 && !document.querySelector(`[square-id="${moveRow}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(moveRow);
          }
          break;
        }
        if (moveCol % 8 !== 0 && document.querySelector(`[square-id="${moveCol}"]`)?.innerHTML.trim() === '') {
          moves.push(moveCol);
        } else {
          if (moveCol % 8 !== 0 && !document.querySelector(`[square-id="${moveCol}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(moveCol);
          }
          break;
        }
      }
      for (let i = 1; i < 8; i++) {
        const moveRow = position - i * 8;
        const moveCol = position - i;
        if (moveRow >= 0 && document.querySelector(`[square-id="${moveRow}"]`)?.innerHTML.trim() === '') {
          moves.push(moveRow);
        } else {
          if (moveRow >= 0 && !document.querySelector(`[square-id="${moveRow}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(moveRow);
          }
          break;
        }
        if (moveCol % 8 !== 7 && document.querySelector(`[square-id="${moveCol}"]`)?.innerHTML.trim() === '') {
          moves.push(moveCol);
        } else {
          if (moveCol % 8 !== 7 && !document.querySelector(`[square-id="${moveCol}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(moveCol);
          }
          break;
        }
      }
      break;
    case 'bishop':
      for (let i = 1; i < 8; i++) {
        const move1 = position + i * 9;
        const move2 = position + i * 7;
        const move3 = position - i * 9;
        const move4 = position - i * 7;
        if (move1 < 64 && move1 % 8 !== 0 && document.querySelector(`[square-id="${move1}"]`)?.innerHTML.trim() === '') {
          moves.push(move1);
        } else {
          if (move1 < 64 && move1 % 8 !== 0 && !document.querySelector(`[square-id="${move1}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(move1);
          }
          break;
        }
        if (move2 < 64 && move2 % 8 !== 7 && document.querySelector(`[square-id="${move2}"]`)?.innerHTML.trim() === '') {
          moves.push(move2);
        } else {
          if (move2 < 64 && move2 % 8 !== 7 && !document.querySelector(`[square-id="${move2}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(move2);
          }
          break;
        }
        if (move3 >= 0 && move3 % 8 !== 0 && document.querySelector(`[square-id="${move3}"]`)?.innerHTML.trim() === '') {
          moves.push(move3);
        } else {
          if (move3 >= 0 && move3 % 8 !== 0 && !document.querySelector(`[square-id="${move3}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(move3);
          }
          break;
        }
        if (move4 >= 0 && move4 % 8 !== 7 && document.querySelector(`[square-id="${move4}"]`)?.innerHTML.trim() === '') {
          moves.push(move4);
        } else {
          if (move4 >= 0 && move4 % 8 !== 7 && !document.querySelector(`[square-id="${move4}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(move4);
          }
          break;
        }
      }
      break;
    case 'queen':
      return [
        ...getPossibleMoves('rook', position),
        ...getPossibleMoves('bishop', position)
      ];
    case 'king':
      const kingMoves = [
        position + 1, position - 1,
        position + 8, position - 8,
        position + 9, position - 9,
        position + 7, position - 7
      ];
      kingMoves.forEach(move => {
        if (move >= 0 && move < 64 && Math.abs(Math.floor(move / 8) - row) <= 1 && Math.abs(move % 8 - col) <= 1) {
          if (!document.querySelector(`[square-id="${move}"]`)?.firstChild?.classList.contains(playerClass)) {
            moves.push(move);
          }
        }
      });
      break;
  }
  return moves;
}
function highlightMoves(moves) {
  const squares = document.querySelectorAll('.square');
  squares.forEach(square => {
    const position = parseInt(square.getAttribute('square-id'));
    if (moves.includes(position)) {
      square.classList.add('possible-move');
    } else {
      square.classList.remove('possible-move');
    }
  });
}

function handlePieceClick(event) {
  const square = event.currentTarget;
  const position = parseInt(square.getAttribute('square-id'));
  const pieceElement = square.firstChild;
  if (pieceElement) {
    const pieceClass = pieceElement.id;
    const moves = getPossibleMoves(pieceClass, position);
    highlightMoves(moves);
  }
}

function initializeBoard() {
  const squares = document.querySelectorAll('.square');
  squares.forEach(square => {
    square.addEventListener('click', handlePieceClick);
  });
}

initializeBoard();
