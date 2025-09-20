import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { User } from '../../../interfaces/user';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { UserDataService } from '../../../services/userDataService/user-data.service';


@Component({
    selector: 'app-user-sidebar',
    templateUrl: './user-sidebar.component.html',
    styleUrl: './user-sidebar.component.css',
    standalone: false
})
export class UserSidebarComponent {
  userData: User;
  constructor( 
    private router: Router,
    private toast:ToastService,
    private socialAuthService: SocialAuthService, 
    private userService :UserServiceService,
    private userDataService: UserDataService
  ){}
  ngOnInit() {
    this.getStudentData();
    this.userDataService.userData$.subscribe(data => {
      this.userData = data; // Update local userData when it changes
    });
    
  }

  updateUser(user: User) {
    this.userDataService.updateUserData(user); // Share the updated user data
  }
  getStudentData(){
    this.userService.getStudentData().subscribe({
      next:(response)=>{
        console.log("This is response.data in the student sidebar",response.data);
        
        this.userData = response.data[0];
        this.updateUser(response.data[0])
        console.log("In sidebar",this.userData);
      },
      error:(error)=>{
        console.error('Error fetching student data:', error);
        //this.toast.showError('Error Fetching Student data!', 'Error');

      }
    })
  }

  logout() {
    localStorage.removeItem("user_auth_token");  // Remove specific user type token
    sessionStorage.removeItem('STUDENT');
    const check = sessionStorage.getItem('SOCIAL');
    
    if (check) {
      this.socialAuthService.signOut().then(() => {
        this.completeLogout('SOCIAL');
      }).catch(error => {
        console.error('Error during social logout:', error);
        if (error === 'Not logged in') {
          // Treat "Not logged in" as a successful logout
          this.completeLogout('SOCIAL');
        } else {
          this.toast.showError('Logout failed. Please try again.', 'Error');
        }
      });
    } else {
      this.completeLogout('STUDENT');
    }
  }
  
  private completeLogout(storageKey: 'SOCIAL' | 'STUDENT') {
    sessionStorage.removeItem(storageKey);
    this.toast.showSuccess('Logout Successful', 'Success');
    this.router.navigate(['/login']);
  }
}
