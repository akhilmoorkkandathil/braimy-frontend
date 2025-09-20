import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { Coordinator } from '../../../interfaces/coordinator';
import { CoordinatorDataService } from '../../../services/coordinatorDataService/coordinator-data.service';

@Component({
    selector: 'app-coordinator-sidebar',
    templateUrl: './coordinator-sidebar.component.html',
    styleUrl: './coordinator-sidebar.component.css',
    standalone: false
})
export class CoordinatorSidebarComponent implements OnInit {
  coordinatorData: Coordinator;

  constructor( private router: Router,private toast:ToastService,private adminService:AdminServiceService,private coordinatorDataService:CoordinatorDataService){}

ngOnInit(): void {
    this.getStudentData();
    this.coordinatorDataService.coordinatorData$.subscribe(data => {
      this.coordinatorData = data; // Update local userData when it changes
    });
}

updateCoordinator(coordinator: Coordinator) {
  this.coordinatorDataService.updateCoordinatorData(coordinator); // Share the updated user data
}

  getStudentData(){
    this.adminService.getCoordinatorData().subscribe({
      next:(response)=>{
        console.log("This is response.data in the student sidebar",response.data);
        
        this.coordinatorData = response.data;
        this.updateCoordinator(response.data);
        console.log(this.coordinatorData);
      },
      error:(error)=>{
        console.error('Error fetching student data:', error);
        //this.toast.showError('Error Fetching Student data!', 'Error');

      }
    })
  }


  logout() {
    localStorage.removeItem("coordinator_auth_token");
    sessionStorage.removeItem("COORDINATOR")
    this.router.navigate(['/login']);  // Adjust the route as per your application's routing structure
    this.toast.showSuccess('Logged out successfully', 'Success');
  }
}
