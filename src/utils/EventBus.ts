type Callback<TProps = unknown> = (...args: TProps[]) => void;

export default class EventBus<TProps = unknown> {
  private listeners: Record<string, Callback<TProps>[]> = {};

  on(event: string, callback: Callback<TProps>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Callback<TProps>): void {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
  }

  emit(event: string, ...args: TProps[]): void {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach((listener) => listener(...args));
  }
}
