<template>
  <div id="app">
    
    <JWTProvider 
      :loggedIn.sync="loggedIn"
      :isFactionManager.sync="isFactionManager"
      :isCampaignManager.sync="isCampaignManager"/>

    <md-tabs v-show="loggedIn">
      
      <md-tab v-show="isFactionManager" :md-disabled="!isFactionManager" md-label="Faction manager">

        <div class="md-layout md-gutter">
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
          <div class="md-layout-item"></div>
        </div>
        
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
      </md-tab>

      <md-tab v-show="isCampaignManager" :md-disabled="!isCampaignManager" md-label="Campaign manager">
        <CampaignManager
          :apiUrl="apiUrl"/>
      </md-tab>

    </md-tabs>
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
      isFactionManager: false,
      isCampaignManager: false,
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
