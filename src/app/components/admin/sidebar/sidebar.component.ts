import { Component } from '@angular/core';
import { ToastService } from '../../../services/toastService/toast.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    standalone: false
})
export class SidebarComponent {
  name = 'Admin';

  constructor( private router: Router,private toast:ToastService){}


  logout() {
    const userType = localStorage.getItem('user_type');
    sessionStorage.removeItem("ADMIN")
    localStorage.removeItem(`${userType}_auth_token`);  // Remove specific user type token
    localStorage.removeItem('user_type');
    this.router.navigate(['/login']);  // Adjust the route as per your application's routing structure
    this.toast.showSuccess('Logged out successfully', 'Success');
  }
}
