import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items:any , searchText: string):object[]{
  

console.log(items)
console.log(searchText)

  
    return items.filter( (it:any) => {
      return it.toLowerCase().includes(searchText) as object[] ;
    
    });
  }
   
}
