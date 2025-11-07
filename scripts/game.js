// General game functions
function zoom() {  
    //zoom and doom - random debug/cheat stuff
    console.log("Doooom!");
    player.shootLevel = 10;
    player.moveSpeedLevel = 10;
    player.fireSpeedLevel = 10;
    player.shootingInterval = 200 - (player.shootSpeedLevel*14);
    player.speed = player.initialSpeed+player.moveSpeedLevel*.5;
    clearInterval(player.shootingIntervalID); // reset for change to apply
    player.shootingIntervalID = null;
    cowsSaved = cowsToSave
}

// IDDQD
function makeInvincible() {
    player.invincible = true;
    player.element.classList.add("invincible");
}

function gameLoop() {
    if (gameState === "gameOver/win" || gameState === "gameOver/lose") {
        cancelAnimationFrame(animationFrameId);
        switch (gameState) {
            case "gameOver/win":
                gameOver("Win");
            break;
            case "gameOver/lose":
                gameOver("Lose");
            break;
        }
    } else {
        nextFrameTime = Date.now() + fpsInterval;

        currentTime = Date.now();
        deltaTime = currentTime - lastTime;
        frameCount++;

        // FPS Counting
        if (currentTime - lastFPSUpdate >= 1000) {
            frameCount = 0;
            lastFPSUpdate = currentTime;
        }
        
        if (fpsLock) {
            if (Math.floor(currentTime >= 1000 / 60)) {
                gameLoopWrap();
                nextFrameTime = currentTime + fpsInterval;
            }
        } else {
            gameLoopWrap();
        }

        lastTime = currentTime;
        console.log(lastTime);
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function gameLoopWrap() {
    if (!isPaused) {
        gameTime();
        updateUi();        
        movePlayer();
        adjustScorePlayer();
        gameAlarm.update(); // alarm system tick

        // kill objects that have isActive = false
        cleanUpArray(activeEnemies);
        cleanUpArray(activePowerUps);
        cleanUpArray(activeBullets);
        cleanUpArray(activeEnemyBullets);
        cleanUpArray(tileArray1);
        cleanUpArray(tileArray2);
        cleanUpArray(referenceArray);
        
        // moveGameObject(objectHandle, object specific movefunction, ?bounce on edge of screen?)
        for (let enemy of activeEnemies) {
            moveGameObject(enemy, moveEnemy, true);
        }
        for (let powerup of activePowerUps) {
            moveGameObject(powerup, movePowerup, true);
        }
        for (let playerBullet of activeBullets) {
            moveGameObject(playerBullet, movePlayerBullet, false);
        }
        for (let bullet of activeEnemyBullets) { 
            moveBullet(bullet);
        }

        // background stuff
        if (gfxLevel > 0) {
            for (let tile of tileArray1) {
                moveGameObject(tile, moveTiles, false);
            }
            for (let tile of tileArray2) {
                moveGameObject(tile, moveTiles, false);
            }
            for (let ref of referenceArray) {
                moveGameObject(ref, moveReference, false);
            }   
        }
        moveGameObject(background1, scrollBackground, false);
        moveGameObject(background2, scrollBackground, false);           
    } else {
        managePauseMenu();
    }
}

// Cleanses objects when set inactive
function cleanUpArray(array) {
    let i = 0;
    while (i < array.length) {
        if (array[i] && !array[i].isActive) {
            destroyGameObject(array[i]);
            array.splice(i, 1);
        } else {
            i++;
        }
    }
}

function nukeDOM() {
    gameLevel = 1;
    cowsSaved = 0;   
    playerScore = 0;
    playerShootLevel = 1;
    playerShootSpeedLevel = 1;
    playerMoveSpeedLevel = 1;

    pauseKeyBlocked = false; 
    isPaused = false;
    isGameOver = false;
    isIntro = false;
  
    // Put all object arrays into a single array (avoids a ton of DRY)
    const allObjectArrays = [activeEnemies, activePowerUps, activeBullets, activeEnemyBullets, tileArray1, tileArray2, referenceArray];
    // Loop dat
    for (const objectArray of allObjectArrays) {
      if (objectArray) {
         for (const object of objectArray) {
          if (object) {
            destroyGameObject(object);
          }
        }
        objectArray.length = 0;
      }
    }

    // nuke DOM
    while (gameContainer.firstChild) {
         gameContainer.removeChild(gameContainer.firstChild);
    }
}

function updateUi() {
    if (uiScore !== null) {
        uiScore.textContent = `Score: ${playerScore}`;
    }
    if (uiLives !== null) {
        uiLives.textContent = `Lives: ${lives}`;
    }
    if (uiTime !== null) {
        uiTime.textContent = `Time: ${formatGameTicks(gameTick)}`;
    }
    if (uiCows !== null) {
        uiCows.textContent = `Cows saved: ${cowsSaved} / ${cowsToSave}`;
    }
}

function checkSoundMusic() {
    // shortcuts for music and sound toggle
    if (event.key === 's' || event.key === 'S') {
        soundIsOn = !soundIsOn
    }
    else if (event.key === 'm' || event.key === 'M') {
        if (musicIsOn) {
            musicIsOn = false;
            music.pause();
        } else {
            musicIsOn = true;
            music.volume = musicVolume;
            music.loop = true;
            music.play();
        }
    }
}

function gameOver(condition) { 
    const tempScore = playerScore; // to avoid resetting
    resetGame();
    playerScore = tempScore;
    music.pause();
    if (gameOverMenuPackage) {
        gameContainer.appendChild(gameOverMenuPackage);
    }  

    switch (condition) {
        case "Lose":
            music.src = 'sfx/gameLose.wav';
            break;
        case "Win":
            music.src = 'sfx/gameWin.wav';
            let gameOverPic = document.getElementById('go-image-2');
            if (gameOverPic) {
                gameOverPic.style.backgroundImage = "url('img/sGameWin.png')";
            }
            break;
    }
    if (musicIsOn) {
        music.volume = musicVolume;
        music.loop = false;
        music.play();
    } 
    showGameOverMenu();
}