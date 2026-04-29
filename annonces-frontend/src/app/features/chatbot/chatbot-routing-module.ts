import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatbotWidget } from './chatbot-widget/chatbot-widget';

const routes: Routes = [
  { path: '', component: ChatbotWidget }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatbotRoutingModule { }