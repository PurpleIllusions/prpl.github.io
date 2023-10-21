// script.js
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsList = document.getElementById('results');
    const musicPlayer = document.getElementById('musicPlayer');

    // Sample music data (you should fetch this from a database)
    const musicDatabase = [
        { title: 'Song 1', rip.mp3 'song1.mp3' },
        { title: 'Song 2', url: 'song2.mp3' },
        { title: 'Song 3', url: 'song3.mp3' }
    ];

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredResults = musicDatabase.filter(track => track.title.toLowerCase().includes(searchTerm));

        displaySearchResults(filteredResults);
    });

    function displaySearchResults(results) {
        resultsList.innerHTML = '';
        results.forEach((track, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = track.title;
            listItem.addEventListener('click', function () {
                playMusic(track);
            });
            resultsList.appendChild(listItem);
        });
    }

    function playMusic(track) {
        musicPlayer.src = track.url;
        musicPlayer.play();
    }
});
