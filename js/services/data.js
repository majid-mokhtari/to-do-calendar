'use strict';

var self = this;
self.data = [];

angular.module("todoListApp")
.service('dataService', function($http){

	// using dependecy injection when 
	// this.getTodos = function(callBack){
	 //    	$http.get('/js/mock/todos.json')
	 //    	.then(callBack);
	 //    };

  this.getTodos = function(){
    	return self.data;
 	}

  //edit todo/event from google calender
  this.editEvent = function(todo){

    var request = gapi.client.calendar.events.get({
      'calendarId': 'primary',
      'eventId': todo.id
    });

    request.execute(function(resp){
      var event = resp;
      event.summary = todo.name;
      var request = gapi.client.calendar.events.update({
        'calendarId': 'primary',
        'resource': event,
        'eventId': todo.id
      });

      request.execute(function(event) {
        appendPre('Event created: ' + event.htmlLink);
        listUpcomingEvents()
      });
    });
  }

  //delete todo/event from google calender
  this.deleteEvent = function(params){

    var request = gapi.client.calendar.events.delete({
      'calendarId': 'primary',
      'eventId': params.id
    });

    request.execute(function(event) {
      appendPre('Event created: ' + event.htmlLink);
    });
  }


  //insert event into google calender
  this.insertEvent = function(todo) {
    var event = {
      'summary': todo.name,
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': todo.startDate,
          'timeZone': 'America/Chicago'
        },
        'end': {
          'dateTime': todo.endDate,
          'timeZone': 'America/Chicago'
        },
        'attendees': [
          {'email': 'lpage@example.com'},
          {'email': 'sbrin@example.com'}
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
          ]
        }
    }

    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });

    request.execute(function(event) {
      appendPre('Event created: ' + event.htmlLink);
      listUpcomingEvents()
    });
  }
  
/*
==============================================
Google Calender API
==============================================
*/
      // local
      var CLIENT_ID = '757261987194-pb9bah2jgvkbrqncs2p4htls222cq1c9.apps.googleusercontent.com';

      // prod
      //var CLIENT_ID = '757261987194-lvfdj8e5qv9o2i7htrgmm8pqp5n71s3u.apps.googleusercontent.com'

      var SCOPES = ["https://www.googleapis.com/auth/calendar"];

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
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
            loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      this.handleAuthClick = function() {
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
              self.data = [];

          if (events.length > 0) {
              for (var i = 0; i < events.length; i++) {
          		var item = {};
          		item.name = events[i].summary;
          		item.startDate = events[i].start.dateTime;
              item.endDate = events[i].end.dateTime;
              item.id = events[i].id;
            	self.data.push(item);
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }

      function appendPre(message) {
        // when there is no to do items
      }
});


