import { Pipe, PipeTransform } from '@angular/core';
import katex from 'katex';

@Pipe({
  name: 'latex'
})
export class latexPipe implements PipeTransform {

  transform(value: string): string {
    return katex.renderToString(value, { throwOnError: false });
  }

}
