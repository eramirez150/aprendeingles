const GameLogic = {
  points: parseInt(localStorage.getItem('points')) || 0,
  streak: parseInt(localStorage.getItem('streak')) || 0,
  lastVisit: localStorage.getItem('lastVisit') || null,

  addPoints: function(amount) {
    this.points += amount;
    localStorage.setItem('points', this.points);
    this.updateStats();
  },

  getPoints: function() {
    return this.points;
  },

  getLevel: function() {
    return Math.floor(this.points / 100) + 1;
  },

  getStreak: function() {
    const today = new Date().toDateString();
    if (this.lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (this.lastVisit === yesterday.toDateString()) {
        this.streak++;
      } else {
        this.streak = 1;
      }
      this.lastVisit = today;
      localStorage.setItem('lastVisit', today);
      localStorage.setItem('streak', this.streak);
    }
    return this.streak;
  },

  updateStats: function() {
    document.getElementById('points').textContent = this.points;
    document.getElementById('level').textContent = this.getLevel();
    document.getElementById('streak').textContent = `${this.streak} días`;
  }
};