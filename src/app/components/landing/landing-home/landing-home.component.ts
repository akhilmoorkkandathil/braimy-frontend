import { Component } from '@angular/core';
import { Course } from '../../../interfaces/course';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { faq } from '../../../interfaces/faq';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-landing-home',
    templateUrl: './landing-home.component.html',
    styleUrl: './landing-home.component.css',
    animations: [
        trigger('faqAnimation', [
            state('void', style({ opacity: 0 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', [
                animate('300ms ease-in') // Duration for opening
            ]),
            transition('* => void', [
                animate('300ms ease-out') // Duration for closing
            ])
        ])
    ],
    standalone: false
})
export class LandingHomeComponent {

  courses: Course[] = []; // Array to store the fetched courses
  faqs:faq[];

  constructor(private router:Router,private userService:UserServiceService,private adminService: AdminServiceService) { }
  ngOnInit(): void {
    this.fetchCourses();
    this.fetchFaqs()
  }

  fetchFaqs(): void {
    this.adminService.getFaqData().subscribe({
      next: (response) => {
        this.faqs = response.data.map((faq: any) => ({
          ...faq,
          open: false // Initialize open property to false
        }));
        console.log(this.faqs);
        
      },
      error: (error) => {
        console.error('Error fetching faqs:', error);
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
  features = [
    {
        title: 'INDIVIDUAL ATTENTION',
        description: 'Individual attention is the key that unlocks the full potential of every student.'
    },
    {
        title: 'PERSONAL MENTORSHIP',
        description: 'Personal mentorship is like having a trusted guide by your side.'
    },
    {
        title: 'CUSTOMISED TIMETABLE',
        description: 'Unleash the true potential of your studies with a customized timetable.'
    },
    {
        title: 'INSTANT DOUBT CLEARING',
        description: 'Imagine having a lifeline that instantly connects you with expert guidance.'
    },
    {
        title: 'TEST PREPARATION',
        description: 'Maximize your test preparation and unleash your full potential.'
    }
];

  toggleFaq(faq: any) {
    faq.open = !faq.open;
  }

}
