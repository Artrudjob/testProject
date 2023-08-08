export const serversModule = angular.module('servers',[])
.component('serversList', {
    templateUrl: '/partials/servers/list',
    controller:[
        'Server',
        'Task',
        'NotificationService',
        function(Server, Task, NotificationService){
            this.servers = Server.query();
            this.addTasks = function(){
                if(confirm('Вы хотите добавить задания?')){
                    Task.addRandom(function(){
                        NotificationService.showSuccess('Задания добавленны')
                    });
                }
            }
    }]
}).component('serversEdit', {
    templateUrl: '/partials/servers/edit',
    controller:[
        'Server',
        '$stateParams',
        '$state',
        'NotificationService',
        'Group',
        function(Server, $stateParams, $state, NotificationService, Group){
            if($stateParams.id){
                this.server = Server.get({id:$stateParams.id});
            }else{
                this.server = new Server();
            }
            this.groups = Group.getAllGroups({});
            console.log(this.groups)
            this.save = function(){
                this.server.$save(function(){
                    NotificationService.showSuccess('Сервер сохранен')
                    $state.go('servers',{},{reload: true});
                })
            }
            
    }]
}).component('serversView', {
    templateUrl: '/partials/servers/view',
    controller:[
        'Server',
        '$stateParams',
        'NotificationService',
        'Charts',
        function(Server, $stateParams, NotificationService, Charts){
            this.server = Server.get({id: $stateParams.id});
            this.charts = Charts.serverCharts({serverId: $stateParams.id});
            this.start = function(){
                if(confirm('Вы хотите запустить сервер?')){
                    this.server.$start(function(){
                        NotificationService.showSuccess('Сервер запущен')
                    })
                }
            }
            this.stop = function(){
                if(confirm('Вы хотите остановить сервер?')){
                    this.server.$stop(function(){
                        NotificationService.showSuccess('Сервер остановлен')
                    })
                }
            }
            this.restart = function(){
              this.server.$restart(function(){
                NotificationService.showSuccess('Сервер перезапущен')
              })
            }
    }]
}).component('serversAddGroup', {
  templateUrl: '/partials/servers/addGroup',
  controller:[
      '$state',
      'NotificationService',
      'Group',
      function($state, NotificationService, Group){
        this.group = {
          name: ''
        };
    
        this.addGroup = function() {
          this.groups = Group.addGroup({ name: this.group.name });
          NotificationService.showSuccess('Создана новая группа');
          $state.go('servers',{},{reload: true});
        };
      }]
}).component('serversEditGroup', {
  templateUrl: '/partials/servers/editGroup',
  controller:[
    'Group',
    '$stateParams',
    'NotificationService',
    '$state',
    function(Group, $stateParams, NotificationService, $state) {
      this.groupId = $stateParams.groupId;
      this.group = Group.getGroup({ id: this.groupId });

      this.start = function(){
        if(confirm('Вы хотите запустить сервер?')){
            this.server.$start(function(){
                NotificationService.showSuccess('Сервер запущен')
            })
        }
    }
      this.updateGroup = function() {
        Group.updateGroup( { id: $stateParams.groupId, name: this.group.name });
        NotificationService.showSuccess('Группа успешна обновленна');
        $state.go('servers',{},{reload: true});
      }
      this.deleteGroup = function() {
        Group.deleteGroup({ id: $stateParams.groupId })
        NotificationService.showSuccess('Группа удаленна');
        $state.go('servers',{},{reload: true});
      }
    }
  ]
}).directive('serverGroupTable', [
  '$compile', 'dataTableLanguage', '$state', function($compile, dataTableLanguage, $state) {
    return {
      restrict: 'A',
      scope: {
        'onDraw': '&',
        'filter': '<',
        'serverId': '<',
      },
      link: function(scope, element) {
        const dt = element.DataTable({
          ordering: false,
          searching: true,
          processing: true,
          serverSide: true,
          language: dataTableLanguage,
          ajax: {
            url: '/groups/',
          },
          columns: [
            { data: 'date' },
            { data: 'name' },
          ],
          order: [[0, 'desc']],
              createdRow: function(row, data) {
              const localScope = scope.$new(true);
              localScope.data = data;
              $compile(angular.element(row).contents())(localScope);
            },
          });
          dt.on('click', 'tbody tr', function () {
            let data = dt.row(this).data();
            $state.go('servers.editGroup', { groupId: data._id });
        });
          dt.columns().every(function() {
            const that = this;
            $('input', this.header()).on('change', function() {
              if (that.search() !== $(this).val()) {
                that.search($(this).val(), false, false).draw();
              }
            });
            $('select', this.header()).on('change', function() {
              if (that.search() !== $(this).val()) {
                that.search($(this).val()).draw();
              }
            });
          });
          dt.on('draw', function() {
            scope.onDraw({params: dt.ajax.params()});
          });
        },
      };
    }]).directive('serverUserActionTable', [
      '$compile', 'dataTableLanguage', function($compile, dataTableLanguage) {
        return {
          restrict: 'A',
          scope: {
            'onDraw': '&',
            'filter': '<',
            'serverId': '<',
          },
          link: function(scope, element) {
            const dt = element.DataTable({ // eslint-disable-line new-cap
              ordering: false,
              searching: true,
              processing: true,
              serverSide: true,
              language: dataTableLanguage,
              ajax: '/journals/user-actions/' + scope.serverId,
              columns: [
                {
                  data: 'date',
                },
                {
                  data: 'user',
                },
                {
                  data: 'action',
                },
              ],
              order: [[0, 'desc']],
              createdRow: function(row, data) {
                const localScope = scope.$new(true);
                localScope.data = data;
                $compile(angular.element(row).contents())(localScope);
              },
            });
            dt.columns().every(function() {
              const that = this;
              $('input', this.header()).on('change', function() {
                if (that.search() !== $(this).val()) {
                  that.search($(this).val(), false, false).draw();
                }
              });
              $('select', this.header()).on('change', function() {
                if (that.search() !== $(this).val()) {
                  that.search($(this).val()).draw();
                }
              });
            });
            dt.on('draw', function() {
              scope.onDraw({params: dt.ajax.params()});
            });
          },
        };
      }]).directive('serverTasksTable', [
      '$compile', 'dataTableLanguage', function($compile, dataTableLanguage) {
        return {
          restrict: 'A',
          scope: {
            'onDraw': '&',
            'filter': '<',
            'serverId': '<',
          },
          link: function(scope, element) {
            const dt = element.DataTable({ // eslint-disable-line new-cap
              ordering: false,
              searching: true,
              processing: true,
              serverSide: true,
              language: dataTableLanguage,
              ajax: '/tasks/list/' + scope.serverId,
              columns: [
                {
                  data: 'date',
                },
                {
                  data: 'name',
                },
                {
                  data: 'completeDuration',
                },
                {
                  data: 'isComplete',
                  render:function(row,data,full){
                    return full.isComplete? 'Да': 'Нет';
                  },
                },
              ],
              order: [[0, 'desc']],
              createdRow: function(row, data) {
                const localScope = scope.$new(true);
                localScope.data = data;
                $compile(angular.element(row).contents())(localScope);
              },
            });
            dt.columns().every(function() {
              const that = this;
              $('input', this.header()).on('change', function() {
                if (that.search() !== $(this).val()) {
                  that.search($(this).val(), false, false).draw();
                }
              });
              $('select', this.header()).on('change', function() {
                if (that.search() !== $(this).val()) {
                  that.search($(this).val()).draw();
                }
              });
            });
            dt.on('draw', function() {
              scope.onDraw({params: dt.ajax.params()});
            });
          },
        };
      }])
      .component('tasksChart', {
        templateUrl: '/partials/servers/default-chart',
        bindings: {
          report: '<',
        },
        controller: [
          function() {
            this.$onInit = function() {
              this.chartParams = {
                type: 'bar',
                data: {
                  datasets: [
                    {
                      label: 'Выполненные',
                      data: this.report.complete,
                      backgroundColor: this.report.complete.map(function() {
                        return '#0000ff';
                      }),
                    },
                    {
                      label: 'Невыполненные',
                      data: this.report.notComplete,
                      backgroundColor: this.report.notComplete.map(function() {
                        return '#ff0000';
                      }),
                    },
                  ],
  
                  labels: this.report.labels,
                },
                options: {
                  responsive: true,
                  legend: {
                    display: false,
                    position: 'left',
                  },
                  scales: {
                    x: {
                      stacked: false,
                      beginAtZero: true,
                    },
                    y: {
                      stacked: false,
                      min: 0,
                    },
                  },
                },
  
              };
            };
          }],
      });