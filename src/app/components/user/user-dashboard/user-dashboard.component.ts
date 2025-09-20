import { Component, OnInit, } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { UserDataService } from '../../../services/userDataService/user-data.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { courseBucket } from '../../../interfaces/courseBucket';

@Component({
    selector: 'app-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrl: './user-dashboard.component.css',
    standalone: false
})
export class UserDashboardComponent implements OnInit {
  bucketData: courseBucket[] = [];
  name:string="user";
  count = 0;
  totalTime:Number;
  rechargeHours:Number = 0;
  
  constructor(
    private userService: UserServiceService , 
    private userDataService: UserDataService,
    private toast: ToastService) {}

  ngOnInit(): void {
    this.todaysClasses()
    this.userDataService.userData$.subscribe(data => {
      this.rechargeHours = data.rechargedHours;
    });
  }


  todaysClasses(){
    this.userService.getStudentClasses().subscribe({
      next: (response) => {
        this.bucketData = response.data;
        console.log("Response data of upcoming classes",response.data);
        
       
      },
      error: (error) => {
        console.error('Error fetching todays class data:', error);
        this.toast.showError(error.error.message, 'Error');
      }
    });
  }

}
