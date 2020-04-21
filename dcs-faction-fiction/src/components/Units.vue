<!--


-->

<template>
  <div>{{units}}</div>
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
      units: {}
    }
  },
  methods: {
    getUnits() {
      if (!this.campaign || !this.faction) {
        return
      }
      fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/units', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
      })
      .then(resp => resp.json())
      .then(data => this.updateUnits(data))
      .catch(err => console.log(err))
    },
    updateUnits(units) {
      this.units = units
    }
  },
  watch: {
    faction() {
      this.getUnits()
    },
    campaign() {
      this.getUnits()
    },
  },
  created() {
    this.$eventHub.$on('logged-in', this.getUnits);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>