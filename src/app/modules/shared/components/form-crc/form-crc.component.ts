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

    //  Ejemplo
    // dividendo=[1,1,0,1]
    // divisor=  [1,0,0,1]
    // resta=    [0,1,0,0]
     dividendo.forEach((element, i) => (element===divisor[i])? resta.push(0):resta.push(1));
     (dividendo[0]===0)?cociente.push(0):cociente.push(1);
    switch(resta[0]){
      case 0:
        resta.shift(); // Se elimina el primer elemento
        resta.push(DxAux[cont]); // Se baja el siguiente binario de Dx y se le agrega a la ultima pocision de resta
        residuo.push(resta); //Se almacenan todos los residuos
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
    //Para quitarle el tamaño a DX
    (cont===(Gx.length)) ? Dx=DxAux.slice(cont, DxAux.length) : Dx=DxAux.slice(cont, DxAux.length);
     cont++;
    }
    return {
      //Organizar el reciduo
      residuo:[...residuo.slice(0,residuo.length-1), residuo[residuo.length-1].slice(0,residuo[residuo.length-1].length-1)],
      cociente,
      divisorAux
     };
  }
//Agregar r al Dx es decir la cantidad de ceros
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
    let expresionRNumero:any = /\d+/; //Expresion regular para buscar numeros en una cadena de string
    let exp:any[]=[]; //Array para almacenar los exponentes del polinomio
    let binary:any[]=[]; //Array para almacenar el binario resultante
    let indice!:any;

      term.forEach(element => {
         indice =element?.match(expresionRNumero); //Buscar si el elemento contiene un numero
          indice=parseInt(indice?.[0]); //Si lo contiene lo convierto a entero
          element.includes('X') && (indice ? exp.push(indice) : exp.push(1));
    });

    exp.sort((a:any, b:any)=>(b - a)); //Ordenar de mayor a menor los exponentes

    let ultimo=exp[exp.length-1];

    exp.forEach((element, i) =>{
      // ejemplo exp=[5,3], la diferencia es 2 pero al principio se manda 1 al binary y entre ellos se debe mandar un 0 luego un 1
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

    // Si se ingresa X^2+x se envia 0 al final del array binary, pero si se ingresa x^2+x+1 se envia 1 al final del array binary,
    let ultimobi:any = term[term.length-1]?.match(expresionRNumero)
    ultimobi= parseInt(ultimobi?.[0]);
    (ultimobi === 1) ? binary.push(1) : binary.push(0);
    return binary
}



}
