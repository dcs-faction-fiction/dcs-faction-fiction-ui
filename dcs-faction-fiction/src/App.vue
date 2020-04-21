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
      <units
        :apiUrl="apiUrl"
        :faction="faction"
        :campaign="campaign"/>
      <airbase
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"
        :airbase.sync="airbase"/>
      <command-map
        :apiUrl="apiUrl"
        :campaign="campaign"
        :faction="faction"
        :airbase.sync="airbase"/>
    </div>
  </div>
</template>

<script>
import JWTProvider from './components/JWTProvider.vue'
import ContextSelector from './components/ContextSelector.vue'
import Airbase from './components/Airbase.vue'
import Units from './components/Units.vue'
import CommandMap from './components/CommandMap.vue'

export default {
  name: 'App',
  data() {
    return {
      apiUrl: 'http://localhost:8080',
      loggedIn: false,
      faction: localStorage.faction,
      campaign: localStorage.campaign,
      airbase: localStorage.airbase,
    }
  },
  components: {
    JWTProvider,
    ContextSelector,
    Airbase,
    Units,
    CommandMap
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
