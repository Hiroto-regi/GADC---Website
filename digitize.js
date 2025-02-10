var map;
var drawnItems;

window.addEventListener('load', function() {
    map = L.map('map').setView([12.8797, 121.774], 6); // Centered on the Philippines with a zoom level of 6

    // OpenStreetMap tile layer
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Mapbox tile layer
    var mapboxLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">My Map</a>',
      maxZoom: 19,
      id: 'mapbox/streets-v11', // Specify the map style here
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN' // Replace with your Mapbox access token
    });

    // Google Satellite tile layer (Note: Using Google Maps tiles directly in Leaflet is against Google's terms of service)
    var googleSatelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3'],
      attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
    });

    // OpenTopoMap grayscale tile layer
    var grayscaleLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        'Elevation data &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
    });

    // Create a base layers object to hold different tile layers
    var baseLayers = {
      "OpenStreetMap": osmLayer,
      "My Map": mapboxLayer,
      "Google Satellite": googleSatelliteLayer,
      "Grayscale": grayscaleLayer
    };

    // Add the base layers to the map and allow user to toggle between them
    L.control.layers(baseLayers, null, { position: 'topleft' }).addTo(map);

    // Create a custom control for search
    var searchControl = L.Control.extend({
      options: {
          position: 'bottomleft'
      },
      onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-control-search');
        container.style.backgroundColor = 'white';
        container.style.padding = '10px';
        container.style.border = '1px solid #ccc';
        container.style.top = 'auto'; // Reset top property
        container.style.bottom = '500px'; // Adjust this value as needed
        container.innerHTML = '<input type="text" id="search-input" placeholder="Search Location"><button onclick="searchLocation()">Search</button>';
        return container;
    }
    });

    map.addControl(new searchControl());

    // Event listener for resizing the map container
    window.addEventListener('resize', function() {
        map.getContainer().style.height = 'calc(100vh - 80px)';
    });

    // Event listener for adjusting search control position on zoom
    map.on('zoomend', function() {
        var searchControlContainer = document.querySelector('.leaflet-control-search');
        searchControlContainer.style.bottom = '80px'; // Adjust this value as needed
    });

    // Initialize the Leaflet.draw plugin
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
      draw: {
        rectangle: false,
        polygon: true, // Enable drawing markers
        circle: true,   // Enable drawing markers
        circlemarker: true, // Enable drawing markers
        marker: true,    // Enable drawing markers
        polyline: true   // Enable drawing polylines
        
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    map.addControl(drawControl);

    map.on('draw:created', function(event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);

      // Get the location information using reverse geocoding
      var latlng = layer.getLatLng();
      var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + latlng.lat + '&lon=' + latlng.lng;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          var locationName = data.display_name;
          // Bind a popup to the marker displaying the location name
          layer.bindPopup(locationName).openPopup();
        })
        .catch(error => {
          console.error('Error fetching location:', error);
        });
    });

    // Add event listener to the search input field
    document.getElementById('search-input').addEventListener('keydown', function(event) {
        // Check if the pressed key is the Enter key
        if (event.key === 'Enter') {
            // Call the searchLocation() function
            searchLocation();
        }
    });

    // Create a custom control for printing
    var printControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control');
            var printButton = L.DomUtil.create('button', 'leaflet-bar leaflet-control-custom', container);
            printButton.innerHTML = 'Print Map';
            printButton.title = 'Print Map (Ctrl + P)';
            L.DomEvent.on(printButton, 'click', function (e) {
                window.print();
                L.DomEvent.stopPropagation(e);
            });
            return container;
        }
    });
    map.addControl(new printControl());
});

function searchLocation() {
  var searchText = document.getElementById('search-input').value;
  if (searchText.trim() !== '') {
      var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(searchText);
      fetch(url)
          .then(response => response.json())
          .then(data => {
              if (data && data.length > 0) {
                  var result = data[0];
                  map.setView([result.lat, result.lon], 16);
                  // Remove existing markers
                  drawnItems.clearLayers();
                  // Add new marker
                  L.marker([result.lat, result.lon]).addTo(drawnItems).bindPopup(result.display_name).openPopup();
              } else {
                  alert('Location not found');
              }
          })
          .catch(error => {
              console.error('Error fetching location:', error);
              alert('Error fetching location. Please try again.');
          });
  } else {
      alert('Please enter a location to search');
  }
}

function clearSearch() {
  drawnItems.clearLayers();
}

// Burger menu

document.addEventListener('DOMContentLoaded', function () {
  const burgerIcon = document.querySelector('.burger_icon');
  const navbarMenu = document.querySelector('.navbar_menu');

  burgerIcon.addEventListener('click', function () {
      navbarMenu.classList.toggle('active');
      burgerIcon.classList.toggle('active');
  });
});

// GADC Title

window.addEventListener('resize', function () {
  var textContainer = document.querySelector('.text_container');
  var windowWidth = window.innerWidth;

  if (windowWidth <= 768) {
      textContainer.innerText = "GADC"; /* Changed text for smaller screens */
      textContainer.style.fontSize = "20px"; // Adjust font size for smaller screens
  } else {
      textContainer.innerText = "GIS Applications Development Center"; 
      textContainer.style.fontSize = "24px"; // Adjust font size for larger screens
  }
});

// Initial call to set text content based on the current screen size
window.dispatchEvent(new Event('resize'));

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
  const profileLink = document.querySelector('.profile-link');
  const dropdownProfile = document.querySelector('.dropdown-profile');

  profileLink.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default link behavior
      event.stopPropagation();
      console.log('Profile link clicked');
      dropdownProfile.classList.toggle('active'); // Toggle the visibility of the dropdown menu
  });

  // Close the dropdown when clicking outside of it
  document.addEventListener('click', function(event) {
      if (!event.target.closest('.dropdown-profile')) { // Corrected class name
          console.log('Clicked outside dropdown');
          dropdownProfile.classList.remove('active');
      }
  });
});