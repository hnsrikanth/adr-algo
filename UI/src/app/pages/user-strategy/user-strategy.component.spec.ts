import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStrategyComponent } from './user-strategy.component';

describe('UserStrategyComponent', () => {
  let component: UserStrategyComponent;
  let fixture: ComponentFixture<UserStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStrategyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
