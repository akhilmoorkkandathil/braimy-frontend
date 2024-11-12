import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-test-credentials-popup',
  templateUrl: './test-credentials-popup.component.html',
  styleUrl: './test-credentials-popup.component.css'
})
export class TestCredentialsPopupComponent {
  isVisible = true;
  testMail = 'test@gmail.com'
  Password='Akhil@123'
  adminMail = 'admin@gmail.com'

  @Output() closePopup = new EventEmitter<void>();

  close() {
    this.isVisible = false;
    this.closePopup.emit(); // Notify parent to hide the popup
  }
}
