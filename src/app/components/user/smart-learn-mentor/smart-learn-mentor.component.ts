
import {
  AfterViewChecked,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { trigger, style, transition, animate } from "@angular/animations";
import { GeminiService } from "../../../services/geminiService/gemini.service";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { GeminiConfig } from "../../../interfaces/geminChat";
import {environment} from "../../../../environments/environment"
import { TextToHtmlPipe } from "../../../pipe/text-to-html.pipe";


@Component({
    selector: 'app-smart-learn-mentor-component',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextToHtmlPipe,
        NgxLoadingModule
    ],
    templateUrl: './smart-learn-mentor.component.html',
    styleUrl: './smart-learn-mentor.component.css',
    animations: [
        trigger("typeWritterEffect", [
            transition(":enter", [
                style({ opacity: 0 }),
                animate("2s", style({ opacity: 1 })),
            ]),
        ]),
    ]
})
export class SmartLearnMentorComponent implements AfterViewChecked {
  @ViewChild("chat-body") private messagesContainer!: ElementRef;
  private dataService = inject(GeminiService);
  public messagesHistory: { role: string; parts: string }[] = [];
  public userMessage!: string | null;
  public loading = false;
  public loadingTemplate!: TemplateRef<any>;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loadingConfig = {
    animationType: ngxLoadingAnimationTypes.circleSwish,
    primaryColour: "#ffffff",
    secondaryColour: "#ccc",
    tertiaryColour: "#dd0031",
    backdropBorderRadius: "3px",
  };
  public gQuestions = [
    "What are questions about Plant cells?",
    "What is cytoplasm?",
    "Give MCQ questions related to human heart?",
  ];

  chatForm = new FormGroup({
    apiKey: new FormControl(environment.API_KEY || ""),
    temperature: new FormControl(0.5),
    bot: new FormControl({
      id: 1,
      value: "SmartLearn Mentor",
    }),
    model: new FormControl("gemini-1.0-pro"),
  });

  sendMessage(message: string) {
    if (!message || this.loading) return;
    setTimeout(() => this.scrollToBottom(), 0);
    this.loading = true;
    this.messagesHistory.push(
      {
        role: "user",
        parts: message,
      },
      {
        role: "model",
        parts: "",
      }
    );
    this.dataService
      .generateContentWithGeminiPro(
        message,
        this.messagesHistory,
        this.chatForm.value as GeminiConfig
      )
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.userMessage = null;
          this.messagesHistory = this.messagesHistory.slice(0, -2);
          this.messagesHistory.push(
            {
              role: "user",
              parts: message,
            },
            {
              role: "model",
              parts: res,
            }
          );
          this.scrollToBottom();
        },
        error: (error) => {
          this.loading = false;
          console.error("Error generating content:", error);
          this.messagesHistory.push({
            role: "model",
            parts: "Sorry, something went wrong. Please try again later.",
          });
          setTimeout(() => this.scrollToBottom(), 0);
        },
      });
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index; // Adjust this based on your data structure
  }
  
}