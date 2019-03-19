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
		path: 'person',
		outlet: 'person'
	},
	{
		path: 'about',
		outlet: 'about'
	},
	{
		path: 'profile',
		outlet: 'profile'
	},
	{
		path: 'login',
		outlet: 'login'
	}
];


export interface PersonProperties {
	firstName?: string;
	lastName?: string;
};
