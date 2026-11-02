const stage = {
  state: {
    config: {
      likeThreshold: 666,
      maxSeats: 12,
      smallGiftThreshold: 10,
      largeGiftThreshold: 50,
      demoMode: true,
      ttsEnabled: true,
      effectsEnabled: true,
      musicEnabled: true
    },
    connection: {
      viewerCount: 128,
      likes: 0,
      comments: 0,
      gifts: 0,
      status: 'offline'
    },
    seats: Array.from({ length: 12 }, (_, index) => ({
      id: index,
      nickname: '',
      avatar: '/assets/avatar_default.svg',
      active: false,
      color: index % 2 === 0 ? '#e85353' : '#4da1d8'
    })),
    chat: [
      { nickname: 'Nguyễn Lan', text: 'Bánh tráng ngon quá!' },
      { nickname: 'Mình Đức', text: 'Cho em 1 combo nhé!' },
      { nickname: 'Thanh Thảo', text: 'Đêm nay quán thật sôi động!' }
    ],
    vip: [
      { nickname: 'Chú Tích Bataso', points: 2860, badge: 'VIP' },
      { nickname: 'Anh Ba Miền Tây', points: 1920, badge: 'VIP' },
      { nickname: 'Em Thảo', points: 1500, badge: 'HOT' }
    ],
    feed: []
  }
};

const socket = io();

const viewerCountEl = document.getElementById('viewer-count');
const likeCountEl = document.getElementById('like-count');
const vipListEl = document.getElementById('vip-list');
const commentStreamEl = document.getElementById('comment-stream');
const seatListEl = document.getElementById('seat-list');
const toastEl = document.getElementById('toast');
const giftBannerNameEl = document.getElementById('gift-banner-name');
const stageRootEl = document.getElementById('stage-root');

function renderVip() {
  vipListEl.innerHTML = stage.state.vip.slice(0, 4).map((person, index) => `
    <div class="vip-item ${index === 0 ? 'top' : ''}">
      <span class="vip-rank">${index + 1}</span>
      <span class="vip-avatar">${person.nickname.slice(0, 1).toUpperCase()}</span>
      <span class="vip-name">${person.nickname}</span>
      <span class="vip-points">${person.points} xu</span>
    </div>
  `).join('');
}

function renderComments() {
  commentStreamEl.innerHTML = stage.state.chat.slice(0, 6).map((comment) => `
    <div class="comment-item">
      <span class="comment-name">${comment.nickname}</span>
      <span class="comment-text">${comment.text}</span>
    </div>
  `).join('');
}

function renderSeats() {
  seatListEl.innerHTML = stage.state.seats.map((seat) => `
    <div class="seat ${seat.active ? 'seat-active' : ''}" style="--seat-color:${seat.color};">
      <div class="seat-avatar ${seat.active ? 'avatar-visible' : ''}">
        <img src="${seat.avatar || '/assets/avatar_default.svg'}" alt="${seat.nickname || 'guest'}" />
      </div>
      <div class="seat-name">${seat.nickname || 'Ghế trống'}</div>
      <div class="seat-plate ${seat.active ? 'plate-visible' : ''}">Bánh tráng</div>
    </div>
  `).join('');
}

function renderMeta() {
  viewerCountEl.textContent = stage.state.connection.viewerCount ? `${stage.state.connection.viewerCount}` : '1.2K';
  likeCountEl.textContent = String(stage.state.connection.likes || 0);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove('visible'), 2400);
}

function triggerHeartBurst() {
  stageRootEl.classList.remove('heart-burst');
  void stageRootEl.offsetWidth;
  stageRootEl.classList.add('heart-burst');
  setTimeout(() => stageRootEl.classList.remove('heart-burst'), 1600);
}

function triggerGiftBurst(name) {
  giftBannerNameEl.textContent = name.toUpperCase();
  stageRootEl.classList.remove('gift-glow');
  void stageRootEl.offsetWidth;
  stageRootEl.classList.add('gift-glow');
  setTimeout(() => stageRootEl.classList.remove('gift-glow'), 2100);
}

function updateState(data) {
  if (!data) return;
  stage.state = { ...stage.state, ...data };
  if (!stage.state.config) stage.state.config = {};
  if (!stage.state.connection) stage.state.connection = {};
  if (!stage.state.seats || stage.state.seats.length === 0) {
    stage.state.seats = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      nickname: '',
      avatar: '/assets/avatar_default.svg',
      active: false,
      color: index % 2 === 0 ? '#e85353' : '#4da1d8'
    }));
  }

  renderVip();
  renderComments();
  renderSeats();
  renderMeta();
}

socket.on('connect', () => {
  socket.emit('stage:ready');
  showToast('Stage kết nối thành công');
});

socket.on('state:sync', (data) => {
  updateState(data);
});

socket.on('live:event', (event) => {
  if (!event) return;
  if (event.type === 'storm') {
    triggerHeartBurst();
    showToast('Bão Bánh Tráng đã khởi động!');
  }

  if (event.type === 'gift') {
    triggerGiftBurst(event.nickname || 'BATASO');
    showToast(`${event.nickname} đã tặng ${event.amount} xu`);
  }

  if (event.type === 'join') {
    showToast(`${event.payload?.nickname || 'Khách'} vừa vào quán`);
  }
});

setTimeout(() => {
  updateState({
    config: { likeThreshold: 666, maxSeats: 12, smallGiftThreshold: 10, largeGiftThreshold: 50 },
    connection: { viewerCount: 128, likes: 0, comments: 0, gifts: 0, status: 'offline' },
    seats: Array.from({ length: 12 }, (_, index) => ({
      id: index,
      nickname: '',
      avatar: '/assets/avatar_default.svg',
      active: false,
      color: index % 2 === 0 ? '#e85353' : '#4da1d8'
    })),
    chat: [
      { nickname: 'Nguyễn Lan', text: 'Bánh tráng nóng giòn quá!' },
      { nickname: 'Mình Đức', text: 'Cho em combo nhé!' },
      { nickname: 'Bảo Nhi', text: 'Mở quán kiểu này là quá chill luôn!' }
    ],
    vip: [
      { nickname: 'Chú Tích Bataso', points: 2860, badge: 'VIP' },
      { nickname: 'Anh Ba Miền Tây', points: 1920, badge: 'VIP' },
      { nickname: 'Em Thảo', points: 1500, badge: 'HOT' },
      { nickname: 'Mình Đức', points: 940, badge: 'HOT' }
    ],
    feed: []
  });
}, 100);
