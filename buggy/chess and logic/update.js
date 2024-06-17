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
  
    // Проверка цвета пешки
    const pieceColor = pieceElement.firstChild.classList.contains('black') ? 'black' : 'white';
    if (pieceColor !== playerGo) {
      alert('Вы можете улучшать только свои пешки.');
      return;
    }
  
    console.log('Pawn clicked for promotion');
  
    // Создаем элемент <select> для выбора типа фигуры
    const selectPromoteTo = document.createElement('select');
    selectPromoteTo.innerHTML = `
      <option value="knight">Конь</option>
      <option value="bishop">Слон</option>
      <option value="rook">Ладья</option>
      <option value="queen">Ферзь</option>
    `;
  
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
  
    // Подтверждение выбора
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
          alert('Не хватает :(');
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
        console.log('Pawn promoted to', promoteTo);
  
        // Удаляем выбор после завершения улучшения
        selectPromoteTo.remove();
        confirmButton.remove();
      }
    });
  
    infoDisplay.textContent = 'Выберите тип фигуры для улучшения:';
    infoDisplay.appendChild(selectPromoteTo);
    infoDisplay.appendChild(confirmButton);
  }

  //поменяй те функции