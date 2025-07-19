import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea,
  IonButton, IonButtons, IonIcon, IonSpinner, IonList, IonBackButton
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonBackButton,
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea,
    IonButton, IonButtons, IonIcon, IonSpinner, IonList, ThemeToggleComponent
  ]
})
export class ProfilePage implements OnInit, OnDestroy {
  user = {
    name: '',
    email: '',
    bio: ''
  };

  originalUser = {
    name: '',
    email: '',
    bio: ''
  };

  isEditing = false;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadUserProfile() {
    try {
      const userEmail = await this.storageService.getItem(Constants.USER_EMAIL);
      const userName = await this.storageService.getItem(Constants.USER_NAME);
      const userBio = await this.storageService.getItem(Constants.USER_BIO) || '';

      if (!userEmail || !userName || !userBio) {
        const res = await this.authService.getUserDetails();
        const { user: { email, name, profile: { bio } } } = res;
        this.user = {
          name: name,
          email: email,
          bio: bio || ''
        };
        await this.storageService.setItem(Constants.USER_EMAIL, email);
        await this.storageService.setItem(Constants.USER_NAME, name);
        await this.storageService.setItem(Constants.USER_BIO, bio);
      } else {
        this.user = {
          name: userName,
          email: userEmail,
          bio: userBio
        };
      }
      this.originalUser = { ...this.user };
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.commonService.presentToast('Error loading profile', 'danger');
    }
  }

  getInitials(): string {
    if (!this.user.name) return 'U';
    return this.user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleEdit() {
    if (this.isEditing) {
      // Cancel editing - restore original values
      this.user = { ...this.originalUser };
    }
    this.isEditing = !this.isEditing;
  }

  async saveProfile() {
    if (!this.user.name.trim()) {
      this.commonService.presentToast('Name is required', 'danger');
      return;
    }

    this.isLoading = true;

    try {
      // Call the profile update API
      const response = await this.authService.updateProfile(this.user.name, this.user.bio);

      if (response.success) {
        await this.storageService.setItem(Constants.USER_NAME, this.user.name);
        await this.storageService.setItem(Constants.USER_BIO, this.user.bio);

        // Update original user data
        this.originalUser = { ...this.user };

        this.isEditing = false;
        this.commonService.presentToast('Profile updated successfully', 'success');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      this.commonService.presentToast(
        error.message || 'Failed to update profile',
        'danger'
      );
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    const res = await this.authService.logout();
    if (res.success) {
      this.commonService.presentToast(res.message, 'success');
    } else {
      this.commonService.presentToast(res.message, 'danger');
      return;
    }
    await this.storageService.clearAll();
    this.router.navigate(['login'], { replaceUrl: true });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

