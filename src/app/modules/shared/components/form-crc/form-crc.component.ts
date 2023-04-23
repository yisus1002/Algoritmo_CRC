import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-form-crc',
  templateUrl: './form-crc.component.html',
  styleUrls: ['./form-crc.component.scss']
})
export class FormCrcComponent implements OnInit{

  public formu!:FormGroup;

  @Output() polinOuput:EventEmitter<{}>;
  public regex:any = /\d+/g;


  constructor(
    private form: FormBuilder,
    public __sController: ControllerService
    ){
      this.polinOuput= new EventEmitter();
  }
  ngOnInit(): void {
    this.createForm();
  }

  public get polynomNoValide(){return this.formu.get('polynomio')?.invalid && this.formu.get('polynomio')?.touched}
  public get polynomGxNoValide(){return this.formu.get('polynomioGx')?.invalid && this.formu.get('polynomioGx')?.touched}
  public get polynomInvalide(){

    let d:any[]=this.formu.value?.polynomio.split(' ');
    let g:any[]=this.formu.value?.polynomioGx.split(' ');
const Dx = d.reduce((max:any, str:any) => {
  const numbers = str.match(this.regex);
  if (!numbers) {
    return max;
  }
  const num = parseInt(numbers[0]);
  return num > max ? num : max;
}, 0);
const Gx = g.reduce((max:any, str:any) => {
  const numbers = str.match(this.regex);
  if (!numbers) {
    return max;
  }
  const num = parseInt(numbers[0]);
  return num > max ? num : max;
}, 0);

    return (Gx>Dx)? true: false;}


  createForm(){
    this.formu= this.form.group({
      polynomio: ["",
                    [Validators.required,  Validators.pattern("^[+-]?(?:\\d+x\\^[\\d]+|[+-]?\\d*x(?:\\^[1-9]\\d{0,2})?|[+-]?\\d+)(?:[+-](?:\\d+x\\^[\\d]+|[+-]?\\d*x(?:\\^[1-9]\\d{0,2})?|[+-]?\\d+))*$")],
                    []
                  ],
      polynomioGx: ["",
                    [Validators.required,  Validators.pattern("^[+-]?(?:\\d+x\\^[\\d]+|[+-]?\\d*x(?:\\^[1-9]\\d{0,2})?|[+-]?\\d+)(?:[+-](?:\\d+x\\^[\\d]+|[+-]?\\d*x(?:\\^[1-9]\\d{0,2})?|[+-]?\\d+))*$")],
                    []
                  ],
    })
  }
  loadForm(){
    this.formu.reset({
      polynomio:'',
      polynomioGx:''
    })
  }

  calcular(){


    if(this.formu.invalid) return;
    let poly:any;
    let polyGx:any;

    poly=this.PolynomioToBinary(this.formu.value?.polynomio)
    polyGx=this.PolynomioToBinary(this.formu.value?.polynomioGx)

    this.__sController.polynomio=poly
    this.__sController.polynomio=polyGx
    let DxR =this.searchR(poly, polyGx)

    let objCRC= this.CalcularCRC(DxR,polyGx)
    let CRC = objCRC?.residuo[objCRC?.residuo.length-1]
    let DxRFinal=[...poly, ...CRC]

    let comprobacion=this.CalcularCRC(DxRFinal,polyGx)

      // CRC.pop()
// console.log(comprobacion);

    this.polinOuput.emit({
      polynomio:this.formu.value?.polynomio,
      polynomioGx:this.formu.value?.polynomioGx,
      polynomioBinary: poly.join(''),
      polynomioBinaryGx: polyGx.join(''),
      DxR:DxR,
      CRC:CRC,
      residuo:objCRC?.residuo,
      cociente:objCRC?.cociente,
      divisor:objCRC?.divisorAux,
      DxRFinal:DxRFinal,
      comprobacion:comprobacion,
    })
  }

  CalcularCRC(Dx:any[], Gx:[]){
    let DxAux:any[]=Dx;
    let cociente=[];
    let divisor:any[]=Gx;
    let dividendo:any[]=Dx;
    let residuo:any[]=[];
    let divisorAux:any[]=[];
    let cont=Gx.length;

    while(Dx.length>0){
      let resta:any[]=[];

     dividendo= dividendo.slice(0, divisor.length);
     divisorAux.push(divisor);

     dividendo.forEach((element, i) => (element===divisor[i])? resta.push(0):resta.push(1));
     (dividendo[0]===0)?cociente.push(0):cociente.push(1);
    switch(resta[0]){
      case 0:
        resta.shift();
        resta.push(DxAux[cont]);
        residuo.push(resta);
        dividendo=resta;
        if(resta[0]===0){
          divisor=[];
          for(let i=0;i<Gx.length;i++){
            divisor.push(0);
          }
        }else{
          divisor=Gx;
        }
        break;
      default:
        break;
    }
    (cont===(Gx.length)) ? Dx=DxAux.slice(cont, DxAux.length) : Dx=DxAux.slice(cont, DxAux.length);
     cont++;
    }
    return {
      residuo:[...residuo.slice(0,residuo.length-1), residuo[residuo.length-1].slice(0,residuo[residuo.length-1].length-1)],
      cociente,
      divisorAux
     };
  }

  searchR(dx:any[],gx:any[]){
    const dxAux=[...dx];
    for(let i=0;i<(gx.length-1);i++){
      dxAux.push(0)
    }
    return dxAux;
  }

  PolynomioToBinary(polynomio:string) {
    polynomio= polynomio.toUpperCase()
    const term = polynomio.split('+');
    let expresionRNumero:any = /\d+/;
    let exp:any[]=[];
    let binary:any[]=[];
    let indice!:any;

      term.forEach(element => {
         indice =element?.match(expresionRNumero);
          indice=parseInt(indice?.[0]);
          element.includes('X') && (indice ? exp.push(indice) : exp.push(1));
    });

    exp.sort((a:any, b:any)=>(b - a));

    let ultimo=exp[exp.length-1];

    exp.forEach((element, i) =>{
        let cantCeros=element- exp[i+1]
        if(element!==ultimo){
            if( cantCeros>1){
                binary.push(1);
                for(let j = 2; j <= cantCeros; j++){
                    binary.push(0);
                }
            }else {
                binary.push(1);
            }
        }else{
            if(element>1){
                binary.push(1);
                for(let k =2; k<=element; k++){
                    binary.push(0);
                }
            }else{
                binary.push(1);
            }
        }
    });

    let ultimobi:any = term[term.length-1]?.match(expresionRNumero)
    ultimobi= parseInt(ultimobi?.[0]);
    (ultimobi === 1) ? binary.push(1) : binary.push(0);
    return binary
}



}
