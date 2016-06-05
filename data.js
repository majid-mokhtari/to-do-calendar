'use strict';

var self = this;
self.data = [];

angular.module("todoListApp")
.service('dataService', function($http){

	// when using dependecy injection
	// this.getTodos = function(callBack){
	 //    	$http.get('/js/mock/todos.json')
	 //    	.then(callBack);
	 //    };

    this.getTodos = function(){
    	return self.data;
 	}

	this.deleteTodo = function(todo){
		console.log("deleted " + todo.name);
	}

	this.saveTodo = function(todo){
		console.log("saved " + todo.name);
	}

/*
==============================================
Google Calender API
==============================================
*/

// Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '757261987194-4hirf92sijd6l0l6ahlhvvi6bp6c6m1r.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        if (!authResult.error) {
          // Hide auth UI, then load client library.
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      this.handleAuthClick = function(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          var events = resp.items;

          if (events.length > 0) {
            for (var i = 0; i < events.length; i++) {

			  var item = {};
			  item.name = events[i].summary;
	    	  self.data.push(item);

              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
            }
          } else {
            //appendPre('No upcoming events found.');
          }

        });
      }

});


