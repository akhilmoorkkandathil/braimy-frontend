import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { AddFaqDialogComponent } from './add-faq-dialog/add-faq-dialog.component';
import { faq } from '../../../interfaces/faq';
import { response } from 'express';

@Component({
    selector: 'app-admin-faq',
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, CommonModule],
    templateUrl: './admin-faq.component.html',
    styleUrl: './admin-faq.component.css'
})
export class AdminFaqComponent implements OnInit {
  faqs:faq[] = [];
constructor(private dialog: MatDialog, private adminService: AdminServiceService) {}

ngOnInit(): void {
    this.fetchFaqData();
}

fetchFaqData() {
  this.adminService.getFaqData().subscribe(
    (response) => {
      this.faqs = response.data; // Assign the fetched data to the faqs property
      console.log('Fetched FAQs:', this.faqs);
    },
    (error) => {
      console.error('Error fetching FAQs:', error);
    }
  );
}

  toggleFaq(faq: any) {
    faq.open = !faq.open;
  }

  openAddFaqDialog(): void {
    const dialogRef = this.dialog.open(AddFaqDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addFaq(result);
      }
    });
  }

  addFaq(faq: { question: string; answer: string }): void {
    this.adminService.addFaq(faq).subscribe(response => {
      this.faqs.push({ ...faq, open: false }); // Add the new FAQ to the list
      console.log('FAQ added successfully:', response);
    }, error => {
      console.error('Error adding FAQ:', error);
    });
  }

  editFaq(faqId: string): void {
    const faqToEdit = this.faqs.find(faq => faq._id === faqId);
    console.log(faqToEdit);
    
    if (faqToEdit) {
      const dialogRef = this.dialog.open(AddFaqDialogComponent, {
        data: { question: faqToEdit.question, answer: faqToEdit.answer } // Pass existing data to the dialog
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateFaq(faqId, result); // Call updateFaq with the new data
        }
      });
    }
  }
  updateFaq(faqId: string, updatedFaq: { question: string; answer: string }): void {
    this.adminService.updateFaq(faqId, updatedFaq).subscribe(response => {
      const index = this.faqs.findIndex(faq => faq._id === faqId);
      if (index !== -1) {
        this.faqs[index] = { ...this.faqs[index], ...updatedFaq };
      }
      console.log('FAQ updated successfully:', response);
    }, error => {
      console.error('Error updating FAQ:', error);
    });
  }

  deleteFaq(faqId: string): void {
    this.adminService.deleteFaq(faqId).subscribe(response => {
      this.faqs = this.faqs.filter(faq => faq._id !== faqId);
      console.log('FAQ deleted successfully:', response);
    }, error => {
      console.error('Error deleting FAQ:', error);
    });
  }
}
