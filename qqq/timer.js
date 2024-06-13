let time1 = 300;
let time2 = 300;
let running1 = false;
let running2 = false;
let timerInterval1;
let timerInterval2;
let playWithTimer = false;

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
        if (!running1) {
            running1 = true;
            clearInterval(timerInterval1);
            timerInterval1 = setInterval(() => {
                time1--;
                if (time1 <= 0) {
                    time1 = 0;
                    clearInterval(timerInterval1);
                    alert("Player 1's time is up!");
                    running1 = false;
                }
                updateDisplay();
            }, 1000);
        } else {
            clearInterval(timerInterval1);
            running1 = false;
        }
    } else if (player === 2) {
        if (!running2) {
            running2 = true;
            clearInterval(timerInterval2);
            timerInterval2 = setInterval(() => {
                time2--;
                if (time2 <= 0) {
                    time2 = 0;
                    clearInterval(timerInterval2);
                    alert("Player 2's time is up!");
                    running2 = false;
                }
                updateDisplay();
            }, 1000);
        } else {
            clearInterval(timerInterval2);
            running2 = false;
        }
    }
}

function toggleTimer(player) {
    if (player === 1) {
        startTimer(1);
    } else if (player === 2) {
        startTimer(2);
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
