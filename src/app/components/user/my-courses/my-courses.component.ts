import { Component, OnInit } from '@angular/core';

import { UserServiceService } from '../../../services/userServices/user-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { IgxButtonModule, IgxCardModule, IgxIconModule, IgxRippleModule } from 'igniteui-angular';
import { courseBucket } from '../../../interfaces/courseBucket';
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-courses',
    imports: [MatGridListModule, MatCardModule, CommonModule, IgxButtonModule, IgxIconModule, IgxCardModule, IgxRippleModule],
    templateUrl: './my-courses.component.html',
    styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {

  bucketCourses: courseBucket[] = [];


  constructor(private userService: UserServiceService, private toast: ToastService,private router: Router) {}



  ngOnInit(): void {
    this.fetchBucketCourses();
  }

  fetchBucketCourses(){
    this.userService.fetchBucketCourses().subscribe({
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

  viewAllCourse(){
    this.router.navigate(['/user/allcourses']);
    
  }

}
