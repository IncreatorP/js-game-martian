document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true;

    switch (gameState) {   

        case "gameOver/waitInput":   
            if (gameOverMenuPackage) {   
                gameContainer.removeChild(gameOverMenuPackage);
            }
            gameState = "mainMenu";
            openMainMenu();
        break;  

        case "mainMenu/showScore":   
            gameState = "mainMenu";
            scoresContainer.style.display = "none";
            gameContainer.removeChild(scoresContainer);
        break;    

        case "namePrompt":
            if (event.key === 'Enter') {
                keyBlocked = true;
                gameState = gamePrevState;
                playerName = document.getElementById('playerNameInput').value;
                if (playerName === '') {
                    playerName = "Player";
                }
                saveHighScore();
                gameContainer.removeChild(gameOverMenuPackage);
                gameState = "mainMenu";
                openMainMenu();
            }

        break;

        case "gameStarted":
            if (!isPaused) {
                updateSpeed();
                checkSoundMusic();
            } else {
                if (!pauseKeyBlocked) {
                    managePauseMenu();  
                }
            }
            checkPause(); 
        break;

        case "longIntro":
            if (event.key === ' ') {
                if (typingComplete) {
                    currentScene++;
                    const xOffset = -(currentScene * 162) + "px";
                    introTypeSpeed = 150; 
                    longImageDiv.style.backgroundPosition = xOffset + " 0";
                    currentLine = 0;
                    introTypeIndex = 0;
                    typingComplete = false;
                    typeWriterDiv.innerHTML = ''; 
                    loopIntro(); 
                } else {
                    introTypeSpeed = fasterSpeed; 
                }
            }
        break;

        case "mainMenu": 
            if (!keyBlocked) {
                manageMenu();
            }
            keyBlocked = true;
        break;
    }
        
 
    if (cheatMode) {
        if (event.key === 'D' || event.key === 'd') {
            if (gameState === "gameStarted" || gameState === "gameStarted/bossFight") {
                zoom();
            }
        }
     }
});

document.addEventListener("keyup", (event) => {
    keyBlocked = false;
    pauseKeyBlocked = false;
    delete keysPressed[event.key];
    if (gameState === "gameStarted" || gameState === "gameStarted/bossFight") {
        updateSpeed();
    }
});
