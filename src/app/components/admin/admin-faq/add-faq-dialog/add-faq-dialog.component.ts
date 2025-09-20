import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {  MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminServiceService } from '../../../../services/adminService/admin-service.service';

@Component({
    selector: 'app-add-faq-dialog',
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, CommonModule, MatDialogContent, MatDialogActions, FormsModule],
    templateUrl: './add-faq-dialog.component.html',
    styleUrl: './add-faq-dialog.component.css'
})
export class AddFaqDialogComponent {
  question: string = '';
  answer: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddFaqDialogComponent> , 
    private adminService:AdminServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { question: string; answer: string } ) {
      if (data) {
        this.question = data.question;
        this.answer = data.answer;
      }
    }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.dialogRef.close({ question: this.question, answer: this.answer });
  }
}
