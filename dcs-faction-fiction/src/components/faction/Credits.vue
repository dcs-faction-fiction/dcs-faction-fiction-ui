<!--


-->

<template>
  <div>
    Current credits: {{credits}}
  </div>
</template>

<script>
export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    faction: String,
    campaign: String
  },
  data() {
    return {
      credits: 0
    }
  },
  methods: {
    getCredits() {
      if (!this.campaign || !this.faction) {
        return
      }
      fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/credits', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
      })
      .then(resp => resp.json())
      .then(data => this.credits = data)
      .catch(err => console.log(err))
    }
  },
  watch: {
    faction() {
      this.getCredits()
    },
    campaign() {
      this.getCredits()
    },
  },
  created() {
    this.$eventHub.$on('logged-in', this.getCredits);
    this.$eventHub.$on('credits-update', this.getCredits);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
    this.$eventHub.$off('credits-update');
  }
}
</script>

<style>

</style>