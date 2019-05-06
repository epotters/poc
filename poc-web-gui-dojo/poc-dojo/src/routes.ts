export default [
  {
    path: 'home',
    outlet: 'home',
    defaultRoute: true
  },
  {
    path: 'people',
    outlet: 'people'
  },
  {
    path: 'person/{personId}',
    outlet: 'person'
  },
  {
    path: 'about',
    outlet: 'about'
  },
  {
    path: 'login',
    outlet: 'login'
  },
  {
    path: 'currentUser',
    outlet: 'currentUser'
  }
];
