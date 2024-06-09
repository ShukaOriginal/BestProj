const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'black'
playerDisplay.textContent = 'black'
const starterRow = [8,9,11,12,13,14,15]

const startPieces = [
    rookBlack, knightBlack, bishopBlack, queenBlack, kingBlack, bishopBlack, knightBlack, rookBlack,
    pawnBlack, pawnBlack, pawnBlack, pawnBlack, pawnBlack, pawnBlack, pawnBlack, pawnBlack, 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    pawnWhite, pawnWhite, pawnWhite, pawnWhite, pawnWhite, pawnWhite, pawnWhite, pawnWhite, 
    rookWhite, knightWhite, bishopWhite, queenWhite, kingWhite, bishopWhite, knightWhite, rookWhite
]
//создание доски с фигурами
function createBoard() {
    startPieces.forEach((startPieces, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPieces
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
       const row = Math.floor( (63 - i) / 8) + 1
       if (row % 2 === 0) {
        square.classList.add(i % 2 === 0 ? "beige" : "brown")
       } else {
        square.classList.add(i % 2 === 0 ? "brown" : "beige")
       }
       if (i <= 15) {
        square.firstChild.firstChild.classList.add('black')
       }
       if (i >= 48) {
        square.firstChild.firstChild.classList.add('white')
       }
        gameBoard.append(square)
    })

}
createBoard()


//индифмкатор ходов что выводит в консоль БРАУЗЕРА

const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId 
let draggedELement

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedELement = e.target
}

//перетаскивание фигур 

function dragOver(e) {
    e.preventDefault()
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
            infoDisplay.textContent = "you cannot go here!";
            setTimeout(() => infoDisplay.textContent = "", 2000);
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
        if (document.querySelector(`[square-id="${startId + i * step}"]`).firstChild) {
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
    const              targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const piece = draggedELement.id
    console.log('targetId', targetId)
    console.log('startId', startId)
    console.log('piece', piece)

    switch(piece) {
        case 'pawn' :
            if (
                starterRow.includes(startId) && startId + width * 2 === targetId ||
                startId + width === targetId ||
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
            ) {
                return true
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
            (startId - width * 7 - 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 6 - 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 5 - 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 4 - 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 3 - 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 2 - 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width - 1 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            // Diagonal moves (top-right to bottom-left)
            (startId - width * 7 + 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 6 + 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 5 + 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 4 + 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 3 + 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width * 2 + 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId - width + 1 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            // Diagonal moves (bottom-left to top-right)
            (startId + width * 7 - 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 6 - 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 5 - 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 4 - 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 3 - 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 2 - 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width - 1 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            // Diagonal moves (bottom-right to top-left)
            (startId + width * 7 + 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 6 + 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 5 + 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 4 + 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 3 + 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width * 2 + 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
            (startId + width + 1 === targetId && checkClearPathBishop(startId, targetId, width))
                    ) {
                        return true;
                    }
                    break;
                    
                    case 'rook':
                        if (
    // Вертикальные движения вверх
    (startId % width === targetId % width && startId - width * 7 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 6 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 5 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 4 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 3 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 2 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width === targetId && checkClearPath(startId, targetId, -width)) ||
// Вертикальные движения вниз
(startId % width === targetId % width && startId + width * 7 === targetId && checkClearPath(startId, targetId, width)) ||
(startId % width === targetId % width && startId + width * 6 === targetId && checkClearPath(startId, targetId, width)) ||
(startId % width === targetId % width && startId + width * 5 === targetId && checkClearPath(startId, targetId, width)) ||
(startId % width === targetId % width && startId + width * 4 === targetId && checkClearPath(startId, targetId, width)) ||
(startId % width === targetId % width && startId + width * 3 === targetId && checkClearPath(startId, targetId, width)) ||
(startId % width === targetId % width && startId + width * 2 === targetId && checkClearPath(startId, targetId, width)) ||
(startId % width === targetId % width && startId + width === targetId && checkClearPath(startId, targetId, width)) ||
// Горизонтальные движения вправо
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 7 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 6 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 5 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 4 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 3 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 2 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 1 === targetId && checkClearPath(startId, targetId, 1)) ||
// Горизонтальные движения влево
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 7 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 6 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 5 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 4 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 3 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 2 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.checkClearPath(startId, targetId, -1))
                        ) {
                            rookHasMoved = true;
                            return true; 
                        }
                    case 'queen':
                        if (
    // Diagonal moves (top-left to bottom-right)
    (startId - width * 7 - 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 6 - 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 5 - 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 4 - 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 3 - 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 2 - 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width - 1 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    // Diagonal moves (top-right to bottom-left)
    (startId - width * 7 + 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 6 + 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 5 + 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 4 + 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 3 + 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width * 2 + 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId - width + 1 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    // Diagonal moves (bottom-left to top-right)
    (startId + width * 7 - 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 6 - 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 5 - 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 4 - 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 3 - 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 2 - 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width - 1 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    // Diagonal moves (bottom-right to top-left)
    (startId + width * 7 + 7 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 6 + 6 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 5 + 5 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 4 + 4 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 3 + 3 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width * 2 + 2 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    (startId + width + 1 === targetId && checkClearPathBishop(startId, targetId, width)) ||
    // Вертикальные движения вверх
    (startId % width === targetId % width && startId - width * 7 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 6 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 5 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 4 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 3 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width * 2 === targetId && checkClearPath(startId, targetId, -width)) ||
    (startId % width === targetId % width && startId - width === targetId && checkClearPath(startId, targetId, -width)) ||
    // Вертикальные движения вниз
    (startId % width === targetId % width && startId + width * 7 === targetId && checkClearPath(startId, targetId, width)) ||
    (startId % width === targetId % width && startId + width * 6 === targetId && checkClearPath(startId, targetId, width)) ||
    (startId % width === targetId % width && startId + width * 5 === targetId && checkClearPath(startId, targetId, width)) ||
    (startId % width === targetId % width && startId + width * 4 === targetId && checkClearPath(startId, targetId, width)) ||
    (startId % width === targetId % width && startId + width * 3 === targetId && checkClearPath(startId, targetId, width)) ||
    (startId % width === targetId % width && startId + width * 2 === targetId && checkClearPath(startId, targetId, width)) ||
    (startId % width === targetId % width && startId + width === targetId && checkClearPath(startId, targetId, width)) ||
// Горизонтальные движения вправо
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 7 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 6 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 5 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 4 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 3 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 2 === targetId && checkClearPath(startId, targetId, 1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId + 1 === targetId && checkClearPath(startId, targetId, 1)) ||
// Горизонтальные движения влево
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 7 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 6 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 5 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 4 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 2 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.floor(targetId / width) && startId - 3 === targetId && checkClearPath(startId, targetId, -1)) ||
(Math.floor(startId / width) === Math.checkClearPath(startId, targetId, -1))
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
                    (startId + 2 === targetId) &&
                    !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
                    rookHasMoved.right === false
                ) {
                    let rookStartId = startId + 3;
                    let rookTargetId = startId + 1;
                    let rook = document.querySelector(`[square-id="${rookStartId}"]`).firstChild;
                    document.querySelector(`[square-id="${rookStartId}"]`).removeChild(rook);
                    document.querySelector(`[square-id="${rookTargetId}"]`).appendChild(rook);

                    kingHasMoved = true;
                    rookHasMoved.right = true;
                    return true;
                }

                // Левая рокировка
                if (
                    (startId - 2 === targetId) &&
                    !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&
                    rookHasMoved.left === false
                ) {
                    let rookStartId = startId - 4;
                    let rookTargetId = startId - 1;
                    let rook = document.querySelector(`[square-id="${rookStartId}"]`).firstChild;
                    document.querySelector(`[square-id="${rookStartId}"]`).removeChild(rook);
                    document.querySelector(`[square-id="${rookTargetId}"]`).appendChild(rook);

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
    if (playerGo === "black") {
        reverseIds();
        playerGo = "white";
        playerDisplay.textContent = 'white';
    } else {
        revertIds();
        playerGo = "black";
        playerDisplay.textContent = 'black';
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - 1) - i));
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => square.setAttribute('square-id', i));
}

// проверка хама и мата

function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings)
    if (!kings.some(kingWhite => kingWhite.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if (!kings.some(kingBlack => kingBlack.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

function buyPiece() {
    const piece = draggedELement.id
    const pieceSymbol = getPieceSymbol(piece);
    const positions = getInitialPositions(piece, playerGo);

    const availablePositions = positions.filter(pos => {
        const square = document.querySelector(`[square-id='${pos}']`);
        return square && square.innerHTML.trim() === '';
    });

    if (availablePositions.length > 0) {
        const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        spawnPiece(pieceSymbol, randomPosition);
    } else {
        alert('No space available for this piece.');
    }
}

function getPieceSymbol(piece) {
    switch (piece) {
        case 'pawn': return playerGo === 'black' ? pawnBlack : pawnWhite;
        case 'rook': return playerGo === 'black' ? rookBlack : rookWhite;
        case 'knight': return playerGo === 'black' ? knightBlack : knightWhite;
        case 'bishop': return playerGo === 'black' ? bishopBlack : bishopWhite;
        case 'queen': return playerGo === 'black' ? queenBlack : queenWhite;
        default: return '';
            }
        }

        function getInitialPositions(piece) {
            const positions = {
                pawn: playerGo === 'black' ? starterRow : [48, 49, 50, 51, 52, 53, 54, 55],
                rook: playerGo === 'black' ? [0, 7] : [56, 63],
                knight: playerGo === 'black' ? [1, 6] : [57, 62],
                bishop: playerGo === 'black' ? [2, 5] : [58, 61],
                queen: playerGo === 'black' ? [3] : [59],
                king: playerGo === 'black' ? [4] : [60]
            };
            return positions[piece];
        }

        function spawnPiece(pieceSymbol, position) {
            const square = document.querySelector(`[square-id='${position}']`);
            if (square) {
                square.innerHTML = pieceSymbol;
                square.firstChild?.classList.add(playerGo);
            }
        }