import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { apiUrls } from './API';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent {
  title = 'eLearningApp';
  
}
