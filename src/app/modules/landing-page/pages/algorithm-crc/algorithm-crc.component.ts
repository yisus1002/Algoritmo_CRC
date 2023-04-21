import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-algorithm-crc',
  templateUrl: './algorithm-crc.component.html',
  styleUrls: ['./algorithm-crc.component.scss']
})
export class AlgorithmCrcComponent implements OnInit {

   polynomio:string = 'x^5 + x^3 + x^2 + x ';

   expresionRNumero:any = /\d+/;
   exp:any[]=[];
   binary:any[]=[];
  indice!:any;
  constructor(){

console.log(this.polynomio);

this.PolynomioToBinary(this.polynomio)
  }


  ngOnInit(): void {
  }

   PolynomioToBinary(polynomio:string) {
    const term = polynomio.split('+');
    // let


    term.forEach(element => {
         this.indice =element?.match(this.expresionRNumero);
        this.indice=parseInt(this.indice?.[0]);
        if((element.includes('x') || element.includes('X'))){
            if(this.indice){
                this.exp.push(this.indice);
            }else{
                this.exp.push(1);
            }
        }
    });
    this.exp.sort((a:any, b:any)=> {
        return b - a;
      });

    let ultimo=this.exp[this.exp.length-1];

    this.exp.forEach((element, i) =>{
        let cantCeros=element- this.exp[i+1]
        if(element!==ultimo){
            if( cantCeros>1){
                this.binary.push(1);
                for(let j = 2; j <= cantCeros; j++){
                    this.binary.push(0);
                }
            }else {
                this.binary.push(1);
            }
        }else{
            if(element>1){
                this.binary.push(1);
                for(let k =2; k<=element; k++){
                    console.log(k, i);
                    this.binary.push(0);
                }
            }else{
                this.binary.push(1);
            }
        }
    });

    let ultimobi:any = term[term.length-1]?.match(this.expresionRNumero)
    ultimobi= parseInt(ultimobi?.[0]);
    if(ultimobi===1){
        this.binary.push(1);
    }else{
        this.binary.push(0);
    }

console.log(this.binary);
}


}
