import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../services/toastService/toast.service';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { UserServiceService } from '../../../../services/userServices/user-service.service';
import { User } from '../../../../interfaces/user';
import { UserDataService } from '../../../../services/userDataService/user-data.service';



@Component({
    selector: 'app-add-to-bucket',
    imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule, MatDialogActions, MatDialogContent, NgxMatTimepickerModule],
    templateUrl: './add-to-bucket.component.html',
    styleUrl: './add-to-bucket.component.css'
})
export class AddToBucketComponent implements OnInit {
  preferredDays: string = '';
  duration: string = '';
  preferredTime: string = '';
  durations: string[] = ['1hr', '2hr', '3hr'];
  dayList: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  defaultValue = { hour: 13, minute: 30 };
  bucketForm: FormGroup;
  userData:User;


  constructor(
    public dialogRef: MatDialogRef<AddToBucketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: string }, // Accept courseId in data
    private fb: FormBuilder,
    private userService: UserServiceService,
    private toast: ToastService,
    private userDataService: UserDataService
  ) {
    this.bucketForm = this.fb.group({
      selectedDays: [[]], // Initialize as an empty array for multiple selection
      preferredTime: [''],
      classDuration: ['']
    });
  }

  ngOnInit(): void {
    this.userDataService.userData$.subscribe(data => {
      this.userData = data;
    });
  }

  onSave(): void {
    const bucketData = {
      courseId: this.data.courseId, // Include courseId
      selectedDays: this.bucketForm.value.selectedDays,
      preferredTime: this.bucketForm.value.preferredTime,
      classDuration: this.bucketForm.value.classDuration,
      coordinatorId: this.userData.coordinator
    };
    console.log(bucketData);
    // Call the service to save the data
    this.userService.addToBucket(bucketData).subscribe({
      
      next: (response) => {
        this.toast.showSuccess('Added to bucket successfully!', 'Success');
        this.dialogRef.close(bucketData); // Close the dialog and pass the data
      },
      error: (error) => {
        this.dialogRef.close();
        console.error('Error adding to bucket:', error);
        this.toast.showError('Failed to add to bucket. Please try again.', 'Error');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
}
