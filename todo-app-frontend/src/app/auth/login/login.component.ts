import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonInput, IonButton, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, FormsModule, CommonModule
  ]
})
export class LoginComponent implements OnInit {
  email = '';
  otp = '';
  password = '';
  confirmPassword = '';
  name = '';

  passwordError = false;
  showPasswordInputs = false;

  passwordType = 'password';
  passwordIcon = 'eye-off';


  constructor() { }

  ngOnInit() { }

  login() {

  }

}
