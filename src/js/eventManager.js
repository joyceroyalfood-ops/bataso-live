const demoFacts = [
  'Bánh tráng nóng giòn được nướng ngay trên bếp than.',
  'Người xem vừa vào quán và nhận chỗ ngồi.',
  'Bão bánh tráng đã bắt đầu, lồng đèn sáng rực!',
  'Món quà lớn đã kích hoạt spotlight cho người tặng.'
];

const demoEvents = [
  { type: 'join', nickname: 'Mình Đức', text: 'Quán Bataso xin chào bạn!' },
  { type: 'comment', nickname: 'Lan Anh', text: 'Nướng giòn quá shop ơi!' },
  { type: 'like', nickname: 'Bảo Nhi', count: 120 },
  { type: 'gift', nickname: 'Trúc Vy', amount: 88 }
];

function createEventQueue() {
  return {
    queue: [],
    add(event) {
      this.queue.push(event);
      if (this.queue.length > 5) this.queue.shift();
    },
    next() {
      return this.queue.shift();
    }
  };
}

export { demoFacts, demoEvents, createEventQueue };
