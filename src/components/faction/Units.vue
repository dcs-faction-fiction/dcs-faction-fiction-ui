<!--


-->

<template>
  <div class="md-layout md-gutter md-alignment-center-left" v-if="newUnit.lat && newUnit.lon">
    <div class="md-layout-item md-size-20">
      <md-field>
        <label>Unit type</label>
        <md-select v-model="newUnit.type">
          <md-option v-for="s in availableUnits" :key="s" :value="s">{{s}}</md-option>
        </md-select>
      </md-field>
    </div>
    <div class="md-layout-item">
      <md-button v-on:click="buyUnit">ADD</md-button>
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
    faction: String,
    campaign: String,
    units: {}
  },
  data() {
    return {
      localUnits: this.units,
      availableUnits: [],
      newUnit: {
        type: undefined,
        lat: 0,
        lon: 0
      },
    }
  },
  methods: {
    loadAvailableItems() {
      fetch(this.apiUrl+'/common-api/enums', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer' + localStorage.token,
        }
      })
      .then(r => r.json())
      .then(data => {
        this.availableUnits = data.units
        this.newUnit.type = this.newUnit.type ? this.newUnit.type : this.availableUnits[0]
      })
      .catch(err => console.log(err))
    },
    async saveUnits(unitsToSave) {
      var toAdd = []
      var toPlace = []
      for (var prop in unitsToSave) {
        var u = unitsToSave[prop]
        var unit = this.localUnits[prop]
        if (unit && (
          ""+u.location.latitude != ""+unit.location.latitude ||
          ""+u.location.longitude != ""+unit.location.longitude )) {
          toPlace.push(u)
        } else if (!unit) {
          toAdd.push(u)
        }
      }
      await this.addUnits(toAdd)
      await this.placeUnits(toPlace)
      if (toAdd.length > 0 || toPlace.length > 0) {
        await this.getUnits()
      }
    },
    async placeUnits(units) {
      var i;
      for (i = 0; i < units.length; i++) {
        var u = units[i]
        await fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/units/'+u.id, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer' + localStorage.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(u.location)
        })
      }
    },
    async addUnits(units) {
      var i;
      for (i = 0; i < units.length; i++) {
        var u = units[i]
        await fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/units', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer' + localStorage.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({type: u.type, location: u.location})
        })
      }
    },
    async buyUnit() {
      var req = {}
      req.type = this.newUnit.type
      req.location = {}
      req.location.latitude = this.newUnit.lat
      req.location.longitude = this.newUnit.lon
      req.location.altitude = 0
      req.location.angle = 0
      await fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/units', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer' + localStorage.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      })
      .then(() => {
        this.getUnits()
        this.$eventHub.$emit('credits-update')
      })
    },
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
      .then(resp => resp.ok ? resp.json() : [])
      .then(data => {
        var result = {}
        data.forEach(u => result[u.id] = u)
        this.localUnits = result
        this.$emit('update:units', this.localUnits)
      })
      .catch(err => console.log(err))
    }
  },
  watch: {
    faction() {
      this.getUnits()
    },
    campaign() {
      this.getUnits()
    },
    units(val) {
      this.saveUnits(val)
    }
  },
  created() {
    this.$eventHub.$on('logged-in', () => {
      this.loadAvailableItems()      
      this.getUnits()
    });
    this.$eventHub.$on('latlon-selected', (latlon) => {
      this.newUnit.lat = latlon.lat
      this.newUnit.lon = latlon.lon
    })
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in')
    this.$eventHub.$off('latlng-selected')
  }
}
</script>

<style>
</style>
