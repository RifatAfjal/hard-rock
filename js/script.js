const inputName = document.getElementById('inputSongName');
const searchBtn = document.querySelector('.search-btn');

// set keypress event for searching
inputName.addEventListener('keyup', (e) => {
    getAPI(inputName.value);

    // when we press backspace button it works
    if(e.keyCode === 8){
        getAPI(inputName.value)
    };
});

//set click button 
searchBtn.addEventListener('click',() => {
    const getSongName = inputName.value;

    if(getSongName === ''){
        alert("Please input a song title for getting it's lyrics")
    }else{
        getAPI(getSongName); 
    }
});

// get api by songName
getAPI = songName => {
    fetch(`https://api.lyrics.ovh/suggest/${songName}`)
        .then(response => response.json())
        .then(json => displayData(json))
}

// get the title,artist
displayData = data => {
    const getSongsArr = data.data;
    if(getSongsArr.length == 0){
        alert("Sorry, you input a wrong name");
    }
    else{
        const getTenLyrics = getSongsArr.slice(0,10);
        getTenLyrics.map(lyric => {
            const title = lyric.title;
            const artist = lyric.artist.name;
            setData(title,artist);
        });
    }

    // show the last 10 element 
    const para = document.querySelector('.lyricsContainer').children;
    const Arr = [...para];
    const newArr = Arr.slice(0,Arr.length-10);
    newArr.map(el => el.parentElement.removeChild(el));

    // for getting lyrics
    getLyrics ();
};

// set title and artist and lyrics button;
setData = (title,artist) => {
    const lyricsContainer = document.querySelector('.lyricsContainer');
    
    // create div for title,artist,button and lyrics
    const divContainer = document.createElement('div');
    divContainer.classList.add('decorate')
    
    divContainer.innerHTML = `<div class="author lead">
                                <div>
                                    <strong>${title}</strong>
                                    <p>${artist}</p>
                                </div>
                                <button>Get lyrics</button>
                             </div>`
    lyricsContainer.appendChild(divContainer);
};

// get  lyrics by this function
getLyrics = () => {
    const lyricsBtns = document.querySelectorAll('.lead button');
    const lyricsBtnsArr = [...lyricsBtns];
    lyricsBtnsArr.map(btn => {
        btn.addEventListener('click', (e) => {
            const targetDiv = e.target.parentElement.parentElement;
            const getTitle = targetDiv.querySelector('strong').innerText;
            const getArtist = targetDiv.querySelector('p').innerText;
            lyrics(getArtist, getTitle,targetDiv);
        });
    });
};

// get lyrics api 
lyrics = (artist, title,targetDiv) => {
    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
      .then(res => res.json())
      .then(json => displayLyrics(json,targetDiv))
      .catch(error => alert("Data didn't find."))
};

// set lyric in pre tag
displayLyrics = (data,targetDiv) => {
    if(targetDiv.childNodes.length == 1){
        const lyricsElement = document.createElement('pre');
        targetDiv.appendChild(lyricsElement);

        if(data.lyrics === undefined){
            lyricsElement.innerText = "Sorry, lyrics didn't find.";
            lyricsElement.style.color = "red";
        }else{
            lyricsElement.innerText = data.lyrics; 
        }
        
    }else{
        targetDiv.removeChild(targetDiv.childNodes[1]);
    }
};