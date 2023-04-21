import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { HomeComponent } from './home/home.component';
import { AlgorithmCrcComponent } from './pages/algorithm-crc/algorithm-crc.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    HomeComponent,
    AlgorithmCrcComponent,
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    SharedModule,
  ],
  exports:[]
})
export class LandingPageModule { }
