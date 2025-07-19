import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardHeader, IonCardSubtitle, IonCardContent,
  IonCardTitle, IonButton, IonInput, IonLabel,
  IonContent,
  IonTitle, IonHeader,
  IonToolbar,
  IonIcon,
  IonItem,
  IonButtons,
  ModalController
} from '@ionic/angular/standalone';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonButtons, IonItem, IonIcon, IonHeader, IonLabel,
    IonInput, IonButton, IonCardTitle, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonContent, IonTitle, IonToolbar, FormsModule, CommonModule, ThemeToggleComponent
  ]
})
export class SignupPage implements OnInit {

  email = '';
  otp = '';
  password = '';
  confirmPassword = '';
  name = '';
  passwordError = false;
  showPasswordInputs = false;
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    private authService: AuthService,
    public commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async sendOtp(): Promise<void> {
    this.commonService.presentLoading();
    try {
      const res = await this.authService.sendOtp(this.email);
      this.showPasswordInputs = true;
      this.commonService.dismissLoading();
      this.commonService.presentToast(res.message);
    } catch (error: any) {
      if (error && error.error.message) {
        console.error(error.error.error);
        this.commonService.presentToast(error.error.message, 'danger');
        this.commonService.dismissLoading();
      } else {
        this.commonService.presentToast('An unexpected error occurred. Please try again.', 'danger');
        this.commonService.dismissLoading();
      }
    }
  }

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'password' ? 'eye-off' : 'eye';
  }

  async signup(): Promise<void> {
    await this.commonService.presentLoading();
    if (!this.name || !this.email || !this.password && this.password.length < 6 || !this.otp) {
      this.passwordError = true;
      await this.commonService.dismissLoading();
      this.commonService.presentToast('Please fill all fields corrctly', 'danger');
    }

    if (this.password === this.confirmPassword) {
      try {
        const res = await this.authService.registerAccount(this.email, this.password, this.name, this.otp);
        if (res.success) {
          this.commonService.presentToast(res.message);
          this.goToLogin();
          await this.commonService.dismissLoading();
        }
        this.resetForm();
      } catch (error: any) {
        console.error(error.error.message);
        await this.commonService.dismissLoading();
        this.commonService.presentToast(error.error.message, 'danger');
      }
    } else {
      await this.commonService.dismissLoading();
      this.commonService.presentToast('Passwords not matching or too short', 'danger');
    }
  }

  resetForm(): void {
    this.email = '';
    this.otp = '';
    this.password = '';
    this.confirmPassword = '';
    this.name = '';
    this.showPasswordInputs = false;
  }
}
