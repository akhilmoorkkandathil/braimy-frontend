import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { UserDataService } from '../../../services/userDataService/user-data.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { Coordinator } from '../../../interfaces/coordinator';
import { CoordinatorDataService } from '../../../services/coordinatorDataService/coordinator-data.service';


@Component({
    selector: 'app-profile',
    imports: [CommonModule, MatCardModule, MatIconModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class CoordinatorProfileComponent {
    coordinatorData:Coordinator;
    selectedFile: File | null = null;

      @ViewChild('fileInput') fileInput!: ElementRef; // Reference to the file input
      constructor(private adminService: AdminServiceService, private toast: ToastService,private dialog: MatDialog,private coordinatorDataService:CoordinatorDataService) {}

      ngOnInit() {
        this.coordinatorDataService.coordinatorData$.subscribe(data => {
          this.coordinatorData = data;
        });
      }

    openEditDialog(): void {
      const dialogRef = this.dialog.open(EditProfileComponent, {
        width: '400px',
        data: this.coordinatorData // Pass the current user data to the dialog
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.coordinatorData = result; // Update userData with the new values
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
        
        this.adminService.uploadCoordinatorProfilePhoto(formData).subscribe({
          next: (response) => {
            this.coordinatorData.photoUrl = response.data.photoUrl
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
