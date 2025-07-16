import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverController, ModalController } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { UserMenuPopoverComponent } from 'src/app/components/user-menu-popover/user-menu-popover.component';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteAccountModalComponent } from 'src/app/components/delete-account-modal/delete-account-modal.component';
import { IonicModule } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { CommonService } from 'src/app/services/common.service';

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
  newTask = { title: '', description: '', priority: 'low', status: 'waiting' };
  editingTaskId: string | null = null;
  // status = ['waiting', 'inProgress', 'done'];
  constructor(
    public routerLink: RouterLink,
    private storageService: StorageService,
    private popoverCtrl: PopoverController,
    private router: Router,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private taskService: TaskService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.quotesAnimation();
  }

  async ionViewWillEnter() {
    await this.getUserData();
    await this.loadTasks();
  }

  async loadTasks() {
    this.commonService.presentLoading();
    await this.taskService.getAllTasks().subscribe({
      next: async (res) => {
        this.tasks = await res.tasks || [];
        this.commonService.dismissLoading();
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.commonService.dismissLoading();
      }
    });
  }

  async addTask() {
    if (!this.newTask.title || !this.newTask.description) {
      this.commonService.presentToast("Please fill in all task details!", 'danger');
      return;
    }
    const taskPayload = {
      "title": this.newTask.title,
      "description": this.newTask.description,
      "priority": this.newTask.priority
    };

    try {
      if (this.editingTaskId) {
        const res = await this.taskService.updateTask(this.editingTaskId, taskPayload).toPromise();
        if (res.success) {
          this.commonService.presentToast(res.message, 'success');
        }
        this.editingTaskId = null;
      } else {
        // Create new task
        await this.taskService.createTask(taskPayload).then(async (res) => {
          if (res.success) {
            this.commonService.presentToast(res.message, 'success');
          }
        });
      }
      this.newTask = { title: '', description: '', priority: 'low', status: 'waiting' };
      this.loadTasks();
    } catch (err: any) {
      console.error(err);
      this.commonService.presentToast('Failed to save task: ' + (err.error?.message || err.message), 'danger');
    }
  }


  editTask(task: any) {
    this.editingTaskId = task._id;
    this.newTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    };
  }

  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: (res) => {
          if (res.success) {
            this.commonService.presentToast(res.message, 'success');
          }
          this.loadTasks();
        },
        error: (err) => this.commonService.presentToast('Failed to delete task: ' + err.error?.message, 'danger')
      });
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
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
        this.router.navigate(['reset-password']);
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
        this.commonService.presentToast('Error: ' + error.error?.message || 'Failed to delete account.', 'danger');
        console.log(error.error?.message);
      }
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
