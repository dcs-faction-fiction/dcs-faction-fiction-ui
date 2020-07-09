<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-left">
      <div class="md-layout-item md-size-15">
        <ContextSelector type="faction"
            :apiUrl="apiUrl"
            :selection.sync="faction"/>
      </div>
      <div class="md-layout-item md-size-15">
        <ContextSelector type="campaign"
            :apiUrl="apiUrl"
            :faction="faction"
            :selection.sync="campaign"/>
      </div>
      <div class="md-layout-item">
        <md-button @click="showLog">LOG</md-button>
      </div>
    </div>
    
    <Credits
      :apiUrl="apiUrl"
      :faction="faction"
      :campaign="campaign"/>

    <div class="md-layout md-gutter md-alignment-top-left">
      <div class="md-layout-item">
        <Airbase
          :apiUrl="apiUrl"
          :campaign="campaign"
          :faction="faction"
          :airbase.sync="airbase"/>
      </div>
      <div class="md-layout-item">
        <Basket
          :apiUrl="apiUrl"
          :campaign="campaign"
          :faction="faction"/>
        
      </div>
    </div>

    <Units
      :apiUrl="apiUrl"
      :faction="faction"
      :campaign="campaign"
      :units.sync="units"/>
    <UnitMap
      :apiUrl="apiUrl"
      :campaign="campaign"
      :faction="faction"
      :airbase="airbase"
      :units.sync="units"/>
  </div>
</template>


<script>
import ContextSelector from '../ContextSelector.vue'
import Airbase from './Airbase.vue'
import Units from './Units.vue'
import Basket from './Basket.vue'
import Credits from './Credits.vue'
import UnitMap from './UnitMap.vue'

export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    isManager: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      faction: localStorage.faction,
      campaign: localStorage.campaign,
      airbase: localStorage.airbase,
      units: {},
    }
  },
  components: {
    ContextSelector,
    Airbase,
    Units,
    Basket,
    Credits,
    UnitMap
  },
  methods: {
    showLog() {
      if (this.campaign && this.faction) {
        fetch(this.apiUrl+'/factionmanager-api/factions/'+this.faction+'/campaigns/'+this.campaign+'/flightlog', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer'+localStorage.token,
          }
        })
        .then(r => r.json())
        .then(strings => console.log(strings));
      }
    }
  },
  watch: {
    faction(val) {
      localStorage.faction = val
    },
    campaign(val) {
      localStorage.campaign = val
    },
    airbase(val) {
      localStorage.airbase = val
    },
    units() {
    }
  }
}
</script>
