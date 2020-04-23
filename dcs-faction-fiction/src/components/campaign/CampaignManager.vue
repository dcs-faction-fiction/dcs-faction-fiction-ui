<template>
  <div>
    <select v-model="campaign">
      <option v-for="c in campaigns" :key="c">{{c}}</option>
    </select>

    <CampaignGiveCredits
      :apiUrl="apiUrl"
      :campaign="campaign"/>
  </div>
</template>

<script>
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
      campaigns: [],
      campaign: localStorage.campaignManagerCampaign
    }
  },
  methods: {
    getCampaigns() {
      fetch(this.apiUrl+'/campaignmanager-api/campaigns', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
      })
      .then(resp => resp.json())
      .then(data => {
        this.campaigns = data
        if (!this.campaign) {
          this.campaign = data[0]
        }
      })
      .catch(err => console.log(err))
    }
  },
  watch: {
    campaign(v) {
      localStorage.campaignManagerCampaign = v
    }
  },
  components: {
    CampaignGiveCredits
  },
  created() {
    this.$eventHub.$on('logged-in', this.getCampaigns);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>