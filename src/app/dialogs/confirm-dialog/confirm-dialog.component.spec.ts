import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(waitForAsync(() => {
    // Configure the testing module with the required component
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ]
    })
    .compileComponents(); // Compile the component templates and styles
  }));

  beforeEach(() => {
    // Create a fixture for the component
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance; // Get the component instance
    fixture.detectChanges(); // Trigger change detection to apply bindings
  });

  // Test case to ensure the component is created
  it('should create', () => {
    expect(component).toBeTruthy(); // Expect the component to be truthy (i.e., created successfully)
  });
});
