import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  async presentLoading(message: string = 'Please wait...'): Promise<void> {
    this.loading = await this.loadingController.create({
      message,
      spinner: 'bubbles',
      cssClass: 'custom-loader'
    });
    await this.loading.present();
  }

  async dismissLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
