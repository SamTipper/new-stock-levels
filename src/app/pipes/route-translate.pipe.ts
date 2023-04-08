import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'routeTranslate'
})
export class RouteTranslatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value){
      const newString = value.substr(1, value.length - 1);
      const cappedString = newString.charAt(0).toUpperCase() + newString.slice(1);
      return cappedString;
    }
    return null;
  }

}
