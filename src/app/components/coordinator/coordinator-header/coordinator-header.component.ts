import { Component } from '@angular/core';
import { Coordinator } from '../../../interfaces/coordinator';
import { CoordinatorDataService } from '../../../services/coordinatorDataService/coordinator-data.service';

@Component({
    selector: 'app-coordinator-header',
    templateUrl: './coordinator-header.component.html',
    styleUrl: './coordinator-header.component.css',
    standalone: false
})
export class CoordinatorHeaderComponent {
  coordinatorData:Coordinator;
  greeting: string;
  greetingMessage: string = "Let's Focus on work";
  constructor(private coordinatorDataService: CoordinatorDataService) {}

  ngOnInit() {
    this.coordinatorDataService.coordinatorData$.subscribe(data => {
      this.coordinatorData = data;
      if (this.coordinatorData) {
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
