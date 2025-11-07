// ----------------------------------------------------------------
// rudimentary object system with create, update and destroy functions
// ----------------------------------------------------------------

// Create a new object
function createGameObject(x, y, cssClass, config = {}) {
    const { hasShadow, speed } = config;  // Destructure properties from config object

    const element = document.createElement('div');
    element.className = cssClass;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    gameContainer.appendChild(element);

    if (cssClass === 'floating-score') {
        const { score } = config;
        element.textContent = score;
    }

    const gameObjectHandle = {
        callsign: "Default",
        isActive: true,
        x,
        y,
        element,
        direction: 90,
        speed,
        dir: 1,
        ...config  // Spread the remaining properties from config for custom attributes
    };

    Object.keys(config).forEach(key => {
        gameObjectHandle[key] = config[key];
      });

    if (hasShadow) {
        const shadowElement = document.createElement('div');
        const shadowClassName = `${cssClass}-shadow`;  // Generate the "-shadow" class name
        shadowElement.className = shadowClassName;
        shadowElement.style.left = `${x - 24}px`;
        shadowElement.style.top = `${y + 64}px`;
        shadowElement.style.filter = "grayscale(100%) brightness(0)";
        shadowElement.style.opacity = "0.3";
        gameContainer.appendChild(shadowElement);
        gameObjectHandle.shadowElement = shadowElement;
    }

    return gameObjectHandle;
}

// Redraw object and shadow
function updateGameObject(objectHandle, newX, newY) {
    objectHandle.element.style.left = `${newX}px`;
    objectHandle.element.style.top = `${newY}px`;

    // If has shadow, update the shadow
    if (objectHandle.shadowElement) {
        const shadowX = newX - 24;  
        const shadowY = newY + 64;  
        objectHandle.shadowElement.style.left = `${shadowX}px`;
        objectHandle.shadowElement.style.top = `${shadowY}px`;
    }
}

// Remove from game container
function destroyGameObject(objectHandle) {
    if (objectHandle && objectHandle.shadowElement) {
        gameContainer.removeChild(objectHandle.shadowElement);
        //document.removeChild(objectHandle.element);
    }

    if (objectHandle && objectHandle.element) {
        gameContainer.removeChild(objectHandle.element);
        //document.removeChild(objectHandle.element);
    }
    objectHandle = null;
}

// ------------ One-shot-animations -------------------------
// thingtype - 'thing' // randomRotation bool // randomPosition - in pixels, applies to both axes
function createThing(x, y, thingType, randomRotation, randomPosition) {
    const thing = document.createElement('div');
    thing.className = thingType;

    if (randomPosition > 0) {
        let randomAddX = Math.random() * randomPosition - randomPosition / 2;
        let randomAddY = Math.random() * randomPosition - randomPosition / 2;
        x = x + randomAddX;
        y = y + randomAddY;
    }

    thing.style.left = x + 'px';
    thing.style.top = y + 'px';
    
    // rotation
    if (randomRotation) {
        const randomAngle = Math.floor(Math.random() * 360);
        thing.style.transform = `rotate(${randomAngle}deg)`;
    }
    gameContainer.appendChild(thing);

    thing.addEventListener('animationend', function() {
        gameContainer.removeChild(thing);
    });
}