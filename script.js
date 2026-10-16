const state = {
  wishes: [],
  currentIndex: 0,
  currentWish: null,
  dodgeStartedAt: 0,
  dodgeTimer: null,
  isDodging: false
};

const elements = {
  welcome: document.querySelector('#welcome-screen'),
  wish: document.querySelector('#wish-screen'),
  final: document.querySelector('#final-screen'),
  begin: document.querySelector('#begin-button'),
  count: document.querySelector('#wish-count'),
  card: document.querySelector('#mandap-card'),
  actionZone: document.querySelector('#action-zone'),
  yes: document.querySelector('#yes-button'),
  no: document.querySelector('#no-button'),
  status: document.querySelector('#dodge-status'),
  reveal: document.querySelector('#reveal-panel'),
  photo: document.querySelector('#photo-placeholder'),
  friendName: document.querySelector('#friend-name'),
  friendMessage: document.querySelector('#friend-message'),
  next: document.querySelector('#next-button'),
  confetti: document.querySelector('#confetti-layer')
};

function showScreen(screen) {
  [elements.welcome, elements.wish, elements.final].forEach((item) => {
    const isVisible = item === screen;
    item.hidden = !isVisible;
    item.classList.toggle('is-active', isVisible);
  });
}

async function loadWishes() {
  try {
    const response = await fetch('wishes.json');
    if (!response.ok) throw new Error('Could not load wishes.json');
    const wishes = await response.json();
    const requestedId = new URLSearchParams(window.location.search).get('id');
    state.wishes = requestedId
      ? wishes.filter((wish) => wish.id.toLowerCase() === requestedId.toLowerCase() || wish.name.toLowerCase() === requestedId.toLowerCase())
      : wishes;
    if (!state.wishes.length) state.wishes = wishes;
    return true;
  } catch (error) {
    elements.status.textContent = 'Please open this page through Live Server to load the wishes.';
    console.error(error);
    return false;
  }
}

function resetWishView() {
  clearDodge();
  state.dodgeStartedAt = 0;
  elements.actionZone.hidden = false;
  elements.reveal.hidden = true;
  elements.yes.hidden = false;
  elements.no.hidden = false;
  elements.next.hidden = true;
  elements.yes.classList.remove('is-dodging');
  elements.yes.style.left = '';
  elements.yes.style.top = '';
  elements.status.textContent = '';
}

function renderWish() {
  state.currentWish = state.wishes[state.currentIndex];
  resetWishView();
  elements.count.textContent = `Wish ${state.currentIndex + 1} of ${state.wishes.length}`;
}

// Moves only within the action zone, keeping the entire button visible on small screens.
function moveYesButton() {
  if (!state.isDodging) return;
  const zone = elements.actionZone.getBoundingClientRect();
  const button = elements.yes.getBoundingClientRect();
  const maxLeft = Math.max(0, zone.width - button.width);
  const maxTop = Math.max(0, zone.height - button.height);
  elements.yes.style.left = `${Math.random() * maxLeft}px`;
  elements.yes.style.top = `${Math.random() * maxTop}px`;
}

function clearDodge() {
  state.isDodging = false;
  if (state.dodgeTimer) window.clearTimeout(state.dodgeTimer);
  state.dodgeTimer = null;
}

// Starts on either hover or touch so the prank works with a mouse and a finger.
function startDodgeSequence() {
  const wish = state.currentWish;
  if (!wish || !wish.dodge || state.dodgeStartedAt || !elements.reveal.hidden) return;
  state.dodgeStartedAt = Date.now();
  state.isDodging = true;
  elements.yes.classList.add('is-dodging');
  elements.status.textContent = 'Catch me if you can!';
  moveYesButton();
  const duration = (Number(wish.dodgeSeconds) || 7) * 1000;
  state.dodgeTimer = window.setTimeout(() => {
    state.isDodging = false;
    elements.yes.classList.remove('is-dodging');
    elements.yes.style.left = '';
    elements.yes.style.top = '';
    elements.status.textContent = 'All right, you caught me.';
  }, duration);
}

function revealWish() {
  if (state.isDodging) return;
  clearDodge();
  const wish = state.currentWish;
  elements.yes.hidden = true;
  elements.next.hidden = false;
  elements.reveal.hidden = false;
  elements.friendName.textContent = wish.name;
  elements.friendMessage.textContent = wish.message;
  elements.photo.setAttribute('aria-label', `Photo placeholder for ${wish.name}`);
  launchConfetti();
}

function launchConfetti() {
  elements.confetti.replaceChildren();
  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${35 + Math.random() * 30}%`;
    piece.style.setProperty('--x', `${(Math.random() - .5) * 360}px`);
    piece.style.setProperty('--y', `${100 + Math.random() * 300}px`);
    piece.style.animationDelay = `${Math.random() * .2}s`;
    elements.confetti.append(piece);
  }
  window.setTimeout(() => elements.confetti.replaceChildren(), 1800);
}

elements.begin.addEventListener('click', async () => {
  elements.begin.disabled = true;
  const loaded = await loadWishes();
  elements.begin.disabled = false;
  if (!loaded) return;
  state.currentIndex = 0;
  renderWish();
  showScreen(elements.wish);
});

elements.yes.addEventListener('pointerenter', startDodgeSequence);
elements.yes.addEventListener('pointerdown', (event) => {
  if (state.isDodging) {
    event.preventDefault();
    moveYesButton();
    return;
  }
  startDodgeSequence();
});
elements.yes.addEventListener('click', revealWish);
elements.no.addEventListener('click', () => {
  elements.status.textContent = state.currentWish.noMessage;
});
elements.next.addEventListener('click', () => {
  state.currentIndex += 1;
  if (state.currentIndex >= state.wishes.length) {
    clearDodge();
    showScreen(elements.final);
    return;
  }
  renderWish();
});
