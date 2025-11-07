// ------------ Trigonometry & math -------------------------------
// helper functions for cleaner code. 
// Mostly inspired by default functionality of Game Maker Studio
// ----------------------------------------------------------------

// Distance between two coordinates
function pointDistance(x1, y1, x2, y2) {
    let y = x2-x1;
    let x = y2-y1;
    return Math.sqrt(x * x + y * y);
}

// Returns angle between two points
function pointDirection(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

// Returns sign of closest turn direction
function angleDifference(angle1, angle2) {
    const diffClockwise = (angle2 - angle1 + 360) % 360;
    const diffCounterClockwise = (angle1 - angle2 + 360) % 360;
    return diffClockwise < diffCounterClockwise ? 1 : -1;
}

// Extracts axis speeds from direction and speed
function speedConvert(speed, directionInDegrees) {
    // direction --> radians
    const directionInRadians = directionInDegrees * (Math.PI / 180);
    const hSpeed = speed * Math.cos(directionInRadians);
    const vSpeed = speed * Math.sin(directionInRadians);

    return { hSpeed, vSpeed };
}

// Simple irandom function
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Simple random picker. Usage: choose("apple", "orange", "pear)
// you can also pass an array, and it will choose between elements (only one array supported)
function choose() {
    let args;
    
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      args = arguments[0];  // If a single array argument is passed, use it
    } else {
      args = arguments;  // Otherwise, use the arguments as-is
    }
    
    if (args.length === 0) {
      return undefined;  // Return undefined if no arguments or empty array
    }
    
    const randomIndex = Math.floor(Math.random() * args.length);
    return args[randomIndex];
}

// simple clamp
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getRandomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

// manual bounding box collision
// defaults to CSS element size if bbx, bbw... etc not specified
function isColliding(handle1, handle2) {
    if (!handle1 || !handle2) return false;

    const element1 = handle1.element;
    const element2 = handle2.element;

    let x1 = parseInt(element1.style.left) || 0;
    let y1 = parseInt(element1.style.top) || 0;
    let bbw1 = handle1.bbw || element1.offsetWidth || 0;
    let bbh1 = handle1.bbh || element1.offsetHeight || 0;

    let x2 = parseInt(element2.style.left) || 0;
    let y2 = parseInt(element2.style.top) || 0;
    let bbw2 = handle2.bbw || element2.offsetWidth || 0;
    let bbh2 = handle2.bbh || element2.offsetHeight || 0;

    // Apply custom bounding box offsets if available
    x1 += handle1.bbx || 0;
    y1 += handle1.bby || 0;
    x2 += handle2.bbx || 0;
    y2 += handle2.bby || 0;

    return !(x1 > x2 + bbw2 ||
            x1 + bbw1 < x2 ||
            y1 > y2 + bbh2 ||
            y1 + bbh1 < y2);
}

// heh
function grid(coord) {
    return coord*tileSize;
}