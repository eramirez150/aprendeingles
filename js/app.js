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
    document.getElementById('submit-quiz').addEventListener('click', submitQuizAnswer);
    
    updateFlashcard();
    showQuizOptions(); // Mostrar opciones al cargar
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
  showQuizOptions(); // Mostrar nuevas opciones en el quiz
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

// Muestra opciones de respuesta en el quiz
function showQuizOptions() {
  const quizOptionsDiv = document.getElementById('quiz-options');
  quizOptionsDiv.innerHTML = ''; // Limpiar opciones anteriores

  if (!currentWord) return;

  // Generar opciones (una correcta y dos incorrectas)
  const words = WordsManager.getAllWords ? WordsManager.getAllWords() : [];
  let options = [currentWord.spanish];

  // Agrega dos opciones incorrectas aleatorias
  while (options.length < 3 && words.length > 2) {
    const random = words[Math.floor(Math.random() * words.length)];
    if (random.spanish !== currentWord.spanish && !options.includes(random.spanish)) {
      options.push(random.spanish);
    }
  }

  // Mezclar opciones
  options = options.sort(() => Math.random() - 0.5);

  // Crear radio buttons
  options.forEach((option, idx) => {
    const label = document.createElement('label');
    label.style.display = 'block';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'quiz-option';
    input.value = option;
    if (idx === 0) input.checked = true; // Selecciona la primera por defecto
    label.appendChild(input);
    label.appendChild(document.createTextNode(option));
    quizOptionsDiv.appendChild(label);
  });
}

function submitQuizAnswer() {
  const selected = document.querySelector('input[name="quiz-option"]:checked');
  if (!selected) {
    alert('Por favor selecciona una respuesta.');
    return;
  }
  const answer = selected.value;
  if (answer === currentWord.spanish) {
    alert('¡Correcto!');
    if (typeof GameLogic !== 'undefined') {
      GameLogic.addPoint && GameLogic.addPoint();
      updateUI();
    }
  } else {
    alert('Incorrecto. La respuesta correcta es: ' + currentWord.spanish);
  }
  nextCard(); // Muestra una nueva palabra y opciones
}
