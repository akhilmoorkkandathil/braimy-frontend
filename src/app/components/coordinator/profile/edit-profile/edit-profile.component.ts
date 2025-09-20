import { Component, Inject } from '@angular/core';
import { Coordinator } from '../../../../interfaces/coordinator';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AdminServiceService } from '../../../../services/adminService/admin-service.service';
import { ToastService } from '../../../../services/toastService/toast.service';
import { CoordinatorDataService } from '../../../../services/coordinatorDataService/coordinator-data.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-edit-profile',
    imports: [MatDialogContent, MatFormField, MatDialogActions, FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule],
    standalone:true,
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  coordinatorData: Coordinator; // Define the type based on your user data structure

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Coordinator,
    private adminService: AdminServiceService,
    private toast: ToastService,
    private coordinatorDataService:CoordinatorDataService
  ) {
    this.coordinatorData = { ...data }; // Initialize with the data passed from the parent component
  }

  onSave(): void {
    console.log("This is the user data in the onsave click",this.coordinatorData);
    
    this.adminService.editCoordinatorProfileInfo(this.coordinatorData).subscribe({
      next: (response) => {
        this.toast.showSuccess('Profile updated successfully!', 'Success');
        this.dialogRef.close(this.coordinatorData); // Close the dialog and pass the updated data
        this.coordinatorDataService.updateCoordinatorData(this.coordinatorData);
      },
      error: (error) => {
        this.dialogRef.close();
        console.error('Error updating profile:', error);
        this.toast.showError('Failed to update profile. Please try again.', 'Error');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
}
