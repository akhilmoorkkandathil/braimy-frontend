import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Coordinator } from '../../../interfaces/coordinator';
import { Tutor } from '../../../interfaces/tutor';
import { Course } from '../../../interfaces/course';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { StudentManagementData } from '../../../interfaces/CoordinatorStudentFormData';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { courseBucket } from '../../../interfaces/courseBucket';
import { CourseBucketResponse } from '../../../interfaces/courseBucketForm';

@Component({
    selector: 'app-add-to-user-course-bucket',
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule, NgxMatTimepickerModule, MatButtonModule],
    standalone:true,
    templateUrl: './add-to-user-course-bucket.component.html',
    styleUrl: './add-to-user-course-bucket.component.css'
})
export class AddToUserCourseBucketComponent {
  manageForm!: FormGroup;
  selectedFile: File | null = null;
  studentId: string | null = null;
  courseId: string | null = null;
  title:string='Add course to bucket';
  button:string='Add course'
  coordinators:Array<Coordinator> = []; 
  tutors:Array<Tutor> = [];
  courses:Array<Course> = [];
  durations: string[] = ['1hr', '2hr', '3hr'];
  dayList: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  defaultValue = { hour: 13, minute: 30 };

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router
  ) {}
  ngOnInit() { 
    this.validateForm()
    this.fetchCoordinatorData();
    this.fetchTutorData()
    this.fetchCourseData()   
    this.route.paramMap.subscribe(params => {      
      this.studentId = params.get('studentId'); 
      this.courseId = params.get('courseId')  
      
      if (this.courseId) { 
        this.loadBucketCourseData(this.studentId,this.courseId);
    }
    });
  }

  loadBucketCourseData(studentId,courseId){
    this.adminService.getBucketCourse(studentId,courseId).subscribe({
      next: (response) => {
        console.log(response.data);
        
        this.title = "Update Course Shedule";
        this.button = "Update";
        this.populateForm(response.data);
      },
      error: (error) => {
        console.error('Error fetching student data:', error);
      }
    });
  }

  populateForm(data: CourseBucketResponse): void {
    this.manageForm.patchValue({
      preferredTime:data.preferredTime,
      selectedDays:data.selectedDays,
      course:data.courseId,
      tutor:data.assignedTutor,
      duration:data.classDuration
    });
  }

  fetchTutorData(): void {
    this.adminService.getTutorsList().subscribe({
      next: (response) => {
        //console.log("Fetched tutor data suscesfull",response);
        
        this.tutors = response.data;
        //console.log(this.tutors);
        
      },
      error: (error) => {
        console.error('Error fetching tutor data:', error);
      }
    });
  }
  fetchCourseData(): void {
    this.adminService.getCouresList().subscribe({
      next: (response) => {
        //console.log("course data",response);
        
        this.courses = response.data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  fetchCoordinatorData(): void {
    this.adminService.getCoordinatorsList().subscribe({
      next: (response) => {
        this.coordinators = response.data;
        
      },
      error: (error) => {
        console.error('Error fetching coordinator data:', error);
      }
    });
  }
  validateForm(){
    this.manageForm = this.fb.group({
      tutor: ['', Validators.required],
      course: ['', Validators.required],
      preferredTime: ['', Validators.required],
      selectedDays: [[], Validators.required],
      duration: ['', Validators.required]
    });
  }

  

  onSubmit() {    
    if (this.manageForm.valid) { 
      if(!this.courseId){
        console.log(" No coureID PResent thats why if condiiong is trur and this block works");
        
        this.adminService.addCourseToUserBucket(this.studentId,this.manageForm.value).subscribe({
          next: (response) => {
            //console.log('Student manage did added successfully', response);
            this.toast.showSuccess(response.message, 'Success');
            this.router.navigate([`/coordinator/viewCourseBucket/${this.studentId}`]);
          },
          error: (error) => {
            console.error(error.response, error);
            this.toast.showError(error.response, 'Error');
          }
        });
      }else{
        console.log("Course ID present thats why else is working");
        
        this.adminService.updateCourseToUserBucket(this.studentId,this.manageForm.value).subscribe({
          next: (response) => {
            //console.log('Student manage did added successfully', response);
            this.toast.showSuccess(response.message, 'Success');
            this.router.navigate([`/coordinator/viewCourseBucket/${this.studentId}`]);
          },
          error: (error) => {
            console.error(error.response, error);
            this.toast.showError(error.response, 'Error');
          }
        });
      }
  }
}
}
