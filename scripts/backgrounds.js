// simple two-step scrolling background system
function makeBackground() {

   background1 = createGameObject(0,0,'background1');
   background2 = createGameObject(0,-gameHeight,'background1');
   
   background1.direction = 90;
   background1.speed = flySpeed;

   background2.direction = 90;
   background2.speed = flySpeed;

   if (gfxLevel > 0)
   {
      levelGrid1 = generateTiles(levelGrid1);
      tileGrid1 = indexTiles(levelGrid1);
      tileArray1 = makeTileObjects(levelGrid1, tileGrid1, 0, 1);  

      levelGrid2 = generateTiles(levelGrid2);
      tileGrid2 = indexTiles(levelGrid2);
      tileArray2 = makeTileObjects(levelGrid2, tileGrid2, -(gameHeight), 2);   

      reference1 = createGameObject(0, 0, 'reference-1');  
      reference1.speed = flySpeed;
      reference1.direction = 90;
      reference1.array = 1; 
      reference1.element.innerHTML = "ref 1";
      referenceArray.push(reference1);

      reference2 = createGameObject(720, -gameHeight, 'reference-2'); 
      reference2.speed = flySpeed;
      reference2.direction = 90;
      reference2.array = 2; 
      reference2.element.innerHTML = "ref 2";
      referenceArray.push(reference2);
   }  
}

// Reference objects mark tileset as "scrolled through"
 function moveReference(refHandle) {
   refHandle.x = 0;
   if (refHandle.y > gameHeight) {      
      if (refHandle.array == 1) {
         tileChoice = choose('tileset1-sand','tileset2-dunes','tileset3-stones','tileset4-tough','tileset5-desert','tileset6-hills');
         levelGrid1 = generateTiles(levelGrid1);
         tileGrid1 = indexTiles(levelGrid1);
         tileArray1 = makeTileObjects(levelGrid1, tileGrid1, -(gameHeight), 1);  
      } else {
         tileChoice = choose('tileset1-sand','tileset2-dunes','tileset3-stones','tileset4-tough','tileset5-desert','tileset6-hills');
         levelGrid2 = generateTiles(levelGrid2);
         tileGrid2 = indexTiles(levelGrid2);
         tileArray2 = makeTileObjects(levelGrid2, tileGrid2, -(gameHeight), 2);   
      }
      refHandle.y = -gameHeight;
   }
 }

// Debug functionality - unused
function log2DArrayAsTable(arr) {
   const table = arr.map(row => {
     const obj = {};
     row.forEach((cell, index) => {
       obj[index] = cell === 0 ? ' ' : cell;
     });
     return obj;
   });
   console.table(table);
 }
 
 function moveTiles(tileHandle) {
   if (tileHandle.y > gameHeight) {
      tileHandle.isActive = false;
   }
 }
 
function scrollBackground(gameObjectHandle) {
   gameObjectHandle.x = 0;
   if (gameObjectHandle.y >= gameHeight) {
      gameObjectHandle.y = -gameHeight;
   }
}
