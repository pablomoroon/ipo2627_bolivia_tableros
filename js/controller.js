import { GameModel } from './model.js';
import { GameView } from './view.js';

const model = new GameModel();
const view = new GameView();
let settings = view.getSettings();

function render() {
  view.render(model, settings);
}

function renderAfterMove() {
  render();
  if (model.isComplete()) view.showCompletion(model.moves);
}

function selectToken(index) {
  if (model.selectedIndex === null) {
    model.selectedIndex = index;
  } else if (model.selectedIndex === index) {
    model.selectedIndex = null;
  } else {
    model.swap(model.selectedIndex, index);
    model.selectedIndex = null;
  }
  renderAfterMove();
}

function swapTokens(firstIndex, secondIndex) {
  model.swap(firstIndex, secondIndex);
  model.selectedIndex = null;
  renderAfterMove();
}

view.bind({
  newGame(nextSettings) {
    settings = nextSettings;
    model.newGame(settings.size);
    render();
  },
  refresh: render
});
view.setTokenClickHandler(selectToken);
view.setDragHandlers(swapTokens);
render();
