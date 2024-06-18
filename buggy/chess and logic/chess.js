const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');
const width = 8;
let playerGo = 'black';
playerDisplay.textContent = 'black';
const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    rook, knight, bishop, queen, king, bishop, knight, rook
]
function createBoard() {
  startPieces.forEach((startPieces, i) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.innerHTML = startPieces;
    square.firstChild?.setAttribute('draggable', true);
    square.setAttribute('square-id', i);
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
    } else {
      square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
    }
    if (i <= 15) {
      square.firstChild.firstChild.classList.add('black');
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add('white');
    }
    gameBoard.append(square);
  });
}
createBoard();

const allSquares = document.querySelectorAll('.square');

let startPositionId;
let draggedELement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedELement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();
  const correctGo = draggedELement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains('piece');
  const valid = checkIfValid(e.target);
  const opponentGo = playerGo === 'white' ? 'black' : 'white';
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
  if (correctGo) {
    if (takenByOpponent && valid) {
      const takenPieceId = e.target.id;
      console.log(`${takenByOpponent} сюда смотри`)
      const pieceValue = pieceValues[takenPieceId];
      if (playerGo === 'black') {
        moneyBlack += pieceValue;
        updateMoney('moneyBlack', moneyBlack);
      } else if (playerGo === 'white') {
        moneyWhite += pieceValue;
        updateMoney('moneyWhite', moneyWhite);
      }

      e.target.parentNode.append(draggedELement);
      e.target.remove();
      checkForWin();
      changePlayer();
      return;
    }
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = 'Сюда нельзя ходить!';
      setTimeout(() => (infoDisplay.textContent = ''), 2000);
      return;
    }
    if (valid) {
      e.target.append(draggedELement);
      checkForWin();
      changePlayer();
      return;
    }
  }
}



let kingHasMoved = false;

const checkClearPathRook = (startId, targetId, step) => {
  for (let i = 1; i < Math.abs((targetId - startId) / step); i++) {
    if (
      document.querySelector(`[square-id="${startId + i * step}"]`).firstChild
    ) {
      return false;
    }
  }
  return true;
};

const checkClearPathBishop = (startId, targetId, width) => {
  const startX = startId % width;
  const startY = Math.floor(startId / width);
  const targetX = targetId % width;
  const targetY = Math.floor(targetId / width);

  if (Math.abs(targetX - startX) !== Math.abs(targetY - startY)) {
    return false;
  }

  const stepX = targetX > startX ? 1 : -1;
  const stepY = targetY > startY ? width : -width;

  let currentId = startId + stepX + stepY;
  while (currentId !== targetId) {
    if (document.querySelector(`[square-id="${currentId}"]`).firstChild) {
      return false;
    }
    currentId += stepX + stepY;
  }

  return true;
};

// ходы фигур
function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute('square-id')) ||
    Number(target.parentNode.getAttribute('square-id'));
  const startId = Number(startPositionId);
  const piece = draggedELement.id;

  console.log('Checking validity for piece:', piece);
  console.log('Start position:', startId);
  console.log('Target position:', targetId);

  switch (piece) {
    case 'pawn':
      if (
        (startId + width === targetId &&
          !document.querySelector(`[square-id="${targetId}"]`).firstChild) ||
        (starterRow.includes(startId) &&
          startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${targetId}"]`).firstChild) ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;
    case 'knight':
      if (
        targetId === startId + width * 2 + 1 ||
        targetId === startId + width * 2 - 1 ||
        targetId === startId + width + 2 ||
        targetId === startId + width - 2 ||
        targetId === startId - width * 2 + 1 ||
        targetId === startId - width * 2 - 1 ||
        targetId === startId - width + 2 ||
        targetId === startId - width - 2
      ) {
        return true;
      }
      break;
    case 'bishop':
      if (
       //Диагональные перемещения (с верхнего левого угла в нижний правый)
        (startId - width * 7 - 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 6 - 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 5 - 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 4 - 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 3 - 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 2 - 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width - 1 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
         //Диагональные перемещения (сверху справа в низ слева)
        (startId - width * 7 + 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 6 + 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 5 + 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 4 + 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 3 + 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 2 + 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width + 1 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
         //Диагональные перемещения (снизу-слева в верх-право)
        (startId + width * 7 - 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 6 - 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 5 - 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 4 - 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 3 - 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 2 - 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width - 1 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        //Диагональные перемещения (справа снизу в верх слева)
        (startId + width * 7 + 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 6 + 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 5 + 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 4 + 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 3 + 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 2 + 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width + 1 === targetId &&
          checkClearPathBishop(startId, targetId, width))
      ) {
        return true;
      }
      break;

    case 'rook':
      if (
        // Вертикальные движения вверх
        (startId % width === targetId % width &&
          startId - width * 7 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 6 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 5 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 4 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 3 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 2 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        // Вертикальные движения вниз
        (startId % width === targetId % width &&
          startId + width * 7 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 6 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 5 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 4 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 3 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 2 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        // Горизонтальные движения вправо
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 7 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 6 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 5 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 4 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 3 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 2 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 1 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        // Горизонтальные движения влево
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 7 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 6 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 5 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 4 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 3 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 2 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
          checkClearPathRook(startId, targetId, -1)
      ) {
        return true;
      }
    case 'queen':
      if (
        //Диагональные перемещения (с верхнего левого угла в нижний правый)
        (startId - width * 7 - 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 6 - 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 5 - 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 4 - 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 3 - 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 2 - 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width - 1 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        //Диагональные перемещения (сверху справа в низ слева)
        (startId - width * 7 + 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 6 + 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 5 + 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 4 + 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 3 + 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width * 2 + 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId - width + 1 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        //Диагональные перемещения (снизу-слева в верх-право)
        (startId + width * 7 - 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 6 - 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 5 - 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 4 - 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 3 - 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 2 - 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width - 1 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        //Диагональные перемещения (справа снизу в верх слева)
        (startId + width * 7 + 7 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 6 + 6 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 5 + 5 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 4 + 4 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 3 + 3 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width * 2 + 2 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        (startId + width + 1 === targetId &&
          checkClearPathBishop(startId, targetId, width)) ||
        // Вертикальные движения вверх
        (startId % width === targetId % width &&
          startId - width * 7 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 6 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 5 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 4 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 3 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 2 === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width === targetId &&
          checkClearPathRook(startId, targetId, -width)) ||
        // Вертикальные движения вниз
        (startId % width === targetId % width &&
          startId + width * 7 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 6 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 5 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 4 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 3 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 2 === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width === targetId &&
          checkClearPathRook(startId, targetId, width)) ||
        // Горизонтальные движения вправо
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 7 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 6 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 5 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 4 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 3 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 2 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 1 === targetId &&
          checkClearPathRook(startId, targetId, 1)) ||
        // Горизонтальные движения влево
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 7 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 6 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 5 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 4 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 2 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 3 === targetId &&
          checkClearPathRook(startId, targetId, -1)) ||
          checkClearPathRook(startId, targetId, -1)
      ) {
        return true;
      }
      break;
    case 'king':
      if (
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width + 1 === targetId ||
        startId + width - 1 === targetId ||
        startId - width + 1 === targetId ||
        startId - width - 1 === targetId
      ) {
        if (playerGo === "black") {
        kingHasMoved = true;
        }
        return true;
      }

      if (kingHasMoved === false) {
        // Правая рокировка
        if (
          startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
        ) {
          let rookStartId = startId + 3;
          let rookTargetId = startId + 1;
          let rook = document.querySelector(
            `[square-id="${rookStartId}"]`
          ).firstChild;
          document
            .querySelector(`[square-id="${rookStartId}"]`)
            .removeChild(rook);
          document
            .querySelector(`[square-id="${rookTargetId}"]`)
            .appendChild(rook);

          kingHasMoved = true;
          return true;
        }

        // Левая рокировка
        if (
          startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
        ) {
          let rookStartId = startId - 4;
          let rookTargetId = startId - 1;
          let rook = document.querySelector(
            `[square-id="${rookStartId}"]`
          ).firstChild;
          document
            .querySelector(`[square-id="${rookStartId}"]`)
            .removeChild(rook);
          document
            .querySelector(`[square-id="${rookTargetId}"]`)
            .appendChild(rook);

          kingHasMoved = true;
          return true;
        }
      }
      break;
  }
  return false;
}
