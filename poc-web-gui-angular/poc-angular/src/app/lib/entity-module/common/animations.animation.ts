import {animate, keyframes, style, transition, trigger} from "@angular/animations";

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
  'slideTo',
  [
    transition(
      "* => *",
      animate('{{ duration }}', style({transform: 'translateY({{y}}px)'})),
      {params: {duration: '1s', y: 0}}
    )

  ]
);


export const leavingTowardsTop =
  trigger('leavingTowardsTop', [
    transition(':leave', [
      style({position: 'relative'}),
      animate("250ms ease-in", keyframes([
        style({top: 0}),
        style({top: "{{topPixels}}"})
      ]))
    ], {params: {topPixels: "-3000px"}})
  ])
