import { Component, Input, OnInit } from '@angular/core';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-algorithm-crc',
  templateUrl: './algorithm-crc.component.html',
  styleUrls: ['./algorithm-crc.component.scss']
})
export class AlgorithmCrcComponent implements OnInit {

  @Input() polynomio:any={};
  constructor(
    public __sController: ControllerService){

  }

  ngOnInit(): void {
  }

  cargar(event:any){
    this.polynomio = event
  }
}
