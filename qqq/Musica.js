const tracks = ['music1.mp3', 'music2.mp3', 'music3.mp3']; // Добавьте нужные треки сюда
let currentTrackIndex = 0;
const audio = document.getElementById('background-music');
const musicSource = document.getElementById('music-source');
const volumeControl = document.getElementById('volume-control');

// Функция для переключения музыки
function changeTrack(direction) {
    currentTrackIndex += direction;
    if (currentTrackIndex < 0) {
        currentTrackIndex = tracks.length - 1;
    } else if (currentTrackIndex >= tracks.length) {
        currentTrackIndex = 0;
    }
    musicSource.src = tracks[currentTrackIndex];
    audio.load();
    audio.play();
}

// Функция для включения/выключения музыки
function toggleMusic() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

// Обработка изменения громкости
volumeControl.addEventListener('input', function () {
    audio.volume = volumeControl.value;
});

// Переключение на следующую музыку по окончанию текущей
audio.addEventListener('ended', function () {
    changeTrack(1);
});
