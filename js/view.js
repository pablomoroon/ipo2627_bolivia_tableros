export class GameView {
  constructor() {
    this.board = document.querySelector('#board');
    this.moveCount = document.querySelector('#move-count');
    this.status = document.querySelector('#game-status');
    this.sizeInput = document.querySelector('#board-size');
    this.shapeSelect = document.querySelector('#shape-select');
    this.paletteSelect = document.querySelector('#palette-select');
    this.form = document.querySelector('#settings-form');
    this.resetButton = document.querySelector('#reset-button');
    this.settingsButton = document.querySelector('#settings-button');
    this.settingsDialog = document.querySelector('#settings-dialog');
    this.closeSettings = document.querySelector('#close-settings');
    this.helpButton = document.querySelector('#help-button');
    this.helpDialog = document.querySelector('#help-dialog');
    this.closeHelp = document.querySelector('#close-help');
    this.completionDialog = document.querySelector('#completion-dialog');
    this.completionMoves = document.querySelector('#completion-moves');
    this.closeCompletion = document.querySelector('#close-completion');
    this.newGameCompletion = document.querySelector('#new-game-completion');
    this.activeTokenSize = 'medium';
  }

  bind(actions) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      actions.newGame(this.getSettings());
      this.settingsDialog.close();
    });

    this.resetButton.addEventListener('click', () => actions.newGame(this.getSettings()));
    this.settingsButton.addEventListener('click', () => this.settingsDialog.showModal());
    this.closeSettings.addEventListener('click', () => this.settingsDialog.close());

    document.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => {
      const next = Number(this.sizeInput.value) + Number(button.dataset.step);
      this.sizeInput.value = Math.min(9, Math.max(3, next));
    }));

    document.querySelectorAll('[data-size]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-size]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      this.activeTokenSize = button.dataset.size;
      actions.refresh();
    }));

    this.helpButton.addEventListener('click', () => this.helpDialog.showModal());
    this.closeHelp.addEventListener('click', () => this.helpDialog.close());
    this.closeCompletion.addEventListener('click', () => this.completionDialog.close());

    this.newGameCompletion.addEventListener('click', () => {
      this.completionDialog.close();
      actions.newGame(this.getSettings());
    });

    this.helpDialog.addEventListener('click', (event) => {
      if (event.target === this.helpDialog) this.helpDialog.close();
    });
  }

  showCompletion(moves) {
    this.completionMoves.textContent = moves;
    this.completionDialog.showModal();
  }

  getSettings() {
    return {
      size: Number(this.sizeInput.value),
      shape: this.shapeSelect.value,
      palette: this.paletteSelect.value,
      tokenSize: this.activeTokenSize
    };
  }

  render(model, settings) {
    const paletteClasses = ['palette--studio', 'palette--citrus', 'palette--berry'];
    const tokenSizeClasses = ['token-size--small', 'token-size--medium', 'token-size--large'];

    this.board.style.setProperty('--board-size', model.size);
    this.board.classList.remove(...tokenSizeClasses);
    this.board.classList.add(`token-size--${settings.tokenSize}`);

    document.body.classList.remove(...paletteClasses);
    document.body.classList.add(`palette--${settings.palette}`);

    this.moveCount.textContent = model.moves;
    this.board.innerHTML = '';

    model.tokens.forEach((token, index) => {
      const shape = settings.shape === 'mixed'
        ? ['circle', 'square', 'triangle'][token.id % 3]
        : settings.shape;

      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('role', 'gridcell');

      const tokenButton = document.createElement('button');
      tokenButton.className = `token token--color-${token.color} token--shape-${shape}`;
      if (model.selectedIndex === index) tokenButton.classList.add('is-selected');
      tokenButton.type = 'button';
      tokenButton.draggable = true;

      // Los atributos data-* se conservan para la interacción pedida en la práctica.
      tokenButton.dataset.color = token.color;
      tokenButton.dataset.shape = shape;
      tokenButton.dataset.index = index;
      tokenButton.setAttribute('aria-label', `Ficha ${index + 1}, color ${token.color}, forma ${shape}`);
      tokenButton.setAttribute('aria-selected', model.selectedIndex === index ? 'true' : 'false');

      cell.append(tokenButton);
      this.board.append(cell);
    });

    this.status.textContent = model.isComplete()
      ? `Tablero completado en ${model.moves} movimientos.`
      : model.selectedIndex === null
        ? 'Selecciona una ficha para empezar.'
        : 'Ahora selecciona otra ficha para intercambiar.';
  }

  setTokenClickHandler(handler) {
    this.board.addEventListener('click', (event) => {
      const token = event.target.closest('.token');
      if (token) handler(Number(token.dataset.index));
    });
  }

  setDragHandlers(handler) {
    this.board.addEventListener('dragstart', (event) => {
      const token = event.target.closest('.token');
      if (token) event.dataTransfer.setData('text/plain', token.dataset.index);
    });

    this.board.addEventListener('dragover', (event) => event.preventDefault());

    this.board.addEventListener('drop', (event) => {
      event.preventDefault();
      const target = event.target.closest('.token');
      if (target) handler(Number(event.dataTransfer.getData('text/plain')), Number(target.dataset.index));
    });
  }
}
