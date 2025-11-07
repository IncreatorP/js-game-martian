// ----------------------------------------------------
// Basic spawn system that relies on custom time
// ----------------------------------------------------

function getRandomEnemy() {
    const rand = Math.random();
    if (rand < 0.2) {
      return "Mine";
    } else if (rand < 0.5) {
      return "Kamikaze";
    } else {
      return "UFO";
    }
}

function gameTime() {
    if (gameState != "gameStarted") return;
    if (isPaused) return;

    gameTick++;
    if (gameTick > 100000) {
        gameTick = 0;
        tickMult++;
    }

    if (isBossFight) {
      return;
    }

    if (cowsSaved === cowsToSave) {
      if (!isBossFight) {
        for (let enemy of activeEnemies) {
          destroyEnemy(enemy);
      }

        warningDiv = document.createElement('div');
        warningDiv.id = 'warning-div';
        warningDiv.innerHTML = "WARNING!";
        gameContainer.appendChild(warningDiv);

        
        setTimeout(() => {
          gameContainer.removeChild(warningDiv);
          warningDiv = null;
        }, 6000);
        

        music.pause();
        music.src = 'https://www.indrek.org/game/sfx/bossFight.mp3';
        if (musicIsOn) {
          music.loop = true;
          music.muted = false;
          music.volume = musicVolume;
          music.play();
        }
        isBossFight = true;
        createEnemy("Boss", 384, -2304);        
      }
    }

    second = gameTick / 60;
    if (objectLoad > 300) return;
    if (activeEnemies.length >= 10) return;

    // lazy procedural generation

    if ((gameTick % (300-gameLevel*10)) === 0) {
    let pos;
    for (let i = 0; i < Math.ceil(gameLevel/2); i++) {
        pos = grid(Math.floor(Math.random()*14)+1);
        createEnemy(getRandomEnemy(), pos, grid(-8));              
        }
    }
    
    else if ((gameTick % (600-gameLevel*10)) === 0) {
        let pos = ((Math.random()*14)+1) * tileSize; 
        for (let i = 0; i < 6; i++) {
            createEnemy("FlyBy", pos, grid(-(8+i)));              
        }
    }       
    
}

// For time display
function formatGameTicks(gameTicks) {
    const seconds = Math.floor(gameTicks / 60);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    let formattedTime = "";
  
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
  
    if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes % 60}m `;
    }
  
    formattedTime += `${seconds % 60}s`;
    return formattedTime;
}
