const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
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
  demoMode: true,
  username: 'bataso.brand'
};

const state = {
  config: { ...DEFAULT_CONFIG },
  connection: {
    username: '@bataso.brand',
    connected: false,
    status: 'offline',
    viewerCount: 128,
    likes: 0,
    comments: 0,
    gifts: 0,
    lastEventAt: Date.now()
  },
  seats: [],
  chat: [],
  vip: [
    { nickname: 'Chú Tích Bataso', points: 2860, badge: 'VIP' },
    { nickname: 'Anh Ba Miền Tây', points: 1920, badge: 'VIP' },
    { nickname: 'Em Thảo', points: 1500, badge: 'HOT' },
    { nickname: 'Mình Đức', points: 940, badge: 'HOT' }
  ],
  queue: [],
  feed: [],
  eventCounter: 0
};

function createSeatArray(length = 12) {
  return Array.from({ length }, (_, index) => ({
    id: index,
    nickname: '',
    avatar: '/assets/avatar_default.svg',
    active: false,
    lastSeen: 0,
    color: index % 2 === 0 ? '#d94e4e' : '#3aa9d8'
  }));
}

state.seats = createSeatArray(state.config.maxSeats);

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

function emitState() {
  io.emit('state:sync', JSON.parse(JSON.stringify({
    config: state.config,
    connection: state.connection,
    seats: state.seats,
    chat: state.chat,
    vip: state.vip,
    feed: state.feed,
    queue: state.queue
  })));
}

function appendEvent(type, payload) {
  state.eventCounter += 1;
  const event = {
    id: `evt-${state.eventCounter}`,
    type,
    payload,
    timestamp: Date.now()
  };
  state.feed.push(event);
  state.feed = state.feed.slice(-20);
  state.queue.push(event);
  state.queue = state.queue.slice(-10);
  io.emit('live:event', event);
  emitState();
}

function resetSeats() {
  state.seats = createSeatArray(state.config.maxSeats);
  emitState();
}

function resetVip() {
  state.vip = [
    { nickname: 'Chú Tích Bataso', points: 2860, badge: 'VIP' },
    { nickname: 'Anh Ba Miền Tây', points: 1920, badge: 'VIP' },
    { nickname: 'Em Thảo', points: 1500, badge: 'HOT' },
    { nickname: 'Mình Đức', points: 940, badge: 'HOT' }
  ];
  emitState();
}

function sortVip() {
  state.vip.sort((a, b) => b.points - a.points);
}

function assignSeat({ nickname, avatar }) {
  let seat = state.seats.find((item) => !item.active);

  if (!seat) {
    const oldest = [...state.seats]
      .filter((item) => item.active)
      .sort((a, b) => (a.lastSeen || 0) - (b.lastSeen || 0))[0];

    if (!oldest) {
      return null;
    }

    seat = oldest;
    seat.nickname = '';
    seat.avatar = '/assets/avatar_default.svg';
    seat.active = false;
    seat.lastSeen = 0;
  }

  seat.nickname = nickname;
  seat.avatar = avatar || '/assets/avatar_default.svg';
  seat.active = true;
  seat.lastSeen = Date.now();
  return seat;
}

function addChat(nickname, text) {
  state.chat.unshift({ nickname, text, at: Date.now() });
  state.chat = state.chat.slice(0, 8);
  state.connection.comments += 1;
  emitState();
}

function addLike(amount = 1) {
  state.connection.likes += amount;
  if (state.connection.likes >= state.config.likeThreshold) {
    const event = {
      type: 'storm',
      title: 'Bão Bánh Tráng',
      message: `Đã chạm ${state.config.likeThreshold} tim!`
    };
    state.feed.push(event);
    state.connection.likes = 0;
    io.emit('live:event', event);
  }
  emitState();
}

function addGift(nickname, amount) {
  state.connection.gifts += amount;
  const tier = amount >= state.config.largeGiftThreshold ? 'large' : 'small';
  const giftEvent = {
    type: 'gift',
    nickname,
    amount,
    tier,
    message: `${nickname} đã tặng ${amount} xu`
  };
  state.feed.push(giftEvent);
  state.feed = state.feed.slice(-20);
  io.emit('live:event', giftEvent);

  const vipGain = amount * 10;
  const existed = state.vip.find((user) => user.nickname === nickname);
  if (existed) {
    existed.points += vipGain;
  } else {
    state.vip.push({ nickname, points: vipGain, badge: 'HOT' });
  }
  sortVip();
  emitState();
}

const demoNames = [
  'Mình Đức', 'Lan Anh', 'Nhi Hân', 'Bảo Nhi', 'Duy Nguyễn', 'Thảo Vy', 'Nguyễn Lan',
  'Mẫn Nghi', 'Mai Anh', 'Hoàng Nam', 'Phương Anh', 'Minh Khoa', 'Thanh Thảo', 'Hào', 'Vy'
];

function triggerDemoEvent(type) {
  if (type === 'join') {
    const nickname = demoNames[Math.floor(Math.random() * demoNames.length)];
    const seat = assignSeat({ nickname, avatar: '/assets/avatar_default.svg' });
    if (seat) {
      addChat(nickname, 'Quán Bataso xin chào bạn!');
      appendEvent('join', { nickname, seatId: seat.id });
    }
    return;
  }

  if (type === 'comment') {
    const nickname = demoNames[Math.floor(Math.random() * demoNames.length)];
    const text = [
      'Bánh tráng này ngon quá!',
      'Cho em 2 phần nhé shop ơi!',
      'Món này ăn ngon quá!',
      'Bếp than nóng hổi quá!',
      'Tay nghề nướng giỏi thật đấy!'
    ][Math.floor(Math.random() * 5)];
    addChat(nickname, text);
    appendEvent('comment', { nickname, text });
    return;
  }

  if (type === 'like') {
    const count = 20 + Math.floor(Math.random() * 120);
    addLike(count);
    appendEvent('like', { count });
    return;
  }

  if (type === 'gift') {
    const nickname = demoNames[Math.floor(Math.random() * demoNames.length)];
    const amount = Math.random() > 0.7 ? 80 + Math.floor(Math.random() * 120) : 5 + Math.floor(Math.random() * 10);
    addGift(nickname, amount);
    appendEvent('gift', { nickname, amount });
  }
}

function demoLoop() {
  if (!state.config.demoMode) return;

  const chance = Math.random();
  if (chance < 0.2) {
    triggerDemoEvent('join');
  } else if (chance < 0.48) {
    triggerDemoEvent('comment');
  } else if (chance < 0.76) {
    triggerDemoEvent('like');
  } else {
    triggerDemoEvent('gift');
  }
}

io.on('connection', (socket) => {
  socket.emit('state:sync', JSON.parse(JSON.stringify({
    config: state.config,
    connection: state.connection,
    seats: state.seats,
    chat: state.chat,
    vip: state.vip,
    feed: state.feed,
    queue: state.queue
  })));

  socket.on('stage:ready', () => {
    socket.emit('state:sync', JSON.parse(JSON.stringify({
      config: state.config,
      connection: state.connection,
      seats: state.seats,
      chat: state.chat,
      vip: state.vip,
      feed: state.feed,
      queue: state.queue
    })));
  });

  socket.on('admin:connect', ({ username }) => {
    state.connection.username = username || '@bataso.brand';
    state.connection.connected = true;
    state.connection.status = 'live';
    state.connection.lastEventAt = Date.now();
    emitState();
  });

  socket.on('admin:disconnect', () => {
    state.connection.connected = false;
    state.connection.status = 'offline';
    emitState();
  });

  socket.on('admin:update-settings', (settings) => {
    state.config = { ...state.config, ...settings };
    if (state.config.maxSeats !== state.seats.length) {
      state.seats = createSeatArray(state.config.maxSeats);
    }
    emitState();
  });

  socket.on('admin:test-event', (type) => {
    triggerDemoEvent(type);
  });

  socket.on('admin:reset-seats', () => {
    resetSeats();
  });

  socket.on('admin:reset-vip', () => {
    resetVip();
  });
});

setInterval(demoLoop, 3200);

server.listen(PORT, () => {
  console.log(`BATASO LIVE server is running at http://localhost:${PORT}`);
});
