let currentWord = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await WordsManager.loadWords();
    currentWord = WordsManager.getRandomWord();
    updateUI();
    
    // Event listeners
    document.getElementById('flashcard-container').addEventListener('click', flipCard);
    document.getElementById('mark-learned').addEventListener('click', () => {
      WordsManager.markWord(currentWord, true);
      nextCard();
    });
    document.getElementById('mark-difficult').addEventListener('click', () => {
      WordsManager.markWord(currentWord, false, true);
      nextCard();
    });
    document.getElementById('next-card').addEventListener('click', nextCard);
    document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);
    
    updateFlashcard();
  } catch (error) {
    console.error("Error inicializando la app:", error);
    document.getElementById('flashcard').querySelector('.front').textContent = 'Error cargando la aplicación';
  }
});

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
  currentWord = WordsManager.getRandomWord();
  updateFlashcard();
  updateUI();
}

function updateFlashcard() {
  const flashcard = document.getElementById('flashcard');
  if (currentWord) {
    flashcard.querySelector('.front').textContent = currentWord.english;
    flashcard.querySelector('.back').textContent = currentWord.spanish;
  }
  flashcard.classList.remove('flipped');
}

function updateUI() {
  const { learned, total } = WordsManager.getProgress();
  document.getElementById('progress-text').textContent = `${learned}/${total} palabras`;
  document.getElementById('progress-bar').style.width = `${(learned / total) * 100}%`;
  
  // Actualizar estadísticas del juego
  if (typeof GameLogic !== 'undefined') {
    document.getElementById('points').textContent = GameLogic.getPoints();
    document.getElementById('level').textContent = GameLogic.getLevel();
    document.getElementById('streak').textContent = `${GameLogic.getStreak()} días`;
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
