import {animate, style, transition, trigger} from '@angular/animations';

// AnimationTransitionMetadata
export const PocAnimations = {
  fadeInOut: trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('1s ease-in', style({opacity: 1}
      ))
    ]),
    transition(':leave', [
      animate('1s ease-out', style({opacity: 0}
      ))
    ])
  ]),

  slideInOut: trigger('slideInOut', [
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('300ms ease-in', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({transform: 'translateX(100%)'}))
    ])
  ])

};
