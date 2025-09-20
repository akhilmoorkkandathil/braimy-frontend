import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { UserServiceService } from '../../../../services/userServices/user-service.service';
import { ToastService } from '../../../../services/toastService/toast.service';
import { User } from '../../../../interfaces/user';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserDataService } from '../../../../services/userDataService/user-data.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-edit-profile',
    imports: [MatDialogContent, MatFormField, MatDialogActions, FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule],
    standalone:true,
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  userData: User; // Define the type based on your user data structure

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserServiceService,
    private toast: ToastService,
    private userDataService:UserDataService
  ) {
    this.userData = { ...data }; // Initialize with the data passed from the parent component
  }

  onSave(): void {
    console.log("This is the user data in the onsave click",this.userData);
    
    this.userService.editProfileInfo(this.userData).subscribe({
      next: (response) => {
        this.toast.showSuccess('Profile updated successfully!', 'Success');
        this.dialogRef.close(this.userData); // Close the dialog and pass the updated data
        this.userDataService.updateUserData(this.userData);
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
