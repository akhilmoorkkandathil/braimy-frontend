import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-dialogue',
    templateUrl: './confirm-dialogue.component.html',
    styleUrl: './confirm-dialogue.component.css',
    standalone: false
})
export class ConfirmDialogueComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogueComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDecline(): void {
    this.dialogRef.close(false);
  }
}
