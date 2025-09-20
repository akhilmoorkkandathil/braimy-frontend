import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.css',
    standalone: false
})
export class AdminLayoutComponent {

  title!: string;
  loggedUser!: string;

  constructor() {}

  navigateHome(): void {
    // Add your navigation logic here
    //console.log('Navigating to Home');
  }

  logout(): void {
    // Add your logout logic here
    //console.log('Logging out');
  }

  
}
