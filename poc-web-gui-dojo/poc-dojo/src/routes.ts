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
    path: 'new-person',
    outlet: 'new-person'
  },
  {
    path: 'organizations',
    outlet: 'organizations'
  },
  {
    path: 'organizations/{personId}',
    outlet: 'organization'
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
