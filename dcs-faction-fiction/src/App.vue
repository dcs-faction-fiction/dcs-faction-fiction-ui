<template>
  <div id="app">
    <JWTProvider :loggedIn.sync="loggedIn"/>
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
      <Map/>
    </div>
  </div>
</template>

<script>
import JWTProvider from './components/JWTProvider.vue'
import ContextSelector from './components/ContextSelector.vue'
import Airbase from './components/Airbase.vue'
import Units from './components/Units.vue'
import Basket from './components/Basket.vue'
import Credits from './components/Credits.vue'
import Map from './components/Map.vue'

export default {
  name: 'App',
  data() {
    return {
      apiUrl: 'http://localhost:8080',
      loggedIn: false,
      faction: localStorage.faction,
      campaign: localStorage.campaign,
      airbase: localStorage.airbase,
      units: {},
    }
  },
  components: {
    JWTProvider,
    ContextSelector,
    Airbase,
    Units,
    Basket,
    Credits,
    Map
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
