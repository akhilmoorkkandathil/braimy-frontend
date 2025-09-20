import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { TutorService } from '../../../services/tutorService/tutor.service';
import { Tutor } from '../../../interfaces/tutor';
import { UserDataService } from '../../../services/userDataService/user-data.service';
import { TutorDataService } from '../../../services/tutorDataService/tutor-data.service';

@Component({
    selector: 'app-tutor-sidebar',
    templateUrl: './tutor-sidebar.component.html',
    styleUrl: './tutor-sidebar.component.css',
    standalone: false
})
export class TutorSidebarComponent implements OnInit {
  tutorData: Tutor;

  constructor( 
    private router: Router,
    private toast:ToastService,
    private tutorService: TutorService,
    private tuturDataService:TutorDataService
  ){}

  ngOnInit(): void {
      this.getTutorData()
      this.tuturDataService.tutorData$.subscribe(data => {
        this.tutorData = data; // Update local userData when it changes
      });
  }

getTutorData(){
  this.tutorService.getTutorData().subscribe({
    next:(response)=>{
      console.log("This is response.data in the tutor sidebar",response.data);
      
      this.tutorData = response.data;
      this.updateTutor(response.data)
    },
    error:(error)=>{
      console.error('Error fetching tutor data:', error);
    }
  })
}
updateTutor(tutor: Tutor) {
  this.tuturDataService.updatetutorData(tutor); // Share the updated user data
}
  logout() {
    localStorage.removeItem("tutor_auth_token");
    sessionStorage.removeItem('TUTOR');
    this.router.navigate(['/login']);  // Adjust the route as per your application's routing structure
    this.toast.showSuccess('Logged out successfully', 'Success');
  }
  
}
