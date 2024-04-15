let indexUtw = 0;
let queue = [];
let seek_slider = document.querySelector('.seek_slider');
let vol_slider = document.querySelector('.vol_slider');
let nazwaUtw = document.querySelector('.nazwa-utw');
let nazwa_artysty = document.querySelector('.artysta');
let play_button = document.querySelector('.play');
let next = document.querySelector('.nastepny-utwor');
let prev = document.querySelector('.poprzedni-utwor');
let now_playing = document.querySelector('.now-playing');
let okladkaUtw = document.querySelector('.okladka');
let curr_time = document.querySelector('.current-time');
let filtered_list = [];
let total_duration = document.querySelector('.total-duration');
let random_icon = document.querySelector('.fa-shuffle');
let curr_track = document.createElement('audio');
let mute = false;
let muteIcon = document.querySelector('.fa-volume-high');
let isPlaying = false;
let losowy_stan = false;
let update_timer;
let currentQueueIndex = 0;

load_song(indexUtw);

async function load_song(indexUtw) {
    clearInterval(update_timer);
    reset();
    try {
        const collectionRef = firestore.collection('songs');
        const querySnapshot = await collectionRef.get();

        if (querySnapshot.empty) {
            console.log("brak utowrow w firestore");
            return;
        }

        indexUtw = (indexUtw + querySnapshot.size) % querySnapshot.size;
        const docSnapshot = querySnapshot.docs[indexUtw];
        const songData = docSnapshot.data();

        // jpg
        const coverImageRef = storage.ref().child(songData.coverImage);
        const coverImageUrl = await coverImageRef.getDownloadURL();

        okladkaUtw.style.backgroundImage = "url(" + coverImageUrl + ")";
        nazwaUtw.textContent = songData.name;
        nazwa_artysty.textContent = songData.artist;
        now_playing.textContent = "Odtwarzanie " + songData.name;

        // mp3
        const audioFileRef = storage.ref().child(songData.audioFile);
        const songUrl = await audioFileRef.getDownloadURL();

        curr_track.src = songUrl;
        curr_track.load();

        update_timer = setInterval(setUpdate, 1000);

        curr_track.addEventListener('ended', next_song);
    } catch (error) {
        console.error("blad podczas ladowania utworu:", error);
    }
}


async function load_lib() {
    try {
        const collectionRef = firestore.collection('songs');
        const querySnapshot = await collectionRef.get();
        if (querySnapshot.empty) {
            console.log("Brak piosenek w bazie");
            return;
        }
        const lista_utwElement = document.getElementById('lista_utw');
        lista_utwElement.innerHTML = "";

        querySnapshot.forEach(doc => {
            const songData = doc.data();
            const listItem = document.createElement('li');
            const add_to_que_icon = document.createElement('i');
            add_to_que_icon.className = "fa-solid fa-bars-staggered add_to_que_icon";
            add_to_que_icon.style.cursor = "pointer";
            add_to_que_icon.addEventListener('click', () => add_to_que_from_lib(songData));
            listItem.addEventListener('click', () => playClickedSong(songData));

            listItem.textContent = `${songData.name} - ${songData.artist}`;

         
            listItem.appendChild(add_to_que_icon);
            lista_utwElement.appendChild(listItem);
        });
    } catch (error) {
        console.error("Błąd poczas ładowania listy:", error);
    }
}



async function playClickedSong(songData) {
    try {
        // reset timer
        clearInterval(update_timer);
        reset();
        const coverImageRef = storage.ref().child(songData.coverImage);
        const coverImageUrl = await coverImageRef.getDownloadURL();

        okladkaUtw.style.backgroundImage = "url(" + coverImageUrl + ")";
        nazwaUtw.textContent = songData.name;
        nazwa_artysty.textContent = songData.artist;
        now_playing.textContent = "Odtwarzanie " + songData.name;

        const audioFileRef = storage.ref().child(songData.audioFile);
        const songUrl = await audioFileRef.getDownloadURL();

        curr_track.src = songUrl;
        curr_track.load();
        update_timer = setInterval(setUpdate, 1000);
            play_song();
        
    } catch (error) {
        console.error("Blad funkcji playclicked:", error);
    }
}



function add_to_que(songData) {
    queue.push(songData);
    console.log("Dodano do kolejki:", songData);

  
    if (!isPlaying) {
        next_from_que();
    }
}


window.onload = function () {
    load_song(indexUtw);
    load_lib();
  
};

async function add_to_que_from_lib(songData) {
    add_to_que(songData);
}
async function next_from_que() {
    if (queue.length > 0) {
        const nextSongData = queue.shift(); 
        await update_player(nextSongData);
    }
}

function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function toggle_mute() {
    if (mute) {
        // Unmute
        curr_track.volume = vol_slider.value / 100;
        mute = false;
        muteIcon.classList.remove('fa-volume-mute');
        muteIcon.classList.add('fa-volume-high');
    } else {
        
        curr_track.volume = 0;
        mute = true;
        muteIcon.classList.remove('fa-volume-high');
        muteIcon.classList.add('fa-volume-mute');
    }
}




function losowy_utwor(){
   losowy_stan ? stop_losowy() : play_losowy();
}

function play_losowy(){
   losowy_stan = true;
    random_icon.classList.add('randomActive');
    var shuffleButton = document.querySelector('.shuffle-button');
    shuffleButton.style.color = '#229704'; 
    
}

function stop_losowy(){
    losowy_stan = false;
    random_icon.classList.remove('randomActive');
    var shuffleButton = document.querySelector('.shuffle-button');
    shuffleButton.style.color = '';
}

function repeat_song() {
    if (isPlaying) {
        curr_track.currentTime = 0;
    } else {
        let current_index = indexUtw;
        load_song(current_index);
        play_song();
    }
}

function playpause_song(){
    isPlaying ? pause_song() : play_song();
}

function play_song(){
    curr_track.play();
    isPlaying = true;
    play_button.innerHTML = '<i class="fa-solid fa-pause"></i>'; 
}

function pause_song(){
    curr_track.pause();
    isPlaying = false;
    play_button.innerHTML = '<i class="fa-solid fa-play"></i>';
}



async function search_f() {
    var input = document.getElementById("search-input");
    var searchText = input.value.toLowerCase();

    try {
        const collectionRef = firestore.collection('songs');
        const querySnapshot = await collectionRef.get();
     if (querySnapshot.empty) {
            console.log("Brak piosenek");
            return;
        }

        const filtered_list = querySnapshot.docs
            .map(doc => doc.data())
            .filter(songData =>
                songData.name.toLowerCase().includes(searchText) ||
                songData.artist.toLowerCase().includes(searchText)
            );

        if (filtered_list.length > 0) {
            const matchedSongData = filtered_list[0];
            await update_player(matchedSongData);
        }
    } catch (error) {
        console.error("Błąd wyszukiwania:", error);
    }

    input.value = "";
}
document.getElementById("search-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        search_f();
    }
});


//NEXT AND PREV
async function next_song() {
    try {
        if (queue.length > 0) {
            currentQueueIndex = (currentQueueIndex + 1) % queue.length;
            console.log("załadowano utwor o indexie", queue[currentQueueIndex]);
            await update_player(queue[currentQueueIndex]);
        } else if (losowy_stan) {
            const collectionRef = firestore.collection('songs');
            const querySnapshot = await collectionRef.get();

            if (querySnapshot.empty) {
                console.log("nie znaleziono piosenek");
                return;
            }

            const randomIndex = getRandomIndex(querySnapshot.size);
            const docSnapshot = querySnapshot.docs[randomIndex];
            const randomSongData = docSnapshot.data();

            await update_player(randomSongData);
        } else {
            const collectionRef = firestore.collection('songs');
            const querySnapshot = await collectionRef.get();

            if (querySnapshot.empty) {
                console.log("nie znaleziono piosenek");
                return;
            }

            indexUtw = (indexUtw + 1) % querySnapshot.size;
            const docSnapshot = querySnapshot.docs[indexUtw];
            const songData = docSnapshot.data();

            await update_player(songData);
        }
    } catch (error) {
        console.error("blad podczas ładowania utworu:", error);
    }
}

async function prev_song() {
    try {
        if (losowy_stan) {
            // tryb shuffle
            const collectionRef = firestore.collection('songs');
            const querySnapshot = await collectionRef.get();

            if (querySnapshot.empty) {
                console.log("No songs found");
                return;
            }

            const randomIndex = getRandomIndex(querySnapshot.size);
            const docSnapshot = querySnapshot.docs[randomIndex];
            const randomSongData = docSnapshot.data();

            await update_player(randomSongData);
        } else if (queue.length > 0) {
           
            currentQueueIndex = (currentQueueIndex - 1 + queue.length) % queue.length;
            await update_player(queue[currentQueueIndex]);
        } else {
            
            const collectionRef = firestore.collection('songs');
            const querySnapshot = await collectionRef.get();

            if (querySnapshot.empty) {
                console.log("Brak utworow");
                return;
            }

            indexUtw = (indexUtw - 1 + querySnapshot.size) % querySnapshot.size;
            const docSnapshot = querySnapshot.docs[indexUtw];
            const songData = docSnapshot.data();

            await update_player(songData);
        }
    } catch (error) {
        console.error("blad prev track:", error);
    }
}






function getRandomIndex(collectionSize) {
    return Math.floor(Math.random() * collectionSize);
}

async function update_player(songData) {
    clearInterval(update_timer);
    reset();
    const coverImageRef = storage.ref().child(songData.coverImage);
    const coverImageUrl = await coverImageRef.getDownloadURL();

    okladkaUtw.style.backgroundImage = "url(" + coverImageUrl + ")";
    nazwaUtw.textContent = songData.name;
    nazwa_artysty.textContent = songData.artist;
    now_playing.textContent = "Odtwarzanie " + songData.name;

    const audioFileRef = storage.ref().child(songData.audioFile);
    const songUrl = await audioFileRef.getDownloadURL();

    curr_track.src = songUrl;
    curr_track.load();

    update_timer = setInterval(setUpdate, 1000);
    await new Promise(resolve => setTimeout(resolve, 100));

    play_song();
}



function przewin(){
    let przewin = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = przewin;
}
function set_vol() {
  
    if (vol_slider.value == 0) {
        curr_track.volume = 0;
        mute = true;
    } else {
        curr_track.volume = vol_slider.value / 100;
        mute = false;
    }
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




