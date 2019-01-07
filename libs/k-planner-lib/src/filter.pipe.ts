import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items:any[] , searchText: string):any[]{
  

console.log(items )

if(!searchText) return items;
console.log(searchText)
if(!items) return [];

searchText = searchText.toLowerCase();
return items.filter( it  => {
  return it.Username.toLowerCase().includes(searchText) ;
});

}

  
  }
   

