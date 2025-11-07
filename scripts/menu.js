//----------------------------------------------------------------
// Main menu functions and player creation
//----------------------------------------------------------------

function setText() {
    helpTextElement = document.getElementById('help-text');
    if (!helpTextElement) return;
    switch (currentIndex) {
        case 0:
            helpTextElement.innerHTML = "Start a new game";
        break;
        case 1:
            helpTextElement.innerHTML = "See highscores";
        break;
        case 2:
            helpTextElement.innerHTML = "Enter / click: toggle, left/right: change volume";
        break;
        case 3:
            helpTextElement.innerHTML = "Enter / click: toggle, left/right: change volume";
        break;
        case 4:
            switch (gfxLevel) {
                case 0:
                    helpTextElement.innerHTML = "Tilesets: Off";
                break;
                case 1:
                    helpTextElement.innerHTML = "Tilesets: On / Tile density: Low";
                break;
                case 2:
                    helpTextElement.innerHTML = "Tilesets: On / Tile density: High";
                break;
            }
        break;
        case 5:
            helpTextElement.innerHTML = "Click or Enter to toggle FPS lock";
        break;
    }
}

function handleMenuClick(index) {
    switch (index) {
        case 0: 
            closeMainMenu(); 
            if (isFirstLaunch) {
                playLongIntro();
            } else {
                startGame();
            }
        break;
        case 1:
            showScores();                
        break;
        case 2:
            toggleMusic('toggle');
        break;
        case 3:
            toggleSounds('toggle');
        break;
        case 4:
            toggleGraphics('up'); // clicking cycles graphics up
        break;
        case 5:
            toggleFps();
        break;
    }
    setText();
}

function manageMenu() {
    if (keysPressed['ArrowUp'] && currentIndex > 0) {
        currentIndex--;
        highlightButton(currentIndex);
        keyBlocked = true;
    }
    else if (keysPressed['ArrowDown'] && currentIndex < buttons.length - 1) {
        currentIndex++;
        highlightButton(currentIndex);
        keyBlocked = true;
    }
    else if (keysPressed['ArrowLeft']) {
        if (currentIndex === 2) toggleMusic('down');
        if (currentIndex === 3) toggleSounds('down');
        if (currentIndex === 4) toggleGraphics('down');
        if (currentIndex === 5) toggleFps();
        keyBlocked = true;
    }
    else if (keysPressed['ArrowRight']) {
        if (currentIndex === 2) toggleMusic('up');
        if (currentIndex === 3) toggleSounds('up');
        if (currentIndex === 4) toggleGraphics('up');
        if (currentIndex === 5) toggleFps();
        keyBlocked = true;
    }
    else if (keysPressed['Enter']) {
        handleMenuClick(currentIndex);
        keyBlocked = true;
    }
    setText();
}

function initButtons() {  
    buttons = Array.from(document.querySelectorAll('#mainMenu button'));

    // add volume indicators and click handlers
    buttons.forEach((button, index) => {
        if (index === 2 || index === 3) {
            const indicatorBackground = document.createElement('div');
            indicatorBackground.className = 'volume-indicator-background';

            const indicator = document.createElement('div');
            indicator.className = 'volume-indicator';

            indicatorBackground.appendChild(indicator);
            button.appendChild(indicatorBackground);         
        }

        // mouse click support
        button.addEventListener('click', () => {
            currentIndex = index;
            highlightButton(index);
            handleMenuClick(index);
        });
    });

    setText();
    highlightButton(0);
    updateVolumeIndicator('musicButton', musicVolume);
    updateVolumeIndicator('soundButton', soundVolume);

    music.src = 'https://www.indrek.org/game/sfx/mainMenu.mp3';
    if (musicIsOn) {
        music.volume = musicVolume;
        music.play();
        music.loop = true;
    }
}

function removeVolumeIndicators() {
    buttons.forEach((button, index) => {
        if (index === 2 || index === 3) {
            const indicatorBackground = button.querySelector('.volume-indicator-background');
            if (indicatorBackground) {
                button.removeChild(indicatorBackground);
            }
        }
    });
}

function updateVolumeIndicator(buttonId, volume) {
    const indicator = document.querySelector(`#${buttonId} .volume-indicator`);
    if (indicator !== null) {
        let w = .260 * (volume * 1000); 
        indicator.style.width = `${w}px`;
    } 
}

function highlightButton(index) {
    buttons.forEach((button, i) => {
        if (i === index) {
            button.classList.add('highlighted');
        } else {
            button.classList.remove('highlighted');
        }
    });
}

function toggleGraphics(direction) {
    const gLevel = ["Low", "Medium", "High"];
    if (direction === 'up') {
        gfxLevel = (gfxLevel + 1) % 3;
    } else if (direction === 'down') {
        gfxLevel = (gfxLevel - 1 + 3) % 3;
    }
    buttons[4].textContent = "Graphics: " + gLevel[gfxLevel];
}

function toggleFps() {
    fpsLock = fpsLock ? 0 : 1;
    buttons[5].textContent = fpsLock ? "FPS Lock: YES" : "FPS Lock: NO";
}

function toggleMusic(direction) {
    if (direction === 'toggle') {
        musicIsOn = !musicIsOn;
        if (!musicIsOn) {
            music.muted = true;
            buttons[2].firstChild.nodeValue = "Music Off";
            music.pause();
        } else {
            music.muted = false;
            buttons[2].firstChild.nodeValue = "Music On";
            music.play();
            music.loop = true;
        }
    } else if (direction === 'up' && musicVolume < 1) {
        musicVolume = clamp(musicVolume + 0.05, 0, 1);
    } else if (direction === 'down' && musicVolume > 0) {
        musicVolume = clamp(musicVolume - 0.05, 0, 1);
    }
    music.volume = musicVolume;
    updateVolumeIndicator('musicButton', musicVolume);
}

function toggleSounds(direction) {
    if (direction === 'up' && soundVolume < 1) {
        soundVolume = clamp(soundVolume + 0.05, 0, 1);
        currentTestAudioIndex = playAudioFromPool(audioPool_Test, currentTestAudioIndex);
    } else if (direction === 'down' && soundVolume > 0) {
        soundVolume = clamp(soundVolume - 0.05, 0, 1);
        currentTestAudioIndex = playAudioFromPool(audioPool_Test, currentTestAudioIndex);
    } else if (direction === 'toggle') {
        soundIsOn = !soundIsOn;
        buttons[3].firstChild.nodeValue = soundIsOn ? "Sounds On" : "Sounds Off"; 
    }
    updateVolumeIndicator('soundButton', soundVolume);
}

function showScores() {
    gameState = "mainMenu/showScore";
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  
    highScores.sort((a, b) => b.score - a.score);
    scoresContainer = document.createElement('div');
    scoresContainer.classList.add('scores-container');
  
    for (let i = 0; i < Math.min(10, highScores.length); i++) {
        const scoreItem = document.createElement('div');
        scoreItem.classList.add('score-item');

        const indexDiv = document.createElement('div');
        const nameDiv = document.createElement('div');
        const scoreDiv = document.createElement('div');

        indexDiv.classList.add('score-part', 'indexDiv'); 
        nameDiv.classList.add('score-part', 'nameDiv');   
        scoreDiv.classList.add('score-part', 'scoreDiv'); 

        indexDiv.textContent = `${i + 1}.`;
        nameDiv.textContent = highScores[i].name.substring(0, 10);
        scoreDiv.textContent = highScores[i].score;

        scoreItem.appendChild(indexDiv);
        scoreItem.appendChild(nameDiv);
        scoreItem.appendChild(scoreDiv);

        scoresContainer.appendChild(scoreItem);
    }

    gameContainer.appendChild(scoresContainer);

    // --- click anywhere to close scores ---
    const closeScores = () => {
        if (scoresContainer && scoresContainer.parentNode) {
            scoresContainer.parentNode.removeChild(scoresContainer);
        }
        gameState = "mainMenu";
        document.removeEventListener('click', closeScores);
    };

    // avoid immediate close on the same click
    setTimeout(() => {
        document.addEventListener('click', closeScores);
    }, 0);
}

// ----------------------------------------------------------------
// ------------------- Intro and init stuff------------------------
// ----------------------------------------------------------------

function playIntro() {
    if (isIntro) {
        const gameContainer = document.getElementById("game-container");
        const introBackground = document.createElement("div");
        introBackground.id = "introBackground";
        const introDoor = document.createElement("div");
        introDoor.id = "introDoor";

        introBackground.appendChild(introDoor);
        gameContainer.appendChild(introBackground); 

        if (soundIsOn) {
            introDoorSound.play();
        }

        introDoor.addEventListener("animationend", function () {
            introBackground.style.animation = "fadeOut 3s ease-out forwards";
        });

        introBackground.addEventListener("animationend", function () {
            introBackground.remove();
            startWithoutIntro();
        });
    }
}

function startWithoutIntro() {
    isIntro = false;
    if (gameState == "gameStarted") {
        player = createPlayer();
        gameContainer.appendChild(uiBar);
        music.pause();
        music.src = 'https://www.indrek.org/game/sfx/track1.mp3';
        if (musicIsOn) {
            music.volume = musicVolume;
            music.play();
            music.loop = true;
        }
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function makeUI() {
    uiBar = document.createElement('div');
    uiBar.id = 'ui-bar';
    uiBar.style.height = '48px';
    
    uiScore = document.createElement('div');
    uiScore.id = 'ui-score';
    uiBar.appendChild(uiScore);

    uiLives = document.createElement('div');
    uiLives.id = 'ui-lives';
    uiBar.appendChild(uiLives);

    uiTime = document.createElement('div');
    uiTime.id = 'ui-time';
    uiBar.appendChild(uiTime);

    uiCows = document.createElement('div');
    uiCows.id = 'ui-cows';
    uiBar.appendChild(uiCows);
}

function startGame() {
    gameState = "gameStarted";
    makeBackground();
    startWithoutIntro();
}

function createPlayer() {
    let created = createGameObject(360, 456, 'player', playerConfig);
    created.playerEngine = createGameObject(360, 468, 'player-engine');
    return created;
}

function openMainMenu() {
    gameContainer.appendChild(mainMenuPackage);
    initButtons();
}

function closeMainMenu() {
    removeVolumeIndicators();
    gameContainer.removeChild(mainMenuPackage);
}

function packageDom() {
    let originalPackage = document.getElementById('mainMenu');
    mainMenuPackage = originalPackage.cloneNode(true);
    gameContainer.removeChild(originalPackage);

    originalPackage = document.getElementById('pauseMenu');
    pauseMenuPackage = originalPackage.cloneNode(true);
    gameContainer.removeChild(originalPackage);

    originalPackage = document.getElementById('gameOverMenu');
    gameOverMenuPackage = originalPackage.cloneNode(true);
    gameContainer.removeChild(originalPackage);
}
