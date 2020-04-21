<!--


-->

<template>
  <div>{{localUnits}}</div>
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
      localUnits: this.units
    }
  },
  methods: {
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
    this.$eventHub.$on('logged-in', this.getUnits);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>