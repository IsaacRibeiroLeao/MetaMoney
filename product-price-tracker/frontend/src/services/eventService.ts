type EventCallback = () => void;

class EventService {
  private listeners: Record<string, EventCallback[]> = {};

  subscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  unsubscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    );
  }

  emit(event: string): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error(`Erro ao executar callback para evento ${event}:`, error);
      }
    });
  }
}

export const eventService = new EventService();

export const EVENTS = {
  PRODUCTS_UPDATED: 'products_updated',
  VENDAS_UPDATED: 'vendas_updated',
  FINAL_VALUES_UPDATED: 'final_values_updated'
};
