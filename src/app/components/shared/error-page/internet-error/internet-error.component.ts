import { Component} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';



@Component({
    selector: 'app-internet-error',
    imports: [RouterModule, MatCardModule],
    standalone:true,
    templateUrl: './internet-error.component.html',
    styleUrl: './internet-error.component.css',
    animations: [
        trigger('cardAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-50px)' }),
                animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('numberAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.5)' }),
                animate('500ms 300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ])
        ]),
        trigger('typingAnimation', [
            state('typing', style({ width: 'auto' })),
            transition('* => typing', [
                style({ width: '0' }),
                animate('2s steps({{ messageLength }})', style({ width: 'auto' }))
            ])
        ])
    ]
})
export class InternetErrorComponent {
  errorCode: string | null = null;
  errorMessage : string | null;
  displayedMessage: string | null = '';
  typingState: string = 'idle';
  cursorBlink: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.errorCode = params['statusCode'] || 'Unknown Error';
      this.errorMessage = params['message'] || 'An unexpected error occurred!';
    });
    setTimeout(() => this.startTyping(), 1000);
  }

  startTyping(): void {
    this.typingState = 'typing';
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < this.errorMessage.length) {
        this.displayedMessage += this.errorMessage[index];
        index++;
      } else {
        clearInterval(typingInterval);
        this.cursorBlink = false;
      }
    }, 50);
  }
  redirectToLogin(){
    this.router.navigate(['/login']);
  }
}
