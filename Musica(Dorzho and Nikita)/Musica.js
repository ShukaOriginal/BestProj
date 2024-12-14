document.addEventListener("DOMContentLoaded", function() {
    var music = document.getElementById("background-music");
    var volumeControl = document.getElementById("volume-control");
    var tracks = ["music1.mp3", "music2.mp3", "music3.mp3", "music4.mp3", "music5.mp3", "music6.mp3", "music7.mp3", "music8.mp3", "music9.mp3"]; // Add more tracks here
    var currentTrackIndex = 0;

    // Auto-play the music when the page loads
    music.play();

    // Function to toggle play/pause
    window.toggleMusic = function() {
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
    };

    // Function to change tracks
    window.changeTrack = function(direction) {
        currentTrackIndex += direction;
        if (currentTrackIndex < 0) {
            currentTrackIndex = tracks.length - 1;
        } else if (currentTrackIndex >= tracks.length) {
            currentTrackIndex = 0;
        }
        music.src = tracks[currentTrackIndex];
        music.play();
    };

    // Set initial volume
    music.volume = volumeControl.value;

    // Update the volume based on the slider input
    volumeControl.addEventListener("input", function() {
        music.volume = this.value;
    });
});
