import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutes,HttpClientModule],
  providers: [MessageService ],
 bootstrap: []
})
export class AppModule {}