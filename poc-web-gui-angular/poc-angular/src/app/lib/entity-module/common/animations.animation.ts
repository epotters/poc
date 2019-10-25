import {animate, state, style, transition, trigger} from "@angular/animations";


export const EntityAnimations = {
  slideTo: trigger(
    'slideTo', [
      state('invisible', style({transform: 'translateY(0)', visibility: 'hidden'})),
      state('*', style({transform: '*', visibility: 'visible'})),

      transition("invisible => *", animate('200ms')),
      transition("* => *",
        animate('{{ duration }}', style({transform: 'translateY({{y}}px)'})),
        {params: {duration: '1s', y: 0}}
      ),
      transition("* => invisible", animate('200ms'))
    ]
  )
};

