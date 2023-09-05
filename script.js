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
    // Add 10 points for every guess right at the start
    score += 10;
    document.getElementById('score').textContent = score;

    if (gameOver) {
        return;
    }

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

    // Call the function to update the table
    updateGuessTable();

if (correctPlace === secretNumberDigits) {
    if (step === 3) {
        checkGuess(true); // Correct guess
        // Game Over after Stage 3
        gameOver = true;
        alert('Congratulations! You have completed Stage 3.\nGame Over');
        showResult(totalScore);
        showNewGameButton();
    } else {
        checkGuess(true); // Correct guess
        
        // Increment and show the step BEFORE resetting game variables
        step++;
        document.getElementById('level').textContent = step;
        alert('Correct guess! Proceed to Stage ' + step);

secretNumberDigits++; // Increase difficulty by adding one more digit
console.log("Updated secretNumberDigits:", secretNumberDigits); // Debugging line
document.getElementById('digits').textContent = secretNumberDigits;
console.log("DOM content:", document.getElementById('digits').textContent); // Debugging line

        secretNumber = generateSecretNumber(secretNumberDigits);
        guesses = [];
        hintUsed = false;
        adminUsed = false;
        document.getElementById('guessTableBody').innerHTML = '';
    }
} else {
    checkGuess(false); // Incorrect guess
    }
}
function updateGuessTable() {
    const guessTableBody = document.getElementById('guessTableBody');
    guessTableBody.innerHTML = ''; // Clear the table body

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
// Add event listener for the 'Get Hint' button
document.getElementById('hintButton').addEventListener('click', getHint);

// Add event listener for the 'Admin' button
document.getElementById('adminButton').addEventListener('click', revealSecretNumber);
// Add event listener for the 'Guess' button
document.getElementById('guessButton').addEventListener('click', () => {
  const guessInput = document.getElementById('guessInput');
  processGuess(guessInput.value);
  guessInput.value = ''; // Clear the input field
});


// Initialize the game
startNewGame();
