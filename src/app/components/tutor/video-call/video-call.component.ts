import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebRTCServiceService } from '../../../services/WebRTCService/web-rtcservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-video-call',
    templateUrl: './video-call.component.html',
    styleUrl: './video-call.component.css',
    standalone: false
})
export class tutorVideoCallComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('localVideo') localVideo: ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef;
  
    isInCall: boolean = false;
    isCallIncoming: boolean = false;
    studentId: string;
    tutorId: string;
    private subscriptions: Subscription[] = [];
  
    constructor(private webRTCService: WebRTCServiceService, private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.studentId = params['studentId'];
        
        // Set up the user in the WebRTC service
        this.webRTCService.setUser(this.tutorId, 'tutor');
        this.webRTCService.setRemoteUser(this.studentId,'student')
      });
    }
  
    ngAfterViewInit(): void {
      this.subscriptions.push(
        this.webRTCService.callStatus$.subscribe(status => {
          this.isInCall = status === 'ongoing';
          if(status === 'incoming'){
            this.isCallIncoming = true;
            this.isInCall = true;
          }
          if (status === 'idle') {
            this.remoteVideo.nativeElement.srcObject = null;
            this.localVideo.nativeElement.srcObject = null;
          }
        }),
        this.webRTCService.remoteStream$.subscribe(stream => {
          if (stream) {
            this.remoteVideo.nativeElement.srcObject = stream;
          }
        }),
        this.webRTCService.incomingCall$.subscribe(callerId => {
          console.log('Incoming call from:', callerId);
          this.isCallIncoming = true;
        })
      );
    }
  
    ngOnDestroy() {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  
    async initiateCall() {
      try {
        this.isInCall = true;
        await this.webRTCService.startCall(this.studentId);
        this.localVideo.nativeElement.srcObject = this.webRTCService.getLocalStream();
        console.log("Call started in tutor side");
        
      } catch (error) {
        console.error('Failed to start call:', error);
      }
    }
  
    async answerIncomingCall() {
      try {
        await this.webRTCService.answerCall();
        this.localVideo.nativeElement.srcObject = this.webRTCService.getLocalStream();
        this.isCallIncoming = false;
        this.isInCall = true;
        console.log('Call answered from tutor side');
      } catch (error) {
        console.error('Failed to answer call:', error);
      }
    }
  
    endCurrentCall() {
      this.webRTCService.endCall();
      this.isInCall = false;
      this.isCallIncoming = false;
    }
}
