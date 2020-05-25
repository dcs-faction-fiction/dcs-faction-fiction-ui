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
      <div class="md-layout-item md-size-15">
        State {{state}}
        <br/>
        Phase {{phase}}
        <br/>
        <div v-if="serverinfo.address">
          Server: {{serverinfo.address}}:{{serverinfo.port}}
          <br/>
          Password: {{serverinfo.password}}
        </div>
      </div>
    </div>

    <md-button @click="downloadMission">Download MIZ</md-button>
    
    <CampaignGiveCredits
      :apiUrl="apiUrl"
      :campaign="campaign"
      :faction="faction"/>

    <div class="md-layout md-gutter md-alignment-top-left">
      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Server</label>
          <md-input v-model="server"/>
        </md-field>
      </div>
      <div class="md-layout-item md-size-15">
        <md-button @click="startServer">START</md-button>
      </div>
    </div>
  </div>
</template>

<script>
var download = require("downloadjs");
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
      faction: localStorage.campaignManagerFaction,
      server: 'server1',
      phase: '',
      state: '',
      serverinfo: {}
    }
  },
  methods: {
    poll() {
      if (!this.campaign || !this.faction) {
        return
      }

      fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/state', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        }
      })
      .then(r => r.json())
      .then(b => this.state = b);

      fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/phase', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        }
      })
      .then(r => r.json())
      .then(b => this.phase = b);
    },
    downloadMission() {
      if (!this.campaign || !this.faction) {
        return
      }

      fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/download-mission', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        }
      })
      .then(r => r.blob())
      .then(b => download(b, "mission.miz"));
    },
    startServer() {
      fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/servers/'+this.server, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer '+localStorage.token,
          'Content-Type': 'application/json'
        },
        body: "{}"
      })
      .catch(err => console.log(err))
    }
  },
  created() {
    setInterval(() => this.poll(), 5000)
  },
  watch: {
    campaign(v) {
      localStorage.campaignManagerCampaign = v
    },
    faction(v) {
      localStorage.campaignManagerFaction = v
    },
    phase(v) {
      if (v == "RUNNING") {
        fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/serverinfo', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer '+localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        .then(r => r.json())
        .then(b => this.serverinfo = b);
      } else {
        this.serverinfo = {}
      }
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