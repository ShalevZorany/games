// Get DOM elements
const levelElement = document.getElementById('level');
const scoreElement = document.getElementById('score');
const digitsElement = document.getElementById('digits');
const guessDigitsElement = document.getElementById('guessDigits');
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const hintButton = document.getElementById('hintButton');
const adminButton = document.getElementById('adminButton');
const guessTableBody = document.getElementById('guessTableBody');

// Game variables
let level = 1;
let score = 0;
let secretNumber = generateSecretNumber(level);
let guessCount = 0;
let startTime = 0;

// Display the game info
displayGameInfo();

// Event listeners
guessButton.addEventListener('click', handleGuess);
hintButton.addEventListener('click', getHint);
adminButton.addEventListener('click', adminMode);

// Handle the guess
function handleGuess() {
  const guess = guessInput.value;
  if (validateGuess(guess)) {
    const result = checkGuess(guess);
    displayGuess(guess, result);
    guessInput.value = '';
    guessCount++;
    if (result.correctDigits === secretNumber.length) {
      endGame(true);
    } else if (guessCount === 3) {
      endGame(false);
    }
  }
}

// Validate the guess
function validateGuess(guess) {
  if (guess.length !== secretNumber.length) {
    displayMessage(`Please enter a ${secretNumber.length}-digit number.`);
    return false;
  }
  const hasDuplicateDigits = new Set(guess).size !== guess.length;
  if (hasDuplicateDigits) {
    displayMessage('Please enter a number without repeating digits.');
    return false;
  }
  const hasZeroDigit = guess.includes('0');
  if (hasZeroDigit) {
    displayMessage('Please enter a number without the digit 0.');
    return false;
  }
  return true;
}

// Check the guess against the secret number
function checkGuess(guess) {
  let correctPlace = 0;
  let correctDigits = 0;
  let incorrectDigits = 0;

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretNumber[i]) {
      correctPlace++;
    } else if (secretNumber.includes(guess[i])) {
      correctDigits++;
    } else {
      incorrectDigits++;
    }
  }

  return {
    correctPlace,
    correctDigits,
    incorrectDigits
  };
}

// Display the guess and result in the table
function displayGuess(guess, result) {
  const row = document.createElement('tr');
  const indexCell = document.createElement('td');
  const guessCell = document.createElement('td');
  const correctPlaceCell = document.createElement('td');
  const correctDigitsCell = document.createElement('td');
  const incorrectDigitsCell = document.createElement('td');

  indexCell.textContent = guessCount;
  guessCell.textContent = guess;
  correctPlaceCell.textContent = result.correctPlace;
  correctDigitsCell.textContent = result.correctDigits;
  incorrectDigitsCell.textContent = result.incorrectDigits;

  row.appendChild(indexCell);
  row.appendChild(guessCell);
  row.appendChild(correctPlaceCell);
  row.appendChild(correctDigitsCell);
  row.appendChild(incorrectDigitsCell);

  guessTableBody.appendChild(row);
}

// Generate a secret number of the specified length
function generateSecretNumber(length) {
  let number = '';
  const digits = '123456789';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    number += digits[randomIndex];
    digits.splice(randomIndex, 1);
  }
  return number;
}

// Display the game info
function displayGameInfo() {
  levelElement.textContent = level;
  scoreElement.textContent = score;
  digitsElement.textContent = secretNumber.length;
  guessDigitsElement.textContent = guessCount;
}

// End the game
function endGame(isWin) {
  if (isWin) {
    displayMessage('Congratulations! You guessed the number.');
    score += 10;
    level++;
    secretNumber = generateSecretNumber(level);
    guessCount = 0;
  } else {
    displayMessage(`Game Over. The secret number was ${secretNumber}.`);
    score = Math.max(0, score - 5);
    level = 1;
    secretNumber = generateSecretNumber(level);
    guessCount = 0;
  }
  displayGameInfo();
  clearGuessTable();
}

// Clear the guess table
function clearGuessTable() {
  while (guessTableBody.firstChild) {
    guessTableBody.removeChild(guessTableBody.firstChild);
  }
}

// Display a message
function displayMessage(message) {
  alert(message);
}

// Get a hint
function getHint() {
  const firstCorrectDigit = secretNumber[0];
  displayMessage(`Hint: The first digit is ${firstCorrectDigit}`);
}

// Activate admin mode
function adminMode() {
  const isAdmin = prompt('Enter the admin password:') === 'admin123';
  if (isAdmin) {
    displayMessage(`Admin mode activated! The secret number is ${secretNumber}.`);
  } else {
    displayMessage('Invalid password. Admin mode not activated.');
  }
}
