function initHighScore() {
    localStorage.removeItem('highScores');

    const highScores = JSON.parse(localStorage.getItem('highScores'));
  
    if (!highScores || highScores.length !== 10) {
      const initialHighScores = [];
      for (let i = 1; i <= 10; i++) {
        initialHighScores.push({ name: 'player', score: i*100 });
      }
  
      localStorage.setItem('highScores', JSON.stringify(initialHighScores));
    } 
}

function showGameOverMenu() {
  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.sort((a, b) => b.score - a.score); // Sort high to low
  let lowestHighScore = highScores[highScores.length - 1]?.score || 0; // Safeguard against empty array

  console.log(lowestHighScore);

  var gameOverMenu = document.getElementById("gameOverMenu");
  var goText = document.getElementById("go-text");

  if (playerScore > lowestHighScore) {
    gameState = "namePrompt";

    let nameLabel = gameOverMenu.querySelector('#labelForPlayerNameInput');
    let nameInput = gameOverMenu.querySelector('#playerNameInput');

    if (!nameLabel) {
      nameLabel = document.createElement('label');
      nameLabel.setAttribute('for', 'playerNameInput');
      nameLabel.textContent = 'Enter your name:';
      nameLabel.id = 'labelForPlayerNameInput'; // Set the id for later retrieval
      gameOverMenu.appendChild(nameLabel);
    }

    if (!nameInput) {
      nameInput = document.createElement('input');
      nameInput.setAttribute('type', 'text');
      nameInput.setAttribute('id', 'playerNameInput');
      nameInput.setAttribute('placeholder', 'Your Name');
      nameInput.setAttribute('maxlength', '18');
      nameInput.setAttribute('autofocus', true);
      gameOverMenu.appendChild(nameInput);
    }

    goText.innerText = `Congratulations! Your score of ${playerScore} is a new high score!`;
  } else {
    gameState = "gameOver";
    goText.innerText = `Your score of ${playerScore} did not make it to the high score list.`;

    setTimeout(() => { 
      gameState = "gameOver/waitInput";
      goText.innerText = `Press any key to continue`;
    }, 6000);
  }
}

function addHighScore(newScore) {
  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];  
  let added = false;

  for (let i = 0; i < highScores.length; i++) {
    if (newScore.score > highScores[i].score) {
      highScores.splice(i, 0, newScore);
      added = true;
      break;
    }
  }

  if (!added) {
    highScores.push(newScore);
  }

  // Trim top 10
  highScores = highScores.slice(0, 10);
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

function saveHighScore() {
  addHighScore({name: playerName, score: playerScore});
  var gameOverMenu = document.getElementById("gameOverMenu");
  let nameLabel = document.getElementById('labelForPlayerNameInput');
  let nameInput = document.getElementById('playerNameInput');
  
  // Remove the elements from the DOM
  if (nameLabel && nameLabel.parentNode === gameOverMenu) {
    gameOverMenu.removeChild(nameLabel);
  }
  if (nameInput && nameInput.parentNode === gameOverMenu) {
    gameOverMenu.removeChild(nameInput);
  }
}
