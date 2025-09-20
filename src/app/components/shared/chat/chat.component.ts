import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

@Component({
    selector: 'app-chat',
    imports: [MatFormField],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent {
  searchControl = new FormControl
}
