stateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
export default function stateConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/servers');
  $stateProvider
      .state({
        name: 'servers',
        url: '/servers',
        component: 'serversList',
      })
      .state({
        name: 'servers.view',
        url: '/view/:id',
        component: 'serversView',
      })
      .state({
        name: 'servers.edit',
        url: '/edit/:id',
        component: 'serversEdit',
      })
      .state({
        name: 'servers.restart',
        url: '/restart/:id',
        component: 'serversRestart',
      })
      .state({
        name: 'servers.addGroup',
        url: '/addGroup',
        component: 'serversAddGroup',
      })
      .state({
        name: 'servers.editGroup',
        url: '/editGroup/:groupId',
        component: 'serversEditGroup',
      })
      .state({
        name: 'servers.create',
        url: '/create',
        component: 'serversEdit',
      })
      .state({
        name: 'journals',
        url: '/journals',
        component: 'journalsMain',
      })
      .state({
        name: 'charts',
        url: '/charts',
        component: 'chartsMain',
      })
}
