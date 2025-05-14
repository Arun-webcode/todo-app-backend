import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, ModalController, IonLabel, IonChip, IonAvatar, PopoverController } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { SignupComponent } from 'src/app/auth/signup/signup.component';
import { StorageService } from 'src/app/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { UserMenuPopoverComponent } from 'src/app/components/user-menu-popover/user-menu-popover.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  providers: [StorageService],
  imports: [IonAvatar, IonChip, IonLabel, IonHeader, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, FormsModule, CommonModule],
})
export class HomePage implements OnInit {
  quotes: string[] = [
    'Believe in yourself!',
    'Start where you are. Use what you have. Do what you can.',
    'Success is the sum of small efforts repeated day in and day out.',
    'Don’t watch the clock; do what it does. Keep going.',
    'The secret of getting ahead is getting started.'
  ];
  currentQuote: string = '';
  quoteIndex: number = 0;
  isLogin: boolean = false;
  name = '';
  email = '';

  constructor(
    public routerLink: RouterLink,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private popoverCtrl: PopoverController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.quotesAnimation();
    // this.storageService.clearAll()
  }

  async ionViewWillEnter() {
    await this.getUserData();
  }

  async openUserMenu(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: UserMenuPopoverComponent,
      event: ev,
      alignment: 'start',
      side: 'bottom',
      translucent: true,
      showBackdrop: false,
      dismissOnSelect: true,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data) {
      this.handleAction(data);
    }
  }

  async handleAction(action: string) {
    switch (action) {
      case 'logout':
        await this.logout();
        break;
      case 'reset-password':
        console.log('Resetting password...');
        break;
      case 'delete-account':
        console.log('Deleting account...');
        break;
    }
  }

  async logout() {
    try {
      const res = await this.authService.logout();
      console.log(res);

      await this.storageService.clearAll();
      await this.getUserData();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async getUserData() {
    this.isLogin = await this.storageService.getItem(Constants.USER_LOGIN);
    this.name = await this.storageService.getItem(Constants.USER_NAME);
    this.email = await this.storageService.getItem(Constants.USER_EMAIL);
  }

  quotesAnimation() {
    this.currentQuote = this.quotes[this.quoteIndex];
    setInterval(() => {
      this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
      this.currentQuote = this.quotes[this.quoteIndex];
    }, 5000);
  }

  async login() {
    const model = await this.modalCtrl.create({
      component: LoginComponent,
      showBackdrop: true,
      backdropDismiss: false,
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await model.present();
    const modalData = await model.onWillDismiss();
    if (modalData.data && modalData.data != 'signup') {
      await this.getUserData();
    } else if (modalData.data == 'signup') {
      this.signup();
    }
  }

  async signup() {
    const modal = await this.modalCtrl.create({
      component: SignupComponent,
      showBackdrop: true,
      backdropDismiss: false,
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();
    const modalData = await modal.onWillDismiss();
    if (modalData.data) {
      this.login();
    }
  }
}
