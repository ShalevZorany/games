// Initialize game variables
let step = 1;
let score = 0;
let totalScore = 0; // New variable to track the cumulative score
let secretNumberDigits = 3;
let guessDigits = 0;
let secretNumber = generateSecretNumber(secretNumberDigits);
let guesses = [];
let hintUsed = false;
let adminUsed = false;

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

// Function to process the user's guess
function processGuess(guess) {
  if (!validateGuess(guess)) {
    alert('Invalid guess! Make sure you enter a ' + secretNumberDigits + '-digit number with no repeating digits, and without the digit 0.');
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
    if (step < 3) {
      step++;
      secretNumberDigits++;
      guessDigits = 0;
      secretNumber = generateSecretNumber(secretNumberDigits);
      guesses = [];
      hintUsed = false;
      adminUsed = false;
      alert('Congratulations! You have guessed all the digits correctly. Moving on to the next step.');
      document.getElementById('step').textContent = step;
      document.getElementById('digits').textContent = secretNumberDigits;
      document.getElementById('guessDigits').textContent = guessDigits;
      guessTableBody.innerHTML = '';
    } else {
      // Game Over
      alert('Congratulations! You have completed all the steps. Final Score: ' + totalScore);
      // You can add any additional logic or actions for the end of the game here
    }
  }
}

// Function to provide a hint by revealing the first digit of the secret number
function getHint() {
  if (hintUsed) {
    alert('Hint already used in this step!');
    return;
  }

  hintUsed = true;
  const hintDigit = secretNumber[0];
  alert('Hint: The first digit of the secret number is ' + hintDigit);
}

// Function to reveal the secret number (admin functionality)
function revealSecretNumber() {
  if (adminUsed) {
    alert('Admin functionality already used in this step!');
    return;
  }

  adminUsed = true;
  score = 0; // Reset the score to 0 for the current step
  alert('Admin: The secret number is ' + secretNumber + '\nScore: 0');
  document.getElementById('score').textContent = score;

  // Update guess table scores to 0
  const guessTableRows = document.querySelectorAll('#guessTableBody tr');
  guessTableRows.forEach((row) => {
    const scoreCell = row.querySelector('td:nth-child(3)');
    scoreCell.textContent = '0';
  });
}

// Event listener for the guess button
document.getElementById('guessButton').addEventListener('click', function() {
  const guessInput = document.getElementById('guessInput');
  const guess = guessInput.value.trim();
  guessInput.value = '';
  processGuess(guess);
});

// Event listener for the hint button
document.getElementById('hintButton').addEventListener('click', getHint);

// Event listener for the admin button
document.getElementById('adminButton').addEventListener('click', revealSecretNumber);
