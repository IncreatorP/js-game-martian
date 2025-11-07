function generateTiles(sourceGrid) {
    // First stage: populate grid with 0 or 1
    let density = Math.random() * (.15 * gfxLevel) + .15; // variable density
    for (let i = 0; i < tilesX-1; i++) {
        for (let j = 0; j < tilesY-1; j++) {           
            sourceGrid[i][j] = Math.random() < density ? 1 : 0;
        }
    }

    // ...and make it less random
    // Cellular automata method to create more blobs in the grid
    let iterations = gridSmoothing; // adjustable smoothing
    for (let i = 0; i < iterations; i++) {
        sourceGrid = smoothGrid(sourceGrid);
    }
    return sourceGrid;
}

function createEmptyGrid() {
    let grid = [];
    for (let i = 0; i < tilesX-1; i++) {
        let row = [];
        for (let j = 0; j < tilesY-1; j++) {
            row.push(0);
        }
        grid.push(row);
    }
    return grid;
}

function smoothGrid(sourceGrid) {
    let newGrid = createEmptyGrid();
    for (let i = 0; i < tilesX-1; i++) {
        for (let j = 0; j < tilesY-1; j++) {
            let neighbors = countNeighbors(i, j, sourceGrid); 
            if (sourceGrid[i][j] === 1) {
                newGrid[i][j] = neighbors >= 4 ? 1 : 0;
            } else {
                newGrid[i][j] = neighbors >= 5 ? 1 : 0;
            }
        }
    }
    return newGrid;
}

function countNeighbors(x, y, sourceGrid) {
    // simpler neighbor count for generation. a bit not DRY
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newX = x + i;
            let newY = y + j;
            if (newX >= 0 && newY >= 0 && newX < tilesX-1 && newY < tilesY-1) {
                count += sourceGrid[newX][newY];
            }
        }
    }
    return count;
}

function indexTiles(sourceGrid) {
    // second stage: choose correct tile index from spritesheet
    let outPutGrid = createEmptyGrid();
    let tileConfig = [
        "00000000", "00000001", "01010001", "11010001", "11110001", "01110001", "01010000",
        "01000000", "11000001", "01110101", "11010111", "11111111", "11111101", "01110100",
        "01000101", "01010111", "11011101", "11110111", "11111111", "01111111", "01011100",
        "11000101", "11110101", "01110111", "00011111", "01011111", "01011101", "01010100",
        "11000111", "11111111", "01111100", "01000001", "00010100", "01000100", "00000100",
        "01000111", "11011111", "01111101", "01010101", "00010001", "11010101", "01110000",
        "00000101", "00010111", "00011101", "00010101", "00010000", "00000111", "00011100"
    ]
    let sum;
    for (let yy = 0; yy < tilesX-1; yy++) {
        for (let xx = 0; xx < tilesY-1; xx++) {
            // generate hash for each tile showing neighbor configuration
            sum = findNeighbors(xx, yy, sourceGrid);

            // check if tile hash matches configuration and set the index accordingly
            let matchFound = false; 
            for (let i = 0; i < tileConfig.length; i++) {
                if (sum.toString() === tileConfig[i]) {
                    outPutGrid[xx][yy] = i;
                    matchFound = true;
                    break;  // exit the loop if a match is found
                }
            }
            if (!matchFound) {
                outPutGrid[xx][yy] = 0;  // set to 0 only if no match was found
            }
        }
    }
    return outPutGrid;
}

function findNeighbors(xx, yy, sourceGrid) {
    // third stage: hash calculation
    // since 2^8 is 256 possible configurations, and we need only 47,
    // we check major directions first, and cardinal directions only when applicable

    let e = checkTile(xx + 1, yy, sourceGrid) || 0;
    if (xx == tilesX) e = choose(0,1);
    let n = checkTile(xx, yy - 1, sourceGrid) || 0;
    let w = checkTile(xx - 1, yy, sourceGrid) || 0;
    if (xx == 0) w = choose(0,1);
    let s = checkTile(xx, yy + 1, sourceGrid) || 0;

    // we need to check 47 cases, not 256, thus we do cardinal dirs second
    let ne = 0;
    if (n && e) {
        ne = checkTile(xx + 1, yy - 1, sourceGrid); }

    let nw = 0
    if (n && w) {
        nw = checkTile(xx - 1, yy - 1, sourceGrid); }

    let sw = 0;
    if (s && w) {
        sw = checkTile(xx - 1, yy + 1, sourceGrid); }

    let se = 0;
    if (s && e) {
        se = checkTile(xx + 1, yy + 1, sourceGrid); }


    // generate 8-digit hash string
    let sum = se.toString() + s.toString() + sw.toString() + w.toString() + nw.toString() + n.toString() + ne.toString() + e.toString();
    return sum;
}

function checkTile(xx, yy, sourceGrid) {
    // DRY
    let result = 0;
    if (xx >= 0 && xx < tilesX-1 && yy >= 0 && yy < tilesY-1) {
        result = sourceGrid[xx][yy]; // final map with correct image number
    }
    return result;
}

function makeTileObjects(sourceGrid, targetGrid, minusY = -(gameHeight)) {
    // fourth stage: create actual game objects and push to tile array  
    let tileNumber = 0;
    let x, y;
    let outputArray = [];
    for (let j = 0; j < tilesX-1; j++) {
        for (let i = 0; i < tilesY-1; i++) {
            tileNumber = targetGrid[i][j];
            x = i * tileSize;
            y = j * tileSize;
            if (sourceGrid[i][j] === 1) {
                const tile = createGameObject(x, y + minusY, tileChoice);
                adjustTileBackground(tile, tileNumber);
                tile.speed = flySpeed;
                tile.direction = 90;
                tile.isActive = true;
                outputArray.push(tile);
            } else {
                if (Math.random() * 100 < 15) { // 15% chance for basic tile
                  const tile = createGameObject(x, y + minusY, 'tileset-base');
                  
                  tileNumber = pickChoice();

                  if (tileNumber === 48) {
                    if (Math.random() * 100 > 0.1) {
                        tileNumber = 0; // tssh!
                      }
                  }

                  adjustTileBackground(tile, tileNumber);
                  tile.speed = flySpeed;
                  tile.direction = 90;
                  tile.isActive = true;
                  outputArray.push(tile);
                }
              }
        }
    }
    return outputArray;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function pickChoice() {  
    if (choices.length === 0) {
      // Reset array when depleted
      choices = Array.from({ length: 49 }, (_, i) => i);
      shuffleArray(choices);
    }
    
    return choices.pop();
}

function adjustTileBackground(objectHandle, tileNumber) {
    // choosing correct image from spritesheet
    // Calculate the row and column in the grid
    let row = Math.floor(tileNumber / 7);
    let col = tileNumber % 7;  

    // Calculate the x and y position
    let xPos = -(col * 48);
    let yPos = -(row * 48);

    objectHandle.element.style.backgroundPosition = `${xPos}px ${yPos}px`;
}

