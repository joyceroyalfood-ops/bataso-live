const demoFacts = [
  'Bánh tráng nướng được quay trực tiếp trên bếp than.',
  'Khách hàng vừa vào quán và nhận chỗ ngồi.',
  'Bão bánh tráng đã được kích hoạt bằng lượt tim.',
  'Quà tặng lớn đã tạo spotlight cho người tặng.'
];

const demoEvents = [
  { type: 'join', nickname: 'Mình Đức', text: 'Quán Bataso xin chào bạn!' },
  { type: 'comment', nickname: 'Lan Anh', text: 'Bánh tráng ngon quá shop ơi!' },
  { type: 'like', nickname: 'Bảo Nhi', count: 120 },
  { type: 'gift', nickname: 'Trúc Vy', amount: 88 }
];

function createEventQueue() {
  return {
    queue: [],
    add(event) {
      this.queue.push(event);
      if (this.queue.length > 6) {
        this.queue.shift();
      }
    },
    next() {
      return this.queue.shift();
    }
  };
}

export { demoFacts, demoEvents, createEventQueue };
