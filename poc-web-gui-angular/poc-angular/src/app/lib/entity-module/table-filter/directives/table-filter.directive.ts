import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {IFilter} from "../../domain/filter.model";



@Directive({
  selector: '[appTableFilter]'
})
export class TableFilterDirective {

  filters = new Map<string, IFilter>();

  filterJson = "{}";

  @Input() appTableFilterOf: any[];

  @Output('matSortChange') readonly filterChange: EventEmitter<string> = new EventEmitter<string>();

  debouncer: Subject<string> = new Subject<string>();

  constructor() {
    this.debouncer.pipe(debounceTime(200))
      .subscribe((val) => this.filterChange.emit(this.filterJson));
  }

  public register(filter: IFilter) {
    this.filters.set(filter.id, filter);
  }

  public deregister(filter: IFilter): void {
    this.filters.delete(filter.id);
  }

  public filter(filter: IFilter): void {
    let filterArray = {};
    this.filters.forEach((f: IFilter, key: string) => {
      if (f.filterData != '') {
        filterArray[f.id] = f.filterData;
      }
    });
    this.filterJson = JSON.stringify(filterArray);
    this.debouncer.next(this.filterJson);

    console.log(this.filterJson);
  }

}
