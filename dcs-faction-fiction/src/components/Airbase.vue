<!--


-->

<template>
  <div>
    {{localAirbase.airbase}}
    <warehouse
      :apiUrl="apiUrl"
      :faction="faction"
      :campaign="campaign"
      :airbase="airbase.airbase"/>
  </div>
</template>

<script>
import Warehouse from './Warehouse.vue'

export default {
  components: {
    Warehouse
  },
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    faction: String,
    campaign: String,
    airbase: {}
  },
  data() {
    return {
      localAirbase: this.airbase
    }
  },
  methods: {
    getAirbase() {
      if (!this.campaign || !this.faction) {
        return
      }
      fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
      })
      .then(resp => resp.json())
      .then(data => this.updateAirbase(data))
      .catch(err => console.log(err))
    },
    updateAirbase(airbase) {
      this.localAirbase = airbase
      this.$emit('update:airbase', this.localAirbase)
    }
  },
  watch: {
    faction() {
      this.getAirbase()
    },
    campaign() {
      this.getAirbase()
    }
  },
  created() {
    this.$eventHub.$on('logged-in', this.getAirbase);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>