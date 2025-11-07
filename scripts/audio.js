// ----------------------------------------------------------------
// Audio pooling system - due arcade nature of the game, 
// audio needs multiple channels to cover all that's going on
// ----------------------------------------------------------------

function createAudioPool(sfxArray, poolSize) {
    const audioPool = [];
    for (let i = 0; i < poolSize; i++) {
        for (const sfx of sfxArray) {
            const audio = new Audio(sfx);
            audio.volume = soundVolume;
            audioPool.push(audio);
        }
    }
    return audioPool;
}

let music = new Audio('https://www.indrek.org/game/sfx/track1.mp3');
music.loop = true;
music.muted = true;
music.volume = musicVolume;

const bulletSFX = ['sfx/plrShoot1.wav', 'sfx/plrShoot2.wav', 'sfx/plrShoot3.wav','sfx/plrShoot1.wav', 'sfx/plrShoot2.wav', 'sfx/plrShoot3.wav'];
const hitSFX = ['sfx/enemyHit1.wav', 'sfx/enemyHit2.wav', 'sfx/enemyHit3.wav','sfx/enemyHit1.wav', 'sfx/enemyHit2.wav', 'sfx/enemyHit3.wav'];
const explosionSFX = ['sfx/explosion1.wav', 'sfx/explosion1.wav', 'sfx/explosion1.wav'];
const levelUpSFX = ['sfx/plrLevelUp.wav', 'sfx/plrLevelUp.wav', 'sfx/plrLevelUp.wav'];
const enemyFireSFX = ['sfx/enemyFireZap1.wav', 'sfx/enemyFireZap2.wav', 'sfx/enemyFireZap2.wav'];
const testSFX = ['sfx/ting.wav', 'sfx/ting.wav', 'sfx/ting.wav'];
const bossPlasma1SFX = ['sfx/BossFireup.wav','sfx/BossFireup.wav','sfx/BossFireup.wav'];
const bossPlasma2SFX = ['sfx/BossFireZap1.wav','sfx/BossFireZap2.wav','sfx/BossFireZap1.wav'];


const audioPool_Bullets = createAudioPool(bulletSFX, 6);
const audioPool_Hits = createAudioPool(hitSFX, 6);
const audioPool_Explosions = createAudioPool(explosionSFX, 3);
const audioPool_LevelUp = createAudioPool(levelUpSFX, 3);
const audioPool_EnemyFire = createAudioPool(enemyFireSFX, 3);
const audioPool_Test = createAudioPool(testSFX, 3);
const audioPool_BossPlasma1 = createAudioPool(bossPlasma1SFX, 3);
const audioPool_BossPlasma2 = createAudioPool(bossPlasma2SFX, 3);


let currentBulletAudioIndex = 0;
let currentHitAudioIndex = 0;
let currentExplosionAudioIndex = 0;
let currentLevelUpAudioIndex = 0;
let currentEnemyFireAudioIndex = 0;
let currentTestAudioIndex = 0;
let currentBossPlasma1AudioIndex = 0;
let currentBossPlasma2AudioIndex = 0;

const introDoorSound = new Audio();
introDoorSound.src = 'sfx/spaceDoor.wav';
introDoorSound.volume = soundVolume;

const nukeSound = new Audio();
nukeSound.src = 'sfx/explosion2.wav';
nukeSound.volume = soundVolume;


function playAudioFromPool(audioPool, currentIndex) {
    if (!soundIsOn || currentIndex >= audioPool.length) return currentIndex;
    // Play the audio at index, increase and reset if end
    audioPool[currentIndex].volume = soundVolume;
    audioPool[currentIndex].play();
    currentIndex++;
  
    if (currentIndex >= audioPool.length) {
        currentIndex = 0;
    }
  
    return currentIndex;
}