import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { SignupComponent } from "../../auth/signup/signup.component";
import { LoginComponent } from "../../auth/login/login.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LoginComponent, SignupComponent],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
