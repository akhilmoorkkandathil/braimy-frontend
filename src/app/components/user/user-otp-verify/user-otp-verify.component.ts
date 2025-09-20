import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { otpVerifyService } from '../../../services/userOtpVerify/user-otp-verify.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';

@Component({
    selector: 'app-user-otp-verify',
    templateUrl: './user-otp-verify.component.html',
    styleUrl: './user-otp-verify.component.css',
    standalone: false
})
export class UserOtpVerifyComponent {
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';
  otp: string = '';
  otpData:string = '';
  verificationResult = '';
  successMessage = '';
  errorMessage = '';
  userType = '';
  userId = '';
   router = inject(Router);
   remainingTime:number = 60;
  timeInterval!: ReturnType<typeof setInterval>;
  
  otpFormObj = new FormData();
  
  otpVerifyService = inject(otpVerifyService);
  activatedRoute = inject(ActivatedRoute);;
  
  otpVerificationSubscription! : Subscription;
  resendOtpSubscription!: Subscription;
  activatedRouteSubscription! : Subscription;
  setOtpSubscription!: Subscription;
  timerSubscription!: Subscription;

  constructor(private toast: ToastService){}

  ngOnInit(): void {
    //this.otpData = { otp: this.otp };
      
    this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params=>{
      this.userId = params['userId'];
      this.userType = params['userType'];
      this.otpData = params['otp']
      //console.log(`check userId from params = ${this.userId}=${this.otpData}`);
    });
    this.startTimer()
  }

  onInputChange(event: Event, currentInput: string): void {
    const input = event.target as HTMLInputElement;
    if (input.value && input.value.length === 1) {
      const nextInput = this.getNextInput(currentInput);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  private getNextInput(currentInput: string): HTMLInputElement | null {
    const inputOrder = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
    const currentIndex = inputOrder.indexOf(currentInput);
    const nextIndex = currentIndex + 1;
    if (nextIndex < inputOrder.length) {
      const nextInputName = inputOrder[nextIndex];
      return document.querySelector(`input[name=${nextInputName}]`);
    }
    return null;
  }
  setOTP(){
    ////console.log('hello, ngoninit', this.userType, this.userId);
      this.setOtpSubscription = this.otpVerifyService.setOtp(this.userId).subscribe({
        next: (res)=>{
          this.successMessage = 'Your OTP has been sent to your email';
          this.errorMessage = '';
          //console.log('hello, ', this.successMessage);
          if(this.remainingTime==60){
            this.startTimer();
          }
          
          
        },
        error: (err)=>{
          this.errorMessage = err.error.message;
          this.successMessage='';
        }
      })
  }

  startTimer(){
    //console.log('hello');
    
    this.remainingTime = 60;  
    // Unsubscribe from the previous timerSubscription if it exists
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    this.timerSubscription = interval(1000).subscribe(()=>{
    if(this.remainingTime > 0)
      {
        this.remainingTime--;
        //console.log('check interval: ',this.remainingTime);
      } else {
        // Reset the timer or handle timeout
        this.timerSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
      }
    })
}

verifyOTP(){
    //console.log("VErify otp clicked");
    
  this.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
    this.otpVerificationSubscription = this.otpVerifyService.verifyOTP(this.userId , this.otp).subscribe({
      next: (res)=>{
        this.toast.showSuccess(res.message, 'Success');
        this.successMessage = res.message;
        this.errorMessage = '';
        this.router.navigate(['/login']);
      },
      error: (err)=>{
        //console.log(err);
        
        this.toast.showError("Invalid OTP", 'Error');
        this.errorMessage = "";
        this.successMessage='';
      }
    })
  }


resendOTP()
  {
    this.startTimer()
    if(this.userType === 'user')
    {
      this.resendOtpSubscription = this.otpVerifyService.resendOTP(this.userId).subscribe({
        next: (res)=>{
          this.toast.showSuccess('Your OTP has been sent to your email', 'Success');
          this.successMessage = 'Your OTP has been sent to your email';
          this.remainingTime = 60;
          this.startTimer();
        },
        error: (err)=>{
          //console.log(err);
          
          this.toast.showError(err.error.message, 'Error');
          this.errorMessage = err.error.message;
          this.successMessage='';
        }
      });
    }
  }
  onSubmit(){

  }

  ngOnDestroy(): void {
    if(this.otpVerificationSubscription){
      this.otpVerificationSubscription.unsubscribe();
    }
    if(this.activatedRouteSubscription){
      this.activatedRouteSubscription.unsubscribe();
    }
    if(this.resendOtpSubscription){
      this.resendOtpSubscription.unsubscribe();
    }
    if(this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }
    if(this.setOtpSubscription){
      this.setOtpSubscription.unsubscribe();
    }
  } 

  
}
