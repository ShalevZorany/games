var guessInput = document.getElementById('guessInput');
var submitBtn = document.getElementById('submitBtn');
var levelSpan = document.getElementById('level');
var scoreSpan = document.getElementById('score');
var digitsSpan = document.getElementById('digits');
var guessInputLabel = document.getElementById('guessInputLabel');
var adminBtn = document.getElementById('adminBtn');

var attemptCounter = 1;
var secretNumber = generateSecretNumber(2); // Start with a 2-digit number
var level = 1; // Starting level
var score = 0; // Starting score
var timeStart; // Time at the start of the level
var hintUsed = false; // If a hint is used, deduct score

submitBtn.addEventListener('click', checkGuess);

function checkGuess() {
  var guess = guessInput.value;

  if (isGuessValid(guess)) {
    var result = compareGuessAndSecret(guess);
    addGuessToTable(guess, result);
    guessInput.value = '';

    if (result.correctPlace === level + 1) {
      alert('Congratulations! You won the level!');
      score += calculateScore(); // Add the score for this level
      level++; // Next level
      secretNumber = generateSecretNumber(level + 1); // The number's length increases
      attemptCounter = 1; // Reset attempts
      timeStart = Date.now(); // Reset timer
      hintUsed = false; // Reset hint
      levelSpan.innerText = level; // Update level display
      scoreSpan.innerText = score; // Update score display
      digitsSpan.innerText = level + 1; // Update the number of digits display
      guessInputLabel.innerText = 'Guess a ' + (level + 1) + '-digit number:';
    }
  } else {
    alert('Invalid guess. Please ensure there are no repeated digits, the digit 0 is not allowed, and the number of digits matches the level.');
    guessInput.value = '';
  }
}

function generateSecretNumber(length) {
  var secretNum = '';
  var digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * digits.length);
    secretNum += digits[randomIndex];
    digits.splice(randomIndex, 1);
  }

  return secretNum;
}

function isGuessValid(guess) {
  var count = {};
  for (var i = 0; i < guess.length; i++) {
    if (guess[i] === '0' || guess[i] in count || guess.lastIndexOf(guess[i]) !== i) {
      return false;
    } else {
      count[guess[i]] = true;
    }
  }
  return guess.length === level + 1;
}

function compareGuessAndSecret(guess) {
  var correctPlace = 0;
  var correctDigits = 0;
  var incorrectDigits = 0;

  var secretDigitsCount = countDigits(secretNumber);
  var guessDigitsCount = countDigits(guess);

  for (var i = 0; i < guess.length; i++) {
    if (guess[i] === secretNumber[i]) {
      correctPlace++;
      secretDigitsCount[guess[i]]--;
    } else if (secretDigitsCount[guess[i]] > 0) {
      correctDigits++;
      secretDigitsCount[guess[i]]--;
    }
  }

  incorrectDigits = guess.length - correctPlace - correctDigits;

  return {
    correctPlace: correctPlace,
    correctDigits: correctDigits,
    incorrectDigits: incorrectDigits
  };
}

function countDigits(number) {
  var count = {};
  for (var i = 0; i < number.length; i++) {
    if (number[i] in count) {
      count[number[i]]++;
    } else {
      count[number[i]] = 1;
    }
  }
  return count;
}

function addGuessToTable(guess, result) {
  var guessTable = document.getElementById('guessTableBody');
  var newRow = guessTable.insertRow(0);

  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  var cell4 = newRow.insertCell(3);
  var cell5 = newRow.insertCell(4);

  cell1.innerHTML = attemptCounter++;
  cell2.innerHTML = guess;
  cell3.innerHTML = result.correctPlace;
  cell4.innerHTML = result.correctDigits;
  cell5.innerHTML = result.incorrectDigits;
}

function calculateScore() {
  var timeElapsed = Date.now() - timeStart;
  var timeScore = 5000 - (timeElapsed / 1000) * 10; // Lose 10 points per second
  var attemptsScore = 1000 - attemptCounter * 50; // Lose 50 points per attempt
  var hintScore = hintUsed ? -500 : 0; // Lose 500 points if a hint was used
  return Math.max(0, timeScore + attemptsScore + hintScore); // The score cannot be negative
}

adminBtn.addEventListener('click', adminLogin);

function adminLogin() {
  var password = prompt("Please enter the admin password:");

  // This is the password 'Check2323' encoded in Base64
  var encodedPassword = "Q2hlY2syMzIz";

  if (btoa(password) === encodedPassword) {
    alert("The secret number is: " + secretNumber);
  } else {
    alert("Incorrect password. Access denied.");
  }
}

window.onload = function () {
  timeStart = Date.now();
  levelSpan.innerText = level;
  scoreSpan.innerText = score;
  digitsSpan.innerText = level + 1;
  guessInputLabel.innerText = 'Guess a ' + (level + 1) + '-digit number:';
};
