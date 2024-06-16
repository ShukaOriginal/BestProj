let time1 = 300;
let time2 = 300;
let running1 = false;
let running2 = false;
let timerInterval1;
let timerInterval2;
let playWithTimer = false;
let currentPlayer = 1;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    document.getElementById('timer1').innerText = formatTime(time1);
    document.getElementById('timer2').innerText = formatTime(time2);
}

function startTimer(player) {
    if (!playWithTimer) return;

    if (player === 1) {
        clearInterval(timerInterval2);
        running2 = false;

        if (!running1) {
            running1 = true;

            timerInterval1 = setInterval(() => {
                time1--;
                if (time1 <= 0) {
                    time1 = 0;
                    clearInterval(timerInterval1);
                    alert("Время игрока 1 истекло!");
                    running1 = false;
                }
                updateDisplay();
            }, 1000);
        }
    } else if (player === 2) {
        clearInterval(timerInterval1);
        running1 = false;

        if (!running2) {
            running2 = true;

            timerInterval2 = setInterval(() => {
                time2--;
                if (time2 <= 0) {
                    time2 = 0;
                    clearInterval(timerInterval2);
                    alert("Время игрока 2 истекло!");
                    running2 = false;
                }
                updateDisplay();
            }, 1000);

        }
    }
}

function switchTurn() {
    if (currentPlayer === 1) {
        currentPlayer = 2;
        startTimer(2);
    } else {
        currentPlayer = 1;
        startTimer(1);

    }
}

function togglePlayMode() {
    const playWithTimerSelect = document.getElementById('play-with-timer');
    playWithTimer = playWithTimerSelect.value === 'yes';

    const timersDiv = document.getElementById('timers');
    if (playWithTimer) {
        timersDiv.style.display = 'block';
        updateDisplay();
    } else {
        timersDiv.style.display = 'none';
        clearInterval(timerInterval1);
        clearInterval(timerInterval2);
        running1 = false;
        running2 = false;
        time1 = 300;
        time2 = 300;
        updateDisplay();
    }
}

updateDisplay();

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
  switchTurn();
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
