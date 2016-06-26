app.controller('mainCtrl', ["$scope", "dataService", "$filter", function ($scope, dataService, $filter) { 

    $scope.todos = [];

    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.endDate.setDate($scope.endDate.getDate() + 1);

    $scope.edited = function () {
        console.log("An input changed!")
    };

    $scope.btnVis = true;
    $scope.message = "You need to authorize access to Google Calendar API if you want to use my awesome web application.";    
    $('#memberModal').modal('show');

    $scope.showTodos = function(){

       // dataService.getTodos(function(response){
       //      $scope.todos = response.data;
       //  });     
       var events = dataService.getTodos();
           $scope.todos = [];

       if(!_.isEmpty(events)){
            if(!_.isEmpty($scope.todos)){
                _.map(dataService.getTodos(), function(item, index){
                    $scope.todos.unshift(item);
                });
            } else {
                $scope.todos = dataService.getTodos(); 
            }
       } else {
            $scope.btnVis = false;
            $scope.closeBtnVis = true;
            $scope.message = "You have no upcoming events!";    
            $('#memberModal').modal('show');
       }

        
    }

    $scope.getCalenderItems = function(){
       dataService.handleAuthClick();      
    }

    $scope.deleteTodo = function (todo) {

        _.map($scope.todos, function(item, index){
            if (item && item.name === todo.name){
                $scope.todos.splice(index, 1);
            };
        });

        //delete todo/event from google calender
        var paramsList = {};
        paramsList.id = todo.id;
        dataService.deleteEvent(paramsList);

    }

    $scope.saveTodo = function (todo) {
        //edit todo/event from google calender
        dataService.editEvent(todo);
    }

    $scope.newTask = '';

    $scope.addTodo = function () {

        var todo = {}
        todo.name = $scope.newTask;
        todo.startDate = $scope.startDate;
        todo.endDate = $scope.endDate;

        if(!_.isEmpty($scope.todos)){
            $scope.todos.unshift(todo);
        } else {
            $scope.todos.push(todo);
        }
        
        $scope.newTask = '';

        // format date for google calender api
        todo.startDate = $filter('date')(todo.startDate, "yyyy-MM-ddTHH:mm:ssZ", "CDT"); 
        todo.endDate = $filter('date')(todo.endDate, "yyyy-MM-ddTHH:mm:ssZ", "CDT"); 
        
        //insert todo/event into google calender
        dataService.insertEvent(todo);

        //show all udpates modal
        $scope.btnVis = false;
        $scope.closeBtnVis = false;
        $scope.showAllBtnVis = true;
        $scope.message = "Event Added";    
        $('#memberModal').modal('show');
    }
}]);

