<template>
  <div id="app">

    <JWTProvider :loggedIn.sync="loggedIn"/>

    <div v-show="loggedIn">
      <CampaignManager
        :apiUrl="apiUrl"/>
    </div>

    <div v-show="loggedIn">
      <ContextSelector type="faction"
        :apiUrl="apiUrl"
        :selection.sync="faction"/>
      <ContextSelector type="campaign"
        :apiUrl="apiUrl"
        :faction="faction"
        :selection.sync="campaign"/>
      <Credits
        :apiUrl="apiUrl"
        :faction="faction"
        :campaign="campaign"/>
      <Units
        :apiUrl="apiUrl"
        :faction="faction"
        :campaign="campaign"
        :units.sync="units"/>
      <Airbase
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"
        :airbase.sync="airbase"/>
      <Basket
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"/>
      <UnitMap
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"
        :airbase="airbase"
        :units.sync="units"/>
    </div>
  </div>
</template>

<script>
import JWTProvider from './components/JWTProvider.vue'

import CampaignManager from './components/campaign/CampaignManager.vue'

import ContextSelector from './components/faction/ContextSelector.vue'
import Airbase from './components/faction/Airbase.vue'
import Units from './components/faction/Units.vue'
import Basket from './components/faction/Basket.vue'
import Credits from './components/faction/Credits.vue'
import UnitMap from './components/faction/UnitMap.vue'

export default {
  name: 'App',
  data() {
    return {
      apiUrl: 'http://95.216.78.27:8080',
      loggedIn: false,
      faction: localStorage.faction,
      campaign: localStorage.campaign,
      airbase: localStorage.airbase,
      units: {},
    }
  },
  components: {
    JWTProvider,
    CampaignManager,
    ContextSelector,
    Airbase,
    Units,
    Basket,
    Credits,
    UnitMap
  },
  methods: {

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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
