document.addEventListener("DOMContentLoaded", function() {
    let music = document.getElementById("background-music");
    let volumeControl = document.getElementById("volume-control");
    let tracks = ["musss/1.mp3", "musss/2.mp3", "musss/3.mp3", "musss/4.mp3", "musss/5.mp3", "musss/6.mp3", "musss/7.mp3", "musss/8.mp3", "musss/9.mp3", "musss/10.mp3", "musss/11.mp3"]; // Add more tracks here
    let currentTrackIndex = 0;

    // Функция для переключения музыки
    window.changeTrack = function(direction) {
        currentTrackIndex += direction;
        if (currentTrackIndex < 0) {
            currentTrackIndex = tracks.length - 1;
        } else if (currentTrackIndex >= tracks.length) {
            currentTrackIndex = 0;
        }
        music.src = tracks[currentTrackIndex];
        music.play();
    }

    // Функция для включения/выключения музыки
    window.toggleMusic = function() {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
    }

    // Обработка изменения громкости
    volumeControl.addEventListener('input', function () {
        music.volume = volumeControl.value;
    });

    // Переключение на следующую музыку по окончанию текущей
    music.addEventListener('ended', function () {
        changeTrack(1);
    });
});
