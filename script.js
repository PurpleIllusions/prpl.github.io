let now_playing = document.querySelector('.now-playing');
let okladkaUtw = document.querySelector('.okladka');
let nazwaUtw = document.querySelector('.nazwa-utw');
let nazwa_artysty = document.querySelector('.artysta');

let play_button = document.querySelector('.play');
let next = document.querySelector('.nastepny-utwor');
let prev = document.querySelector('.poprzedni-utwor');
let seek_slider = document.querySelector('.seek_slider');
let vol_slider = document.querySelector('.vol_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-shuffle');
let curr_track = document.createElement('audio');
let mute = false;
let indexUtw = 0;
let isPlaying = false;
let losowy_stan = false;
let update_timer;

const lista_utworow = [
    
  {
        img: 'https://firebasestorage.googleapis.com/v0/b/odtwarzacz-b693f.appspot.com/o/jpgs%2Fdielit.jpg?alt=media&token=377257ef-0908-4ac7-a831-37aa4182ab1a',
        name: 'Molly',
        artist: 'Playboi Carti',
        song: 'https://firebasestorage.googleapis.com/v0/b/odtwarzacz-b693f.appspot.com/o/muzyka%2Fmolly.mp3?alt=media&token=7967afcc-ea9d-426a-8d8d-09b0c2f1dd9b'
    },
    {
        img: 'https://firebasestorage.googleapis.com/v0/b/odtwarzacz-b693f.appspot.com/o/jpgs%2Fagc.jpg?alt=media&token=6836afed-42ed-49bb-9b8b-9597f3a46485',
        name: 'need u ',
        artist: 'ken',
        song: 'https://firebasestorage.googleapis.com/v0/b/odtwarzacz-b693f.appspot.com/o/muzyka%2Fneed_u.mp3?alt=media&token=43ae8704-2916-451c-99bc-0a1ad1cc5ad2'
    }
];

load_music(indexUtw);

function load_music(indexUtw){
    clearInterval(update_timer);
    reset();

    curr_track.src = lista_utworow[indexUtw].song;
    curr_track.load();

    okladkaUtw.style.backgroundImage = "url(" + lista_utworow[indexUtw].img + ")";
    nazwaUtw.textContent = lista_utworow[indexUtw].name;
    nazwa_artysty.textContent = lista_utworow[indexUtw].artist;
    now_playing.textContent = "Odtwarzanie " + (indexUtw + 1) + " z " + lista_utworow.length + " utworów";

    update_timer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    
}

function wycisz() {
    if (mute) {
        
        curr_track.volume = 1.0; 
        mute = false;
        vol_slider.value = 100; 
    } else {
      
        curr_track.volume = 0; 
        mute = true;
        vol_slider.value = 0; 
    }
}
function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function losowy_utwor(){
   losowy_stan ? stop_losowy() : play_losowy();
}
function play_losowy(){
   losowy_stan = true;
    randomIcon.classList.add('randomActive');

    
    var shuffleButton = document.querySelector('.shuffle-button');
    shuffleButton.style.color = '#229704'; 
    
}
function stop_losowy(){
    losowy_stan = false;
    randomIcon.classList.remove('randomActive');

   
    var shuffleButton = document.querySelector('.shuffle-button');
    shuffleButton.style.color = '';
}
function repeatTrack(){
    let current_index = indexUtw;
    load_music(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;

   
    play_button.innerHTML = '<i class="fa-solid fa-pause"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
   
    
    play_button.innerHTML = '<i class="fa-solid fa-play"></i>';
}



// search
function searchFunction() {
    
    var input = document.getElementById("search-input");

    
    var searchText = input.value.toLowerCase(); 

  
    var filteredMusicList = lista_utworow.filter(function (track) {
        return (
            track.name.toLowerCase().includes(searchText) ||
            track.artist.toLowerCase().includes(searchText)
        );
    });

    if (filteredMusicList.length > 0) {
        load_music(lista_utworow.indexOf(filteredMusicList[0]));
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
    if(indexUtw < lista_utworow.length - 1 && losowy_stan === false){
        indexUtw += 1;
    }else if(indexUtw < lista_utworow.length - 1 && losowy_stan === true){
        let random_index = Number.parseInt(Math.random() * lista_utworow.length);
        indexUtw = random_index;
    }else{
        indexUtw = 0;
    }
    load_music(indexUtw);
    playTrack();
}
function prevTrack(){
    if(indexUtw > 0){
        indexUtw -= 1;
    }else{
        indexUtw = lista_utworow.length -1;
    }
    load_music(indexUtw);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume(){
    curr_track.volume = vol_slider.value / 100;
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
