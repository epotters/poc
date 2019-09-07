import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {EntityMeta, SelectOption} from "../../";


export class FilterConfig {
  type: 'none' | 'text' | 'select' | 'date' = "none";
  options?: SelectOption[];
}


@Component({
  selector: 'filter-row',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.css']
})
export class FilterRowComponent<T extends Identifiable> implements OnInit, AfterViewInit {

  @Input() meta: EntityMeta<T>;
  @Output() readonly filterChange: EventEmitter<any> = new EventEmitter<any>();

  debounceTime: number = 300;
  keySuffix: string = 'Filter';

  debouncer: Subject<string> = new Subject<string>();
  rowFilterForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder
  ) {
    console.debug('Constructing FilterRowComponent');
  }


  ngOnInit() {
    this.rowFilterForm = this.buildFormGroup();
    this.debouncer.pipe(debounceTime(this.debounceTime))
      .subscribe((val) => this.filterChange.emit(this.rowFilterForm.getRawValue()));
    this.onChanges();
  }


  ngAfterViewInit(): void {
    console.debug('AfterViewInit FilterRowComponent');
  }


  public clearFilter() {
    this.rowFilterForm.reset();
  }


  onChanges(): void {
    this.rowFilterForm.valueChanges.subscribe(entityFilter => {
      console.debug('onChanges');
      console.debug(entityFilter);
      this.debouncer.next(entityFilter);
    });
  }



  private buildFormGroup(): FormGroup {
    let group = {};
    for (let key in this.meta.filteredColumns) {
      let filterConfig = this.meta.filteredColumns[key];
      group[key + this.keySuffix] = new FormControl('');
    }
    return this.formBuilder.group(group);
  }


}
