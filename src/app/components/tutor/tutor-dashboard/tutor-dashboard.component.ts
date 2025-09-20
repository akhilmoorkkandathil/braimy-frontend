import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { User } from '../../../interfaces/user';
import { courseBucket } from '../../../interfaces/courseBucket';

@Component({
    selector: 'app-tutor-dashboard',
    templateUrl: './tutor-dashboard.component.html',
    styleUrl: './tutor-dashboard.component.css',
    standalone: false
})
export class TutorDashboardComponent implements OnInit {
  bucketData: courseBucket[] = [];
  ngOnInit(): void {
    this.fetchUpcomingClasses()
  }

  constructor(
    private adminService: AdminServiceService) {}

  fetchUpcomingClasses(){
    this.adminService.getTutorUpcomingClasses().subscribe({
      next: (response) => {
        console.log(response.data);
        
        this.bucketData = response.data;
       
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

}
