<template>
  <div id="app">
    <j-w-t-provider :loggedIn.sync="loggedIn"/>
    <div v-show="loggedIn">
      <context-selector type="faction"
        :apiUrl="apiUrl"
        :selection.sync="faction"/>
      <context-selector type="campaign"
        :apiUrl="apiUrl"
        :faction="faction"
        :selection.sync="campaign"/>
      <credits
        :apiUrl="apiUrl"
        :faction="faction"
        :campaign="campaign"/>
      <units
        :apiUrl="apiUrl"
        :faction="faction"
        :campaign="campaign"
        :units.sync="units"/>
      <airbase
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"
        :airbase.sync="airbase"/>
      <basket
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"/>
      <command-map
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"
        :airbase.sync="airbase"
        :units.sync="units"/>
    </div>
  </div>
</template>

<script>
import JWTProvider from './components/JWTProvider.vue'
import ContextSelector from './components/ContextSelector.vue'
import Airbase from './components/Airbase.vue'
import Units from './components/Units.vue'
import CommandMap from './components/CommandMap.vue'
import Basket from './components/Basket.vue'
import Credits from './components/Credits.vue'

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
    CommandMap,
    Basket,
    Credits
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
