<template>
  <div id="app">
    <j-w-t-provider :loggedIn.sync="loggedIn"/>
    <div v-show="loggedIn">
      <context-selector type="faction"
        :apiUrl="apiUrl"
        :selection.sync="faction"/>
      <context-selector type="campaign"
        :apiUrl="apiUrl"
        :selection.sync="campaign"
        :faction.sync="faction"/>
    </div>
  </div>
</template>

<script>
import JWTProvider from './components/JWTProvider.vue'
import ContextSelector from './components/ContextSelector.vue'

export default {
  name: 'App',
  data() {
    return {
      apiUrl: 'http://localhost:8080',
      loggedIn: false,
      faction: localStorage.faction,
      campaign: localStorage.campaign
    }
  },
  components: {
    JWTProvider,
    ContextSelector
  },
  methods: {

  },
  watch: {
    faction(val) {
      localStorage.faction = val
    },
    campaign(val) {
      localStorage.campaign = val
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
