function getEmptySeatIndex(seats) {
  return seats.findIndex((seat) => !seat.active);
}

function assignSeat(seats, nickname, avatar = '/assets/avatar_default.svg') {
  const emptyIndex = getEmptySeatIndex(seats);
  if (emptyIndex < 0) return null;

  const nextSeat = { ...seats[emptyIndex], nickname, avatar, active: true, lastSeen: Date.now() };
  seats[emptyIndex] = nextSeat;
  return nextSeat;
}

function releaseSeat(seats, seatId) {
  const targetSeat = seats.find((seat) => seat.id === seatId);
  if (!targetSeat) return;

  targetSeat.nickname = '';
  targetSeat.avatar = '/assets/avatar_default.svg';
  targetSeat.active = false;
  targetSeat.lastSeen = 0;
}

export { assignSeat, releaseSeat, getEmptySeatIndex };
