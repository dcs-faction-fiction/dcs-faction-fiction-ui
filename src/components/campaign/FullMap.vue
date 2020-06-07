
<template>
  <div id="map-campaign"></div>
</template>

<script>

import 'leaflet/dist/leaflet.css';
var L = require('leaflet')
var mapLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 17,
  minZoom: 4,
  useCache: true,
  opacity: 1
})
var terrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	minZoom: 4,
  maxZoom: 17,
  opacity: 0.5
})

export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    campaign: String
  },
  data() {
    return {
      map: undefined,
      mapObjects: {},
      factions: {}
    }
  },
  methods: {
    fetchUnits() {
      fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/situation', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        }
      })
      .then(r => r.json())
      .then(b => this.factions = b.factions);
    },
    renderFaction(factionName, faction) {

      var airbaseKey = factionName + '-airbase';
      var coords = [
        faction.faction.airbaseLocation.latitude,
        faction.faction.airbaseLocation.longitude
      ];
      if (this.mapObjects[airbaseKey]) {
        this.mapObjects[airbaseKey].remove()
      }
      this.mapObjects[airbaseKey] = new L.Circle(coords, faction.faction.zoneSizeFt * 0.3048, {
        stroke: true,
        color: '#3388ff',
        weight: 4,
        opacity: 0.5,
        fill: true,
        fillColor: null, //same as color by default
        fillOpacity: 0.2
      })
      this.mapObjects[airbaseKey].addTo(this.map)

      // All the items will be emptied anyway.
      var unitsKey = factionName + "-units";
      if (this.mapObjects[unitsKey]) {
        this.mapObjects[unitsKey].forEach(u => u.remove())
      }
      
      // Start with a new array
      this.mapObjects[unitsKey] = []
      
      // Units are key-values properties in an object
      var prop
      for (prop in faction.units) {
        var u = faction.units[prop]

        // Create the marker
        var marker = L.marker([u.location.latitude, u.location.longitude], {
          icon: L.divIcon({html: '<div>'+u.type+'</div>'}),
          id: factionName + "-" + prop
        })

        // Add it to the map and array
        marker.addTo(this.map)
        this.mapObjects[unitsKey].push(marker)
      }
      
      setTimeout(() => this.map.invalidateSize(), 0)
    }
  },
  mounted() {
    if (!this.map) {
      this.map = L.map("map-campaign", {zoom: 7})
      this.map.setView([43.5, 41]);
      mapLayer.addTo(this.map)
      terrainLayer.addTo(this.map)
      setTimeout(() => this.map.invalidateSize(), 0)
    }
  },
  created() {
    this.fetchUnits();
    setInterval(() => this.fetchUnits(), 60000)
  },
  watch: {
    factions() {
      for (var factionName in this.factions) {
        var faction = this.factions[factionName];
        this.renderFaction(factionName, faction);
      }
    }
  }
}
</script>

<style>
#map-campaign {
  width: 100%;
  height: 510px;
}
</style>
