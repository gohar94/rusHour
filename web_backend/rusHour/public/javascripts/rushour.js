// DONT CHANGE ANYTHING HERE
// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});



// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});
// TILL HERE

function getInfoWindowContent(heading, body) {
  var top = '<strong><h3 style="color: black;">' + heading + '</h3></strong>';
  var middle = '<p style="color: black;">' + body + '</p>';
  return top+middle;
}

// Google Maps Scripts
// When the window has finished loading create our google map below
var map;
var image = '/images/marker-green-light.png';
var markersArray = [];
var infoWindowsArray = [];

function initialize() {
  var mapOptions = {
    zoom: 14,
    scrollwheel: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DEFAULT,
      mapTypeIds: [
        google.maps.MapTypeId.ROADMAP,
        google.maps.MapTypeId.TERRAIN
      ]
    },
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    }
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  // load markers from database data
  loadMarkers();
  
  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      // LOADING MARKER AT OUR LOCATION
      var marker = new google.maps.Marker({
          position: pos,
          map: map,
          icon: image,
          title: 'My Current Location',
          id: "0"
      });
  
      // CONTENT OF THE INFOBOX
      var contentString = getInfoWindowContent("This is my location.", "I am here.");

      var infowindow = new google.maps.InfoWindow({ content: contentString });
      markersArray.push(marker);
      infoWindowsArray.push(infowindow);

      // LISTENER TO OPEN INFOBOX
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

// This will query for the services in DB and show on map
function loadMarkers() {
  $.ajax({
    type: "GET",
    cache: true,
    url: 'http://localhost:3000/services/all',
    dataType: 'json',
    
    success: function(data){
      jQuery.each(data , function() {
        if (this.latitude && this.longitude) {
          var markerPosition = new google.maps.LatLng(this.latitude, this.longitude);
          var marker = new google.maps.Marker({
            position: markerPosition,
            map: map,
            animation: google.maps.Animation.DROP,
            description: this.name + " = " + this.count,
            icon: image,
            id: this._id
          });

          markersArray.push(marker);

          // //hover in
          // google.maps.event.addListener(marker, 'mouseover', function() {
          //   marker.infobox.open(mainMap, marker);
          //   marker.infobox.isOpen = true;
          // });

          // // hover out
          // google.maps.event.addListener(marker, 'mouseout', function() {
          //   if (marker.infobox.isOpen) {
          //     marker.infobox.close();
          //     marker.infobox.isOpen = false;
          //   }
          // });
          
          var contentString = getInfoWindowContent(marker.description, marker.id);
          
          var infowindow = new google.maps.InfoWindow({ content: contentString });
          infoWindowsArray.push(infowindow);
          
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });
        
        }
      });
    }, 
    error: function(e) { 
      console.log(e);
    } 
  });
}

// BOOK KEEPING
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);

// SEARCH BOX autocomplete
$(function () {
  $("#searchBox").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "http://localhost:3000/services/search",
        type: "GET",
        data: request,  // request is the value of search input
        success: function (data) {
          // Map response values to field label and value
          response($.map(data, function (el) {
            return {
              label: (el.name + " (" + el.address + ", " + el.city + ")"),
              value: el._id
            };
          }));
        }
      });
    },
       
    // The minimum number of characters a user must type before a search is performed.
    minLength: 1, 

    // set an onFocus event to show the result on input field when result is focused
    focus: function (event, ui) { 
      this.value = ui.item.label; 
      // Prevent other event from not being execute
      event.preventDefault();
    },
    select: function (event, ui) {
      // Prevent value from being put in the input:
      this.value = ui.item.label;
      // Set the id to the next input hidden field
      $(this).next("input").val(ui.item.value); 
      // Prevent other event from not being execute            
      event.preventDefault();
      // // optionnal: submit the form after field has been filled up
      // $('#quicksearch').submit();
    }
  });
});

// TICKER AND CHART INITIAL FILL
function fillTickerInitialValues() {
  $.ajax({
    type: "GET",
    cache: true,
    url: 'http://localhost:3000/services/services_history?limit=10',
    dataType: 'json',
    
    success: function(data){
      jQuery.each(data , function() {
        var name = this.name;
        var action = "";
        if (this.operator == "inc") {
          action = "arrived at ";
        } else {
          action = "departed from ";
        }
        var noun = "";
        if (this.delta == "1") {
          noun = " person ";
        } else {
          noun = " people ";
        }
        var time_array = this.created_at.split("T")[1].split(":");
        var time = time_array[0]+":"+time_array[1];
        var ticker_string =  this.delta + noun + action + this.name + " at " + time;
        $('#ticker').append($('<li>').text(ticker_string));
      });
    }, 
    error: function(e) { 
      console.log(e);
    } 
  });
}

// SOCKETS for realtime updates
var socket = io();
socket.on('update_count', function(msg){

  var msgArray = msg.split("/");
  var id = msgArray[0];
  var count = msgArray[1];
  
  for (var i = 0; i < markersArray.length; i++) {
    if (markersArray[i].id == id) {
      var name = markersArray[i].description.split(" = ")[0];
      var newContent = name + " = " + count;
      markersArray[i].description = newContent;
      for (var j = 0; j < infoWindowsArray.length; j++) {
        var index = infoWindowsArray[j].content.indexOf(id);
        // means that the id is present in this infowindow
        if (index > -1) {
          infoWindowsArray[j].setContent(getInfoWindowContent(newContent, id));
          break;
        }
      }
      break;
    }
  }
});

socket.on('update_ticker', function(msg){
  var today = new Date();
  $('#ticker').append($('<li>').text(msg + " at " + today.getHours()+":"+today.getMinutes()));
});


function makeChart() {
  console.log("making chart");
  var chart_name = "";
  var y_values = [0];
  var x_values = [];

  $.ajax({
    type: "GET",
    cache: true,
    url: 'http://localhost:3000/services/services_history?limit=10&service_id=551308f413c2be4d33b8bedd',
    dataType: 'json',
    
    success: function(data){
      jQuery.each(data , function() {
        var time_array = this.created_at.split("T")[1].split(":");
        var time = time_array[0]+":"+time_array[1];
        var x = parseInt(String(this.new_count),10);
        y_values.push(x);
        x_values.push(time);
        chart_name = this.name;
      });
      
      var data = {
        labels: x_values.reverse(),
        datasets: [
          {
            label: chart_name,
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: y_values.reverse(),
          }
        ]
      };

      var options = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero : false,
        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
      };

      var ctx = $("#myChart").get(0).getContext("2d");
      Chart.defaults.global.responsive = true;
      var myNewChart = new Chart(ctx);
      var myLineChart = new Chart(ctx).Line(data, options);
    },
    error: function(e) { 
      console.log(e);
    } 
  });
}

function onLoad() {
  makeChart();
  fillTickerInitialValues();
}

window.onload = onLoad();