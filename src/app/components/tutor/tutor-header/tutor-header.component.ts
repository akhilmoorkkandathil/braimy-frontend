import { Component } from '@angular/core';
import { Tutor } from '../../../interfaces/tutor';
import { TutorDataService } from '../../../services/tutorDataService/tutor-data.service';

@Component({
    selector: 'app-tutor-header',
    templateUrl: './tutor-header.component.html',
    styleUrl: './tutor-header.component.css',
    standalone: false
})
export class TutorHeaderComponent {
  tutorData:Tutor;
  greeting: string;
  greetingMessage: string = "Let's teach students";
  constructor(private tutorDataService: TutorDataService) {}

  ngOnInit() {
    this.tutorDataService.tutorData$.subscribe(data => {
      this.tutorData = data;
      if (this.tutorData) {
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
