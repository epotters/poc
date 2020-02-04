import {ChangeDetectionStrategy, Component, forwardRef, Input, ViewEncapsulation} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

import {EntitySelectorBase} from './entity-selector-base';


@Component({
  selector: 'entity-selector',
  templateUrl: './entity-selector.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EntitySelectorComponent),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitySelectorComponent<T> extends EntitySelectorBase<T> {
  @Input() debounceTime = 100;
  @Input() emptyText = '';
  @Input() autoActiveFirstOption = false;
}
