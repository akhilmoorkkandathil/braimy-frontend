import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { Course } from '../../../interfaces/course';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddToBucketComponent } from './add-to-bucket/add-to-bucket.component';



@Component({
    selector: 'app-user-course',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './user-course.component.html',
    styleUrl: './user-course.component.css'
})
export class UserCourseComponent {
  course: Course; // Define the type according to your data
  courseId:string;

  constructor(private route: ActivatedRoute, private userService: UserServiceService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id'); // Retrieve course ID from route
    if (this.courseId) {
      this.fetchCourseDetails(this.courseId);
    }
  }

  openAddToBucketDialog(): void {
    const dialogRef = this.dialog.open(AddToBucketComponent, {
      width: '400px',
      data: { courseId: this.courseId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Data received from dialog:', result);
      }
    });
  }

  fetchCourseDetails(courseId: string): void {
    this.userService.getCourse(courseId).subscribe({
      next: (response) => {
        console.log(response);
        
        this.course = response.data[0]; // Ensure response contains course details

      },
      error: (error) => {
        console.error('Error fetching course details:', error);
      }
    });
  }
}
