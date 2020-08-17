const inputName = document.getElementById('inputSongName');
const searchBtn = document.querySelector('.search-btn');

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

    // show the last 10 song when we click the search more than one time
    const para = document.querySelectorAll('.author');
    for(let i = 0; i < (para.length - 10); i++){
        para[i].style.display = "none";
    }
    getLyrics ();
};

// set title and artist and lyrics button;
setData = (title,artist) => {
    const lyricsContainer = document.querySelector('.lyricsContainer');
    
    // create div for title,artist,button and lyrics
    const divContainer = document.createElement('div');
    
    // create div for title,artist and button
    const div = document.createElement('div');
    div.classList.add('author','lead');
   
    // create a div for title and artist 
    const container = document.createElement('div');

    // append them 
    lyricsContainer.appendChild(divContainer);
    divContainer.appendChild(div);
    div.appendChild(container);

    createTag("strong", title, container);
    createTag('p',artist, container);
    createTag('button', "Get lyrics", div);
}


// for avoid duplicate use this function for creating element
createTag = (tag,text,appendTag) => {
    const generateTag = document.createElement(tag); 
    generateTag.innerText = text;
    appendTag.appendChild(generateTag);
};

// get  lyrics by this function
getLyrics = () => {
    const lyricsBtns = document.querySelectorAll('.lead button');
    const lyricsBtnsArr = [...lyricsBtns];
    lyricsBtnsArr.map(btn => {
        btn.addEventListener('click', (e) => {
            const targetDiv = e.target.parentElement.parentElement;
            targetDiv.classList.toggle('showHide');

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
};

// set lyric in pre tag
displayLyrics = (data,targetDiv) => {
    if(targetDiv.classList.contains('showHide')){
        const getAuthor = document.querySelector('.showHide');
        const lyricsElement = document.createElement('pre');
        getAuthor.appendChild(lyricsElement)
        lyricsElement.innerText = data.lyrics;
    }else{
        targetDiv.removeChild(targetDiv.childNodes[1]);
    }
    
};