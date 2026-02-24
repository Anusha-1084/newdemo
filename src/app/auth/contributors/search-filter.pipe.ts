import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.designation.toLowerCase().includes(searchTerm) ||
      item.role.toLowerCase().includes(searchTerm)
    );
  }
}
