export const TOKEN_COLORS = ['coral', 'mint', 'gold'];

export class GameModel {
  constructor(size = 5) {
    this.size = size;
    this.moves = 0;
    this.selectedIndex = null;
    this.tokens = [];
    this.newGame(size);
  }

  newGame(size = this.size) {
    this.size = Math.min(9, Math.max(3, Number(size) || 5));
    this.moves = 0;
    this.selectedIndex = null;
    const solved = Array.from({ length: this.size * this.size }, (_, index) => ({
      color: TOKEN_COLORS[Math.floor(index / this.size) % TOKEN_COLORS.length],
      id: index
    }));
    this.tokens = solved.sort(() => Math.random() - 0.5);
    if (this.isComplete()) [this.tokens[0], this.tokens[1]] = [this.tokens[1], this.tokens[0]];
  }

  swap(firstIndex, secondIndex) {
    if (firstIndex === secondIndex || firstIndex < 0 || secondIndex < 0) return false;
    [this.tokens[firstIndex], this.tokens[secondIndex]] = [this.tokens[secondIndex], this.tokens[firstIndex]];
    this.moves += 1;
    return true;
  }

  isComplete() {
    return this.tokens.every((token, index) => {
      const rowStart = Math.floor(index / this.size) * this.size;
      return token.color === this.tokens[rowStart].color;
    });
  }
}
