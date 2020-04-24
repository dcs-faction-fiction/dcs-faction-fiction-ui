<template>
  <div>
    <div class="md-layout md-layout-item md-gutter md-alignment-center-left">
      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Give credits</label>
          <md-input v-model="credits"/>
        </md-field>
      </div>
      <div class="md-layout-item md-size-10">
        <md-button @click="giveCredits">GIVE</md-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    campaign: {}
  },
  data() {
    return {
      credits: 0
    }
  },
  methods: {
    giveCredits() {
      if (!this.campaign || !this.faction) {
        return
      }

      fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/add-credits-to-faction/'+this.faction, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
        body: JSON.stringify(this.credits)
      })
      .then(() => {
        this.credits = 0
        this.$eventHub.$emit('credits-update')
      })
      .catch(err => console.log(err))
      this.credits = 0
    },
    getFactions() {
      if (!this.campaign) {
        return
      }

      fetch(this.apiUrl+'/campaignmanager-api/campaigns/'+this.campaign+'/factions', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
      })
      .then(resp => resp.json())
      .then(data => {
        this.factions = data
        if (!this.faction) {
          this.faction = data[0]
        }
      })
      .catch(err => console.log(err))
    }
  },
  watch: {
    campaign() {
      this.getFactions()
    },
    faction(v) {
      localStorage.campaignManagerFaction = v
    }
  },
  created() {
    this.$eventHub.$on('logged-in', this.getFactions);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>