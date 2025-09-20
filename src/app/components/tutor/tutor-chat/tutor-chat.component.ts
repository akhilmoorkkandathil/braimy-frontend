import { Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chatServices/chatService/chat.service';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { User } from '../../../interfaces/user';
import { ChatMessage } from '../../../interfaces/chatMessage';
import { TutorChatService } from '../../../services/chatServices/tutorChatService/tutor-chat.service';
import { Router, RouterModule } from '@angular/router';
import { usesrWithLastMessage } from '../../../interfaces/userWithLastMessage';
import { EmojiesComponent } from '../../shared/emojies/emojies.component';
import { TutorDataService } from '../../../services/tutorDataService/tutor-data.service';

@Component({
    selector: 'app-tutor-chat',
    imports: [CommonModule, FormsModule, RouterModule, EmojiesComponent],
    templateUrl: './tutor-chat.component.html',
    styleUrl: './tutor-chat.component.css'
})
export class TutorChatComponent {


  @ViewChild('chatContent') private chatContent: ElementRef;

  tutorInput=''
  userId = '';
  studentListWithLastMessage:usesrWithLastMessage[];
  tutorId=''
  userType = "Tutor";
  messages: ChatMessage[] = [];
  isEmojiPickerVisible:boolean = false;
  constructor(
    private chatService:ChatService, 
    private adminservice:AdminServiceService,
    private tutorChatService:TutorChatService,
    private router:Router,
    private tutorDateService:TutorDataService
  ){}


  ngOnInit(): void {
      this.chatService.connect()
      this.getMessages()
      this.fetchStudentwithLastMessag();
      this.getTutorId()
  }

  getTutorId(){
    this.tutorDateService.tutorData$.subscribe(data => {
      this.tutorId = data._id;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }



  fetchStudentwithLastMessag() {
    this.adminservice.getTutorStudentWithLastMessage().subscribe(res => {
      this.studentListWithLastMessage = res.data;
      console.log("Student list....",res.data);
      
    });
  }
  

  selected:undefined | boolean =false;

  selectedStudent: User;

  selectUser(student) {
    console.log("selected student data",student);
    
    this.messages = []
    this.selected = true;
    this.userId = student.userId
    this.joinChat()
    this.selectedStudent = student;
    this.getOldChats(this.userId);
    
  }

  joinChat(){
    this.chatService.joinChat(this.tutorId,this.userType);
  }
  onEmojiSelected(emoji: string) {
    this.tutorInput += emoji;
  }
  getOldChats(userId:string){
    this.tutorChatService.getOldChats(userId).subscribe({
      next: (response) => {
        console.log('fetched older messages: ', response.data);
        this.messages = [...response.data];
        console.log("messages",this.messages);
        
      },
      error: (error) => {
        console.error('Error fetching older chat:', error);
      }
  });
}
  sendMessage(){
    this.isEmojiPickerVisible = false;
    const newMessage: ChatMessage = {
      userId: this.userId,
      tutorId:this.tutorId,
      senderType: this.userType,
      message: this.tutorInput,
      createdAt: new Date(),
    };
    console.log("In tutor sending message methode",newMessage);
    
    this.chatService.sendMessage(newMessage);
    this.messages.push(newMessage);
    this.updateStudentWithLastMessage(this.userId, newMessage);
    setTimeout(() => this.scrollToBottom(), 0);
    this.tutorInput = '';
  }
  scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop = this.chatContent.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getMessages() {
    this.chatService.getMessages().subscribe((message: ChatMessage) => {
      console.log('Received message:', message);
      if (message.userId === this.userId) {
        this.messages.push(message);
      }
      this.updateStudentWithLastMessage(message.userId, message);
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  navigateToVideoCall() {
    this.router.navigate(['/tutor/video'], { 
      queryParams: { tutorId: this.tutorId,studentId: this.userId }
    });
  }

  private updateStudentWithLastMessage(userId: string, message: ChatMessage) {
    const studentIndex = this.studentListWithLastMessage.findIndex(
      (student) => student.userId === userId
    );
    if (studentIndex !== -1) {
      this.studentListWithLastMessage[studentIndex].lastMessage = message.message;
      this.studentListWithLastMessage[studentIndex].lastMessageTime = message.createdAt.toString();
    }
  }
  
}
