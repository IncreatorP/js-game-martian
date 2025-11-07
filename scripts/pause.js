// --- Pause menu stuff ----
// --- Similar to main menu stuff --

function checkPause() {
    if (keysPressed['p'] || keysPressed['P'] || keysPressed['Escape']) {
        if (!isPaused)
        {            
            showPause();
            isPaused = true;
        }
    }
}

function showPause() {
    cancelAnimationFrame(animationFrameId);
    gameContainer.appendChild(pauseMenuPackage); 
    initPauseButtons();
    music.pause();
}

function hidePause() {
    pauseKeyBlocked = false; 
    if (musicIsOn) {
        music.muted = false;
        music.loop = true;
        music.play();
    }
    isPaused = false;
    gameContainer.removeChild(pauseMenuPackage);
}

function managePauseMenu() {  
    if (pauseKeyBlocked) return; 

    if (keysPressed['ArrowUp'] && pauseCurrentIndex > 0) {
        pauseKeyBlocked = true; 
        pauseCurrentIndex--;
        highlightPauseButton(pauseCurrentIndex);
    }
    else if (keysPressed['ArrowDown'] && pauseCurrentIndex < pauseButtons.length - 1) {
        pauseKeyBlocked = true; 
        pauseCurrentIndex++;
        highlightPauseButton(pauseCurrentIndex);
    }
    else if (keysPressed['Enter']) {
        switch (pauseCurrentIndex) {
            case 0:
                hidePause();
                animationFrameId = requestAnimationFrame(gameLoop);
            break;
            case 1:
                restartGame();
            break;
            case 2:
                backToMenu();
            break;
        }
    }
}

function initPauseButtons() {
    pauseCurrentIndex = 0;
    pauseButtons = Array.from(document.querySelectorAll('#pauseMenu button'));
    highlightPauseButton(0);
}

function initOtherButtons() {
    pauseCurrentIndex = 0;
    pauseButtons = Array.from(document.querySelectorAll('#pauseMenu button'));
    highlightPauseButton(0);
}


function highlightPauseButton(index) {
    pauseButtons.forEach((button, i) => {
        if (i === index) {
            button.classList.add('highlighted');
        } else {
            button.classList.remove('highlighted');
        }
    });
}

function resetGame() {
    if (isPaused) { 
        hidePause();
    }
    // nuke DOM
    nukeDOM();
    lives = 5;

    // Reinit tilemaps
    tileGrid1 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));
    tileGrid2 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));
    levelGrid1 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));
    levelGrid2 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));

    if (musicIsOn) {
        music.muted = false;
        music.loop = true;
        music.play();
    }
}

function restartGame() {
    resetGame();
    gameState = "gameStarted";
    gameTick =
    makeUI();
    makeBackground();
    startWithoutIntro();
}

function backToMenu() {   
    console.log("Back to main menu");
    gameState = "mainMenu";
    resetGame();
    openMainMenu(); 
}