class QuizManager {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.currentWord = null;
        this.initialize();
    }

    async initialize() {
        try {
            await WordsManager.loadWords();
            this.showNewQuestion();
            this.updateUI();
        } catch (error) {
            console.error('Error inicializando el quiz:', error);
        }
    }

    showNewQuestion() {
        this.currentWord = WordsManager.getRandomWord();
        const wordDisplay = document.querySelector('.current-word');
        const optionsGrid = document.querySelector('.options-grid');
        
        // Mostrar la palabra en español
        wordDisplay.textContent = this.currentWord.spanish;
        
        // Generar y mostrar opciones
        const options = this.generateOptions();
        optionsGrid.innerHTML = options
            .map(option => `<button class="option-button" data-value="${option}">${option}</button>`)
            .join('');
            
        // Añadir event listeners
        document.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleAnswer(e));
        });
    }

    generateOptions() {
        const correctAnswer = this.currentWord.english;
        const allWords = WordsManager.getAllWords();
        let options = [correctAnswer];
        
        while (options.length < 4) {
            const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
            if (!options.includes(randomWord.english)) {
                options.push(randomWord.english);
            }
        }
        
        return options.sort(() => Math.random() - 0.5);
    }

    handleAnswer(event) {
        const selectedButton = event.target;
        const selectedAnswer = selectedButton.dataset.value;
        const isCorrect = selectedAnswer === this.currentWord.english;
        
        document.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);
        
        if (isCorrect) {
            selectedButton.classList.add('correct');
            this.score += 10 * (this.streak + 1);
            this.streak++;
            // Marcar como aprendida en WordsManager
            WordsManager.markWord(this.currentWord, true);
        } else {
            selectedButton.classList.add('incorrect');
            document.querySelector(`[data-value="${this.currentWord.english}"]`)
                .classList.add('correct');
            this.streak = 0;
            // Marcar como difícil en WordsManager
            WordsManager.markWord(this.currentWord, false, true);
        }
        
        // Actualizar UI y progreso
        this.updateUI();
        this.updateProgress();
        
        setTimeout(() => this.showNewQuestion(), 1500);
    }

    updateUI() {
        document.getElementById('quiz-score').textContent = this.score;
        document.getElementById('quiz-streak').textContent = this.streak;
    }

    updateProgress() {
        // Actualizar barra de progreso
        const progress = WordsManager.getProgress();
        document.getElementById('progress-text').textContent = 
            `${progress.learned}/${progress.total} palabras`;
        document.getElementById('progress-bar').style.width = 
            `${(progress.learned / progress.total) * 100}%`;
    }
}

// Inicializar el quiz cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new QuizManager();
});
