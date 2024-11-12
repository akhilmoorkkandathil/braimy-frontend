import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCredentialsPopupComponent } from './test-credentials-popup.component';

describe('TestCredentialsPopupComponent', () => {
  let component: TestCredentialsPopupComponent;
  let fixture: ComponentFixture<TestCredentialsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCredentialsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCredentialsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
