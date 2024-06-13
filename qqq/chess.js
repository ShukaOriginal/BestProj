const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');
const width = 8;
let playerGo = 'black';
playerDisplay.textContent = 'black';
const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
let moneyWhite = 100;
const prices = {
  pawn: 3,
  rook: 7,
  knight: 5,
  bishop: 5,
  queen: 11,
};
let moneyBlack = 100;
//--
// prettier-ignore
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
//создание доски с фигурами gameboard
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
highlightMoves
const allSquares = document.querySelectorAll('.square');

function spawnPiece(piece) {
  let emptySquare = [...allSquares].find((square) => !square.innerHTML.trim());
  if (playerGo == 'white') {
    emptySquare = [...allSquares]
      .reverse()
      .find((square) => !square.innerHTML.trim());
  }

  if (!emptySquare) {
    alert('Нет свободных клеток.');
    return;
  }

  if (playerGo === 'black') {
    if (moneyBlack < prices[piece]) {
      alert('нет хватает:(');
      return;
    }
    moneyBlack -= prices[piece];
    updateMoney('moneyBlack', moneyBlack);
 }

  else if (playerGo === 'white') {
    if (moneyWhite < prices[piece]) {
      alert('нет хватает:(');
      return;
    }
    moneyWhite -= prices[piece];
    updateMoney('moneyWhite', moneyWhite);
  }
  function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedELement = e.target;
  }

  const tempDiv = document.createElement('div');
  let pieceContent;

  if (piece === 'pawn') {
    pieceContent = pawn;
  } else if (piece === 'rook') {
    pieceContent = rook;
  } else if (piece === 'knight') {
    pieceContent = knight;
  } else if (piece === 'bishop') {
    pieceContent = bishop;
  } else if (piece === 'queen') {
    pieceContent = queen;
  } else {
    alert('Неверный тип фигуры.');
    return;
  }

  tempDiv.innerHTML = pieceContent;
  const pieceElement = tempDiv.firstChild;
  pieceElement.setAttribute('draggable', true);
  pieceElement.classList.add('piece');
  emptySquare.appendChild(pieceElement);

  if (playerGo === 'black') {
    emptySquare.firstChild.firstChild.classList.add('black');
  } else if (playerGo === 'white') {
    emptySquare.firstChild.firstChild.classList.add('white');
  }
}
function updateMoney(elementId, amount) {
  document.getElementById(elementId).textContent = amount;
}
// Добавляем обработчики событий для кнопок
document
  .getElementById('spawn-pawn')
  .addEventListener('click', () => spawnPiece('pawn'));
document
  .getElementById('spawn-rook')
  .addEventListener('click', () => spawnPiece('rook'));
document
  .getElementById('spawn-knight')
  .addEventListener('click', () => spawnPiece('knight'));
document
  .getElementById('spawn-bishop')
  .addEventListener('click', () => spawnPiece('bishop'));
document
  .getElementById('spawn-queen')
  .addEventListener('click', () => spawnPiece('queen'));

//индифмкатор ходов что выводит в консоль БРАУЗЕРА

allSquares.forEach((square) => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
});

let startPositionId;
let draggedELement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedELement = e.target;
}

//перетаскивание фигур

function dragOver(e) {
  e.preventDefault();
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
      e.target.parentNode.append(draggedELement);
      e.target.remove();
      checkForWin();
      changePlayer();
      return;
    }
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = 'you cannot go here!';
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
let rookHasMoved = { left: false, right: false };

// при абстракции переименуй функцию
const checkClearPath = (startId, targetId, step) => {
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
        // Diagonal moves (top-left to bottom-right)
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
        // Diagonal moves (top-right to bottom-left)
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
        // Diagonal moves (bottom-left to top-right)
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
        // Diagonal moves (bottom-right to top-left)
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
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 6 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 5 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 4 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 3 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 2 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        // Вертикальные движения вниз
        (startId % width === targetId % width &&
          startId + width * 7 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 6 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 5 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 4 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 3 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 2 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width === targetId &&
          checkClearPath(startId, targetId, width)) ||
        // Горизонтальные движения вправо
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 7 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 6 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 5 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 4 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 3 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 2 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 1 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        // Горизонтальные движения влево
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 7 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 6 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 5 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 4 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 3 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 2 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        Math.floor(startId / width) ===
          Math.checkClearPath(startId, targetId, -1)
      ) {
        rookHasMoved = true;
        return true;
      }
    case 'queen':
      if (
        // Diagonal moves (top-left to bottom-right)
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
        // Diagonal moves (top-right to bottom-left)
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
        // Diagonal moves (bottom-left to top-right)
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
        // Diagonal moves (bottom-right to top-left)
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
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 6 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 5 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 4 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 3 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width * 2 === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        (startId % width === targetId % width &&
          startId - width === targetId &&
          checkClearPath(startId, targetId, -width)) ||
        // Вертикальные движения вниз
        (startId % width === targetId % width &&
          startId + width * 7 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 6 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 5 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 4 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 3 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width * 2 === targetId &&
          checkClearPath(startId, targetId, width)) ||
        (startId % width === targetId % width &&
          startId + width === targetId &&
          checkClearPath(startId, targetId, width)) ||
        // Горизонтальные движения вправо
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 7 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 6 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 5 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 4 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 3 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 2 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId + 1 === targetId &&
          checkClearPath(startId, targetId, 1)) ||
        // Горизонтальные движения влево
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 7 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 6 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 5 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 4 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 2 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        (Math.floor(startId / width) === Math.floor(targetId / width) &&
          startId - 3 === targetId &&
          checkClearPath(startId, targetId, -1)) ||
        Math.floor(startId / width) ===
          Math.checkClearPath(startId, targetId, -1)
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
        kingHasMoved = true;
        return true;
      }

      if (kingHasMoved === false) {
        // Правая рокировка
        if (
          startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
          rookHasMoved.right === false
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
          rookHasMoved.right = true;
          return true;
        }

        // Левая рокировка
        if (
          startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
          rookHasMoved.left === false
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
          rookHasMoved.left = true;
          return true;
        }
      }
      break;
  }
  return false;
}

//переключение игрока после хода

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

// проверка хама и мата

function checkForWin() {
  const kings = Array.from(document.querySelectorAll('#king'));
  console.log(kings);
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

function createBoard() {
  startPieces.forEach((startPiece, i) => {
      const square = document.createElement('div');
      square.classList.add('square');
      square.innerHTML = startPiece;
      square.firstChild?.setAttribute('draggable', true);
      square.setAttribute('square-id', i);
      const row = Math.floor((63 - i) / 8) + 1;
      if (row % 2 === 0) {
          square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
      } else {
          square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
      }
      if (i <= 15) {
          square.firstChild?.firstChild?.classList.add('black');
      }
      if (i >= 48) {
          square.firstChild?.firstChild?.classList.add('white');
      }
      gameBoard.append(square);
  });
}

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
          if (document.querySelector(`[square-id="${position + 8 * direction}"]`)?.innerHTML.trim() === '') {
              moves.push(position + 8 * direction);
              // Move forward two squares if on start row
              if (row === startRow && document.querySelector(`[square-id="${position + 16 * direction}"]`)?.innerHTML.trim() === '') {
                  moves.push(position + 16 * direction);
              }
          }
          // Capture diagonally
          if (document.querySelector(`[square-id="${position + 8 * direction + 1}"]`)?.firstChild?.classList.contains(playerClass === 'white' ? 'black' : 'white')) {
              moves.push(position + 8 * direction + 1);
          }
          if (document.querySelector(`[square-id="${position + 8 * direction - 1}"]`)?.firstChild?.classList.contains(playerClass === 'white' ? 'black' : 'white')) {
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
      // Add logic for other pieces here (rook, bishop, queen, king)
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

//createBoard();
initializeBoard();