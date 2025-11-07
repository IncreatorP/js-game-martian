// ui divs
const gameContainer = document.getElementById("game-container");
const gameContainerRect = gameContainer.getBoundingClientRect();
const gameWidth = gameContainerRect.width;
const gameHeight = gameContainerRect.height;
const introBackground = document.getElementById("introBackground");
const introDoor = document.getElementById("introDoor");
let longIntroDiv;
let longImageDiv;
let typeWriterDiv;
let helpTextElement; 
let warningDiv;

// deep copies of dom elements for easy dropping
let mainMenuPackage;;
let pauseMenuPackage;
let quitMenuPackage;


let scoresContainer;          
let gameOverContainer;
let playerNameInput;
let playerName = "Player 1";
let nameLabel;
let nameInput;

// old flow control, replaced with two-variable state machine
let isPaused = false; 
let isNamePrompt = true;
let isIntro = true;
let isGameOver = false;
let isBossFight = false;

// new flow control
let gameState = "mainMenu";
let gamePrevState = gameState;

//-------
let isFirstLaunch = false; // change to skip intro


let uiBar;
let uiScore;
let uiLives;
let uiTime;
let uiCows;
let uiDebug;
let gfxLevel = 2;
let fpsLock = 0;
let currentTime = Date.now();
let deltaTime;

let background1;
let background2;
let megaCrater = [];
let flySpeed = 3;

const border = 8; // border for vertical edges
const tileSize = 48; // typical size of gameObject
let buttons = [];
let pauseButtons = [];
let pauseCurrentIndex = 0;
let pauseKeyBlocked = false; 
let objectLoad;

let musicIsOn = false;
let soundIsOn = true;
let musicVolume = .6;
let soundVolume = .1;

let keyBlocked = false;
let currentIndex = 0;

let currentFrame = 0;
const totalFrames = 16;
const frameWidth = 96; 
let frameCount = 0;
let lastFPSUpdate = Date.now();
let fpsInterval = 1000 / 60;
let nextFrameTime = Date.now;

const keysPressed = {};

// object arrays
const activeBullets = [];
const activeEnemies = [];
const activeEnemyBullets = [];
const activePowerUps = [];
let tileArray1 = [];
let tileArray2 = [];
let referenceArray = [];
let reference1;
let reference2;
 
let gameTick = 100;
let tickMult = 0;
let second = 0;

let gameLevel = 1; // difficulty level (max 10)
const maxGameLevel = 10;
let bulletDebug = 0;
let playerScore = 0;
let pseudoDrop = 0;
let increasePseudoDropValue = 2; // 2% pseudo random adjustment per dead enemy

const cowsToSave = 30; // moo
let cowsSaved = 0;

// fps counter
let lastTime = Date.now();
let fps = 0;

let currentLine = 0;
let introTypeIndex = 0;
let introTypeSpeed = 150; 
const fasterSpeed = 15;
let isTypingComplete = false;
let isSpeedUp = false;
let effectiveSpeed = introTypeSpeed;
let currentScene = 0;
let typingComplete = false;
const lines = [
  ["2423 A.D.", "Planet Mars", "Experimental Agricultural", "Colony-002"],
  ["Attention!", "Deimosians are abducting our cattle!"],
  ["Not on my watch!", "Prepare Sentinel for launch.", "I'll deal with them."],
  ["Flight checks completed.", "Plasma cannons online.", "All ready for launch.", "Release the clamps!"]
];

const tilesX = 16;
const tilesY = 16;
let tileChoice;
let choices = Array.from({ length: 49 }, (_, i) => i); // choices for basic tileset (craters etc)

const gridSmoothing = 3;
let tileGrid1 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));
let tileGrid2 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));
let levelGrid1 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));
let levelGrid2 = new Array(tilesX).fill(null).map(() => new Array(tilesY).fill(0));

let cheatMode = true;
let debugTotalObjects = 0;
let animationFrameId; // for restarting animation loop

let introStage = 0;

let introCt = 0;
const introDelay = [240, 120];
let player;
let lives = 5;

let baseCowSpawnRate = 10;
let increaseFactor = 1;
let playerStrength = 0; // summary of player upgrades, to spawn more cows


const playerConfig = {
    callsign: "Player",
    playerEngine: null,
    invincible: false,
    dead: false,
    cx: 24,
    cy: 24,
    hSpeed: 0,
    vSpeed: 0,
    bbx: 2, // bounding box upper-left corner and width/height
    bbw: 44,
    bby: 2,
    bbh: 39,
    width: 48,
    height: 48,
    direction: 0,
    initialSpeed: 4,
    speed: 4,
    bulletSpeed: 12,
    shootLevel: 1,
    shootSpeedLevel: 1,
    maxShootLevel: 10,    
    maxShootSpeedLevel: 10,
    maxMoveSpeedLevel: 10,
    moveSpeedLevel: 1,
    shootingIntervalID: null,
    shootingInterval: 200,
    hasShadow: true,
    scoreMultiplier: 1,
    scoreTimer: 0,
    scoreTimerInterval: 120 // 2 seconds        
};

const enemyConfigurations = {
    "UFO": {
        callSign: "UFO", // used for debugging mostly
        CSS: 'enemy',
        x: 0,
        y: 0,
        cx: 24,
        cy: 24,
        bbx: 3,
        bbw: 43,
        bby: 9,
        bbh: 30,
        speed: 1.7,
        maxSpeed: 2.5,
        hitPoints: 50,
        level: 1,
        bulletSpeed: 3,
        hasShadow: true,
        dir: 1, // horizontal direction multiplier for screen bouncing
        fireInterval: 60*2, // 2 seconds
        fireCounter: 60*2,
        direction: 90,
        dropChance: 15, // chance to drop a powerup
        state: "Approach",
        wayPointX: 400,
        wayPointY: 400,
        wayPointTolerance: 10,
        shotsFired: 0,
        shotsToFire: 3,
        wayPoints: 1,
        maxWayPoints: 1,
        pointValue: 100,
        shootRandom: true,
        randomShootChance: .5
    },
    "FlyBy": {
        callSign: "FlyBy", 
        CSS: 'enemy-flyby',
        xDir: 0,
        x: 0,
        y: 0,
        cx: 24,
        cy: 24,
        bbx: 18,
        bbw: 12,
        bby: 9,
        bbh: 28,
        speed: 1,
        maxSpeed: 5,
        direction: 90,
        hitPoints: 10,
        level: 1,
        bulletSpeed: 3,
        hasShadow: true,
        dir: 1, 
        fireInterval: 60*2, 
        fireCounter: 60*2,
        direction: 90,
        dropChance: 10,
        state: "Approach",
        shotsFired: 0,
        shotsToFire: 3,
        pointValue: 50,
        shootRandom: true,
        randomShootChance: 1,
        spreadAngle: 15 // random direction spread on speedup
    },
    "Kamikaze": {
        callSign: "Kamikaze", 
        CSS: 'enemy-kamikaze',
        xDir: 0,
        x: 0,
        y: 0,
        cx: 24,
        cy: 24,
        bbx: 8,
        bbw: 31,
        bby: 11,
        bbh: 23,
        speed: 2.5,
        maxSpeed: 5,
        direction: 90,
        hitPoints: 20,
        level: 1,
        hasShadow: true,
        dir: 1, 
        direction: 90,
        dropChance: 30,
        state: "Approach",
        pointValue: 250,
        wayPointX: 400,
        wayPointY: 400,
        wayPointTolerance: 10,
        wayPoints: 1,
        maxWayPoints: 1,
        waitCounter: 0,
        waitInterval: 60*3,
        turnAmount: 1, // amount of kamikaze turning to attack player. More is more dangerous
        turnTolerance: 5, // how much is "sufficient" angle towards player
        shootRandom: true,
        randomShootChance: 2,
        bulletSpeed: 2,
    },
    "Mine": {
        callSign: "Mine", 
        CSS: 'enemy-mine',
        x: 0,
        y: 0,
        cx: 24,
        cy: 24,
        bbx: 2,
        bbw: 46,
        bby: 2,
        bbh: 46,
        speed: .6,
        maxSpeed: 1.5,
        direction: 90,
        hitPoints: 80,
        level: 1,
        hasShadow: true,
        dir: 1, 
        direction: 90,
        dropChance: 80,
        state: "Approach",
        pointValue: 500,
        bulletSpeed: 5,
    },
    "Boss": {
      callSign: "Boss", 
      CSS: 'enemy-boss',
      x: 0,
      y: 0,
      cx: 49,
      cy: 78,
      bbx: 8,
      bbw: 131,
      bby: 12,
      bbh: 86,
      speed: 2,
      maxSpeed: 2,
      hitPoints: 3000,
      maxHitPoints: 3000,
      rage: false,
      level: 1,
      bulletSpeed: 3.5,
      hasShadow: true,
      dir: 1, 
      direction: 90,
      dropChance: 2, 
      state: "Approach",
      wayPointX: [24, 288, 600],
      wayPointY: [48, 128, 48],      
      currentWayPoint: 0,
      nextWayPoint: 0,
      wayPointTolerance: 10,     
      fireDirection: 0,
      fireRandomAngle: 40,
      bulletCount: 0,
      shotsFired: 0,
      shotsToFire: 4,
      patternShots: 0,
      patternMaxShots: 5,
      pointValue: 100000,
      shootRandom: false,
      randomShootChance: .5,
      plasmaChance: 2,
      plasmaNum: 0,
      plasmaMax: 0,
      dead: false,
  },
  "BossPlasma1": {
    callSign: "BossPlasma1", 
    CSS: 'enemy-boss-plasma1',
    x: 0,
    y: 0,
    cx: 24,
    cy: 24,
    bbx: 10,
    bbw: 28,
    bby: 10,
    bbh: 28,
    speed: 0,
    maxSpeed: 2,
    direction: 0,
    hasShadow: false,
    state: "Fireup",
    master: null
  },
  "BossPlasma2": {
    callSign: "BossPlasma2", 
    CSS: 'enemy-boss-plasma2',
    x: 0,
    y: 0,
    cx: 24,
    cy: 24,
    bbx: 10,
    bbw: 28,
    bby: 10,
    bbh: 720,
    speed: 0,
    maxSpeed: 2,
    direction: 0,
    hasShadow: false,
    state: "Fireup",
    master: null
  },
};

// Alarm system from Game Maker reimagined in JS
// for more flexible timing system
class Alarm {
    constructor() {
      this.alarms = {};
    }
  
    setAlarm(name, steps, callback) {
      this.alarms[name] = { steps, callback };
    }
  
    stopAlarm(name) {
      if (this.alarms[name]) {
        delete this.alarms[name];
      }
    }

    update() {
      for (const [name, alarm] of Object.entries(this.alarms)) {
        if (alarm.steps > 0) {
          alarm.steps--;
          if (alarm.steps === 0) {
            alarm.callback();
          }
        }
      }
    }
  } 
const gameAlarm = new Alarm();
    
/* USAGE example: 
Set an alarm called "spawnEnemy" that will trigger after 100 steps

gameAlarm.setAlarm("spawnEnemy", 100, () => {
    console-log("Enemy spawned!");
});
and
gameAlarm.stopAlarm("spawnEnemy");
*/
