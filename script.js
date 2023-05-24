function checkGuess() {
  if (timeLeft === 60) {
    startTimer();
  }

  var guessInput = document.getElementById('guessInput').value;
  var guessTable = document.getElementById('guessTable');

  // Add your guess checking logic here
  var targetNumber = '1234'; // Replace with your actual target number
  var correctPlace = 0;
  var correctDigits = 0;
  var incorrectDigits = 0;

  // Compare the guess with the target number
  for (var i = 0; i < guessInput.length; i++) {
    if (guessInput[i] === targetNumber[i]) {
      correctPlace++;
    } else if (targetNumber.includes(guessInput[i])) {
      correctDigits++;
    }
  }

  incorrectDigits = 4 - (correctPlace + correctDigits);

  // Create a new row in the table to display the guess result
  var newRow = guessTable.insertRow();
  var attemptCell = newRow.insertCell();
  var guessCell = newRow.insertCell();
  var correctPlaceCell = newRow.insertCell();
  var correctDigitsCell = newRow.insertCell();
  var incorrectDigitsCell = newRow.insertCell();

  attemptCell.textContent = guessTable.rows.length - 1;
  guessCell.textContent = guessInput;
  correctPlaceCell.textContent = correctPlace;
  correctDigitsCell.textContent = correctDigits;
  incorrectDigitsCell.textContent = incorrectDigits;

  document.getElementById('guessInput').value = '';
}
