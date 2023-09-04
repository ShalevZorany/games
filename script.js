// Initialize game variables
let step = 1;
let score = 0;
let totalScore = 0;
let secretNumberDigits = 3;
let guessDigits = 0;
let secretNumber = generateSecretNumber(secretNumberDigits);
let guesses = [];
let hintUsed = false;
let adminUsed = false;
let gameOver = false;

// Function to generate a random secret number with the specified number of digits
function generateSecretNumber(digits) {
  let number = '';
  const digitsArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  while (number.length < digits) {
    const randomIndex = Math.floor(Math.random() * digitsArray.length);
    const digit = digitsArray[randomIndex];

    if (!number.includes(digit)) {
      number += digit;
    }
  }

  return number;
}

// Function to validate the user's guess
function validateGuess(guess) {
    if (guess.length !== secretNumberDigits) {
        return false;
    }
    if (new Set(guess).size !== secretNumberDigits) {
        return false;
    }
    if (guess.includes('0')) {
        return false;
    }
    return true;
}

function checkGuess(isCorrect) {
    const feedbackElement = document.getElementById('feedback');

    if (isCorrect) {
        feedbackElement.textContent = 'Correct!';
        feedbackElement.classList.add('correct-feedback');
        feedbackElement.classList.remove('incorrect-feedback');
    } else {
        feedbackElement.textContent = 'Incorrect! Try again.';
        feedbackElement.classList.add('incorrect-feedback');
        feedbackElement.classList.remove('correct-feedback');
    }
}

function processGuess(guess) {
    if (gameOver || step > 5) {
        return;
    }

    if (!validateGuess(guess)) {
        alert('Invalid guess! Make sure you enter a ' + secretNumberDigits + '-digit number with no repeating digits, and without the digit 0.');
        return;
    }

// checkGuess(guess);

    let correctPlace = 0;
    let correctDigits = 0;
    let incorrectDigits = 0;

    for (let i = 0; i < secretNumber.length; i++) {
        const secretDigit = secretNumber[i];
        const guessDigit = guess[i];

        if (secretDigit === guessDigit) {
            correctPlace++;
        } else if (secretNumber.includes(guessDigit)) {
            correctDigits++;
        } else {
            incorrectDigits++;
        }
    }

    guesses.push({
        guess: guess,
        correctPlace: correctPlace,
        correctDigits: correctDigits,
        incorrectDigits: incorrectDigits
    });

  // Update game information
  guessDigits++;
  score += 10; // Increase score for each guess
  totalScore += score; // Update the total score
  document.getElementById('score').textContent = score;
  document.getElementById('guessDigits').textContent = guessDigits;

  // Update guess table
  const guessTableBody = document.getElementById('guessTableBody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${guesses.length}</td>
    <td>${guess}</td>
    <td>${correctPlace}</td>
    <td>${correctDigits}</td>
    <td>${incorrectDigits}</td>
  `;
  guessTableBody.appendChild(newRow);

  // Check if the user has guessed all digits correctly
if (correctPlace === secretNumberDigits) {
    checkGuess(true); // Correct guess
} else {
    checkGuess(false); // Incorrect guess
}
      // Game Over after Stage 3
      gameOver = true;
      alert('Congratulations! You have completed Stage 3.\nGame Over');
      showResult(totalScore);
      showNewGameButton();
    }
}

// Function to show the result
function showResult(score) {
  const resultContainer = document.getElementById('result');
  resultContainer.textContent = 'Your Result: ' + score + ' points';
}

// Function to show the "New Game" button
function showNewGameButton() {
  const newGameButton = document.getElementById('newGameButton');
  newGameButton.style.display = 'inline-block';
}

// Event listener for the guess button
document.getElementById('guessButton').addEventListener('click', function() {
  const guessInput = document.getElementById('guessInput');
  const guess = guessInput.value.trim();
  guessInput.value = '';
  processGuess(guess);
});

// Event listener for the hint button
document.getElementById('hintButton').addEventListener('click', function() {
  getHint();
  if (step === 5) {
    document.getElementById('hintButton').disabled = true;
  }
});

// Event listener for the admin button
document.getElementById('adminButton').addEventListener('click', function() {
  revealSecretNumber();
});

// Event listener for the new game button
document.getElementById('newGameButton').addEventListener('click', function() {
  startNewGame();
});

// Function to provide a hint by revealing the first digit of the secret number
function getHint() {
  if (hintUsed || gameOver) {
    return;
  }

  hintUsed = true;
  score += 50; // Increase score by 50 for using a hint
  const hintDigit = secretNumber[0];
  alert('Hint: The first digit of the secret number is ' + hintDigit);
  document.getElementById('score').textContent = score;
}

// Function to reveal the secret number (admin functionality)
function revealSecretNumber() {
  if (adminUsed || gameOver) {
    return;
  }

  adminUsed = true;
  score += 100; // Increase the score by 100
  totalScore += 100; // Update the total score
  alert('Admin: The secret number is ' + secretNumber + '\nScore: ' + score);
  document.getElementById('score').textContent = score;
}


// Function to start a new game
function startNewGame() {
  step = 1;
  score = 0;
  totalScore = 0;
  secretNumberDigits = 3;
  guessDigits = 0;
  secretNumber = generateSecretNumber(secretNumberDigits);
  guesses = [];
  hintUsed = false;
  adminUsed = false;
  gameOver = false;
  document.getElementById('level').textContent = step;
  document.getElementById('score').textContent = score;
  document.getElementById('digits').textContent = secretNumberDigits;
  document.getElementById('guessDigits').textContent = guessDigits;
  document.getElementById('guessTableBody').innerHTML = '';
  document.getElementById('result').textContent = '';
  document.getElementById('newGameButton').style.display = 'none';
  document.getElementById('hintButton').disabled = false;
  document.getElementById('adminButton').disabled = false;
}

// Initialize the game
startNewGame();
