var app; 
$(function(){ 
  app = {

     map: null,
     oneSweetTreat: null,
     directionsDisplay:null,
     directionsService: null,
     infowindow: new google.maps.InfoWindow(),
     HR: null, 
     onePOPO: null,
     places: null,

     placesArray: [],

     icons: { 
      cone: { 
        url: 'ST.png', 
        origin: new google.maps.Point(0,0), 
        anchor: new google.maps.Point(22,32)
      },
      park: {
        url: 'tree.png', 
        size: new google.maps.Size(44,32), 
        origin: new google.maps.Point(0,0), 
        anchor: new google.maps.Point(22,32)
      }, 
      hackReactor: {
        url: 'logo.png', 
        size: new google.maps.Size(44,32), 
        origin: new google.maps.Point(0,0), 
        anchor: new google.maps.Point(22,32)
      }
     },

     styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],

    initialize: function(){
      //instantiate directions
      app.directionsService = new google.maps.DirectionsService();
      
      //create a map centered on HR
      app.HR = new google.maps.LatLng(37.783910, -122.408978);
      var mapOptions = {
        center: app.HR,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: app.styles
      }
      app.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      
      //direction renderer
      var rendererOpts = { 
        map: app.map,
        suppressMarkers: true
      }

      app.directionsDisplay = new google.maps.DirectionsRenderer(rendererOpts); 
      app.finder()
      //listeners
      $('#newST').on('click', app.finder);
      setInterval(function() {
        var red   = Math.floor(Math.random() * 256);
        var green = Math.floor(Math.random() * 256);
        var blue  = Math.floor(Math.random() * 256);
        $('#newST').css('background-color', 'rgb(' + red + ',' + green + ',' + blue + ')');
      },1000);

    }, 

    finder: function(){ 
      var sweetTreats = { 
        location: app.HR, 
        radius: 750,
        openNow: true,
        keyword: 'dessert'
      }
    
      app.places = new google.maps.places.PlacesService(app.map);
      app.performSearch(sweetTreats, app.places, function(){ 
           var parks = { 
              location: app.oneSweetTreat.geometry.location, 
              radius: 750,
              types: ['park'] 
           }

        app.performParkSearch(parks, app.places, function(){ 
          app.calcRoute();
          app.handleInfo();
        });
      });
    },

    handleInfo: function(){ 
      $('#desc').html('<p>'+ app.oneSweetTreat.name + '</p>' + '<p>'+ app.oneSweetTreat.vicinity + '</p>' + '<p> Rating: ' +app.oneSweetTreat.rating + '/5 </p>' );
      $('#POPOS').html('<p>'+ app.onePOPO.name + '</p>' + '<p>'+ app.onePOPO.vicinity + '</p>');
    },

    calcRoute: function(){ 
      for (var i=0; i<app.placesArray.length; i++){ 
        app.placesArray[i].setMap(null);
     }

      var start = 'Hack Reactor, 944 market st, San Francisco, California'; 
      var waypoint = [{location: app.oneSweetTreat.geometry.location}]
      var end = app.onePOPO.geometry.location;
    
      var request = { 
        origin: start, 
        waypoints: waypoint,
        destination: end, 
        travelMode: google.maps.TravelMode.WALKING
      }

      app.directionsService.route(request, function(response, status){ 
        if(status == google.maps.DirectionsStatus.OK){ 
          app.directionsDisplay.setDirections(response); 
          var leg = response.routes[0].legs;
          app.createMarker(leg[0].start_location, app.icons.hackReactor);
          app.createMarker(leg[0].end_location, app.icons.cone);
          app.createMarker(leg[1].end_location, app.icons.park);
        }
      });
    },

    performParkSearch: function(y,x,callback){ 
      x.nearbySearch(y, function(results, status){ 
        if(status !== google.maps.places.PlacesServiceStatus.OK){ 
          alert(status);
          return;
        }
        app.onePOPO = results[Math.floor(Math.random()*results.length)]
        callback(app.onePOPO)
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

    createMarker: function(place, icon){ 
      var marker = new google.maps.Marker({ 
        map: app.map, 
        position: place, 
        icon: icon
      })
    }
  
  };
}());