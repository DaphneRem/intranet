import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
  name: 'filter'
  
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items:any , searchText: string){
    let item= [];
// if(!searchText) return items.dataSource;

// if(!items.dataSource) return [];

// searchText = searchText.toLowerCase();


// items.dataSource.forEach( it => {
 
// if(it.Username.toLowerCase().includes(searchText)==true){
//   console.log(it.Username)
//   item.push(it)
//   console.log(item)


// }
// return item 
  
// });

}

  
  }
   

