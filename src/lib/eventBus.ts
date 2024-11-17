type EventCallback = (data: any) => void;

class EventBus {
  private listeners: { [key: string]: EventCallback[] } = {};
  private lastEvents: { [key: string]: { data: any; timestamp: number } } = {};
  private readonly EVENT_TIMEOUT = 5000; // 5 saniye

  subscribe(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Son eventi yeni aboneye gönder
    const lastEvent = this.lastEvents[event];
    if (lastEvent && Date.now() - lastEvent.timestamp < this.EVENT_TIMEOUT) {
      callback(lastEvent.data);
    }

    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  publish(event: string, data: any) {
    // Eventi kaydet
    this.lastEvents[event] = {
      data,
      timestamp: Date.now()
    };

    // Dinleyicilere gönder
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  clear(event?: string) {
    if (event) {
      delete this.listeners[event];
      delete this.lastEvents[event];
    } else {
      this.listeners = {};
      this.lastEvents = {};
    }
  }

  // Event geçmişini temizle
  clearOldEvents() {
    const now = Date.now();
    Object.keys(this.lastEvents).forEach(event => {
      if (now - this.lastEvents[event].timestamp > this.EVENT_TIMEOUT) {
        delete this.lastEvents[event];
      }
    });
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Periyodik olarak eski eventleri temizle
setInterval(() => eventBus.clearOldEvents(), 60000); // Her dakika