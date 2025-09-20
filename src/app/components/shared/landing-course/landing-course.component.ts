import { Component } from '@angular/core';
import { Course } from '../../../interfaces/course';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../../../services/userServices/user-service.service';
type Topic = 'gettingStarted' | 'reactBasics';

@Component({
    selector: 'app-landing-course',
    templateUrl: './landing-course.component.html',
    styleUrl: './landing-course.component.css',
    standalone: false
})
export class LandingCourseComponent {

  course: Course; // Define the type according to your data

  constructor(private route: ActivatedRoute, private userService: UserServiceService) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id'); // Retrieve course ID from route
    if (courseId) {
      this.fetchCourseDetails(courseId);
    }
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
  openSubtopics: Record<Topic, boolean> = {
    gettingStarted: false,
    reactBasics: false,
    // Initialize other topics as needed
  };

  toggleSubtopics(topic: Topic) {
    this.openSubtopics[topic] = !this.openSubtopics[topic];
  }
}
