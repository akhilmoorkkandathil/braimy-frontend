import { Component, ElementRef, ViewChild } from '@angular/core';
import { Tutor } from '../../../interfaces/tutor';
import { ToastService } from '../../../services/toastService/toast.service';
import { TutorDataService } from '../../../services/tutorDataService/tutor-data.service';
import { MatDialog } from '@angular/material/dialog';
import { TutorEditProfileComponent } from './edit-profile/edit-profile.component';
import { TutorService } from '../../../services/tutorService/tutor.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-tutor-profile',
    imports: [CommonModule, MatCardModule, MatIconModule],
    templateUrl: './tutor-profile.component.html',
    styleUrl: './tutor-profile.component.css'
})
export class TutorProfileComponent {
  tutorData:Tutor;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input

  constructor(private tutorService: TutorService, private toast: ToastService, private tutorDataService: TutorDataService,private dialog: MatDialog) {}

  ngOnInit() {
    this.tutorDataService.tutorData$.subscribe(data => {
      this.tutorData = data;
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(TutorEditProfileComponent, {
      width: '400px',
      data: this.tutorData // Pass the current user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tutorData = result; // Update userData with the new values
      }
    });
  }



   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadProfilePhoto(); // Immediately upload the photo after selection
    }
  }

  uploadProfilePhoto(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      console.log(formData);
      
      this.tutorService.uploadTutorProfilePhoto(formData).subscribe({
        next: (response) => {
          this.tutorData.photoUrl = response.data.photoUrl
          this.toast.showSuccess('Profile photo updated successfully!', 'Success');
        },
        error: (error) => {
          console.error('Error uploading profile photo:', error);
          this.toast.showError('Failed to update profile photo. Please try again.', 'Error');
        }
      });
    } else {
      this.toast.showError('Please select a file to upload.', 'Error');
    }
  }
}
