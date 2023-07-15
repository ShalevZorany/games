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

// Event listeners
guessButton.addEventListener("click", makeGuess);
hintButton.addEventListener("click", getHint);
adminButton.addEventListener("click", adminMode);

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
    alert(`Please enter a ${guessDigits}-digit number.`);
    return;
  }

  if (!validateGuess(guess)) {
    alert(`Please ensure that each digit in your ${guessDigits}-digit guess is unique and not zero.`);
    return;
  }

  const result = checkGuess(guess);

  displayGuessResult(guess, result.correctPlace, result.correctDigits, result.incorrectDigits);

  if (result.correctPlace === guessDigits) {
    endGame();
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

// End the game or transition to the next step
function endGame() {
  gameEnded = true;
  guessInputElement.disabled = true;
  guessButton.disabled = true;
  hintButton.disabled = true;
  adminButton.disabled = true;

  // Move the focus back to the guess input field
  guessInputElement.focus();

  setTimeout(() => {
    alert(`Congratulations! You guessed the number in ${guessCount} attempts.`);

    if (guessDigits === 3) {
      // Completed step 1
      alert("You have completed step 1. Proceeding to step 2.");
      // Perform any necessary actions specific to step 1 completion

      // Update variables for step 2
      level++;
      secretNumberDigits++;
      guessDigits = secretNumberDigits;
      secretNumber = generateSecretNumber(secretNumberDigits);
      guessCount = 1; // Reset the guess count

      // Update DOM elements for step 2
      levelElement.textContent = level;
      digitsElement.textContent = secretNumberDigits;
      guessDigitsElement.textContent = guessDigits;
      guessTableBody.innerHTML = ""; // Clear previous guesses from the table

      guessInputElement.value = ""; // Reset the guess input
      guessInputElement.disabled = false; // Enable the guess input field for step 2
      guessInputElement.focus(); // Set focus to the guess input for the next guess

      guessButton.disabled = false;
      hintButton.disabled = false;
      adminButton.disabled = false;

      // Update the score based on the current level and guess count
      updateScore();
    } else {
      // Completed step 2
      alert("You have completed step 2. Game over.");
      // Perform any necessary actions specific to step 2 completion
    }
  }, 0);
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

  alert(`Hint: The digit at index ${hintIndex} is ${hintDigit}.`);

  score -= 5;
  scoreElement.textContent = score;
}

// Admin mode (cheat)
function adminMode() {
  if (confirm("Are you sure you want to enter admin mode? This will reveal the secret number.")) {
    alert(`Admin mode activated! The secret number is ${secretNumber}.`);
  }
}
