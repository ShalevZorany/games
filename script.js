// Global variables
var level = 1;
var score = 0;
var digits = 3;
var guessDigits = 0;
var secretNumber = '';
var attempts = 0;
var startTime = 0;
var hintUsed = false;
var adminPassword = 'rimon'; // Updated admin password
var guessedNumbers = new Set(); // Track guessed numbers
var updateTimeInterval;

// Function to generate a random number with the specified number of digits without repeating digits
function generateSecretNumber(numDigits) {
  var min = Math.pow(10, numDigits - 1);
  var max = Math.pow(10, numDigits) - 1;

  // Generate a random number within the range
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert the number to a string and check for repeating digits
  var secretNumberString = randomNumber.toString();
  var digitCount = new Set(secretNumberString).size;

  // If the number of unique digits is not equal to the number of digits,
  // regenerate the number until we have a valid one
  while (digitCount !== numDigits || guessedNumbers.has(randomNumber) || secretNumberString.includes('0')) {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    secretNumberString = randomNumber.toString();
    digitCount = new Set(secretNumberString).size;
  }

  return randomNumber;
}

// Function to update the game information displayed on the page
function updateGameInfo() {
  document.getElementById('level').textContent = level;
  document.getElementById('score').textContent = score;
  document.getElementById('digits').textContent = digits;
  document.getElementById('guessDigits').textContent = guessDigits;
}

// Function to update the score every second
function updateScore() {
  var currentTime = new Date().getTime();
  var timeElapsed = (currentTime - startTime) / 1000;
  score = Math.floor(Math.max(5000 - timeElapsed * 10, 0)); // Update the score calculation as desired
  updateGameInfo();
}

// Function to start a new game
function startGame() {
  secretNumber = generateSecretNumber(digits).toString();
  attempts = 0;
  startTime = new Date().getTime();
  hintUsed = false;
  document.getElementById('guessInput').disabled = false;
  document.getElementById('guessInput').value = '';
  document.getElementById('guessTableBody').innerHTML = '';
  updateGameInfo();

  // Start updating the score every second
  updateTimeInterval = setInterval(updateScore, 1000);
}

// Function to check the user's guess
function checkGuess() {
  var guessInput = document.getElementById('guessInput');
  var guess = guessInput.value.trim();

  // Validate the input
  if (guess.length !== digits || guess.includes('0') || !/^[1-9]\d*$/.test(guess) || guessedNumbers.has(Number(guess))) {
    alert('Please enter a valid ' + digits + '-digit number (excluding leading zeros) without repeating digits.');
    return;
  }

  // Count the number of correct place, correct digits, and incorrect digits
  var correctPlace = 0;
  var correctDigits = 0;
  var incorrectDigits = 0;
  for (var i = 0; i < digits; i++) {
    if (guess[i] === secretNumber[i]) {
      correctPlace++;
    } else if (secretNumber.includes(guess[i])) {
      correctDigits++;
    } else {
      incorrectDigits++;
    }
  }

  // Add the guess and its result to the table
  var guessTableBody = document.getElementById('guessTableBody');
  var newRow = guessTableBody.insertRow();
  newRow.insertCell().textContent = attempts + 1;
  newRow.insertCell().textContent = guess;
  newRow.insertCell().textContent = correctPlace;
  newRow.insertCell().textContent = correctDigits;
  newRow.insertCell().textContent = incorrectDigits;

  // Check if the guess is correct
  if (correctPlace === digits) {
    clearInterval(updateTimeInterval);
    guessInput.disabled = true;
    alert('Congratulations! You guessed the number correctly.');
    level++;
    digits++;
    startGame();
  } else {
    attempts++;
    guessedNumbers.add(Number(guess));
    guessInput.value = '';
    guessInput.focus();
  }
}

// Function to give a hint about the first digit of the secret number
function giveHint() {
  hintUsed = true;
  alert('The first digit of the secret number is: ' + secretNumber[0]);
}

// Function to handle admin button clicked event
function adminButtonClicked() {
  var password = prompt('Enter the admin password:');
  if (password === adminPassword) {
    alert('Admin password is correct.\nThe secret number is: ' + secretNumber);
  } else {
    alert('Incorrect password. Access denied.');
  }
}

// Start the first game
startGame();



