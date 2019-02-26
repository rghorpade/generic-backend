import { EventEmitter } from 'events'

export class DbWatcher extends EventEmitter {
  private watchedKeys: string[] = []
  private readonly interval = 2000
  private readonly getAsync: (key: string) => string

  constructor(getAsyncImplementation: (key: string) => string) {
    super()
    this.getAsync = getAsyncImplementation
    setInterval(this.checkSubscriptions.bind(this), this.interval)
  }

  async checkSubscriptions() {
    for (const watchedKey of this.watchedKeys) {
      const data = JSON.parse(await this.getAsync(watchedKey))

      if (data && data.status === 'success') {
        this.emit(watchedKey)
        this.watchedKeys = this.watchedKeys.filter(key => key !== watchedKey)
      }
    }
  }

  addSubscription(userId: string) {
    if (this.watchedKeys.indexOf(userId) < 0) {
      this.watchedKeys.push(userId)
    }
  }
}
