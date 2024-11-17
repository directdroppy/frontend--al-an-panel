type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift(); // Remove oldest log
    }

    // In development, also log to console
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = entry.level === 'error' ? console.error :
                           entry.level === 'warn' ? console.warn :
                           console.log;
      consoleMethod(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.data || '');
    }

    // Here you would typically send logs to a logging service
    this.persistLogs(entry);
  }

  private persistLogs(entry: LogEntry) {
    // Send logs to server or logging service
    // This is a placeholder for actual implementation
    try {
      const logsEndpoint = '/api/logs';
      fetch(logsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      }).catch(error => {
        console.error('Failed to persist logs:', error);
      });
    } catch (error) {
      console.error('Error persisting logs:', error);
    }
  }

  public info(message: string, data?: any) {
    this.addLog(this.createLogEntry('info', message, data));
  }

  public warn(message: string, data?: any) {
    this.addLog(this.createLogEntry('warn', message, data));
  }

  public error(message: string, error?: Error | any) {
    this.addLog(this.createLogEntry('error', message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    }));
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();