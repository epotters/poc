import {animate, style, transition, trigger} from '@angular/animations';

// AnimationTransitionMetadata
export const Animations = {
  fadeIn: trigger('fadeIn', [
    transition(':enter', [
      style({
        opacity: 0
      }),
      animate('1s ease-in', style({
        opacity: 1
      }))
    ])
  ]),

  fadeOut: trigger('fadeOut', [
    transition(':leave', [
      style({
        opacity: 1
      }),
      animate('1s ease-out', style({
        opacity: 0
      }))
    ])
  ])

};
