const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'black'
//очки игроков
let whiteScore = 0
let blackScore = 0

playerDisplay.textContent = 'black'

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

let scoreTablet = [
    ['pawn', 'knight', 'bishop', 'rook', 'queen'],
    [1, 3, 3, 5, 9]
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

let startPostitionId 
let draggedELement

function dragStart (e) {
    startPostitionId = e.target.parentNode.getAttribute('square-id');
    draggedELement = e.target
}

//перетаскивание фигур + подсчёт очков

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation()
    const correctGo = draggedELement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    
    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedELement)
            e.target.remove()
            scoreTablet[0].forEach((element, index) => {
            if (element == e.target.id) {
                if (playerGo == 'white') {
                    whiteScore += scoreTablet[1][index]
                }else {
                    blackScore += scoreTablet[1][index]
                }
            }});
            console.log('black' + blackScore);
            console.log('white' + whiteScore);
            checkForWin()
            changePlayer()
            return
        }
        if (!valid){
            infoDisplay.textContent = "you cannot go here!"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return
        }
        if (valid) {
            e.target.append(draggedELement)
            checkForWin()
            changePlayer()
            return
        }
    }
    
}


// ходы фигур
function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPostitionId)
    const piece = draggedELement.id
    console.log('targetId', targetId)
    console.log('startId', startId)
    console.log('piece', piece)

    switch(piece) {
        case 'pawn' :
            const starterRow = [8,9,11,12,13,14,15]
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
                    startId + width * 2 - 1 ||
                    startId + width * 2 - 1 ||
                    startId + width - 2 ||
                    startId + width + 2 ||
                    startId - width * 2 - 1 ||
                    startId - width * 2 - 1 ||
                    startId - width - 2 ||
                    startId - width + 2
                ) {
                    return true
                }
                break;
                case 'bishop':
                    if (startId + width + 1 === targetId ||
                        startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                        startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                        startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                        startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                        startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                        startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild ||
                        // ---------
                        startId - width - 1 === targetId ||
                        startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                        startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                        startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                        startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                        startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                        startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild ||
                       // -----
                       startId - width + 1 === targetId ||
                        startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                        startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                        startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                        startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                        startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                        startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild ||
                    // ---------
                    startId + width - 1 === targetId ||
                        startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                        startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                        startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                        startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                        startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                        startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild
                    ) {
                        return true
                    }
                    break;
                    case 'rook':
                        if (
                            startId + width === targetId ||
                            startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                            startId + width * 3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild ||
                            startId + width * 4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild ||
                            startId + width * 5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild ||
                            startId + width * 6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild ||
                            startId + width * 7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild ||
                        //-----
                            startId - width === targetId ||
                            startId - width * 2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                            startId - width * 3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild ||
                            startId - width * 4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild ||
                            startId - width * 5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width - 4}"]`).firstChild ||
                            startId - width * 6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild ||
                            startId - width * 7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild ||
                        //--------
                            startId + 1 === targetId ||
                            startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                            startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
                            startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
                            startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
                            startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
                            startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
                        //-----
                        startId - 1 === targetId ||
                        startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                        startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
                        startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
                        startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
                        startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
                        startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 6}"]`).firstChild
                        ) {
                            return true; 
                        }
                        break;
                    case 'queen':
                        if (
                            startId + width === targetId ||
                            startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                            startId + width * 3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild ||
                            startId + width * 4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild ||
                            startId + width * 5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild ||
                            startId + width * 6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild ||
                            startId + width * 7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width * 6}"]`).firstChild ||
                        //-----
                            startId - width === targetId ||
                            startId - width * 2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                            startId - width * 3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild ||
                            startId - width * 4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild ||
                            startId - width * 5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width - 4}"]`).firstChild ||
                            startId - width * 6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild ||
                            startId - width * 7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + width - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - width * 6}"]`).firstChild ||
                        //--------
                            startId + 1 === targetId ||
                            startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
                            startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
                            startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
                            startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
                            startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
                            startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
                        //-----
                        startId - 1 === targetId ||
                        startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
                        startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
                        startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
                        startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
                        startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
                        startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 3}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 4}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 5}"]`).firstChild &&  !document.querySelector(`[square-id="${startId - 6}"]`).firstChild ||
                        //----
                        startId + width + 1 === targetId ||
                        startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                        startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                        startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                        startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                        startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                        startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild ||
                                // ---------
                        startId - width - 1 === targetId ||
                        startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                        startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                        startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                        startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                        startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                        startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`).firstChild ||
                               // -----
                        startId - width + 1 === targetId ||
                        startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                        startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                        startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                        startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                        startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                        startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`).firstChild ||
                            // ---------
                        startId + width - 1 === targetId ||
                        startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                        startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                        startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                        startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                        startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                        startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild
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
                            startId -width - 1 === targetId 
                        ) {
                            return true;
                        }
    }
}

//переключение игрока после хода

function changePlayer() {
    if (playerGo === "black") {
        reverseIds()
        playerGo = "white"
        playerDisplay.textContent = 'white'
    } else {
        revertIds()
        playerGo = "black"
        playerDisplay.textContent = 'black'
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - 1) - i))
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}

// проверка хама и мата

function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings)
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}