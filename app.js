var app; 

$(function(){ 
  app = {

     map: null,
     oneSweetTreat: null,
     directionsDisplay:null,
     directionsService: null,
     infowindow: new google.maps.InfoWindow(),
     HR: null, 

     placesArray: [],

    initialize: function(){
      //instantiate directions
      app.directionsService = new google.maps.DirectionsService();
      
      //create a map centered on HR
      app.HR = new google.maps.LatLng(37.783910, -122.408978);
      var mapOptions = {
        center: app.HR,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      app.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      
      //direction renderer
      var rendererOpts = { 
        map: app.map 
      }
      app.directionsDisplay = new google.maps.DirectionsRenderer(rendererOpts); 
      app.finder()
      //listeners
      $('#newST').on('click', app.finder);

    }, 

    finder: function(){ 
      var sweetTreats = { 
        location: app.HR, 
        radius: 10000,
        openNow: true,
        keyword: 'dessert'
      }

      var places = new google.maps.places.PlacesService(app.map);
      app.performSearch(sweetTreats, places, function(){ 
        app.calcRoute();
        app.handleInfo();
        console.log(app.oneSweetTreat)
      });
    },

    handleInfo: function(){ 
      $('#desc').html('<p>'+ app.oneSweetTreat.name + '</p>' + '<p>'+ app.oneSweetTreat.vicinity + '</p>' + '<p> Rating: ' +app.oneSweetTreat.rating + '/5 </p>' )

    },

    calcRoute: function(){ 
      for (var i=0; i<app.placesArray.length; i++){ 
        app.placesArray[i].setMap(null);
      }
      //waypoints will be stored as an array of objects -- location and stopover(optional)

      var start = 'Hack Reactor, 944 market st, San Francisco, California'; 
      var end = app.oneSweetTreat.geometry.location;

      var request = { 
        origin: start, 
        destination: end, 
        travelMode: google.maps.TravelMode.WALKING
      }

      app.directionsService.route(request, function(response, status){ 
        if(status == google.maps.DirectionsStatus.OK){ 
          app.directionsDisplay.setDirections(response); 
        }
      });
    },

    performSearch: function(y, x, callback){ 
      x.nearbySearch(y, function(results, status){ 
        if(status !== google.maps.places.PlacesServiceStatus.OK){ 
          alert(status);
          return;
        }
        app.oneSweetTreat = results[Math.floor(Math.random()*results.length)]
        callback(app.oneSweetTreat)
      });
    },

    createMarker: function(place){ 
      var placeLoc = place.geometry.location; 
      var marker = new google.maps.Marker({ 
        map: map, 
        position: place.geometry.location
      })

      google.maps.event.addListener(marker, 'click', function(){ 
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    },
  
  };
}());








