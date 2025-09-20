import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../../../validators/noWhiteSpace.validator'; 
import { confirmPasswordValidator } from '../../../validators/confirmPassword.validator';
import { passwordValidator } from '../../../validators/password.validator';
import { phoneNumberValidator } from '../../../validators/phone.validator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserSignupService } from '../../../services/userSignup/user-signup.service';
import { ToastService } from '../../../services/toastService/toast.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css',
})
export class UserRegisterComponent implements OnInit,OnDestroy {
  fb = inject(FormBuilder);
  SignupService = inject(UserSignupService);
  router = inject(Router)
  constructor(private toast: ToastService){}

  signupForm!: FormGroup;
  tutorSignupForm!: FormGroup;
  coordinatorSignupForm!: FormGroup;
  message: string = '';
  error: string = '';
  

  userSignupSubscription!:Subscription;
  tutorSignupSubscription!:Subscription;
  coordinatorSignupSubscription!:Subscription;


  ngOnInit(): void {
    this.validateUserForm();
    this.validateTutorForm();
    this.validateCoordinatorForm()
  }
  passwordMatchValidator(form: FormGroup) {
    return form.controls['password'].value === form.controls['confirmPassword'].value ? null : { 'mismatch': true };
  }

  

  validateUserForm(){
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, noWhitespaceValidator(),  Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required,Validators.email, noWhitespaceValidator()])],
      phone: ['', [Validators.required, noWhitespaceValidator(),phoneNumberValidator()]],
      password: ['', [Validators.required, noWhitespaceValidator(),passwordValidator()]],
      confirmPassword: ['', [Validators.required, noWhitespaceValidator()]]
    },
    {
      validator: confirmPasswordValidator('password', 'confirmPassword')
    })
    
  }

  validateTutorForm(){
    this.tutorSignupForm = this.fb.group({
      fullName: ['', [Validators.required, noWhitespaceValidator(),  Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required,Validators.email, noWhitespaceValidator()])],
      phone: ['', [Validators.required, noWhitespaceValidator(),phoneNumberValidator()]],
      password: ['', [Validators.required, noWhitespaceValidator(),passwordValidator()]],
      confirmPassword: ['', [Validators.required, noWhitespaceValidator()]]
    }, 
    {
      validator: confirmPasswordValidator('password', 'confirmPassword')
    }
  );
  }

  validateCoordinatorForm(){
    this.coordinatorSignupForm = this.fb.group({
      fullName: ['', [Validators.required, noWhitespaceValidator(),  Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required,Validators.email, noWhitespaceValidator()])],
      phone: ['', [Validators.required, noWhitespaceValidator(),phoneNumberValidator()]],
      password: ['', [Validators.required, noWhitespaceValidator(),passwordValidator()]],
      confirmPassword: ['', [Validators.required, noWhitespaceValidator()]]
    }, 
    {
      validator: confirmPasswordValidator('password', 'confirmPassword')
    }
  );
  }
  

  onStudentSubmit() {
    //console.log(this.signupForm.value);

    this.userSignupSubscription = this.SignupService.userSignup(this.signupForm.value)
      .subscribe({
        next: (res)=>{
          //console.log('User Created');
          const userId= res.data.id;
          const userType = res.data.userType;
          this.router.navigate(['user/otpverify'],{ queryParams: { userId: `${userId}`, userType: `${userType}` } });
          this.signupForm.reset();
        },
        error: (err) => {
          this.toast.showError(err.error.message, 'Error');
        }
      });
  }

  onTutorSubmit() {

    this.tutorSignupSubscription = this.SignupService.tutorSignup(this.tutorSignupForm.value)
      .subscribe({
        next: (res)=>{
          this.toast.showSuccess(res.message, 'Success');
          this.router.navigate(['login']);
          this.signupForm.reset();
        },
        error: (err) => {
          this.toast.showError(err.error.message, 'Error');
        }
      });
  }

  onCoordinatorSubmit() {
    console.log("sdfsdfds");
    
    this.coordinatorSignupSubscription = this.SignupService.coordinatorSignup(this.coordinatorSignupForm.value)
      .subscribe({
        next: (res)=>{
          console.log("Sucess");
          
          this.toast.showSuccess(res.message, 'Success');
          this.router.navigate(['login']);
          this.signupForm.reset();
        },
        error: (err) => {
          this.toast.showError(err.error.message, 'Error');
        }
      });
  }

  

  ngOnDestroy(): void {
    if (this.userSignupSubscription) {
      this.userSignupSubscription.unsubscribe();
    }
    if (this.tutorSignupSubscription) {
      this.tutorSignupSubscription.unsubscribe();
    }
    if (this.coordinatorSignupSubscription) {
      this.coordinatorSignupSubscription.unsubscribe();
    }
    
  }

  

}
