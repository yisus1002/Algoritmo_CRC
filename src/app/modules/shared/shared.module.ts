import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormCrcComponent } from './components/form-crc/form-crc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { latexPipe } from 'src/app/pipes/latex.pipe';


@NgModule({
  declarations: [
    NavbarComponent,
    FormCrcComponent,

    latexPipe
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    MaterialModule,
    FormCrcComponent,
    latexPipe
  ]
})
export class SharedModule { }
