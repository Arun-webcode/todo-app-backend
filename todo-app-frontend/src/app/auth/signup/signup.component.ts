import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonLabel, IonCardHeader, IonCardSubtitle, IonCardContent,
  IonCardTitle, IonItem, IonButton, IonIcon, IonInput
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    IonInput, IonIcon, IonButton, IonItem, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonLabel, IonCard, FormsModule, CommonModule
  ]
})
export class SignupComponent implements OnInit {

  email = '';
  otp = '';
  password = '';
  confirmPassword = '';
  name = '';

  showOtpInput = false;
  showPasswordInputs = false;
  otpError = false;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    private toastController: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  async sendOtp(): Promise<void> {
    try {
      await this.authService.sendOtp('arun.webcode@gmail.com');
      this.showOtpInput = true;
      this.presentToast('OTP sent to your email');
    } catch (error) {
      this.presentToast('Failed to send OTP', 'danger');
    }
  }

  async verifyOtp(): Promise<void> {
    // Replace this with actual OTP verification logic, this is just a placeholder
    const isOtpValid = await this.mockOtpVerification(this.otp);
    if (isOtpValid) {
      this.otpError = false;
      this.showPasswordInputs = true;
      this.presentToast('OTP verified successfully');
    } else {
      this.otpError = true;
      this.presentToast('Invalid OTP', 'danger');
    }
  }

  togglePassword(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'password' ? 'eye-off' : 'eye';
  }

  async signup(): Promise<void> {
    if (this.password === this.confirmPassword && this.password.length >= 6) {
      try {
        await this.authService.registerAccount(this.password, this.name, this.otp);
        this.presentToast('Account registered successfully');
        this.resetForm();
      } catch (error) {
        this.presentToast('Registration failed', 'danger');
      }
    } else {
      this.presentToast('Passwords do not match or are too short', 'danger');
    }
  }

  resetForm(): void {
    this.email = '';
    this.otp = '';
    this.password = '';
    this.confirmPassword = '';
    this.name = '';
    this.showOtpInput = false;
    this.showPasswordInputs = false;
  }

  private async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  private mockOtpVerification(otp: string): Promise<boolean> {
    // Simulate OTP verification logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(otp === '123456'); // Replace with actual OTP validation logic
      }, 1000);
    });
  }
}
