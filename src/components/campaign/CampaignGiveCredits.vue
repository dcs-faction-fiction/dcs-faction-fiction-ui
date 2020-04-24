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
    campaign: {},
    faction: {}
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
    }
  }
}
</script>

<style>

</style>