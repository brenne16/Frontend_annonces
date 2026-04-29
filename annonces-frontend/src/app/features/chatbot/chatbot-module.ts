import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { ChatbotRoutingModule } from './chatbot-routing-module';
import { ChatbotWidget } from './chatbot-widget/chatbot-widget';

@NgModule({
  imports: [
    SharedModule,
    ChatbotRoutingModule,
    ChatbotWidget
  ]
})
export class ChatbotModule { }