import { Component } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserDataService } from '../../../services/userDataService/user-data.service';

@Component({
    selector: 'app-user-header',
    templateUrl: './user-header.component.html',
    styleUrl: './user-header.component.css',
    standalone: false
})
export class UserHeaderComponent {
  userData:User;
  greeting: string;
  greetingMessage: string = "Lets learn something new today";
  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userDataService.userData$.subscribe(data => {
      this.userData = data;
      if (this.userData) {
        this.setGreeting(); // Call setGreeting only when userData is available
      }
    });
  }

  setGreeting() {
    const currentHour = new Date().getHours();
    console.log(currentHour);
    

    if (currentHour>5 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour>=12 && currentHour < 15) {
      this.greeting = 'Good Afternoon';
    } else if (currentHour>=15 && currentHour < 20){
      this.greeting = 'Good Evening';
    }else{
      this.greeting = 'Good Night';
      this.greetingMessage = "Have a good sleep!!!";
    }
  }
}
