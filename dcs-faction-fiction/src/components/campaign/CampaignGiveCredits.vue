<template>
  <div>
    <select v-model="faction">
      <option v-for="f in factions" :key="f.faction">{{f.faction}}</option>
    </select>
    <input v-model="credits"/>
    <button @click="giveCredits">GIVE</button>
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
      factions: [],
      faction: localStorage.campaignManagerFaction,
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