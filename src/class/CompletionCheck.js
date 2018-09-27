export default class CompletionCheck {
  constructor(total, callback, onCheck) {
    this.callback = callback;
    this.onCheck = onCheck;
    this.counter = {
      count: 0,
      total: total
    };
    setTimeout(() => this.check(), 500);
    return this.counter;
  }

  check() {
    if (this.onCheck) {
      this.onCheck();
    }
    if (this.counter.count < this.counter.total) {
      setTimeout(() => this.check(), 500);
    } else {
      this.callback();
    }
  }
}
