import {ComponentFactoryResolver} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ComponentLoader} from './component-loader';


beforeEach(() => {
  TestBed.configureTestingModule({
    declarations: [],
    providers: [ComponentFactoryResolver]
  }).compileComponents();
});


describe('Component loader tests', () => {
  let componentFactoryResolver: ComponentFactoryResolver;

  beforeEach(() => {
    componentFactoryResolver = TestBed.get(ComponentFactoryResolver);
  });


  it('should load an entity component', () => {

    const loader = new ComponentLoader(componentFactoryResolver);

  });

});
