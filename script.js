document.addEventListener('DOMContentLoaded', () => {
  let currentGuess = '';
  let secretNumber = generateSecretNumber(3);
  let score = 0;
  let level = 1;
  let statistics = { totalGuesses: 0, totalHints: 0, gamesPlayed: 0, totalTime: 0 };
  let difficulty = 'Easy';
  let timer;
  let timeRemaining = 60;
  let history = [];
  let timerRunning = false;

  const guessDisplay = document.getElementById('guessDisplay');
  const levelDisplay = document.getElementById('level');
  const scoreDisplay = document.getElementById('score');
  const digitsDisplay = document.getElementById('digits');
  const timerDisplay = document.getElementById('timer');
  const feedback = document.getElementById('feedback');
  const guessTableBody = document.getElementById('guessTableBody');
  const difficultySelect = document.getElementById('difficultySelect');

  // אירועי לחצנים
  document.querySelectorAll('.number-button').forEach(button => {
    button.addEventListener('pointerdown', () => {
      const digit = button.getAttribute('data-digit');
      if (digit) {
        addDigit(digit);
      } else {
        deleteLastDigit();
      }
    });
  });

  document.getElementById('guessButton').addEventListener('click', processGuess);
  document.getElementById('hintButton').addEventListener('click', getHint);
  document.getElementById('resetButton').addEventListener('click', resetGame);
  document.getElementById('timerButton').addEventListener('click', toggleTimer);
  difficultySelect.addEventListener('change', changeDifficulty);

  // פונקציות עזר
  function generateSecretNumber(digits) {
    let numbers = [];
    while (numbers.length < digits) {
      let randomDigit = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(randomDigit)) {
        numbers.push(randomDigit);
      }
    }
    return numbers.join('');
  }

  function addDigit(digit) {
    if (currentGuess.length < secretNumber.length && !currentGuess.includes(digit)) {
      currentGuess += digit;
      guessDisplay.textContent = currentGuess;
    }
  }

  function deleteLastDigit() {
    currentGuess = currentGuess.slice(0, -1);
    guessDisplay.textContent = currentGuess;
  }

  function processGuess() {
    if (currentGuess.length === secretNumber.length) {
      let correctPlace = 0;
      let correctDigit = 0;
      let incorrectDigit = 0;

      for (let i = 0; i < currentGuess.length; i++) {
        if (currentGuess[i] === secretNumber[i]) {
          correctPlace++;
        } else if (secretNumber.includes(currentGuess[i])) {
          correctDigit++;
        } else {
          incorrectDigit++;
        }
      }

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${currentGuess}</td>
        <td>${correctPlace}</td>
        <td>${correctDigit}</td>
        <td>${incorrectDigit}</td>
      `;
      guessTableBody.appendChild(newRow);

      history.push({ guess: currentGuess, correctPlace, correctDigit, incorrectDigit });
      statistics.totalGuesses++;

      if (correctPlace === secretNumber.length) {
        feedback.textContent = 'כל הכבוד! ניחשת את המספר הסודי!';
        feedback.classList.add('correct-feedback');
        feedback.classList.remove('incorrect-feedback');
        score += 100;
        level++;
        levelDisplay.textContent = level;
        secretNumber = generateSecretNumber(secretNumber.length + 1);
        digitsDisplay.textContent = secretNumber.length;
        statistics.gamesPlayed++;
        resetCurrentGuess();
      } else {
        feedback.textContent = 'ניחוש שגוי. נסה שוב!';
        feedback.classList.remove('correct-feedback');
        feedback.classList.add('incorrect-feedback');
        score -= 10;
      }
      scoreDisplay.textContent = score;
      resetCurrentGuess();
    } else {
      feedback.textContent = 'אנא הכנס ניחוש מלא.';
      feedback.classList.remove('correct-feedback');
      feedback.classList.add('incorrect-feedback');
    }
  }

  function resetCurrentGuess() {
    currentGuess = '';
    guessDisplay.textContent = currentGuess;
  }

  function getHint() {
    if (score >= 20) {
      score -= 20;
      statistics.totalHints++;
      scoreDisplay.textContent = score;
      alert(`אחת הספרות היא: ${secretNumber[0]}`);
    } else {
      alert('אין לך מספיק נקודות לקבלת רמז.');
    }
  }

  function resetGame() {
    currentGuess = '';
    secretNumber = generateSecretNumber(3);
    score = 0;
    level = 1;
    statistics = { totalGuesses: 0, totalHints: 0, gamesPlayed: 0, totalTime: 0 };
    history = [];
    guessDisplay.textContent = currentGuess;
    feedback.textContent = '';
    feedback.classList.remove('correct-feedback', 'incorrect-feedback');
    guessTableBody.innerHTML = '';
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    digitsDisplay.textContent = secretNumber.length;
    timeRemaining = 60;
    timerDisplay.textContent = timeRemaining;
    if (timerRunning) {
      clearInterval(timer);
      timerRunning = false;
    }
  }

  function changeDifficulty() {
    difficulty = difficultySelect.value;
    if (difficulty === 'Hard') {
      secretNumber = generateSecretNumber(secretNumber.length + 1);
    } else {
      secretNumber = generateSecretNumber(3);
    }
    digitsDisplay.textContent = secretNumber.length;
    alert(`רמת הקושי שונתה ל-${difficulty === 'Easy' ? 'קל' : 'קשה'}.`);
    resetCurrentGuess();
  }

  function toggleTimer() {
    if (timerRunning) {
      clearInterval(timer);
      timerRunning = false;
    } else {
      timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;
        if (timeRemaining <= 0) {
          clearInterval(timer);
          timerRunning = false;
          alert('הזמן תם! המשחק יאופס.');
          resetGame();
        }
      }, 1000);
      timerRunning = true;
    }
  }
});
