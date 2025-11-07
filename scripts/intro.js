// Typewriter effect
function typeLine(typeWriterDiv) {
    if (introTypeIndex < lines[currentScene][currentLine].length) {  
        typeWriterDiv.innerHTML += lines[currentScene][currentLine].charAt(introTypeIndex); 
        introTypeIndex++;
        let effectiveSpeed = isSpeedUp ? introTypeSpeed / 2 : introTypeSpeed;
        setTimeout(() => typeLine(typeWriterDiv), effectiveSpeed);
    } else {
        completeLine(typeWriterDiv);
    }
}

// Typewriter effect speedup
function completeLine(typeWriterDiv) {
    if (currentLine < lines[currentScene].length - 1) {
        currentLine++;
        introTypeIndex = 0;
        typeWriterDiv.innerHTML += "<br>";
        typeLine(typeWriterDiv);
    } else {
        typingComplete = true;
    }
}

// DOM init
function playLongIntro() {

    music.src = 'https://www.indrek.org/game/sfx/bossFight.mp3';
    if (musicIsOn) {
        music.volume = musicVolume;
        music.play();
        music.loop = true;
    }

    isFirstLaunch = false;
    longIntroDiv = document.createElement('div');
    longIntroDiv.id = 'long-intro-background';
    gameContainer.appendChild(longIntroDiv);

    longImageDiv = document.createElement('div');
    longImageDiv.id = 'long-intro-image';
    longIntroDiv.appendChild(longImageDiv);

    typeWriterDiv = document.createElement('div');
    typeWriterDiv.id = 'typewriter-text-c';
    longIntroDiv.appendChild(typeWriterDiv);

    gameState = "longIntro";
    loopIntro();
}

// Main intro loop
function loopIntro() {
    if (currentScene == 4) {
        longIntroDiv.removeChild(longImageDiv);
        longIntroDiv.removeChild(typeWriterDiv);
        if (longIntroDiv instanceof Node && gameContainer.contains(longIntroDiv)) {
            gameContainer.removeChild(longIntroDiv);
        }
        gameState = "gameStarted";
        makeBackground();
        makeUI();
        playIntro();
    } else {
        typeLine(typeWriterDiv);
    }
}