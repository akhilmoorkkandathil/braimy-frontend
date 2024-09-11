import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChatService } from '../../../../services/chatServices/chatService/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorService } from '../../../../services/tutorService/tutor.service';
import { Tutor } from '../../../../interfaces/tutor';
import { ChatMessage } from '../../../../interfaces/chatMessage';
import { UserChatService } from '../../../../services/chatServices/userChatService/user-chat.service';
import { RouterModule } from '@angular/router';
import { tutorWithLastMessage } from '../../../../interfaces/tutorWithLastMessage';
import { EmojiesComponent } from '../../../shared/emojies/emojies.component';

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,EmojiesComponent],
  templateUrl: './chat-layout.component.html',
  styleUrl: './chat-layout.component.css',
})
export class ChatLayoutComponent implements OnInit {
  userInput = '';
  userId = '';
  tutorWithLastMessage: tutorWithLastMessage[];
  tutorId = '';
  userType = 'User';
  messages: ChatMessage[] = [];
  isEmojiPickerVisible = false;

  constructor(
    private chatService: ChatService,
    private tutorService: TutorService,
    private userChatservice: UserChatService
  ) {}

  ngOnInit(): void {
    this.chatService.connect();
    this.userId = localStorage.getItem('userId');
    this.fetchTutors();
    this.getMessages();
  }

  fetchTutors() {
    this.tutorService.getStudentTutorsWithLastMessage().subscribe((res) => {
      this.tutorWithLastMessage = res.data;
      console.log(res.data);
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
    this.isEmojiPickerVisible = false;
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
      },
    });
  }

  sendMessage() {
    const newMessage: ChatMessage = {
      userId: this.userId,
      senderType: this.userType,
      message: this.userInput,
      createdAt: new Date(), // Add the current time here
    };
    this.chatService.sendMessage(
      this.userId,
      this.tutorId,
      this.userType,
      this.userInput
    );
    this.messages.push(newMessage);
    const tutorIndex = this.tutorWithLastMessage.findIndex(
      (tutor) => tutor.tutorId === this.tutorId
    );
    if (tutorIndex !== -1) {
      this.tutorWithLastMessage[tutorIndex].lastMessage = newMessage.message;
      this.tutorWithLastMessage[tutorIndex].lastMessageTime =
        newMessage.createdAt.toString();
    }
    this.userInput = '';
  }

  getMessages() {
    this.chatService.getMessages().subscribe((message: ChatMessage) => {
      console.log('hey, received message in the component:', message);

      this.messages.push(message);
      console.log(this.messages);
    });
  }
  makeCall() {}
}


//Next to do

// When recieveing message the message need to be updated in the reciever sidebar
//fix the bug - recieving message in opening tab