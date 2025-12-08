import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutes,HttpClientModule],
  providers: [
  ],
 bootstrap: []
})
export class AppModule {}