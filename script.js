// Game variables
let level = 1;
let score = 0;
let secretNumberDigits = 3;
let guessDigits = secretNumberDigits;
let secretNumber = generateSecretNumber(secretNumberDigits);
let guessCount = 1;
let gameEnded = false;

// DOM elements
const levelElement = document.getElementById("level");
const scoreElement = document.getElementById("score");
const digitsElement = document.getElementById("digits");
const guessDigitsElement = document.getElementById("guessDigits");
const guessInputElement = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const hintButton = document.getElementById("hintButton");
const adminButton = document.getElementById("adminButton");
const guessTableBody = document.getElementById("guessTableBody");

// Update the input field and guess button based on the current guessDigits value
function updateInputField() {
  guessInputElement.maxLength = guessDigits;
  guessInputElement.placeholder = `Enter your guess`;
}

// Generate a random secret number of the specified digits
function generateSecretNumber(digits) {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1); // Array of digits 1-9
  let secret = "";

  for (let i = 0; i < digits; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    secret += numbers[randomIndex];
    numbers.splice(randomIndex, 1); // Remove the selected digit
  }

  return secret;
}

// Make a guess
function makeGuess() {
  if (gameEnded) {
    alert("The game has ended. Please refresh the page to play again.");
    return;
  }

  const guess = guessInputElement.value;

  if (guess.length !== guessDigits) {
    alert(`Please enter a ${guessDigits}-digit guess.`);
    return;
  }

  if (!validateGuess(guess)) {
    alert("Please ensure that each digit in your guess is unique and not zero.");
    return;
  }

  const result = checkGuess(guess);

  displayGuessResult(guess, result.correctPlace, result.correctDigits, result.incorrectDigits);

  if (result.correctPlace === guessDigits) {
    if (level === 2) {
      alert("Congratulations! You have completed Level 2.");
      endGame();
    } else {
      level++;
      secretNumberDigits++;
      guessDigits = secretNumberDigits;
      secretNumber = generateSecretNumber(secretNumberDigits);

      levelElement.textContent = level;
      digitsElement.textContent = secretNumberDigits;
      guessDigitsElement.textContent = guessDigits;

      updateInputField();
      clearGuessTable();
      guessInputElement.value = "";
      guessInputElement.focus();
    }
  } else {
    guessCount++;
    updateScore();
    guessInputElement.value = "";
    guessInputElement.focus();
  }
}

// Validate the guess to ensure that each digit is unique and not zero
function validateGuess(guess) {
  const uniqueDigits = new Set(guess.split(""));
  return (
    uniqueDigits.size === guessDigits &&
    !uniqueDigits.has("0") // Check if the guess contains the digit "0"
  );
}

// Check the guess against the secret number
function checkGuess(guess) {
  let correctPlace = 0;
  let correctDigits = 0;
  let incorrectDigits = 0;
  const secretDigits = secretNumber.split("");
  const guessDigits = guess.split("");

  for (let i = 0; i < guessDigits.length; i++) {
    if (secretDigits[i] === guessDigits[i]) {
      correctPlace++;
    } else if (secretDigits.includes(guessDigits[i])) {
      correctDigits++;
    } else {
      incorrectDigits++;
    }
  }

  return { correctPlace, correctDigits, incorrectDigits };
}

// Display the result of a guess in the table
function displayGuessResult(guess, correctPlace, correctDigits, incorrectDigits) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${guessCount}</td>
    <td>${guess}</td>
    <td>${correctPlace}</td>
    <td>${correctDigits}</td>
    <td>${incorrectDigits}</td>
  `;
  guessTableBody.appendChild(newRow);
}

// End the game
function endGame() {
  gameEnded = true;
  guessInputElement.disabled = true;
  guessButton.disabled = true;
  hintButton.disabled = true;
  adminButton.disabled = true;
}

// Clear the guess table and reset guess count for each level
function clearGuessTable() {
  guessCount = 1;
  guessTableBody.innerHTML = "";
}

// Update the score based on the current level and guess count
function updateScore() {
  score = level * 10 - guessCount;
  scoreElement.textContent = score;
}

// Get a hint by revealing a random digit of the secret number
function getHint() {
  if (score < 5) {
    alert("Not enough points to get a hint!");
    return;
  }

  const hintIndex = Math.floor(Math.random() * secretNumberDigits);
  const hintDigit = secretNumber.charAt(hintIndex);

  let hintMessage = `Hint: One of the digits in the secret number is ${hintDigit}.`;

  if (secretNumberDigits > 1) {
    hintMessage += ` The digit is at index ${hintIndex}.`;
  }

  alert(hintMessage);

  score -= 5;
  scoreElement.textContent = score;
}

// Admin mode (cheat)
function adminMode() {
  if (confirm("Are you sure you want to enter admin mode? This will reveal the secret number.")) {
    alert(`Admin mode activated! The secret number is ${secretNumber}.`);
  }
}

// Event listeners
guessButton.addEventListener("click", makeGuess);
hintButton.addEventListener("click", getHint);
adminButton.addEventListener("click", adminMode);

// Initialize the game
function initializeGame() {
  level = 1;
  score = 0;
  secretNumberDigits = 3;
  guessDigits = secretNumberDigits;
  secretNumber = generateSecretNumber(secretNumberDigits);
  guessCount = 1;
  gameEnded = false;

  // Update the game info display
  levelElement.textContent = level;
  scoreElement.textContent = score;
  digitsElement.textContent = secretNumberDigits;
  guessDigitsElement.textContent = guessDigits;

  // Update the input field and guess button
  updateInputField();

  // Clear the guess table
  clearGuessTable();
}

// Call the initializeGame function to set up the game
initializeGame();
