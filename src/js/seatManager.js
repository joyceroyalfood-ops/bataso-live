function getEmptySeatIndex(seats) {
  return seats.findIndex((seat) => !seat.active);
}

function assignSeat(seats, nickname, avatar = '/assets/avatar_default.svg') {
  const index = getEmptySeatIndex(seats);
  if (index < 0) return null;

  seats[index] = {
    ...seats[index],
    nickname,
    avatar,
    active: true,
    lastSeen: Date.now()
  };

  return seats[index];
}

function releaseSeat(seats, seatId) {
  const target = seats.find((seat) => seat.id === seatId);
  if (!target) return;

  target.nickname = '';
  target.avatar = '/assets/avatar_default.svg';
  target.active = false;
  target.lastSeen = 0;
}

export { assignSeat, releaseSeat, getEmptySeatIndex };
