import { Component, Inject } from '@angular/core';
import { Tutor } from '../../../../interfaces/tutor';
import { TutorService } from '../../../../services/tutorService/tutor.service';
import { ToastService } from '../../../../services/toastService/toast.service';
import { TutorDataService } from '../../../../services/tutorDataService/tutor-data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-edit-profile',
    imports: [MatDialogContent, MatFormField, MatDialogActions, FormsModule, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule],
    standalone:true,
    templateUrl: './edit-profile.component.html',
    styleUrl: './edit-profile.component.css'
})
export class TutorEditProfileComponent {
  tutorData: Tutor; // Define the type based on your user data structure

  constructor(
    public dialogRef: MatDialogRef<TutorEditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tutor,
    private tutorService: TutorService,
    private toast: ToastService,
    private tutorDataService:TutorDataService
  ) {
    this.tutorData = { ...data }; // Initialize with the data passed from the parent component
  }

  onSave(): void {
    console.log("This is the user data in the onsave click",this.tutorData);
    
    this.tutorService.editTutorProfileInfo(this.tutorData).subscribe({
      next: (response) => {
        this.toast.showSuccess('Profile updated successfully!', 'Success');
        this.dialogRef.close(this.tutorData); // Close the dialog and pass the updated data
        this.tutorDataService.updatetutorData(this.tutorData);
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
