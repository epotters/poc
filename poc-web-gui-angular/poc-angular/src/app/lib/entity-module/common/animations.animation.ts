import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";

export const grow = trigger(
  "grow",
  [
    transition(
      "* => *",
      animate('{{ duration }}', style({height: '{{ height }}', width: "{{width}}"})),
      {params: {duration: "1s", y: 0}}
    ),
  ]
);


export const slideTo = trigger(
  'slideTo', [
    state('invisible', style({transform: 'translateY(0)', height: '0', minHeight: '0', visibility: 'hidden'})),
    state('*', style({transform: 'translateY(*)', height: '31', minHeight: '31', visibility: 'visible'})),

    transition("invisible => *", animate('200ms')),
    transition("* => *",
      animate('{{ duration }}', style({transform: 'translateY({{y}}px)'})),
      {params: {duration: '1s', y: 0}}
    ),
    transition("* => invisible", animate('200ms'))
  ]
);


export const detailExpand = [
  trigger('detailExpand', [
    state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
    state('*', style({height: '*', visibility: 'visible'})),
    transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
];


export const leavingTowardsTop =
  trigger('leavingTowardsTop', [
    transition(':leave', [
      style({position: 'relative'}),
      animate("250ms ease-in", keyframes([
        style({top: 0}),
        style({top: "{{topPixels}}"})
      ]))
    ], {params: {topPixels: "-3000px"}})
  ]);
