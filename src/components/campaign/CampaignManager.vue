<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-left">
      <div class="md-layout-item md-size-15">
        <ContextSelector type="campaign"
            :apiUrl="apiUrl"
            :selection.sync="campaign"/>
      </div>
      <div class="md-layout-item md-size-15">
        <ContextSelector type="faction"
            :apiUrl="apiUrl"
            :campaign="campaign"
            :selection.sync="faction"/>
      </div>
      <div class="md-layout-item">
        <md-button>Download MIZ</md-button>
      </div>
      <div class="md-layout-item">
        <CampaignGiveCredits
          :apiUrl="apiUrl"
          :campaign="campaign"/>
      </div>
    </div>
  </div>
</template>

<script>
import ContextSelector from '../ContextSelector.vue';
import CampaignGiveCredits from './CampaignGiveCredits.vue';

export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      campaign: localStorage.campaignManagerCampaign,
      faction: localStorage.campaignManagerFaction
    }
  },
  methods: {
  },
  watch: {
    campaign(v) {
      localStorage.campaignManagerCampaign = v
    },
    faction(v) {
      localStorage.campaignManagerFaction = v
    }
  },
  components: {
    CampaignGiveCredits,
    ContextSelector
  }
}
</script>

<style>

</style>