let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');
let isMuted = false;
let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-shuffle');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img: 'rip.jpg',
        name: 'Rip',
        artist: 'carti',
        music: 'rip.mp3'
    },
    {
        img: 'rip.jpg',
        name: 'Over',
        artist: 'carti',
        music: 'over.mp3'
    }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Odtwarzanie " + (track_index + 1) + " z " + music_list.length + " utworów";

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    
}

function toggleMute() {
    if (isMuted) {
        // Jeśli jest wyciszone, włącz dźwięk
        curr_track.volume = 1.0; // Ustaw głośność na 1 (100%)
        isMuted = false;
        volume_slider.value = 100; // Aktualizuj suwak głośności
    } else {
        // Jeśli nie jest wyciszone, wycisz dźwięk
        curr_track.volume = 0; // Ustaw głośność na 0 (0%)
        isMuted = true;
        volume_slider.value = 0; // Aktualizuj suwak głośności
    }
}
function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}
function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;

   
    playpause_btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
   
    
    playpause_btn.innerHTML = '<i class="fa-solid fa-play"></i>';
}



// JavaScript code for the search function
function searchFunction() {
    // Get the search input element by its ID
    var input = document.getElementById("search-bar");

    // Get the value entered by the user
    var searchText = input.value;

    // Perform your search logic with searchText
    // For example, you can send the search query to a server or display search results on the page.

    // You can also clear the input field after performing the search
    input.value = "";
}

// Add an event listener to trigger the search function when the user presses Enter
document.getElementById("search-bar").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchFunction();
    }
});

function nextTrack(){
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1;
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume(){
    curr_track.volume = volume_slider.value / 100;
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}
