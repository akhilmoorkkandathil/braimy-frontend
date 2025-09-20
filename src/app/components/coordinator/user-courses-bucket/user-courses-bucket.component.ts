import { Component, OnInit } from '@angular/core';

import { UserServiceService } from '../../../services/userServices/user-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { IgxButtonModule, IgxCardModule, IgxIconModule, IgxRippleModule } from 'igniteui-angular';
import { courseBucket } from '../../../interfaces/courseBucket';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user-courses-bucket',
    imports: [MatGridListModule, MatCardModule, CommonModule, IgxButtonModule, IgxIconModule, IgxCardModule, IgxRippleModule, MatButtonModule, MatIconModule],
    templateUrl: './user-courses-bucket.component.html',
    styleUrl: './user-courses-bucket.component.css'
})
export class UserCoursesBucketComponent {
  bucketCourses: courseBucket[] = [];
  studentId:string;


  constructor(private userService: UserServiceService, private toast: ToastService,private router: Router,private route: ActivatedRoute) {}



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {      
      this.studentId = params.get('id');      
      if (this.studentId) {
        this.fetchBucketCourses();
      }
    });
  }

  fetchBucketCourses(){
    this.userService.fetchBucketCoursesCoordinator(this.studentId).subscribe({
      next: (response) => {        
        this.bucketCourses = response.data; // Assuming response is an array of courses
        console.log('Fetched bucket courses:', this.bucketCourses);
      },
      error: (error) => {
        console.error('Error fetching bucket courses:', error);
        this.toast.showError('Failed to fetch bucket courses. Please try again.', 'Error');
      }
    });
  }

  AddCourse(){
    this.router.navigate([`/coordinator/addCourse/${this.studentId}`]);
  }

  editCourse(courseId:string){
    this.router.navigate([`/coordinator/addCourse/${this.studentId}/${courseId}`]);
  }
  removeCourse(courseId:string){
    this.userService.removeFromBucket(this.studentId,courseId).subscribe({
      next: (response) => {        
        this.bucketCourses = this.bucketCourses.filter(course => course.courseId._id !== courseId);
        this.toast.showSuccess('Course removed from bucket.', 'Success');
      },
      error: (error) => {
        console.error('Error fetching bucket courses:', error);
        this.toast.showError('Failed to fetch bucket courses. Please try again.', 'Error');
      }
    });
    
  }

}
