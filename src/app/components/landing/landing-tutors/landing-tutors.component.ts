import { Component } from '@angular/core';
import { Tutor } from '../../../interfaces/tutor';
import { TutorService } from '../../../services/tutorService/tutor.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing-tutors',
    templateUrl: './landing-tutors.component.html',
    styleUrl: './landing-tutors.component.css',
    standalone: false
})
export class LandingTutorsComponent {
  tutors:Tutor[];
  searchTerm: string = '';

  constructor(private tutorService: TutorService, private router:Router) { }

  ngOnInit(): void {
    this.fetchTutors();
  }

  fetchTutors(): void {
    this.tutorService.getTutors().subscribe({
      next: (response) => {
        this.tutors = response.data; // Assuming response is an array of courses
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }

  searchCourses() {
    this.tutorService.searchTutor(this.searchTerm).subscribe({
      next: (response) => {
        
        this.tutors = response.data; // Update courses with search results
      },
      error: (error) => {
        console.error('Error searching courses:', error);
      }
    });
  }
}
