let now_playing = document.querySelector('.now-playing');
let okladkaUtw = document.querySelector('.okladka');
let nazwaUtw = document.querySelector('.nazwa-utw');
let nazwa_artysty = document.querySelector('.artysta');

let playpause_btn = document.querySelector('.play');
let next_btn = document.querySelector('.nastepny-utwor');
let prev_btn = document.querySelector('.poprzedni-utowr');
let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-shuffle');
let curr_track = document.createElement('audio');
let isMuted = false;
let indexUtw = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img: 'rip.jpg',
        name: 'Rip',
        artist: 'Playboi Carti',
        music: 'rip.mp3'
    },
    {
        img: 'rip.jpg',
        name: 'Molly',
        artist: 'Playboi Carti',
        music: 'mollyy.mp3'
    },
    {
        img: '2pac.jpg',
        name: 'Hit Em Up',
        artist: '2Pac',
        music: 'Hit Em Up.mp3'
    }
];

loadTrack(indexUtw);

function loadTrack(indexUtw){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[indexUtw].music;
    curr_track.load();

    okladkaUtw.style.backgroundImage = "url(" + music_list[indexUtw].img + ")";
    nazwaUtw.textContent = music_list[indexUtw].name;
    nazwa_artysty.textContent = music_list[indexUtw].artist;
    now_playing.textContent = "Odtwarzanie " + (indexUtw + 1) + " z " + music_list.length + " utworów";

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    
}

function toggleMute() {
    if (isMuted) {
        
        curr_track.volume = 1.0; 
        isMuted = false;
        volume_slider.value = 100; 
    } else {
      
        curr_track.volume = 0; 
        isMuted = true;
        volume_slider.value = 0; 
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

    
    var shuffleButton = document.querySelector('.shuffle-button');
    shuffleButton.style.color = '#229704'; 
    
}
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');

   
    var shuffleButton = document.querySelector('.shuffle-button');
    shuffleButton.style.color = '';
}
function repeatTrack(){
    let current_index = indexUtw;
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



// search
function searchFunction() {
    
    var input = document.getElementById("search-input");

    
    var searchText = input.value.toLowerCase(); 

  
    var filteredMusicList = music_list.filter(function (track) {
        return (
            track.name.toLowerCase().includes(searchText) ||
            track.artist.toLowerCase().includes(searchText)
        );
    });

    // If there are matching results, load the first matching track
    if (filteredMusicList.length > 0) {
        loadTrack(music_list.indexOf(filteredMusicList[0]));
        playTrack();
    }

  
    input.value = "";
}


document.getElementById("search-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchFunction();
    }
});


function nextTrack(){
    if(indexUtw < music_list.length - 1 && isRandom === false){
        indexUtw += 1;
    }else if(indexUtw < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        indexUtw = random_index;
    }else{
        indexUtw = 0;
    }
    loadTrack(indexUtw);
    playTrack();
}
function prevTrack(){
    if(indexUtw > 0){
        indexUtw -= 1;
    }else{
        indexUtw = music_list.length -1;
    }
    loadTrack(indexUtw);
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
