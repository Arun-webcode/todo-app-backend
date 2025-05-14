import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserMenuPopoverComponent } from './user-menu-popover.component';

describe('UserMenuPopoverComponent', () => {
  let component: UserMenuPopoverComponent;
  let fixture: ComponentFixture<UserMenuPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserMenuPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
