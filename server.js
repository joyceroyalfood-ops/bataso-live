const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

const DEFAULT_CONFIG = {
  maxSeats: 12,
  likeThreshold: 666,
  seatTimeout: 75,
  smallGiftThreshold: 10,
  largeGiftThreshold: 50,
  ttsEnabled: true,
  musicEnabled: true,
  effectsEnabled: true,
  demoMode: true
};

const state = {
  config: { ...DEFAULT_CONFIG },
  connection: {
    username: 'BATASO STUDIO',
    connected: false,
    status: 'offline',
    viewerCount: 128,
    likes: 0,
    comments: 0,
    gifts: 0
  },
  seats: Array.from({ length: 12 }, (_, index) => ({
    id: index,
    nickname: '',
    avatar: '/assets/avatar_default.svg',
    color: index % 2 === 0 ? '#d9485f' : '#2eb3a6',
    active: false,
    lastSeen: 0,
    plate: 'Bánh tráng'
  })),
  vip: [
    { nickname: 'Mình Đức', points: 8420, badge: 'VIP' },
    { nickname: 'Nhi Hân', points: 7950, badge: 'VIP' },
    { nickname: 'Lan Anh', points: 6780, badge: 'V.I.P' },
    { nickname: 'Tuấn Tú', points: 5900, badge: 'HOT' }
  ],
  comments: [
    { nickname: 'Nguyễn Lan', text: 'Bánh tráng này ngon quá!' },
    { nickname: 'Mình Đức', text: 'Cho em 1 combo nhé!' },
    { nickname: 'Thanh Thảo', text: 'Giá tốt quá shop ơi' },
    { nickname: 'Hoàng Nam', text: 'Ship Gia Lai không?' }
  ],
  feed: [],
  eventCounter: 0,
  demoUsers: ['Mình Đức', 'Lan Anh', 'Nhi Hân', 'Trúc Vy', 'Bảo Nhi', 'Duy', 'Khoa', 'Phương Anh', 'Hoàng Nam', 'Mai Linh', 'Thanh Trúc', 'Triệu Vy'],
  lastGiftTime: 0,
  lastLikeTime: 0,
  queue: []
};

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/stage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'stage.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

function cloneState() {
  return JSON.parse(JSON.stringify({
    config: state.config,
    connection: state.connection,
    seats: state.seats,
    vip: state.vip,
    comments: state.comments,
    feed: state.feed,
    eventCounter: state.eventCounter
  }));
}

function emitState() {
  io.emit('state:sync', cloneState());
}

function sortVip() {
  state.vip.sort((a, b) => b.points - a.points);
}

function getSeatSlot() {
  return state.seats.find((seat) => !seat.active) || null;
}

function assignSeat({ nickname, avatar }) {
  const seat = getSeatSlot();
  if (!seat) {
    const inactiveSeat = state.seats
      .filter((item) => item.active)
      .sort((a, b) => (a.lastSeen || 0) - (b.lastSeen || 0))[0];

    if (inactiveSeat) {
      inactiveSeat.nickname = '';
      inactiveSeat.avatar = '/assets/avatar_default.svg';
      inactiveSeat.active = false;
      inactiveSeat.lastSeen = 0;
      inactiveSeat.plate = 'Bánh tráng';
      return assignSeat({ nickname, avatar });
    }

    return null;
  }

  seat.nickname = nickname;
  seat.avatar = avatar || '/assets/avatar_default.svg';
  seat.active = true;
  seat.lastSeen = Date.now();
  seat.plate = 'Bánh tráng';
  return seat;
}

function resetSeats() {
  state.seats = Array.from({ length: state.config.maxSeats }, (_, index) => ({
    id: index,
    nickname: '',
    avatar: '/assets/avatar_default.svg',
    color: index % 2 === 0 ? '#d9485f' : '#2eb3a6',
    active: false,
    lastSeen: 0,
    plate: 'Bánh tráng'
  }));
}

function addComment(nickname, text) {
  state.comments.unshift({ nickname, text });
  state.comments = state.comments.slice(0, 8);
  state.connection.comments += 1;
  emitState();
}

function addLike(count = 1) {
  state.connection.likes += count;
  if (state.connection.likes >= state.config.likeThreshold) {
    state.feed.push({
      type: 'storm',
      message: `Bão bánh tráng đã khởi động! ${state.connection.likes} tim đã chạm mốc.`
    });
    state.connection.likes = 0;
  }
  emitState();
}

function addGift(amount, nickname) {
  state.connection.gifts += amount;
  state.lastGiftTime = Date.now();
  state.feed.push({
    type: amount >= state.config.largeGiftThreshold ? 'large-gift' : 'gift',
    message: `${nickname} đã tặng ${amount} xu`,
    nickname,
    amount
  });
  emitState();
}

function pushEvent(type, payload) {
  state.eventCounter += 1;
  const event = { id: `evt-${state.eventCounter}`, type, payload, timestamp: Date.now() };
  state.feed.push(event);
  state.feed = state.feed.slice(-20);
  io.emit('event:push', event);
  emitState();
}

function simulateJoin() {
  const name = state.demoUsers[Math.floor(Math.random() * state.demoUsers.length)];
  const seat = assignSeat({ nickname: name, avatar: '/assets/avatar_default.svg' });
  if (seat) {
    pushEvent('join', { nickname: name, seatId: seat.id, color: seat.color });
    addComment(name, 'Quán Bataso xin chào bạn!');
  }
}

function simulateComment() {
  const name = state.demoUsers[Math.floor(Math.random() * state.demoUsers.length)];
  const phrases = [
    'Bánh tráng nướng thơm quá!',
    'Cho em 2 phần bánh tráng nhé!',
    'Tay nghề nướng này quá đỉnh!',
    'Mời cả nhà vào quán cùng ăn!',
    'Đêm nay quán Bataso thật sôi động!'
  ];
  const text = phrases[Math.floor(Math.random() * phrases.length)];
  addComment(name, text);
  pushEvent('comment', { nickname: name, text });
}

function simulateLike() {
  const count = 12 + Math.floor(Math.random() * 45);
  addLike(count);
  pushEvent('like', { count });
}

function simulateGift() {
  const amount = Math.random() > 0.7 ? 80 + Math.floor(Math.random() * 120) : 3 + Math.floor(Math.random() * 8);
  const name = state.demoUsers[Math.floor(Math.random() * state.demoUsers.length)];
  addGift(amount, name);
  pushEvent('gift', { nickname: name, amount });
}

function processDemoLoop() {
  if (!state.config.demoMode) return;

  const roll = Math.random();
  if (roll < 0.24) simulateJoin();
  else if (roll < 0.52) simulateComment();
  else if (roll < 0.76) simulateLike();
  else simulateGift();
}

io.on('connection', (socket) => {
  socket.emit('state:sync', cloneState());

  socket.on('admin:connect', ({ username }) => {
    state.connection.username = username || 'BATASO STUDIO';
    state.connection.connected = true;
    state.connection.status = 'live';
    emitState();
  });

  socket.on('admin:disconnect', () => {
    state.connection.connected = false;
    state.connection.status = 'offline';
    emitState();
  });

  socket.on('admin:update-settings', (settings) => {
    state.config = { ...state.config, ...settings };
    emitState();
  });

  socket.on('admin:reset-seats', () => {
    resetSeats();
    emitState();
  });

  socket.on('admin:reset-vip', () => {
    state.vip = [
      { nickname: 'Mình Đức', points: 8420, badge: 'VIP' },
      { nickname: 'Nhi Hân', points: 7950, badge: 'VIP' },
      { nickname: 'Lan Anh', points: 6780, badge: 'V.I.P' },
      { nickname: 'Tuấn Tú', points: 5900, badge: 'HOT' }
    ];
    emitState();
  });

  socket.on('admin:test-event', (type) => {
    if (type === 'join') simulateJoin();
    if (type === 'comment') simulateComment();
    if (type === 'like') simulateLike();
    if (type === 'gift') simulateGift();
  });

  socket.on('stage:ready', () => {
    socket.emit('state:sync', cloneState());
  });
});

setInterval(() => {
  processDemoLoop();
}, 2500);

server.listen(PORT, () => {
  console.log(`BATASO LIVE server is running at http://localhost:${PORT}`);
});
