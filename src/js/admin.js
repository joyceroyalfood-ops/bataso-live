import { assignSeat } from './seatManager.js';
import { addVipPoints } from './vipManager.js';
import { getGiftTier, calculateVipPoints } from './giftManager.js';
import { ttsManager } from './ttsManager.js';

const stageState = {
  config: {
    maxSeats: 12,
    likeThreshold: 666,
    seatTimeout: 75,
    smallGiftThreshold: 10,
    largeGiftThreshold: 50,
    demoMode: true,
    ttsEnabled: true,
    musicEnabled: true,
    effectsEnabled: true
  },
  connection: {
    username: 'BATASO STUDIO',
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
    color: index % 2 === 0 ? '#d9485f' : '#2eb3a6'
  })),
  comments: [
    { nickname: 'Nguyễn Lan', text: 'Bánh tráng này ngon quá!' },
    { nickname: 'Mình Đức', text: 'Cho em 1 combo nhé!' }
  ],
  vip: [
    { nickname: 'Mình Đức', points: 8420, badge: 'VIP' },
    { nickname: 'Nhi Hân', points: 7950, badge: 'VIP' },
    { nickname: 'Lan Anh', points: 6780, badge: 'V.I.P' }
  ],
  feed: []
};

const socket = io();
const seatContainer = document.getElementById('seat-container');
const commentStream = document.getElementById('comment-stream');
const vipPanel = document.getElementById('vip-panel');
const viewerCount = document.getElementById('viewer-count');
const heartFill = document.getElementById('heart-fill');
const heartText = document.getElementById('heart-text');
const toast = document.getElementById('toast');

function renderSeats() {
  seatContainer.innerHTML = stageState.seats
    .map((seat) => {
      const seatClass = seat.active ? 'seat active' : 'seat';
      return `
        <div class="${seatClass}" style="--seat-color: ${seat.color};">
          <div class="seat-avatar">
            <img src="${seat.avatar || '/assets/avatar_default.svg'}" alt="${seat.nickname || 'guest'}" />
          </div>
          <div class="seat-name">${seat.nickname || 'Ghế trống'}</div>
          ${seat.active ? '<div class="seat-plate">Bánh tráng</div>' : ''}
        </div>
      `;
    })
    .join('');
}

function renderComments() {
  commentStream.innerHTML = stageState.comments
    .slice(0, 5)
    .map(
      (item) => `
        <div class="comment-item">
          <span class="comment-user">${item.nickname}</span>
          <span class="comment-text">${item.text}</span>
        </div>
      `
    )
    .join('');
}

function renderVip() {
  vipPanel.innerHTML = stageState.vip
    .slice(0, 4)
    .map(
      (person) => `
        <div class="vip-row">
          <span class="vip-name">${person.nickname}</span>
          <span class="vip-badge">${person.badge}</span>
          <span class="vip-points">${person.points}</span>
        </div>
      `
    )
    .join('');
}

function renderHeartMeter() {
  const max = stageState.config.likeThreshold || 666;
  const ratio = Math.min((stageState.connection.likes || 0) / max, 1);
  heartFill.style.width = `${ratio * 100}%`;
  heartText.textContent = `${stageState.connection.likes} / ${max}`;
}

function renderMeta() {
  viewerCount.textContent = `${stageState.connection.viewerCount || 128} đang xem`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function handleIncomingState(data) {
  if (!data) return;
  Object.assign(stageState, data);
  renderSeats();
  renderComments();
  renderVip();
  renderHeartMeter();
  renderMeta();
}

function seedDemoState() {
  stageState.seats = [
    { id: 0, nickname: 'Mình Đức', avatar: '/assets/avatar_default.svg', active: true, color: '#d9485f' },
    { id: 1, nickname: 'Lan Anh', avatar: '/assets/avatar_default.svg', active: true, color: '#61b9ff' },
    { id: 2, nickname: 'Nhi Hân', avatar: '/assets/avatar_default.svg', active: true, color: '#ffd76b' },
    ...Array.from({ length: 9 }, () => ({ id: null, nickname: '', avatar: '/assets/avatar_default.svg', active: false, color: '#2eb3a6' }))
  ];

  stageState.comments = [
    { nickname: 'Nguyễn Lan', text: 'Bánh tráng này ngon quá!' },
    { nickname: 'Mình Đức', text: 'Cho em combo nhé!' },
    { nickname: 'Bảo Nhi', text: 'Đêm nay quán quá chill!' }
  ];

  stageState.vip = [
    { nickname: 'Mình Đức', points: 8420, badge: 'VIP' },
    { nickname: 'Nhi Hân', points: 7950, badge: 'VIP' },
    { nickname: 'Lan Anh', points: 6780, badge: 'V.I.P' },
    { nickname: 'Tuấn Tú', points: 5900, badge: 'HOT' }
  ];

  renderSeats();
  renderComments();
  renderVip();
}

socket.on('connect', () => {
  socket.emit('stage:ready');
  showToast('Kết nối stage thành công');
});

socket.on('state:sync', (data) => {
  handleIncomingState(data);
});

socket.on('event:push', (event) => {
  const { type, payload } = event;
  if (type === 'join') {
    const seat = assignSeat(stageState.seats, payload.nickname, '/assets/avatar_default.svg');
    if (seat) {
      stageState.seats = stageState.seats.map((item) => item.id === seat.id ? { ...item, nickname: payload.nickname } : item);
      showToast(`${payload.nickname} vừa ngồi vào quán`);
      ttsManager.speak(`Quán Bataso xin chào bạn ${payload.nickname}, mời bạn ngồi ăn bánh tráng nóng giòn!`);
    }
  }

  if (type === 'comment') {
    stageState.comments.unshift({ nickname: payload.nickname, text: payload.text });
    showToast(`${payload.nickname}: ${payload.text}`);
  }

  if (type === 'like') {
    stageState.connection.likes += payload.count || 0;
    showToast(`Bão bánh tráng tăng ${payload.count || 0} tim`);
  }

  if (type === 'gift') {
    const tier = getGiftTier(payload.amount, stageState.config);
    if (tier !== 'tiny') {
      ttsManager.speak(`Quán Bataso vô cùng cảm ơn tấm lòng vàng của bạn ${payload.nickname}, chúc bạn luôn dồi dào tài lộc, vạn sự như ý!`);
    }
    stageState.vip = addVipPoints(stageState.vip, payload.nickname, calculateVipPoints(payload.amount));
    showToast(`${payload.nickname} tặng ${payload.amount} xu`);
  }

  renderSeats();
  renderComments();
  renderVip();
  renderHeartMeter();
});

seedDemoState();
