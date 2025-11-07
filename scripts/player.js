// ----------------------------------------------------------------
// Player object doesn't use base object system, due uniqueness
// ----------------------------------------------------------------

// ------------ Movement --------------------

 function updateSpeed() {  
    //if (isPaused || gameState != "gameStarted" || gameState != "gameStarted/bossFight") return; 
    if (!player) return;

    player.hSpeed = 0;
    player.vSpeed = 0;

    if (keysPressed['ArrowUp']) {
        player.vSpeed = -player.speed;
    }
    if (keysPressed['ArrowDown']) {
        player.vSpeed = player.speed;
    }
    if (keysPressed['ArrowLeft']) {
        player.hSpeed = -player.speed;
        player.element.style.backgroundImage = 'url("img/sPlrShip_Left.png")';
        player.shadowElement.style.backgroundImage = 'url("img/sPlrShip_Left.png")';
    }
    if (keysPressed['ArrowRight']) {
        player.hSpeed = player.speed;
        player.element.style.backgroundImage = 'url("img/sPlrShip_Right.png")';
        player.shadowElement.style.backgroundImage = 'url("img/sPlrShip_Right.png")';
    }
    if (keysPressed[' ']) {
        if (player.shootingIntervalID === null) {
            playerShoot();
            player.shootingIntervalID = setInterval(playerShoot, player.shootingInterval);
        }
    } else {
        clearInterval(player.shootingIntervalID);
        player.shootingIntervalID = null;
    }
    if (!keysPressed['ArrowLeft'] && !keysPressed['ArrowRight']) {
        player.element.style.backgroundImage = 'url("img/sPlrShip.png")';
        player.shadowElement.style.backgroundImage = 'url("img/sPlrShip.png")';
    }
}

function adjustScorePlayer() {
    if (isPaused) return;
    // ticks down score multiplier
    if (player.scoreTimer > 0) {
        player.scoreTimer--;
    } else {
        player.scoreMultiplier = 1;
    }
}

function movePlayer() {
    if (isPaused) return;
    if (player.dead) return;
    const newX = player.x + player.hSpeed;
    const newY = player.y + player.vSpeed;

    if (newX >= 0 && newX <= gameWidth - 48) { 
        player.x = newX;
    }
    if (newY >= 0 && newY <= gameHeight - 48) { 
        player.y = newY;
    }

    for (let i = 0; i < activeEnemies.length; i++) {
        if (isColliding(activeEnemies[i], player)) {
            if (activeEnemies[i].callSign != "Boss") {
                activeEnemies[i].hitPoints -= 100; }

            if (player.invincible === false && player.dead == false) {                
                playerDie();
            }
        }
    }
    updateGameObject(player.playerEngine, player.x, player.y+12);    
    updateGameObject(player, player.x, player.y); 
}

function playerDie() {
    createThing(player.x, player.y, 'explosionbig', true, 0);
    currentExplosionAudioIndex = playAudioFromPool(audioPool_Explosions, currentExplosionAudioIndex);
    player.element.style.display = 'none';
    player.playerEngine.element.style.display = 'none';
    player.shadowElement.style.display = 'none';
    player.dead = true;
    lives -= 1;
    // 25% attribute decrease at random for 3 parameters
    decrease = choose(0,1,2);
    switch (decrease) {
        case 0:
            player.shootLevel -= Math.ceil(player.shootLevel / 4);
            if (player.shootLevel < 1) player.shootLevel = 1;
            createPowerUp(player.x, player.y, 0);
        break;
        case 1:
            player.shootSpeedLevel -= Math.ceil(player.shootSpeedLevel / 4);
            if (player.shootSpeedLevel < 1) player.shootSpeedLevel = 1;
            createPowerUp(player.x, player.y, 1);
        break;
        case 2:
            player.moveSpeedLevel -= Math.ceil(player.moveSpeedLevel / 4);
            if (player.moveSpeedLevel < 1) player.moveSpeedLevel = 1;
            createPowerUp(player.x, player.y, 2);
        break;
    }  
    if (lives > -1) {
        gameAlarm.setAlarm("respawn", 120, () => {
            player.dead = false;
            player.x = 384;
            player.y = 720;
            updateGameObject(player.playerEngine, player.x, player.y+12);    
            updateGameObject(player, player.x, player.y); 
            player.element.style.display = 'block';
            player.playerEngine.element.style.display = 'block';
            player.shadowElement.style.display = 'block';

            player.invincible = true;
            player.element.classList.add("invincible");
            gameAlarm.setAlarm("mortal", 240, () => {
                player.invincible = false;
                player.element.classList.remove("invincible");
            });
        });
    } else {
        gameState = "gameOver/lose";
    }
}

function playerShoot() {
    if (isPaused) return;
    if (player.dead) return;

    const spriteSize = 96;
    const bulletX = player.x + player.cx - spriteSize/2;  // Adjusting for centering
    const bulletY = player.y;
    let bullet;
    switch (player.shootLevel)
    {
        // dynamic bounding boxes to make preciser collision detection
        case 1:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 46, bby: 10, bbw: 4, bbh: 10, direction: 270, damage: 5 });
            break;
        case 2:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 41, bby: 10, bbw: 12, bbh: 10, direction: 270, damage: 6 });
            break;
        case 3:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 38, bby: 7, bbw: 20, bbh: 13, direction: 270, damage: 7 });
            break;
        case 4:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 30, bby: 7, bbw: 36, bbh: 17, direction: 270, damage: 8 });
            break;
        case 5:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 29, bby: 3, bbw: 40,  bbh: 21, direction: 270, damage: 9 });
            break;
        case 6:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 34, bby: 3, bbw: 29,  bbh: 20, direction: 270, damage: 10 });
            break;
        case 7:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 22, bby: 3, bbw: 52,  bbh: 25, direction: 270, damage: 12 });
            break;
        case 8:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 18, bby: 1, bbw: 61,  bbh: 29, direction: 270, damage: 14 });
            break;
        case 9:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 13, bbx: 18, bby: 1, bbw: 61,  bbh: 29, direction: 270, damage: 16 });
            break;
        case 10:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 16, bbx: 18, bby: 1, bbw: 61,  bbh: 29, direction: 270, damage: 25 });
            break;
    
        default:
            bullet = createGameObject(bulletX, bulletY, 'bullet', { speed: 10, bbx: 46, bby: 10, bbw: 4, bbh: 10, direction: 270, damage: 5 });
            break;
    }

    bullet.element.style.backgroundPositionX = `${-((player.shootLevel - 1) * spriteSize)}px`;
    activeBullets.push(bullet);

    createThing(player.x+16, player.y-8, 'plasmahit', false, 0);
    currentBulletAudioIndex = playAudioFromPool(audioPool_Bullets, currentBulletAudioIndex); // play sound
}


// Creates floating score display, text optional
function giveScore(x, y, score, text = "none") {
    playerScore += score;
    let score2 = score.toString(); 
    
    if (text != "none") {
        score2 = text + "\n" + score.toString(); 
    }

    const floatingText = createGameObject(x, y, 'floating-score', { score: score2 });
    // timeout is a better solution than alarm here
    setTimeout(() => {
        destroyGameObject(floatingText);
    }, 2000);
}

// Player shooting
function movePlayerBullet(objectHandle) {
    let y = objectHandle.y;
    let bullet = objectHandle;
    
    if (y < -16) {
        bullet.isActive = false;
        return;
    }       
     // Check collision with each enemy in activeEnemies array
     for (let j = 0; j < activeEnemies.length; j++) {
        let enemy = activeEnemies[j];
        if (enemy.hitPoints > 0)
        {
            if (isColliding(bullet, enemy)) {
                applyBlink(enemy);
                createThing(parseInt(bullet.element.style.left) +32, parseInt(bullet.element.style.top) - player.bulletSpeed - 8, 'plasmahit', true, 16);
                bullet.isActive = false;
                enemy.hitPoints -= bullet.damage;
                if (enemy.hitPoints < 1) {     
                    player.scoreTimer = player.scoreTimerInterval; // reset score mult
                    const score = enemy.pointValue * player.scoreMultiplier;
                    if (player.scoreMultiplier < 10) player.scoreMultiplier++;
                    giveScore(enemy.x+enemy.cx, enemy.y+enemy.cy, score);
                    destroyEnemy(enemy);
                }

                currentHitAudioIndex = playAudioFromPool(audioPool_Hits, currentHitAudioIndex);
                break;  // Stop the loop if a collision is detected
            }
        }     
    }
}
