// Get a random number within a specified range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a new secret number with a specified number of digits
function generateSecretNumber(digits) {
  let secretNumber = '';
  const uniqueDigits = Array.from({ length: 10 }, (_, i) => i); // Array of unique digits 0-9

  while (secretNumber.length < digits) {
    const randomIndex = getRandomNumber(0, uniqueDigits.length - 1);
    const digit = uniqueDigits.splice(randomIndex, 1)[0];
    secretNumber += digit.toString();
  }

  return secretNumber;
}

// Compare the user's guess with the secret number and return the result
function compareGuess(guess, secretNumber) {
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

// Function to handle the user's guess
function handleGuess() {
  const guessInput = document.getElementById('guessInput');
  const guess = guessInput.value;
  const secretNumber = '123'; // Replace with your generated secret number

  const result = compareGuess(guess, secretNumber);

  // Update the table with the guess and result
  const guessTableBody = document.getElementById('guessTableBody');
  const newRow = guessTableBody.insertRow();
  const cell1 = newRow.insertCell();
  const cell2 = newRow.insertCell();
  const cell3 = newRow.insertCell();
  const cell4 = newRow.insertCell();
  const cell5 = newRow.insertCell();
  cell1.textContent = guessTableBody.rows.length;
  cell2.textContent = guess;
  cell3.textContent = result.correctPlace;
  cell4.textContent = result.correctDigits;
  cell5.textContent = result.incorrectDigits;

  // Clear the guess input field
  guessInput.value = '';

  // Update the score
  const scoreSpan = document.getElementById('score');
  let score = parseInt(scoreSpan.textContent);
  score += 10; // Increase the score based on your desired logic
  scoreSpan.textContent = score.toString();
}

// Event listener for the guess button
const guessButton = document.getElementById('guessButton');
guessButton.addEventListener('click', handleGuess);
