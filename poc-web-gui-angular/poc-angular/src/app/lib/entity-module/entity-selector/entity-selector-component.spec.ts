import {EntitySelectorComponent} from "./entity-selector.component";
import {Person} from "../../../core/domain";
import {TestBed} from "@angular/core/testing";
import {ElementRef, Injector} from "@angular/core";
import {FocusMonitor} from "@angular/cdk/a11y";
import {personMeta} from "../../../people/person-meta";
import {PersonService} from "../../../people/person.service";


describe('EntityComponent tests', () => {
  let entitySelector: EntitySelectorComponent<Person>;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [ElementRef, Injector, FocusMonitor, PersonService]});
  });

  it('Instantiate an EntitySelector', () => {

    const _elRef: ElementRef = TestBed.inject(ElementRef);
    const injector: Injector = TestBed.inject(Injector);
    const focusMonitor: FocusMonitor = TestBed.inject(FocusMonitor);

    const comp = new EntitySelectorComponent<Person>(_elRef, injector, focusMonitor);

    comp.meta = personMeta;
    comp.service = TestBed.inject(PersonService);

    const searchString: string = 'test';
    expect(comp.displayWith(searchString)).toBe(searchString);


  });
});

