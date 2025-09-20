import { Component } from '@angular/core';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { Router } from '@angular/router';
import { Course } from '../../../interfaces/course';
import { CourseService } from '../../../services/corseService/course.service';

@Component({
    selector: 'app-landing-courses',
    templateUrl: './landing-courses.component.html',
    styleUrl: './landing-courses.component.css',
    standalone: false
})
export class LandingCoursesComponent {
  courses: Course[] = []; // Array to store the fetched courses

  constructor(private courseService: CourseService, private router:Router,private userService:UserServiceService) { }


  searchTerm: string = '';
  ngOnInit(): void {
    this.fetchCourses();
  }
  searchCourses() {
    this.courseService.searchCourses(this.searchTerm).subscribe({
      next: (response) => {
        console.log(response.data);
        
        this.courses = response.data; // Update courses with search results
      },
      error: (error) => {
        console.error('Error searching courses:', error);
      }
    });
  }

  fetchCourses(): void {
    this.userService.getCouresList().subscribe({
      next: (response) => {
        this.courses = response.data; // Assuming response is an array of courses
        console.log(this.courses);
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }
  navigateToCourse(courseId:string):void{
    this.router.navigate(['/course', courseId]); 
  }
}
