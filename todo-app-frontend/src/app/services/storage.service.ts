import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    await this.storage.defineDriver(CordovaSQLiteDriver);
  }

  async setItem(key: string, value: any): Promise<void> {
    await this.storage.set(key, value);
  }

  async getItem(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  async removeItem(key: string): Promise<void> {
    await this.storage.remove(key);
  }

  async clearAll(): Promise<void> {
    await this.storage.clear();
  }

  async isLoggedIn() {
    return await this.storage.get(Constants.AUTH_TOKEN);
  }
}
