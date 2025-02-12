import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonModal } from '@ionic/angular/standalone';
import { SignupComponent } from "../../auth/signup/signup.component";
import { LoginComponent } from "../../auth/login/login.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LoginComponent, SignupComponent, IonModal, IonIcon, IonButton, IonLabel, IonList, IonItem],
})
export class HomePage implements OnInit {
  isLogin = false;

  constructor() { }

  ngOnInit() {
  }

  handleChildData(data: string) {
    if (data == 'false') {
      this.isLogin = false;
    } else if (data == 'true') {
      this.isLogin = true;
    } else {

    }
  }

}
