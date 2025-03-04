import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SubscriptionComponent } from './subscription.component';

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Additional test cases can be added here
});
