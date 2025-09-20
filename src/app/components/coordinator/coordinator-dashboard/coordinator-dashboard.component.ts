import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { User } from '../../../interfaces/user';
import { courseBucket } from '../../../interfaces/courseBucket';

@Component({
    selector: 'app-coordinator-dashboard',
    templateUrl: './coordinator-dashboard.component.html',
    styleUrl: './coordinator-dashboard.component.css',
    standalone: false
})
export class CoordinatorDashboardComponent implements OnInit {

  readonly VAPID_PUBLIC_KEY = "BNF7aEziBSVhfSQ1osQRoD5Axk2Yqry2AO9EdhzFDhUkftziK_fvjNIJTmnZIPb6Ccky64TdeyJFA_lCEELoUw0";
  upcomingClasses: courseBucket[] = [];
    constructor(
        private swPush: SwPush,
        private adminService: AdminServiceService) {}
  ngOnInit(): void {
    this.fetchUpcomingClasses()
  }


  fetchUpcomingClasses(){
    this.adminService.getTodaysUpcomingClasses().subscribe({
      next: (response) => {
        //console.log(response.data);
        
        this.upcomingClasses = response.data;
       
      },
      error: (error) => {
        console.error('Error fetching classes data:', error);
      }
    });
  }

    subscribeToNotifications() {

        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
        .then(sub => this.adminService.addPushSubscriber().subscribe())
        .catch(err => console.error("Could not subscribe to notifications", err));
    }

}
