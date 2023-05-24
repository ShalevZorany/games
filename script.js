// Generate a random 4-digit number
var targetNumber = generateTargetNumber();

// Keep track of the number of attempts
var attempt = 1;

function generateTargetNumber() {
  var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var target = "";
  for (var i = 0; i < 4; i++) {
    var randomIndex = Math.floor(Math.random() * digits.length);
    target += digits[randomIndex];
    digits.splice(randomIndex, 1);
  }
  return target;
}

function checkGuess() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;

  // Validate the guess
  if (guess.length !== 4 || isNaN(guess)) {
    alert("Please enter a 4-digit number.");
    return;
  }

  var correctPlace = 0;
  var correctDigits = 0;
  var incorrectDigits = 0;

  // Check the guess against the target number
  for (var i = 0; i < guess.length; i++) {
    var guessDigit = guess.charAt(i);
    if (guessDigit === targetNumber.charAt(i)) {
      correctPlace++;
    } else if (targetNumber.includes(guessDigit)) {
      correctDigits++;
    } else {
      incorrectDigits++;
    }
  }

  // Display the results in the table
  var guessTable = document.getElementById("guessTable");
  var row = guessTable.insertRow(-1);
  var attemptCell = row.insertCell(0);
  var guessCell = row.insertCell(1);
  var correctPlaceCell = row.insertCell(2);
  var correctDigitsCell = row.insertCell(3);
  var incorrectDigitsCell = row.insertCell(4);

  attemptCell.innerHTML = attempt;
  guessCell.innerHTML = guess;
  correctPlaceCell.innerHTML = correctPlace;
  correctDigitsCell.innerHTML = correctDigits;
  incorrectDigitsCell.innerHTML = incorrectDigits;

  // Increment the attempt counter
  attempt++;

  // Check if the guess is correct
  if (correctPlace === 4) {
    alert("Congratulations! You guessed the number correctly.");
    guessInput.disabled = true;
  } else {
    guessInput.value = "";
    guessInput.focus();
  }
}
