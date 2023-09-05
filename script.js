// Initialize game variables
let step = 1;
let score = 0;
let totalScore = 0;
let secretNumberDigits = 3;
let secretNumber = generateSecretNumber(secretNumberDigits);
let guesses = [];
let hintUsed = false;
let adminUsed = false;
let gameOver = false;

// DOM elements
const levelElement = document.getElementById('level');
const scoreElement = document.getElementById('score');
const digitsElement = document.getElementById('digits');
const guessTableBody = document.getElementById('guessTableBody');
const feedbackElement = document.getElementById('feedback');
const hintButton = document.getElementById('hintButton');
const adminButton = document.getElementById('adminButton');

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

// Function to update UI elements
function updateUI() {
  levelElement.textContent = step;
  scoreElement.textContent = score;
  digitsElement.textContent = secretNumberDigits;
  feedbackElement.textContent = '';
  hintButton.disabled = hintUsed || gameOver;
  adminButton.disabled = adminUsed || gameOver;
}

// Function to award points for guessing
function awardPoints() {
  score += 10;
  updateUI();
}

// Function to check if the guess is correct
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

// Function to process user's guess
function processGuess(guess) {
  awardPoints();

  if (gameOver) {
    return;
  }

  if (!validateGuess(guess)) {
    feedbackElement.textContent = 'Invalid guess! Make sure you enter a ' + secretNumberDigits + '-digit number with no repeating digits, and without the digit 0.';
    return;
  }

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

  updateGuessTable();

  if (correctPlace === secretNumberDigits) {
    if (step === 3) {
      checkGuess(true);
      gameOver = true;
      alert('Congratulations! You have completed Stage 3.\nGame Over');
      showResult(totalScore);
      showNewGameButton();
    } else {
      checkGuess(true);
      step++;
      document.getElementById('level').textContent = step;
      alert('Correct guess! Proceed to Stage ' + step);

      secretNumberDigits++;
      console.log("Updated secretNumberDigits:", secretNumberDigits);
      document.getElementById('digits').textContent = secretNumberDigits;
      console.log("DOM content:", document.getElementById('digits').textContent);

      secretNumber = generateSecretNumber(secretNumberDigits);
      guesses = [];
      hintUsed = false;
      adminUsed = false;
      document.getElementById('guessTableBody').innerHTML = '';
    }
  } else {
    checkGuess(false);
  }
}

// Function to update the guess table
function updateGuessTable() {
  guessTableBody.innerHTML = '';

  guesses.forEach((guessObj, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${guessObj.guess}</td>
      <td>${guessObj.correctPlace}</td>
      <td>${guessObj.correctDigits}</td>
      <td>${guessObj.incorrectDigits}</td>
    `;
    guessTableBody.appendChild(newRow);
  });
}

// Function to provide a hint by revealing the first digit of the secret number
function getHint() {
  if (hintUsed || gameOver) {
    return;
  }

  hintUsed = true;
  score += 50;
  const hintDigit = secretNumber[0];
  alert('Hint: The first digit of the secret number is ' + hintDigit);
  updateUI();
}

// Function to reveal the secret number (admin functionality)
function revealSecretNumber() {
  if (adminUsed || gameOver) {
    return;
  }

  adminUsed = true;
  score += 100;
  totalScore += 100;
  const adminMessage = 'Admin: The secret number is ' + secretNumber + '\nScore: ' + score;
  alert(adminMessage);
  updateUI();
}

// Function to start a new game
function startNewGame() {
  step = 1;
  score = 0;
  totalScore = 0;
  secretNumberDigits = 3;
  secretNumber = generateSecretNumber(secretNumberDigits);
  guesses = [];
  hintUsed = false;
  adminUsed = false;
  gameOver = false;
  updateUI();
}

// Add event listener for the 'Get Hint' button
hintButton.addEventListener('click', getHint);

// Add event listener for the 'Admin' button
adminButton.addEventListener('click', revealSecretNumber);

// Add event listener for the 'Guess' button
document.getElementById('guessButton').addEventListener('click', () => {
  const guessInput = document.getElementById('guessInput');
  processGuess(guessInput.value);
  guessInput.value = ''; // Clear the input field
});

// Initialize the game
startNewGame();
