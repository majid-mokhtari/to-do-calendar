app.controller('mainCtrl', ["$scope", "dataService", function ($scope, dataService) { 

    $scope.todos = [];

    $scope.edited = function () {
        console.log("An input changed!")
    };

    $('#memberModal').modal('show');

    $scope.showTodos = function(){

       // dataService.getTodos(function(response){
       //      $scope.todos = response.data;
       //  });     

        if(!_.isEmpty($scope.todos)){
            _.map(dataService.getTodos(), function(item, index){
                $scope.todos.unshift(item);
            });
        } else {
            $scope.todos = dataService.getTodos(); 
        }
    }

    $scope.getCalenderItems = function(){
       dataService.handleAuthClick();      
    }

    $scope.deleteTodo = function (todo) {
        dataService.deleteTodo(todo);

        _.map($scope.todos, function(item, index){
            if (item && item.name === todo.name){
                $scope.todos.splice(index, 1);
            }
        });
    }

    $scope.saveTodo = function (todo) {
        dataService.saveTodo(todo);
    }

    $scope.newTask = '';

    $scope.addTodo = function () {
        var todo = {}
        todo.name = $scope.newTask

        if(!_.isEmpty($scope.todos)){
            $scope.todos.unshift(todo);
        } else {
            $scope.todos.push(todo);
        }
        
        $scope.newTask = '';
    }
}]);

