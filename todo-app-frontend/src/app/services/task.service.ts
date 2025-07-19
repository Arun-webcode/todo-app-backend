import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrls, Constants } from 'src/app/config/constants';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

export interface Task {
  _id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = environment.baseUrl;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public tasks$ = this.tasksSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  // Get tasks organized by status
  get pendingTasks$(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === 'pending'))
    );
  }

  get inProgressTasks$(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === 'in-progress'))
    );
  }

  get completedTasks$(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === 'completed'))
    );
  }

  getAllTasks(): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.get(`${this.baseUrl}${ApiUrls.task.getAllTasks}`, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.success && response.tasks) {
            this.tasksSubject.next(response.tasks);
          }
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          return throwError(error);
        })
      );
  }

  createTask(task: Omit<Task, '_id'>): Observable<any> {
    this.loadingSubject.next(true);
    const taskPayload = {
      ...task,
      status: 'pending' // Always start as pending
    };
    
    return this.http.post(`${this.baseUrl}${ApiUrls.task.createTask}`, taskPayload, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.success) {
            this.refreshTasks();
          }
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          return throwError(error);
        })
      );
  }

  updateTask(taskId: string, task: Partial<Task>): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.put(`${this.baseUrl}${ApiUrls.task.updateTaskByTaskid.replace(':id', taskId)}`, task, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.success) {
            this.refreshTasks();
          }
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          return throwError(error);
        })
      );
  }

  updateTaskStatus(taskId: string, status: Task['status']): Observable<any> {
    return this.updateTask(taskId, { status });
  }

  deleteTask(taskId: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.delete(`${this.baseUrl}${ApiUrls.task.deleteTaskByTaskid.replace(':id', taskId)}`, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.success) {
            this.refreshTasks();
          }
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          this.loadingSubject.next(false);
          return throwError(error);
        })
      );
  }

  getTaskById(taskId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${ApiUrls.task.getTaskByUserid.replace(':id', taskId)}`, { withCredentials: true });
  }

  private refreshTasks(): void {
    this.getAllTasks().subscribe();
  }

  // Helper method to get priority color
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
    }
  }

  // Helper method to get status icon
  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'ellipse-outline';
      case 'in-progress': return 'checkmark-outline';
      case 'completed': return 'checkmark-done-outline';
      default: return 'ellipse-outline';
    }
  }
}
