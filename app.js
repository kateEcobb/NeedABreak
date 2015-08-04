var map;
var oneSweetTreat;
var directionsDisplay;
var directionsService; 
var stepDisplay; 
var infowindow = new google.maps.InfoWindow();

var placesArray = [];

var app = angular.module('sweetTreat', []);

app.controller('mapCtrl', function($scope){ 
  $scope.map = new google.maps.LatLng(37.783910, -122.408978);

})





var initialize = function(){
  
  //instantiate directions
  directionsService = new google.maps.DirectionsService();
  
  //create a map centered on HR
  var HR = new google.maps.LatLng(37.783910, -122.408978);
  var mapOptions = {
    center: HR,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  //direction renderer
  var rendererOpts = { 
    map: map 
  }
  
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOpts); 
  //info window for specific directions TODO

  var sweetTreats = { 
    location: HR, 
    radius: 60000,
    openNow: true,
    keyword: 'dessert'
  }
  stepDisplay = new google.maps.InfoWindow();

var places = new google.maps.places.PlacesService(map);
performSearch(sweetTreats, places, function(){ 
  console.log(oneSweetTreat)
  calcRoute();
  this.trigger()
});

}; //end of initialize

var calcRoute = function(){ 
  for (var i=0; i<placesArray.length; i++){ 
    placesArray[i].setMap(null);
  }
  //waypoints will be stored as an array of objects -- location and stopover(optional)

  var start = 'Hack Reactor, San Francisco, California'; 
  var end = oneSweetTreat.geometry.location;

  var request = { 
    origin: start, 
    destination: end, 
    travelMode: google.maps.TravelMode.WALKING
  }

  directionsService.route(request, function(response, status){ 
    if(status == google.maps.DirectionsStatus.OK){ 
      directionsDisplay.setDirections(response); 
    }
  });
};

var performSearch = function(y, x, callback){ 
  x.nearbySearch(y, function(results, status){ 
    if(status !== google.maps.places.PlacesServiceStatus.OK){ 
      alert(status);
      return;
    }
    oneSweetTreat = results[Math.floor(Math.random()*results.length)]
    callback(oneSweetTreat)

    // createMarker(oneSweetTreat)
  });
};

var createMarker = function(place){ 
  var placeLoc = place.geometry.location; 
  var marker = new google.maps.Marker({ 
    map: map, 
    position: place.geometry.location
  })

  google.maps.event.addListener(marker, 'click', function(){ 
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
};

google.maps.event.addListener()


google.maps.event.addDomListener(window, 'load', initialize);