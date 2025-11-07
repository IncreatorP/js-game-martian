
function createPowerUp(x, y, puType = -1) {
    const randomDir = (Math.floor(Math.random() * 100) + 40);
    if (puType === -1) {
        puType = choose(0,1,2,3);
    }

    const className = ['powerup firepower','powerup firespeed', 'powerup movespeed', 'moo'];
    let score;
    const config = {
        hasShadow: true,
        timeOut: 300,
        counter: 0,
        direction: randomDir,
        speed: 1.2,
        puType: puType,
        rotation: randomDir,
        rotationSpeed: .2
    }
    const powerup = createGameObject(x, y, className[puType], config);
    Object.keys(config).forEach(key => {
        powerup[key] = config[key];
      });
    if (puType === 3)
    {
        powerup.element.style.transform = `rotate(${powerup.rotation}deg)`;
    }

    activePowerUps.push(powerup);
    return powerup;
}

function movePowerup(objectHandle) {
    if (objectHandle.isActive)
    {
        // force to leave screen if timeout
        objectHandle.counter++; 
        objectHandle.rotation += objectHandle.rotationSpeed;
        // rotate shadow for the cow
        if (objectHandle.puType === 3) {
            objectHandle.element.style.transform = `rotate(${objectHandle.rotation}deg)`;
            objectHandle.shadowElement.style.transform = `rotate(${objectHandle.rotation}deg)`;
        }

        if (isColliding(objectHandle, player) && player.dead === false) {

                const xx = objectHandle.x;
                const yy = objectHandle.y;
                objectHandle.isActive = false;
                switch (objectHandle.puType) {
                    case 0:
                    if (player.shootLevel < player.maxShootLevel) {
                        currentLevelUpAudioIndex = playAudioFromPool(audioPool_LevelUp, currentLevelUpAudioIndex);
                        player.shootLevel++;
                        giveScore(xx, yy, 250, "Guns upgrade");
                        playerStrength++;
                    } else {
                        giveScore(xx,yy,1000);
                    } 
                break;
                    case 1:
                        if (player.shootSpeedLevel < player.maxShootSpeedLevel) {
                            player.shootSpeedLevel++;
                            player.shootingInterval = 200 - (player.shootSpeedLevel*14);
                            clearInterval(player.shootingIntervalID); // reset for change to apply
                            player.shootingIntervalID = null;
                            playerStrength++;
                            giveScore(xx, yy, 250, "Shooting computer upgrade");
                        } else {
                            giveScore(xx, yy, 1000);
                        } 
                    break;
                    case 2:
                        if (player.moveSpeedLevel < player.maxMoveSpeedLevel) {
                            player.moveSpeedLevel++;
                            player.speed = player.initialSpeed+player.moveSpeedLevel*.5;
                            playerStrength++;
                            giveScore(xx, yy, 250, "Thruster upgrade");
                        } else {
                            giveScore(xx, yy, 1000);
                        } 
                    break;
                    case 3: 
                        cowsSaved++;                        
                        if (gameLevel < maxGameLevel)
                        {
                            gameLevel = Math.round(maxGameLevel/cowsToSave*cowsSaved)+1;
                        }
                        giveScore(xx, yy, 5000);

                    break;
                }              
                currentLevelUpAudioIndex = playAudioFromPool(audioPool_LevelUp, currentLevelUpAudioIndex);
            }
    }

    if (objectHandle.counter === objectHandle.timeOut) {
        applyBlink(objectHandle);
        objectHandle.speed = 10;
        objectHandle.direction = 90;
    }
    if (objectHandle.Y > gameHeight) {
        objectHandle.setActive = false;
    }
}
