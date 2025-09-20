import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { User } from '../../../interfaces/user';
import { UserDataService } from '../../../services/userDataService/user-data.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, MatCardModule, MatIconModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {

  userData:User;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input

  constructor(private userService: UserServiceService, private toast: ToastService, private userDataService: UserDataService,private dialog: MatDialog) {}

  ngOnInit() {
    this.userDataService.userData$.subscribe(data => {
      this.userData = data;
    });
  }

  openEditDialog(): void {
    console.log(this.userData);
    
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '400px',
      data: this.userData // Pass the current user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userData = result; // Update userData with the new values
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
      
      this.userService.uploadProfilePhoto(formData).subscribe({
        next: (response) => {
          this.userData.photoUrl = response.data.photoUrl
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
