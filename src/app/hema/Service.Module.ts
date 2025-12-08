import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRouting } from './Service.Routing';
import {  RouterModule } from '@angular/router';

@NgModule({
    declarations : [],
  imports: [CommonModule, ServiceRouting,RouterModule]
})
export class ServiceModule {}