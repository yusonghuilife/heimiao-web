type EventHandler = (...args: any[]) => void;

class EventEmitter {
  private events: Map<string, EventHandler[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, handler: EventHandler) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler) {
    if (!this.events.has(event)) return;
    const handlers = this.events.get(event)!;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) return;
    this.events.get(event)!.forEach(handler => handler(...args));
  }
}

export const eventEmitter = new EventEmitter(); 