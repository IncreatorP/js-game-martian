// ----------------------------------------------------------------
// ------- Enemy object-based logic functions ---------------------
// ------- And global movement logic ------------------------------
// ----------------------------------------------------------------

// Runtime object update 
function moveLogic(objectHandle) {
    let { hSpeed, vSpeed } = speedConvert(objectHandle.speed, objectHandle.direction);
    hSpeed = objectHandle.dir * hSpeed;
    objectHandle.x += hSpeed;
    objectHandle.y += vSpeed;
}

// Bouncing from screen edges
function moveBounce(gameObjectHandle) {
    let dir = gameObjectHandle.dir;
    let x = gameObjectHandle.x;
    let y = gameObjectHandle.y;

    const leftEdge = border;
    const rightEdge = gameWidth - tileSize - border;

    if (x < leftEdge || x > rightEdge) {
        dir *= -1;
    }

    gameObjectHandle.dir = dir;
}

function moveGameObject(objectHandle, handlerFunction, bounce) {
    // bounce edges if true
    if (bounce) {
        moveBounce(objectHandle);
    }
    // perform global move logic (dir/speed based)
    moveLogic(objectHandle); 
  
    // use custom move logic if given
    if (handlerFunction) {
        handlerFunction(objectHandle);
    }
    // draw
    updateGameObject(objectHandle, objectHandle.x, objectHandle.y);
}

// ---------------------------------
// ---- Enemy-specific part --------
// ---------------------------------

function fireEnemyBullet(enemy, direction, speed, doTarget) {
    if (!enemy) return;
    currentEnemyFireAudioIndex = playAudioFromPool(audioPool_EnemyFire, currentEnemyFireAudioIndex);
    const config = {
        speed: speed,
        direction: direction
    }

    const bullet = createGameObject(enemy.x+enemy.cx-8, enemy.y+enemy.cy-8, 'enemybullet1', config);
    activeEnemyBullets.push(bullet);

    if (doTarget && player) {
        const angleToPlayer = pointDirection(enemy.x+enemy.cx, enemy.y+enemy.cy, player.x+player.cx, player.y+player.cy);
        const where = angleToPlayer-5+Math.random()*10;
        bullet.direction = where;
    }
}

function moveEnemy(objectHandle) {
    // Main enemy behavior system with simple state machine
    // Enemy AI:
    // UFO       - picks a waypoint, flies there, shoots at player couple times, chooses next waypoint
    //             after third waypoint, shoots a bullet spray at player and leaves
    // FlyBy     - Shoots to the side, after reaching 1/3 of the screen, speeds up firing and movement
    // Kamikaze  - picks a waypoint, shoots at random at player. After some while, tries to ram the player

    let o = objectHandle;
    o.innertext = o.randomShootChance;

    switch (o.callSign) {
        case "UFO":
            switch (o.state) {
                case "Approach":
                    o.direction = pointDirection(o.x+o.cx, o.y+o.cy, o.wayPointX, o.wayPointY);
                    o.speed = o.maxSpeed * 0.75;

                    if (o.shootRandom && o.y > 0) {
                        if (Math.random()*100 <= o.randomShootChance) {
                            fireEnemyBullet(o, o.direction, o.bulletSpeed, true);
                        }
                    }
                    
                    if (pointDistance(o.x+o.cx, o.y+o.cy, o.wayPointX, o.wayPointY) <= o.wayPointTolerance) {
                        o.state = "StandAndShoot";
                        o.speed = 0;
                        o.fireCounter = 0;
                        o.shotsFired = 0;
                    }
                break;
                case "StandAndShoot":
                    o.speed = 0;
                    o.fireCounter++;
                    if (o.fireCounter >= o.fireInterval) {
                        o.shotsFired++;
                        fireEnemyBullet(o, o.direction, o.bulletSpeed, true);

                        o.fireCounter = 0;
                        if (o.shotsFired >= o.shotsToFire) {
                            if (o.wayPoints === o.maxWayPoints) {   
                                    
                                    // fiveshot for "goodbye" - spread shot                    
                                    const angleToPlayer = pointDirection(o.x+o.cx, o.y+o.cy, player.x+player.cx, player.y+player.cy);
                                    const multiplier = (1 + Math.floor(gameLevel/2))
                                    for (i = 0; i < multiplier; i++) {
                                        fireEnemyBullet(o, (angleToPlayer-(multiplier*5)) + i*10, o.bulletSpeed, false);
                                    }

                                    
                                o.state = "Leave"; 
                            } else {
                                const newWayPoints = generateWayPoints();
                                o.wayPoints++;
                                o.wayPointX = newWayPoints.wayPointX;
                                o.wayPointY = newWayPoints.wayPointY;
                                o.state = "Approach";
                                o.speed = o.maxSpeed * 0.75;
                            }
                        }
                    }
                    break;
                case "Leave":
                    o.direction = 90;
                    o.speed = o.maxSpeed;
                    break;
                default:
                    o.direction = 90;
                    o.speed = o.maxSpeed;
                break;
        }
        break;
        case "FlyBy":
            switch (o.state) {
                case "Approach":
                    if (o.y > 0) {
                            o.fireCounter++;
                            if (o.fireCounter >= o.fireInterval) {
                                fireEnemyBullet(o, 355 + Math.random()*10 + (o.xDir*180), o.bulletSpeed, false);
                                o.fireCounter = 0;
                            }
                            if (o.y > gameHeight / 3) {
                                o.direction = 90 - o.spreadAngle/2 + Math.random()*o.spreadAngle;
                                o.fireCounter = 0;
                                o.speed = o.maxSpeed;
                                o.state = "Leave";
                            }
                    }
                break;
                case "Leave":
                            o.fireCounter++;
                            if (o.fireCounter/2 >= o.fireInterval) {
                                fireEnemyBullet(o, 355 + Math.random()*10 + (o.xDir*180), o.bulletSpeed, false);
                                o.fireCounter = 0;
                            }
                break;
            }
        break;
        case "Kamikaze": 
            switch (o.state) {
                case "Approach":
                    o.direction = pointDirection(o.x+o.cx, o.y+o.cy, o.wayPointX, o.wayPointY);
                    o.speed = o.maxSpeed * 0.75;                   
                    if (pointDistance(o.x+o.cx, o.y+o.cy, o.wayPointX, o.wayPointY) <= o.wayPointTolerance) {
                        o.state = "Wait";
                        o.speed = 0;
                        o.waitCounter = 0;
                    }
                break;
                case "Wait":
                    o.waitCounter++;
                    o.direction = pointDirection(o.x+o.cx, o.y+o.cy, o.wayPointX, o.wayPointY);
    
                    if (o.shootRandom && o.y > 0) {
                        if (Math.random()*100 <= o.randomShootChance) {
                            fireEnemyBullet(o, o.direction, o.bulletSpeed, true);
                        }
                    }
                    if (o.waitCounter > o.waitInterval) {
                        o.state = "Ram";
                        o.direction = pointDirection(o.x, o.y, player.x, player.y)-5+Math.random()*10;
                        o.speed = o.maxSpeed;                        
                    }
                break;   
                case "Ram":
                    // Find direction between enemy and player
                    // Choose closest turn direction, limit by turnAmount for difficuly
                    let playerDir = pointDirection(o.x+o.cx, o.y+o.cy, player.x, player.y);
                    playerDir = (playerDir + 360) % 360; // Normalize
                    o.direction = (o.direction + 360) % 360; // Normalize)
                  
                    let difference = Math.abs(playerDir - o.direction);
                  
                    if (difference > o.turnTolerance) { 
                        let amountToTurn = Math.min(difference, o.turnAmount);
                        let turnDirection = angleDifference(o.direction, playerDir);
                        o.direction += (amountToTurn * turnDirection);
                        o.direction = (o.direction + 360) % 360; // Normalize again
                    }
                break;   
            }
        break;
        case "Mine":
            switch (o.state) {
                case "Approach":
                break;
            }
        break;
        case "Boss": 

        if (100 / o.maxHitPoints * o.hitPoints < 0) {
            o.element.style.backgroundPositionX = "-576px";
        } else if (100 / o.maxHitPoints * o.hitPoints < 25) {
            o.element.style.backgroundPositionX = "-432px";
        } else if (100 / o.maxHitPoints * o.hitPoints < 50) {
            o.element.style.backgroundPositionX = "-288px";
        } else if (100 / o.maxHitPoints * o.hitPoints < 75) {
            o.element.style.backgroundPositionX = "-144px";
        } 

        if (o.rage === false && 100 / o.maxHitPoints * o.hitPoints < 50) {
            o.rage = true;
            o.maxSpeed *= 1.5;
            o.bulletSpeed *= 1.5;
        }

        if (o.hitPoints < 0 && o.state != "Die") {
            o.state = "Die";
            o.speed = 0;
            o.direction = 90;                
            gameAlarm.stopAlarm("fire");
        }

        if (o.hitPoints > 0) {
            switch (o.state) {
                case "Approach":
                    o.direction = pointDirection(o.x, o.y, o.wayPointX[o.nextWayPoint], o.wayPointY[o.nextWayPoint]);
                    o.speed = o.maxSpeed;  

                    if (Math.random()*100 < o.plasmaChance && o.plasmaNum < o.plasmaMax) {
                        o.plasmaNum++;
                        let plasma;
                        plasma = createEnemy("BossPlasma1", o.x+o.cx, o.y+o.cy);
                        plasma.master = o;
                    }

                    if (pointDistance(o.x, o.y, o.wayPointX[o.nextWayPoint], o.wayPointY[o.nextWayPoint]) <= o.wayPointTolerance) {
                        o.currentWayPoint = o.nextWayPoint;
                        o.state = "Wait";
                        o.plasmaMax = 1;
                        o.speed = 0;
                        o.waitCounter = 0;
                        gameAlarm.setAlarm("fire", 120, () => {
                            o.state = "FireNormal";
                            o.patternShots = 0;
                        });
                    }                
                break;
                case "Wait": 
                    o.plasmaNum = 0;               
                break;    
                case "FireNormal":
                    o.fireDirection = (pointDirection(o.x, o.y, player.x, player.y));
                    o.fireAngle = o.fireDirection - (Math.random() * (o.fireRandomAngle/2));
                    for (var i = 0; i < o.shotsToFire; i++) {
                        fireEnemyBullet(o, o.fireAngle, o.bulletSpeed); 
                        o.fireAngle += o.fireRandomAngle/o.shotsToFire;
                    }
                    o.patternShots++;
                    if (o.patternShots < o.patternMaxShots) {
                        gameAlarm.setAlarm("fire", 20, () => {
                            o.state = "FireNormal";
                        });
                        o.state = "Wait";
                    } else {
                        o.nextWayPoint++;
                        if (o.nextWayPoint > 2) {
                            o.nextWayPoint = 0;
                        }
                        o.state = "Approach";
                    }
                break;
                case "Die": 
                   speed = 0;
                break;
            }
        }
        break;
        case "BossPlasma1":
            o.x = o.master.x+o.master.cx;
            o.y = o.master.y+o.master.cy;

            switch (o.state) {               
                case "Fireup":
                        currentBossPlasma1AudioIndex = playAudioFromPool(audioPool_BossPlasma1, currentBossPlasma1AudioIndex);
                    setTimeout(() => {
                        let plasma;
                        plasma = createEnemy("BossPlasma2", o.x, o.y);
                        plasma.master = o.master;
                        o.isActive = false;
                    }, 1200);
                    o.state = "Die";
                break;
            }
        break;
        case "BossPlasma2":
            o.x = o.master.x+o.master.cx;
            o.y = o.master.y+o.master.cy;

            switch (o.state) {
                case "Fireup":
                    currentBossPlasma2AudioIndex = playAudioFromPool(audioPool_BossPlasma2, currentBossPlasma2AudioIndex);
                    setTimeout(() => {
                        o.isActive = false;
                    }, 1100);
                    o.state = "Die";
                break;
            }
    break;
    }
    //-------------------- die
    if (o.y > gameHeight) {
        o.isActive = false;
    }
}

function createEnemy(enemyType = "UFO", x = -320, y = -96) {
    const config = enemyConfigurations[enemyType];
    if (!config) {
        return null;
    }

    const enemyClass = config.CSS;
    const enemy = createGameObject(x, y, enemyClass, config);
    let wayPointX = 0, wayPointY = 0;
    
    switch (enemyType) {
        case "UFO":
            ({ wayPointX, wayPointY } = generateWayPoints());
            enemy.wayPointX = wayPointX;
            enemy.wayPointY = wayPointY;
        break;
        case "FlyBy":
            if (x > 384) {
                enemy.element.style.transform = "scaleX(-1)";
                enemy.shadowElement.style.transform = "scaleX(-1)";
                enemy.xDir = 1;
            }
        break;
        case "Kamikaze":
            enemy.wayPointX = Math.floor(Math.random()*(gameWidth-tileSize*2)+tileSize);
            enemy.wayPointY = 96;
        break;   
        case "Boss":
        break;   
        default:
            ({ wayPointX, wayPointY } = generateWayPoints());
            enemy.wayPointX = wayPointX;
            enemy.wayPointY = wayPointY;
        break;
    } 
    enemy.x = x;
    enemy.y = y;
    activeEnemies.push(enemy);
    adjustLevelEnemy(enemy); // adjust values for current game difficulty level
    return enemy;
}

// Simple difficulty adjustment for common enemy types
function adjustLevelEnemy(enemyHandle) {
    let attributesToUpdate = {
        maxSpeed: enemyHandle.maxSpeed + (.15 * gameLevel),
        hitpoints: enemyHandle.hitpoints + (75 * gameLevel),
        fireInterval: enemyHandle.fireInterval - (.2 * gameLevel),
        bulletSpeed: enemyHandle.bulletSpeed + (.2 * gameLevel),
        waitInterval: enemyHandle.waitInterval - ((gameLevel * .5) * 5),
        dropChance: enemyHandle.dropChance + gameLevel,
      };
      
      Object.keys(attributesToUpdate).forEach(key => {
        enemyHandle[key] = attributesToUpdate[key];
      });
}

function generateWayPoints() {
    // put x somewhere between screen boundaries
     let wayPointX = Math.floor(Math.random() * (gameWidth - (border*2) - tileSize)) + border; 

    // put y somewhere between 25% and 75% of game screen height
    let wayPointY = Math.floor(Math.random() * (gameHeight / 4)) + gameHeight / 4; 
    return { wayPointX, wayPointY };
}

function destroyEnemy(enemyHandle) {
    createThing(enemyHandle.x, enemyHandle.y, 'explosionbig', true, 0);
    currentExplosionAudioIndex = playAudioFromPool(audioPool_Explosions, currentExplosionAudioIndex);
    const randomFloat = (Math.floor(Math.random() * 100));

    if (enemyHandle.callSign === "Mine") {
            for (let i = 0; i <360; i += 30) {
                fireEnemyBullet(enemyHandle, i, enemyHandle.bulletSpeed, false);
            }
    }
    if (enemyHandle.callSign === "Boss") {

        enemyHandle.direction = 90;
        for (let i = 0; i <10; i++) {
            let o = Math.random()*enemyHandle.bbw + enemyHandle.x;
            let p = Math.random()*enemyHandle.bbh + enemyHandle.y;
            gameAlarm.setAlarm(i.toString(), 20*i, () => {
                currentExplosionAudioIndex = playAudioFromPool(audioPool_Explosions, currentExplosionAudioIndex);
                createThing(o, p, 'explosionbig', true, 0);
            });
        }

        gameAlarm.setAlarm("nuke", 180, () => {
            if (soundIsOn) {
                nukeSound.play();
            }
            createThing(enemyHandle.x, enemyHandle.y, 'explosionbig2', true, 0);
        });

        gameAlarm.setAlarm("gameOver/win", 200, () => {
            enemyHandle.isActive = false;
            isGameOver = true;
        });
    }


    // Powerup spawning logic. Customized for increased cow spawn 
    // when player is high-level, to make game progress faster
    cowSpawnRate = baseCowSpawnRate + (playerStrength * increaseFactor);

    let actualDropChance = enemyHandle.dropChance + pseudoDrop;
    let randomNum = Math.random() * 100;

    if (randomNum <= actualDropChance) {
        let cowRandomNum = Math.random() * 100;
        if (cowRandomNum <= cowSpawnRate) {
            createPowerUp(enemyHandle.x, enemyHandle.y, 3);
        } else {
            createPowerUp(enemyHandle.x, enemyHandle.y);
        }
        pseudoDrop = 0; // Reset pseudoDrop
    } else {
        pseudoDrop += increasePseudoDropValue; // Increase pseudoDrop
    }
    if (enemyHandle.callSign != "Boss") {
        enemyHandle.isActive = false;
    }
}

function moveBullet(bulletHandle) {
    if (!bulletHandle) {
        return;
    }
    function removeBullet() {
        if (gameContainer.contains(bulletHandle.element)) {
            gameContainer.removeChild(bulletHandle.element);
        }
        const index = activeEnemyBullets.indexOf(bulletHandle);
        if (index !== -1) {
            activeEnemyBullets.splice(index, 1);
        }
    }

    let { hSpeed, vSpeed } = speedConvert(bulletHandle.speed, bulletHandle.direction);
    bulletHandle.x += hSpeed;
    bulletHandle.y += vSpeed;
    updateGameObject(bulletHandle, bulletHandle.x, bulletHandle.y);

    if (isColliding(player, bulletHandle)) {
        if (player.invincible === false && player.dead == false) {                
            playerDie();
        }
        /* applyBlink(player);
        player.hitPoints -= 10; */
        removeBullet();
        return;
    }

    if (bulletHandle.x < 0 || bulletHandle.x > gameWidth || bulletHandle.y < 0 || bulletHandle.y > gameHeight) {
        removeBullet();
    }
}

// Blink effect for getting hit (performance costly!!!)
function applyBlink(gameObjectHandle) {
    gameObjectHandle.element.classList.add('blink');
      // timeout is in ms
    setTimeout(() => {
      gameObjectHandle.element.classList.remove('blink');
    }, 30);
  }
