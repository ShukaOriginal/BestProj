const prices = {
    pawn: 3,
    rook: 7,
    knight: 5,
    bishop: 5,
    queen: 11,
  };
  
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0,
  };
  
  const pricesUpgrade = {
      knight: 2,
      bishop: 2,
      rook: 4,
      queen: 9,
    };
  
  let moneyWhite = 11;
  let moneyBlack = 11;
  document.getElementById('moneyBlack').textContent = moneyBlack;
  document.getElementById('moneyWhite').textContent = moneyWhite;

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

  document.getElementById('upgrade-pawn').addEventListener('click', enablePromotionMode);

function enablePromotionMode() {
  promotionMode = true;
  infoDisplay.textContent = 'Выберите пешку для улучшения.';
}

allSquares.forEach((square) => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
    square.addEventListener('click', handleSquareClick);
  });

function handleSquareClick(e) {
  if (!promotionMode) return;

  let pieceElement;
  if (e.target.classList.contains('piece') && e.target.id === 'pawn') {
    pieceElement = e.target;
  } else if (e.target.closest('.piece') && e.target.closest('.piece').id === 'pawn') {
    pieceElement = e.target.closest('.piece');
  } else {
    return;
  }

  const pieceColor = pieceElement.firstChild.classList.contains('black') ? 'black' : 'white';
  if (pieceColor !== playerGo) {
    alert('Вы можете улучшать только свои пешки.');
    return;
  }


  const selectPromoteTo = document.createElement('select');
  selectPromoteTo.innerHTML = `
    <option value="knight">Конь</option>
    <option value="bishop">Слон</option>
    <option value="rook">Ладья</option>
    <option value="queen">Ферзь</option>
  `;

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Подтвердить';

  confirmButton.addEventListener('click', () => {
    const promoteTo = selectPromoteTo.value;

    if (pricesUpgrade[promoteTo] && confirm(`Это будет стоить ${pricesUpgrade[promoteTo]} rubles. Продолжить?`)) {
      if (playerGo === 'black' && moneyBlack >= pricesUpgrade[promoteTo]) {
        moneyBlack -= pricesUpgrade[promoteTo];
        updateMoney('moneyBlack', moneyBlack);
      } else if (playerGo === 'white' && moneyWhite >= pricesUpgrade[promoteTo]) {
        moneyWhite -= pricesUpgrade[promoteTo];
        updateMoney('moneyWhite', moneyWhite);
      } else {
        alert('Не хватает денег :(');
        return;
      }

      const tempDiv = document.createElement('div');
      let pieceContent;

      if (promoteTo === 'knight') {
        pieceContent = knight;
      } else if (promoteTo === 'bishop') {
        pieceContent = bishop;
      } else if (promoteTo === 'rook') {
        pieceContent = rook;
      } else if (promoteTo === 'queen') {
        pieceContent = queen;
      } else {
        alert('Неверный тип фигуры.');
        return;
      }

      tempDiv.innerHTML = pieceContent;
      const newPiece = tempDiv.firstChild;
      newPiece.setAttribute('draggable', true);
      newPiece.classList.add('piece');

      if (playerGo === 'black') {
        newPiece.firstChild.classList.add('black');
      } else if (playerGo === 'white') {
        newPiece.firstChild.classList.add('white');
      }

      pieceElement.parentNode.replaceChild(newPiece, pieceElement);

      promotionMode = false;
      infoDisplay.textContent = '';
      selectPromoteTo.remove();
      confirmButton.remove();
    }
  });

  infoDisplay.textContent = 'Выберите тип фигуры для улучшения:';
  infoDisplay.appendChild(selectPromoteTo);
  infoDisplay.appendChild(confirmButton);
}