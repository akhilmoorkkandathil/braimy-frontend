import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../../interfaces/user';
import { ApiResponse } from '../../interfaces/apiResponse';
import { apiUrls } from '../../API';
import { Course } from '../../interfaces/course';
import { Expense } from '../../interfaces/expense';
import { Payment } from '../../interfaces/payment';
import { coureseShedule } from '../../interfaces/courseShedule';
import { PaymentResponse } from '../../interfaces/paymentTable';
import { faq } from '../../interfaces/faq';


@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  http = inject(HttpClient)
  constructor() { }

  getUsersList(){
    return this.http.get<ApiResponse>(`${apiUrls.usersApi}getUsers`,{withCredentials:true});
  }
  getCoordinatorUsersList(){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}getUsersList`,{withCredentials:true});
  }
  addStudent(studentData:FormData){
    return this.http.post<ApiResponse>(`${apiUrls.usersApi}addStudent`,studentData,{withCredentials:true});
  }
  blockStudent(studentId: string) {
    return this.http.patch<ApiResponse>(`${apiUrls.usersApi}blockStudent/${studentId}`, { withCredentials: true });
  }  
  unblockStudent(studentId: string) {
    return this.http.patch<ApiResponse>(`${apiUrls.usersApi}unblockStudent/${studentId}`, { withCredentials: true });
  }  
  getStudent(studentId:string){
    return this.http.get<ApiResponse>(`${apiUrls.usersApi}getStudent/${studentId}`,{withCredentials:true});
  }
  updateStudent(studentId:string,studentData:FormData){
    return this.http.post<ApiResponse>(`${apiUrls.usersApi}updateStudent/${studentId}`,studentData,{withCredentials:true});
  }
  getTutorsList(){
    return this.http.get<ApiResponse>(`${apiUrls.tutorsApi}getTutors`,{withCredentials:true});
  }
  addTutor(courseData:Course){
    return this.http.post<ApiResponse>(`${apiUrls.tutorsApi}addTutor`,courseData,{withCredentials:true})
  }
  blockTutor(tutorId:string){
    return this.http.patch<ApiResponse>(`${apiUrls.tutorsApi}blockTutor/${tutorId}`,{withCredentials:true});
  }
  unblockTutor(tutorId:string){
    return this.http.patch<ApiResponse>(`${apiUrls.tutorsApi}unblockTutor/${tutorId}`,{withCredentials:true});
  }
  verifyTutor(tutorId:string){
    return this.http.patch<ApiResponse>(`${apiUrls.tutorsApi}verifyTutor/${tutorId}`,{withCredentials:true});
  }
  getTutor(tutorId:string){
    return this.http.get<ApiResponse>(`${apiUrls.tutorsApi}getTutor/${tutorId}`,{withCredentials:true});
  }
  deleteTutor(tutorId:string){
    return this.http.delete<ApiResponse>(`${apiUrls.tutorsApi}deleteTutor/${tutorId}`,{withCredentials:true});
  }
  updateTutor(tutorId:string,tutorData:FormData){
    return this.http.put<ApiResponse>(`${apiUrls.tutorsApi}updateTutor/${tutorId}`,tutorData,{withCredentials:true});
  }
  getCoordinatorsList(){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}getCoordinators`,{withCredentials:true})
  }
  
  addCoordinator(courseData:Course){
    return this.http.post<ApiResponse>(`${apiUrls.coordinatorApi}addCoordinator`,courseData,{withCredentials:true})
  }
  blockCoordinator(coordinatorId:string){
    return this.http.patch<ApiResponse>(`${apiUrls.coordinatorApi}blockCoordinator/${coordinatorId}`,{withCredentials:true});
  }
  unblockCoordinator(coordinatorId:string){
    return this.http.patch<ApiResponse>(`${apiUrls.coordinatorApi}unblockCoordinator/${coordinatorId}`,{withCredentials:true});
  }
  verifyCoordinator(coordinatorId:string){
    return this.http.patch<ApiResponse>(`${apiUrls.coordinatorApi}verifyCoordinator/${coordinatorId}`,{withCredentials:true});
  }
  getCoordinator(coordinatorId:string){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}getCoordinator/${coordinatorId}`,{withCredentials:true});
  }
  deleteCoordinator(coordinatorId:string){
    return this.http.delete<ApiResponse>(`${apiUrls.coordinatorApi}deleteCoordinator/${coordinatorId}`,{withCredentials:true});
  }
  updateCoordinator(coordinatorId:string,coordinatorData:User){
    return this.http.post<ApiResponse>(`${apiUrls.coordinatorApi}updateCoordinator/${coordinatorId}`,{coordinatorData},{withCredentials:true});
  }

  addCourse(formData:FormData){    
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}addCourse`,formData,{withCredentials:true})
  }
  getCouresList(){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getCourses`,{withCredentials:true})

  }
  getCourse(courseId:string){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getCourse/${courseId}`,{withCredentials:true});
  }
  deleteCourse(courseId:string){
    return this.http.delete<ApiResponse>(`${apiUrls.adminApi}deleteCourse/${courseId}`,{withCredentials:true});
  }
  updateCourse(courseId: string, courseData: FormData) {
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}updateCourse/${courseId}`, courseData, {
      withCredentials: true
    });
  }  

  addExpense(expenseData:Expense){
    return this.http.put<ApiResponse>(`${apiUrls.adminApi}addExpense`,expenseData,{withCredentials:true})
  }
  getExpense(expenseId:string){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getExpense/${expenseId}`,{withCredentials:true});
  }
  deleteExpense(expenseId:string){
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}deleteExpense/${expenseId}`,{withCredentials:true});
  }
  updateExpense(expenseId:string,expenseData:User){
    return this.http.put<ApiResponse>(`${apiUrls.adminApi}updateExpense/${expenseId}`,{expenseData},{withCredentials:true});
  }
  addPayment(paymentData:Payment){
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}addPayment`,paymentData,{withCredentials:true})
  }

  getPaymentList(){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getPayments`,{withCredentials:true})

  }
  getPayment(paymentId:string){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getPayment/${paymentId}`,{withCredentials:true});
  }
  deletePayment(paymentData:PaymentResponse){
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}deletePayment`,paymentData,{withCredentials:true});
  }
  updatePayment(paymentId:string,paymentData:User){
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}updatePayment/${paymentId}`,{paymentData},{withCredentials:true});
  }

  getExpenseList(){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getExpenses`,{withCredentials:true})

  }
  addPushSubscriber(){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getExpenses`,{withCredentials:true})
  }
  getTutorStudentList(){
    return this.http.get<ApiResponse>(`${apiUrls.tutorsApi}getTutorStudent`,{withCredentials:true});
  }
  getTutorStudentWithLastMessage(){
    return this.http.get<ApiResponse>(`${apiUrls.tutorsApi}getTutorStudentWithLastMessage`,{withCredentials:true});
  }
  getTodaysClasses(){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}todaysClasses`,{withCredentials:true});
  }
  getTodaysUpcomingClasses(){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}upcomingClasses`,{withCredentials:true});
  }
  getTutorUpcomingClasses(){
    return this.http.get<ApiResponse>(`${apiUrls.tutorsApi}getTutorUpcomingClasses`,{withCredentials:true});
  }
  approveClass(studentId:string){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}approveClass/${studentId}`,{withCredentials:true});
  }
  sendNotification(studentId:string){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}notificationSend/${studentId}`,{withCredentials:true});
  }
  getDashBoardData(){    
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}dashboardData`,{withCredentials:true});
  }

  addCourseToUserBucket(studentId:string,addToBucketForm:coureseShedule){
    return this.http.post<ApiResponse>(`${apiUrls.coordinatorApi}addCourseToUserBucket/${studentId}`,addToBucketForm,{withCredentials:true});
  }
  updateCourseToUserBucket(studentId:string,addToBucketForm:coureseShedule){
    console.log("This si the ADd to bucker form data in the servive",addToBucketForm);
    
    return this.http.post<ApiResponse>(`${apiUrls.coordinatorApi}updateCourseToUserBucket/${studentId}`,addToBucketForm,{withCredentials:true});
  }

  getBucketCourse(studentId:string,courseId:string){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}getBucketCourse/${studentId}/${courseId}`,{withCredentials:true});

  }

  uploadCoordinatorProfilePhoto(formData:FormData){    
    return this.http.post<ApiResponse>(`${apiUrls.coordinatorApi}uploadCoordinatorProfilePhoto`,formData,{withCredentials:true});
  }

  getCoordinatorData(){
    return this.http.get<ApiResponse>(`${apiUrls.coordinatorApi}getCoordinatorData`,{withCredentials:true});
  }

  editCoordinatorProfileInfo(coordinatorData){
    return this.http.post<ApiResponse>(`${apiUrls.coordinatorApi}editCoordinatorProfileInfo`,coordinatorData,{withCredentials:true});
  }
  addFaq(data:faq){
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}addFaq`,data,{withCredentials:true});
  }
  getFaqData(){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getFaqs`,{withCredentials:true});

  }
  updateFaq(faqId:string,faqData:faq){
    return this.http.post<ApiResponse>(`${apiUrls.adminApi}updateFaq/${faqId}`,faqData,{withCredentials:true});
  }

  deleteFaq(faqId:string){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}deleteFaq/${faqId}`,{withCredentials:true});
  }

  getBarGraphData(){
    return this.http.get<ApiResponse>(`${apiUrls.adminApi}getBarGraphData`,{withCredentials:true});
  }

  
}


