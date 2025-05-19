import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonChip, IonAvatar, PopoverController, ModalController } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { UserMenuPopoverComponent } from 'src/app/components/user-menu-popover/user-menu-popover.component';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteAccountModalComponent } from 'src/app/components/delete-account-modal/delete-account-modal.component';
import { IonicModule } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  providers: [StorageService],
  imports: [IonicModule, FormsModule, CommonModule],
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
  name = '';
  email = '';
  tasks: any[] = [];
  newTask = { title: '', description: '', priority: 'Medium' };
  editingTaskId: string | null = null;

  constructor(
    public routerLink: RouterLink,
    private storageService: StorageService,
    private popoverCtrl: PopoverController,
    private router: Router,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.quotesAnimation();
  }

  async ionViewWillEnter() {
    await this.getUserData();
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (res) => {
        this.tasks = res.tasks || [];
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
      }
    });
  }

  addTask() {
    if (this.editingTaskId) {
      // Update existing task
      this.taskService.updateTask(this.editingTaskId, this.newTask).subscribe({
        next: () => {
          this.editingTaskId = null;
          this.newTask = { title: '', description: '', priority: 'Medium' };
          this.loadTasks();
        },
        error: (err) => alert('Failed to update task: ' + err.error?.message)
      });
    } else {
      // Create new task
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          this.newTask = { title: '', description: '', priority: 'Medium' };
          this.loadTasks();
        },
        error: (err) => alert('Failed to add task: ' + err.error?.message)
      });
    }
  }

  editTask(task: any) {
    this.editingTaskId = task._id;
    this.newTask = {
      title: task.title,
      description: task.description,
      priority: task.priority
    };
  }

  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => this.loadTasks(),
        error: (err) => alert('Failed to delete task: ' + err.error?.message)
      });
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return '';
    }
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
      if (data == 'logout') {
        await this.logout();
      } else if (data == 'reset-password') {

      } else if (data == 'delete-account') {
        await this.deleteAccount();
      }
    }
  }

  async deleteAccount() {
    const modal = await this.modalCtrl.create({
      component: DeleteAccountModalComponent,
      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5,
      handle: true,
      backdropDismiss: false,
      showBackdrop: true,
      cssClass: 'delete-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.password) {
      try {
        const res = await this.authService.deleteAccount(data.password);
        console.log(res);
        await this.storageService.clearAll();
        this.router.navigate(['login']);
      } catch (error: any) {
        console.error('Delete account failed', error);
        alert('Error: ' + error.error?.message || 'Failed to delete account.');
      }
    }
  }

  async logout() {
    await this.storageService.clearAll();
    this.router.navigate(['login']);
  }

  async getUserData() {
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
}
