const WordsManager = {
  words: [],

  loadWords: async function() {
    try {
      const response = await fetch('data/words.json');
      if (!response.ok) throw new Error('Error al cargar palabras');
      
      this.words = await response.json();
      const savedProgress = JSON.parse(localStorage.getItem('wordsProgress')) || {};
      
      this.words = this.words.map(word => ({
        ...word,
        learned: savedProgress[word.english]?.learned || false,
        difficulty: savedProgress[word.english]?.difficulty || 0
      }));
    } catch (error) {
      console.error('Error loading words:', error);
      // Datos de respaldo
      this.words = [
        { english: "apple", spanish: "manzana", category: "food", learned: false, difficulty: 0 },
        { english: "run", spanish: "correr", category: "verb", learned: false, difficulty: 0 },
        { english: "happy", spanish: "feliz", category: "adjective", learned: false, difficulty: 0 }
      ];
    }
  },

  getRandomWord: function() {
    if (this.words.length === 0) return null;
    
    const unlearnedWords = this.words.filter(word => !word.learned || word.difficulty > 0);
    if (unlearnedWords.length === 0) {
      return this.words[Math.floor(Math.random() * this.words.length)];
    }
    
    const totalDifficulty = unlearnedWords.reduce((sum, word) => sum + (word.difficulty + 1), 0);
    let random = Math.random() * totalDifficulty;
    
    for (const word of unlearnedWords) {
      random -= (word.difficulty + 1);
      if (random <= 0) return word;
    }
    
    return unlearnedWords[unlearnedWords.length - 1];
  },

  markWord: function(word, learned = false, difficult = false) {
    const index = this.words.findIndex(w => w.english === word.english);
    if (index !== -1) {
      this.words[index].learned = learned;
      this.words[index].difficulty = difficult ? this.words[index].difficulty + 1 : 0;
      this.saveProgress();
    }
  },

  saveProgress: function() {
    const progress = this.words.reduce((acc, word) => ({
      ...acc,
      [word.english]: { learned: word.learned, difficulty: word.difficulty }
    }), {});
    localStorage.setItem('wordsProgress', JSON.stringify(progress));
  },

  getProgress: function() {
    const learned = this.words.filter(word => word.learned).length;
    return { learned, total: this.words.length };
  }
};