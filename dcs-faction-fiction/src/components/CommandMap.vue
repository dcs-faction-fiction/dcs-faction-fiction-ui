<!--


-->

<template>
  <div>
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
             data-projection="EPSG:4326" style="height: 400px">
      <vl-view :zoom="8" :center="airbaseLocation"></vl-view>
      <vl-feature id="airbase-zone" v-if="airbase && airbaseLocation.length > 0">
        <vl-geom-circle :coordinates="airbaseLocation" :radius="airbase.zoneSizeFt * 0.3048"></vl-geom-circle>
        <vl-style-box>
          <vl-style-stroke color="green" :width="3"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
        </vl-style-box>
      </vl-feature>
      <vl-layer-tile id="osm">
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
    airbase: {}
  },
  data() {
    return {
      airbaseLocation: []
    }
  },
  watch: {
    airbase(val) {
      if (val.airbaseLocation) {
        this.airbaseLocation = [val.airbaseLocation.longitude, val.airbaseLocation.latitude]
      }
    }
  }
}
</script>

<style>

</style>