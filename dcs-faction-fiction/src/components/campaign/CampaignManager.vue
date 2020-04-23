<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Campaign</label>
          <md-select v-model="campaign">
            <md-option v-for="c in campaigns" :key="c" :value="c">{{c}}</md-option>
          </md-select>
        </md-field>
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