import {animate, state, style, transition, trigger} from '@angular/animations';


export const EntityAnimations = {
  slideTo: trigger(
    'slideTo', [
      state('invisible', style({transform: 'translateY(0)', height: 0, opacity: 0})),
      state('*', style({transform: '*', height: '*', opacity: 1})),

      transition('invisible => *', animate('200ms ease-in', style({height: '*', opacity: 1}))),
      transition('* => *', animate('500ms')),
      transition('* => invisible', animate('200ms ease-out', style({height: 0, opacity: 0})))
    ]
  )
};

