let targetNumber = Math.floor(1000 + Math.random() * 9000);  // 4 digit random number
let attempt = 0;

function checkGuess() {
  let guessInput = document.getElementById('guessInput');
  let guessTable = document.getElementById('guessTable');
  
  if (guessInput.value.length != 4) {
    alert('Please enter a 4-digit number');
    return;
  }
  
  let guessNumber = parseInt(guessInput.value, 10);
  
  if (isNaN(guessNumber)) {
    alert('Invalid number');
    return;
  }
  
  attempt++;
  
  let correctPlace = 0;
  let correctDigits = 0;
  let incorrectDigits = 0;
  
  for (let i = 0; i < 4; i++) {
    if (guessInput.value[i] == String(targetNumber)[i]) {
      correctPlace++;
    } else if (String(targetNumber).includes(guessInput.value[i])) {
      correctDigits++;
    } else {
      incorrectDigits++;
    }
  }
  
  let newRow = guessTable.insertRow();
  newRow.insertCell(0).textContent = attempt;
  newRow.insertCell(1).textContent = guessNumber;
  newRow.insertCell(2).textContent = correctPlace;
  newRow.insertCell(3).textContent = correctDigits;
  newRow.insertCell(4).textContent = incorrectDigits;
  
  if (guessNumber == targetNumber) {
    alert('Congratulations! You guessed the number.');
  }
  
  guessInput.value = '';
}
