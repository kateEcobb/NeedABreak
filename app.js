var map;
var directionsDisplay;
var directionsService; 
var stepDisplay; 
var infowindow = new google.maps.InfoWindow();


var initialize = function(){
  //instantiate directions
  var directionsService = new google.maps.DirectionsService();
  
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
    radius: 500,
    keyword: 'dessert'
  }

var placesArray = [];
var places = new google.maps.places.PlacesService(map);
  
performSearch(sweetTreats, places);

}; //end of initialize


var calcRoute = function(){ 
  placesArray.forEach(function(place){ 
    place.setMap(null);
  });

  var HR = '944 market street, san francisco, california'; 
  //get waypoints from search query


  var request = { 
    origin: blah

  }

}

var performSearch = function(y, x){ 
  x.nearbySearch(y, function(results, status){ 
    if(status !== google.maps.places.PlacesServiceStatus.OK){ 
      alert(status);
      return;
    }
    for (var i=0; i<results.length; i++){ 
      createMarker(results[i])
    }
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


google.maps.event.addDomListener(window, 'load', initialize);