<template>
  <div id="app">
    
    <JWTProvider 
      :loggedIn.sync="loggedIn"
      :isFactionManager.sync="isFactionManager"
      :isCampaignManager.sync="isCampaignManager"/>

    <md-tabs v-show="loggedIn" :md-active-tab="isFactionManager ? 'factionManager' : 'campaignManager'">
      
      <md-tab id="factionManager"
        v-show="isFactionManager"
       :md-disabled="!isFactionManager"
        md-label="Faction manager">
        <FactionManager
          :apiUrl="apiUrl"
          :isManager="isFactionManager"/>
      </md-tab>

      <md-tab id="campaignManager"
        v-show="isCampaignManager"
       :md-disabled="!isCampaignManager"
        md-label="Campaign manager">
        <CampaignManager
          :apiUrl="apiUrl"
          :isManager="isCampaignManager"/>
      </md-tab>

    </md-tabs>
  </div>
</template>

<script>
import JWTProvider from './components/JWTProvider.vue'
import CampaignManager from './components/campaign/CampaignManager.vue'
import FactionManager from './components/faction/FactionManager.vue'

export default {
  name: 'App',
  components: {
    JWTProvider,
    CampaignManager,
    FactionManager,
  },
  data() {
    return {
      apiUrl: 'https://95.216.78.27:8443',
      loggedIn: false,
      isFactionManager: false,
      isCampaignManager: false
    }
  },
  watch: {
    isFactionManager(value) {
      if (!value) {
        delete localStorage.faction
        delete localStorage.campaign
      }
    },
    isCampaignManager(value) {
      if (!value) {
        delete localStorage.campaignManagerCampaign
        delete localStorage.campaignManagerFaction
      }
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
