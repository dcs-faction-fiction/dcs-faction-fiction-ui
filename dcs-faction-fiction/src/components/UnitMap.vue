
<template>
  <div id="map"></div>
</template>

<script>

import 'leaflet/dist/leaflet.css';
var L = require('leaflet')
var mapLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 16,
  minZoom: 4,
  useCache: true,
});
var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
  layers: 'TOPO-OSM-WMS',
  opacity: 0.3
});

export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    faction: String,
    campaign: String,
    airbase: {},
    units: {}
  },
  data() {
    return {
      map: undefined
    }
  },
  methods: {
    getCenterCoords () {
      if (this.airbase) {
        return [
          this.airbase.airbaseLocation.latitude,
          this.airbase.airbaseLocation.longitude
        ]
      } else {
        return [42, 42]
      }
    }
  },
  mounted() {
    if (!this.map) {
      this.map = L.map('map')
      mapLayer.addTo(this.map);
      wmsLayer.addTo(this.map);
      setTimeout(() => this.map.invalidateSize(), 0)
    }
  },
  watch: {
    airbase() {
      var coords = this.getCenterCoords()
      this.map.setView(coords, 8)
      setTimeout(() => this.map.invalidateSize(), 0)
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 500px;
}
</style>
