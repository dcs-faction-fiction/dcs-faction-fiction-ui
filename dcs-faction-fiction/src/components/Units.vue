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
      localUnits: this.units,
      unsavedUnits: this.units
    }
  },
  methods: {
    saveUnits() {
      var toAdd = []
      var toPlace = []
      this.localUnits.forEach(u => {
        var unit = this.unsavedUnits[u.id]
        if (unit && (
          ""+u.location.latitude != ""+unit.location.latitude ||
          ""+u.location.longitude != ""+unit.location.longitude )) {
          toPlace.push(u)
        } else if (!unit) {
          toAdd.push(u)
        }
      })
      if (toAdd.length > 0) {
        this.addUnits(toAdd)
      }
      if (toPlace.length > 0) {
        this.placeUnits(toPlace)
      }
    },
    placeUnits(units) {
      units.forEach(u => fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/units/'+u.id, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer' + localStorage.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(u.location)
        })
        .then(() => this.getUnits())
        .catch(err => console.log(err))
      )
    },
    addUnits(units) {
      units.forEach(u => fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/units', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer' + localStorage.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({type: u.type, location: u.location})
        })
        .then(() => this.getUnits())
        .catch(err => console.log(err))
      )
      console.log('placing units: ' + units)
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
      .then(data => this.updateUnits(data))
      .catch(err => console.log(err))
    },
    updateUnits(units) {
      this.localUnits = units
      var result = {}
      units.forEach(u => result[u.id] = u)
      this.unsavedUnits = result
      this.$emit('update:units', units)
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
      this.localUnits = val
      this.saveUnits()
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