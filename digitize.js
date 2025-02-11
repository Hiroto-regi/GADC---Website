var map;
var drawnItems;

window.addEventListener('load', function () {
    // Initialize the map
    map = L.map('map').setView([12.8797, 121.774], 6); // Centered on the Philippines

    // OpenStreetMap tile layer
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Additional Map Layers
    var baseLayers = {
        "OpenStreetMap": osmLayer,
        "Google Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Imagery © <a href="https://www.google.com/maps">Google Maps</a>'
        }),
        "Grayscale": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        })
    };

    // Layer control
    L.control.layers(baseLayers, null, { position: 'topleft' }).addTo(map);

    // Initialize Leaflet.draw
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: {
            rectangle: false,
            polygon: true,
            circle: true,
            circlemarker: true,
            marker: true,
            polyline: true
        },
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    // Capture drawn items and fetch location details
    map.on('draw:created', function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
        var latlng = layer.getLatLng();

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
            .then(response => response.json())
            .then(data => {
                var locationName = data.display_name;
                layer.bindPopup(locationName).openPopup();
            })
            .catch(error => console.error('Error fetching location:', error));
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            searchLocation();
        }
    });

    function searchLocation() {
        var searchText = document.getElementById('search-input').value;
        if (!searchText.trim()) {
            alert('Please enter a location to search');
            return;
        }

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var result = data[0];
                    map.setView([result.lat, result.lon], 16);
                    drawnItems.clearLayers();
                    L.marker([result.lat, result.lon]).addTo(drawnItems).bindPopup(result.display_name).openPopup();
                } else {
                    alert('Location not found');
                }
            })
            .catch(error => {
                console.error('Error fetching location:', error);
                alert('Error fetching location. Please try again.');
            });
    }

    // Print control
    var printControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function () {
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

    // Campus selection from dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            var coordinates = this.getAttribute('data-coordinates').split(',');
            map.setView([parseFloat(coordinates[0]), parseFloat(coordinates[1])], 16);
            drawnItems.clearLayers();
            L.marker([parseFloat(coordinates[0]), parseFloat(coordinates[1])]).addTo(drawnItems).bindPopup(this.textContent).openPopup();
        });
    });

    // Burger menu toggle
    document.querySelector('.burger_icon').addEventListener('click', function () {
        document.querySelector('.navbar_menu').classList.toggle('active');
        this.classList.toggle('active');
    });

    // Adjust GADC title based on screen size
    function adjustTitle() {
        var textContainer = document.querySelector('.text_container');
        if (window.innerWidth <= 768) {
            textContainer.innerText = "GADC";
            textContainer.style.fontSize = "20px";
        } else {
            textContainer.innerText = "GIS Applications Development Center";
            textContainer.style.fontSize = "24px";
        }
    }
    window.addEventListener('resize', adjustTitle);
    adjustTitle();

    // Profile dropdown toggle
    var profileLink = document.querySelector('.profile-link');
    var dropdownProfile = document.querySelector('.dropdown-profile');

    profileLink.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropdownProfile.classList.toggle('active');
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown-profile')) {
            dropdownProfile.classList.remove('active');
        }
    });
});
