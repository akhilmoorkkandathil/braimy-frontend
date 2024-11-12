import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';
import { LandingNavbarComponent } from './components/landing/landing-navbar/landing-navbar.component'; 
import { LandingFooterComponent } from './components/landing/landing-footer/landing-footer.component'; 
import { LandingHomeComponent } from './components/landing/landing-home/landing-home.component'; 
import { LandingCoursesComponent } from './components/shared/landing-courses/landing-courses.component'; 
import { LandingTutorsComponent } from './components/landing/landing-tutors/landing-tutors.component'
import { LandingCourseComponent } from './components/shared/landing-course/landing-course.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';  
import { UserLoginComponent } from './components/user/user-login/user-login.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UserOtpVerifyComponent } from './components/user/user-otp-verify/user-otp-verify.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { UserSidebarComponent } from './components/user/user-sidebar/user-sidebar.component';
import { UserHeaderComponent } from './components/user/user-header/user-header.component';
import { TutorsComponent } from './components/user/tutors/tutors.component';
import { ToastComponent } from './components/shared/toast/toast.component';
import { ToastrModule } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';


import {  SocialAuthServiceConfig, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider,SocialLoginModule } from '@abacritt/angularx-social-login';
import { FacebookLoginProvider } from 'angularx-social-login';
import { SidebarComponent } from './components/admin/sidebar/sidebar.component';
import { AdminHeaderComponent } from './components/admin/admin-header/admin-header.component';
import { TutorLayoutComponent } from './layouts/tutor-layout/tutor-layout.component';
import { CoordinatorLayoutComponent } from './layouts/coordinator-layout/coordinator-layout.component';
import { CoordinatorDashboardComponent } from './components/coordinator/coordinator-dashboard/coordinator-dashboard.component';
import { CoordinatorSidebarComponent } from './components/coordinator/coordinator-sidebar/coordinator-sidebar.component';
import { CoordinatorHeaderComponent } from './components/coordinator/coordinator-header/coordinator-header.component';
import { TutorSidebarComponent } from './components/tutor/tutor-sidebar/tutor-sidebar.component';
import { TutorHeaderComponent } from './components/tutor/tutor-header/tutor-header.component';
import { TutorDashboardComponent } from './components/tutor/tutor-dashboard/tutor-dashboard.component';
import { TableComponent } from './components/shared/table/table.component';
import { AdminUserListComponent } from './components/admin/admin-user-list/admin-user-list.component';
import { AdminTutorsListComponent } from './components/admin/admin-tutors-list/admin-tutors-list.component';
import { AdminCoordinatorsListComponent } from './components/admin/admin-coordinators-list/admin-coordinators-list.component';
import { AdminCourseListComponent } from './components/admin/admin-course-list/admin-course-list.component';
import { AdminPaymentListComponent } from './components/admin/admin-payment-list/admin-payment-list.component';
import { AdminExpenseListComponent } from './components/admin/admin-expense-list/admin-expense-list.component';
import { TutorClassesComponent } from './components/tutor/tutor-classes/tutor-classes.component';
import { TutorCoursesComponent } from './components/tutor/tutor-courses/tutor-courses.component';
import { CoordinatorClassesComponent } from './components/coordinator/coordinator-classes/coordinator-classes.component';
import { CoordinatorNotificationsComponent } from './components/coordinator/coordinator-notifications/coordinator-notifications.component';
import { UserNotificationComponent } from './components/user/user-notification/user-notification.component';
import { AdminAddCourseComponent } from './components/admin/admin-add-course/admin-add-course.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { AdminAddPaymentComponent } from './components/admin/admin-add-payment/admin-add-payment.component';
import { AdminAddExpenseComponent } from './components/admin/admin-add-expense/admin-add-expense.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminAddStudentComponent } from './components/admin/admin-add-student/admin-add-student.component';
import { AdminAddTutorComponent } from './components/admin/admin-add-tutor/admin-add-tutor.component';
import { AdminAddCoordinatorComponent } from './components/admin/admin-add-coordinator/admin-add-coordinator.component';
import { MatMenuModule } from '@angular/material/menu';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoordinatorStuedentsComponent } from './components/coordinator/coordinator-stuedents/coordinator-stuedents.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ConfirmDialogueComponent } from './components/shared/confirm-dialogue/confirm-dialogue.component';
import { ErrorInterceptor } from './interceptors/error-handler.interceptor';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { TutorClassHistoryComponent } from './components/tutor/tutor-class-history/tutor-class-history.component';
import { UserPaymentHistoryComponent } from './components/user/user-payment/user-payment-history/user-payment-history.component';
import { StudentVideoCallComponent } from './components/user/video-call/video-call.component';
import { TestCredentialsPopupComponent } from './components/user/user-login/test-credentials-popup/test-credentials-popup.component';

const config: SocketIoConfig = { url: environment.SOCKET_IO_URL , options: {} };


@NgModule({
  declarations: [
    AppComponent,
    UserLayoutComponent,
    LandingLayoutComponent,
    LandingNavbarComponent,
    LandingFooterComponent,
    LandingHomeComponent,
    LandingCoursesComponent,
    LandingTutorsComponent,
    LandingCourseComponent,
    AdminLayoutComponent,
    UserRegisterComponent,
    UserLoginComponent,
    UserOtpVerifyComponent,
    UserDashboardComponent,
    UserSidebarComponent,
    UserHeaderComponent,
    TutorsComponent,
    ToastComponent,
    SidebarComponent,
    AdminHeaderComponent,
    TutorLayoutComponent,
    CoordinatorLayoutComponent,
    CoordinatorDashboardComponent,
    CoordinatorSidebarComponent,
    CoordinatorHeaderComponent,
    TutorSidebarComponent,
    TutorHeaderComponent,
    TutorDashboardComponent,
    TableComponent,
    AdminUserListComponent,
    AdminTutorsListComponent,
    AdminCoordinatorsListComponent,
    AdminCourseListComponent,
    AdminPaymentListComponent,
    AdminExpenseListComponent,
    TutorClassesComponent,
    TutorCoursesComponent,
    CoordinatorClassesComponent,
    CoordinatorNotificationsComponent,
    UserNotificationComponent,
    AdminAddCourseComponent,
    AdminAddPaymentComponent,
    AdminAddExpenseComponent,
    AdminAddStudentComponent,
    AdminAddTutorComponent,
    AdminAddCoordinatorComponent,
    CoordinatorStuedentsComponent,
    StudentVideoCallComponent,
    ConfirmDialogueComponent,
    TutorClassHistoryComponent,
    UserPaymentHistoryComponent,
    TestCredentialsPopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Duration in milliseconds
      positionClass: 'toast-top-right', // Position of the toast
      preventDuplicates: true, // Prevent duplicate toasts
    }),
    AppRoutingModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RippleModule,
    ButtonModule,
    DialogModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    MatSelectModule,
    NgxMatTimepickerModule,
    SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    SocketIoModule.forRoot(config),
    
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, 
      useClass: ErrorInterceptor, 
      multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('413388112525-kcbrhvaqns1usl5j546tgl26mtliq9rf.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('975750380968165')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
