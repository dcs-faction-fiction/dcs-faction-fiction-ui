<!--


-->

<template>
  <div>
    Your base is: {{localAirbase ? localAirbase.airbase : ""}}.
    Your base zone radius is: {{airbase.zoneSizeFt}}ft.
  <br/>
    Click +/- buttons to increase/decrease, each increase is 50000ft and costs 2c.
    You can decrease, down to the minimum, and regain 1c each time.
  <br/>
    <md-button @click="increaseAirbase">+</md-button>
    <md-button @click="decreaseAirbase">-</md-button>
  <br/>
    <warehouse v-if="airbase"
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
    increaseAirbase() {
      if (!this.campaign || !this.faction) {
        return
      }
      var t = this
      fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/zone', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
        body: '{}'
      })
      .then(resp => resp.json())
      .then(() => {
        t.$eventHub.$emit('credits-update')
        t.getAirbase()
      })
      .catch(err => console.log(err))
    },
    decreaseAirbase() {
      if (!this.campaign || !this.faction) {
        return
      }
      var t = this
      fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/zone', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        }
      })
      .then(resp => resp.json())
      .then(() => {
        t.$eventHub.$emit('credits-update')
        t.getAirbase()
      })
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