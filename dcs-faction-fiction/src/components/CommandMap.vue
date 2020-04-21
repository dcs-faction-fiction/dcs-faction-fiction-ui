<!--


-->

<template>
  <div>
    <button @click="applyUnitsPosition">APPLY UNITS POSITION</button>
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
             data-projection="EPSG:4326" style="height: 400px">
      <vl-view :zoom="8" :center="airbaseLocation"></vl-view>
      
      <vl-feature :z-index="1" id="airbase-zone" v-if="airbase && airbaseLocation.length > 0">
        <vl-geom-circle :coordinates="airbaseLocation" :radius="airbase.zoneSizeFt * 0.3048"></vl-geom-circle>
        <vl-style-box>
          <vl-style-stroke color="green" :width="3"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
        </vl-style-box>
      </vl-feature>

      <vl-layer-vector :z-index="2" id="layer-units">
        <vl-source-vector ident="units-target" :features.sync="mapUnits"></vl-source-vector>
        <vl-style-box>
          <vl-style-circle :radius="3">
            <vl-style-fill color="white"></vl-style-fill>
            <vl-style-stroke color="brown" :width="2"></vl-style-stroke>
          </vl-style-circle>
          <vl-style-stroke color="brown"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
          <!--<vl-style-text :text="unitType"></vl-style-text>-->
        </vl-style-box>
      </vl-layer-vector>
      <vl-interaction-snap source="units-target" :priority="10"></vl-interaction-snap>
      <vl-interaction-modify source="units-target"></vl-interaction-modify>

      <vl-layer-vector :z-index="2" id="draw-pane">
        <vl-source-vector ident="draw-target" :features.sync="mapDrawnFeatures"></vl-source-vector>
        <vl-style-box>
          <vl-style-circle :radius="3">
            <vl-style-fill color="white"></vl-style-fill>
            <vl-style-stroke color="yellow" :width="2"></vl-style-stroke>
          </vl-style-circle>
        </vl-style-box>
      </vl-layer-vector>
      <vl-interaction-draw source="draw-target" type="Point"></vl-interaction-draw>
      <vl-interaction-modify source="draw-target"></vl-interaction-modify>
      <vl-interaction-snap source="draw-target" :priority="10"></vl-interaction-snap>

      <vl-interaction-select :features.sync="mapSelection">
        <template>
          <vl-style-box :z-index="1">
            <vl-style-circle :radius="3">
            <vl-style-fill color="white"></vl-style-fill>
            <vl-style-stroke color="yellow" :width="2"></vl-style-stroke>
            </vl-style-circle>
          </vl-style-box>
        </template>
      </vl-interaction-select>

      <vl-layer-tile id="osm" :z-index="0">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
  </div>
</template>

<script>
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
      airbaseLocation: [],
      mapUnits: [],
      updateMutex: false,
      mapSelection: [],
      mapDrawnFeatures: []
    }
  },
  methods: {
    applyUnitsPosition() {
      this.$emit('update:units', this.mapUnits.map(u => {
        return {
          id: u.id,
          type: u.unitType,
          location: {
            latitude: u.geometry.coordinates[1],
            longitude: u.geometry.coordinates[0],
            altitude: 0,
            angle: 0
          }
        }
      }))
    }
  },
  watch: {
    airbase(val) {
      if (val.airbaseLocation) {
        this.airbaseLocation = [val.airbaseLocation.longitude, val.airbaseLocation.latitude]
      }
    },
    units(val) {
      this.mapUnits = val.map(i => {
        return {
          id: i.id,
          unitType: i.type,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [i.location.longitude,i.location.latitude],
          },
          properties: {},
        }
      })
    }
  }
}
</script>

<style>

</style>