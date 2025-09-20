import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../../../services/chatServices/chatService/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorService } from '../../../../services/tutorService/tutor.service';
import { Tutor } from '../../../../interfaces/tutor';
import { ChatMessage } from '../../../../interfaces/chatMessage';
import { UserChatService } from '../../../../services/chatServices/userChatService/user-chat.service';
import { Router, RouterModule } from '@angular/router';
import { tutorWithLastMessage } from '../../../../interfaces/tutorWithLastMessage';
import { EmojiesComponent } from '../../../shared/emojies/emojies.component';
import { ToastService } from '../../../../services/toastService/toast.service';
import { UserDataService } from '../../../../services/userDataService/user-data.service';

@Component({
    selector: 'app-chat-layout',
    imports: [CommonModule, FormsModule, RouterModule, EmojiesComponent],
    templateUrl: './chat-layout.component.html',
    styleUrl: './chat-layout.component.css'
})
export class ChatLayoutComponent implements OnInit {


  @ViewChild('chatContent') private chatContent: ElementRef;

  userInput = '';
  userId = '';
  tutorWithLastMessage: tutorWithLastMessage[]=[];
  tutorId = '';
  userType = 'User';
  messages: ChatMessage[] = [];
  isEmojiPickerVisible = false;

  constructor(
    private chatService: ChatService,
    private tutorService: TutorService,
    private userChatservice: UserChatService,
    private router:Router,
    private toast: ToastService,
    private userDataService:UserDataService
  ) {}

  ngOnInit(): void {
    this.chatService.connect();
    this.fetchTutors();
    this.getMessages();
    this.getUeserId()
  }

  getUeserId(){
    this.userDataService.userData$.subscribe(data => {
      this.userId = data._id;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContent.nativeElement.scrollTop = this.chatContent.nativeElement.scrollHeight;
    } catch(err) { }
  }

  fetchTutors() {
    this.tutorService.getStudentTutorsWithLastMessage().subscribe({
      next: (res) => {
        this.tutorWithLastMessage = res.data;
        console.log(res.data);
      },
      error: (error) => {
        console.error('Error fetching tutors with last message:', error);
        // Handle the error appropriately, e.g., show a toast message or alert
        //this.toast.showError(error.error.message, 'Error');
      }
    });
  }
  selected: undefined | boolean = false;

  selectedTutor: Tutor;

  selectUser(tutor: tutorWithLastMessage) {
    console.log('This is tutor data', tutor);

    this.messages = [];
    this.selected = true;
    this.tutorId = tutor.tutorId;
    this.joinChat();
    this.selectedTutor = tutor;
    this.getOldChats(this.tutorId);
  }


  onEmojiSelected(emoji: string) {
    this.userInput += emoji;
  }

  joinChat() {
    this.chatService.joinChat(this.userId, this.userType);
  }

  getOldChats(tutorId: string) {
    this.userChatservice.getOldChats(tutorId).subscribe({
      next: (response) => {
        console.log('fetched older messages: ', response.data);
        this.messages.push(...response.data);
      },
      error: (error) => {
        console.error('Error fetching older chat:', error);
        this.toast.showError(error.error.message, 'Error');
      },
    });
  }

  sendMessage() {
    this.isEmojiPickerVisible = false;
    const newMessage: ChatMessage = {
      userId: this.userId,
      tutorId:this.tutorId,
      senderType: this.userType,
      message: this.userInput,
      createdAt: new Date(),
    };
    console.log(newMessage);
    
    this.chatService.sendMessage(newMessage);
    //this.messages.push(newMessage);
    this.updateTutorWithLastMessage(newMessage);
    setTimeout(() => this.scrollToBottom(), 0);
    this.userInput = '';
  }

  navigateToVideoCall() {
    this.router.navigate(['/user/video'], { 
      queryParams: { 
        userId: this.userId,
        tutorId: this.tutorId
      }
    });
  }
  
  getMessages() {
    this.chatService.getMessages().subscribe((message: ChatMessage) => {
      console.log('hey, received message in the component:', message);
      this.messages.push(message);
      this.updateTutorWithLastMessage(message);
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }
  
  private updateTutorWithLastMessage(message: ChatMessage) {
    const tutorIndex = this.tutorWithLastMessage.findIndex(
      (tutor) => tutor.tutorId === this.tutorId
    );
    if (tutorIndex !== -1) {
      this.tutorWithLastMessage[tutorIndex].lastMessage = message.message;
      this.tutorWithLastMessage[tutorIndex].lastMessageTime = message.createdAt.toString();
    }
  }
}


//Next to do

// When recieveing message the message need to be updated in the reciever sidebar
//fix the bug - recieving message in opening tab