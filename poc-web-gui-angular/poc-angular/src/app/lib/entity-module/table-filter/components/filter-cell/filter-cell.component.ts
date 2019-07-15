import {Component, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {TableFilterDirective} from '../../directives/table-filter.directive';
import {SelectOption} from "../../..";

export class FilterConfig {
  type: 'none' | 'text' | 'select' | 'date' = "none";
  options?: SelectOption[];
}

@Component({
  selector: 'filter-cell',
  templateUrl: './filter-cell.component.html',
  styleUrls: ['./filter-cell.component.css']
})
export class FilterCellComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() filterConfig: FilterConfig;

  filterData = "";

  constructor(@Optional() public filter: TableFilterDirective) {
    console.debug('Constructing FilterCellComponent');
  }

  ngOnInit() {
    if (!this.filter) {
      throw "Filter directive not found!"
    } else {
      this.filter.register(this);
    }
  }

  ngOnDestroy() {
    this.filter.deregister(this);
  }

  
  onTextChange(value: string) {
    console.debug('Text for filter "' + this.id + '" changed to "' + value + '"');
    this.filterData = value;
    this.filter.filter(this);
  }

}
