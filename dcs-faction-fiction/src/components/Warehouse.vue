<!--


-->

<template>
  <div>{{warehouse}}</div>
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
    airbase: String
  },
  data() {
    return {
      warehouse: {}
    }
  },
  methods: {
    getWarehouse() {
      if (!this.campaign || !this.faction || !this.airbase) {
        return
      }
      fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/warehouse', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
      })
      .then(resp => resp.json())
      .then(data => this.updateWarehouse(data))
      .catch(err => console.log(err))
    },
    updateWarehouse(warehouse) {
      this.warehouse = warehouse
    }
  },
  watch: {
    faction() {
      this.getWarehouse()
    },
    campaign() {
      this.getWarehouse()
    },
    airbase() {
      this.getWarehouse()
    }
  },
  created() {
    this.$eventHub.$on('logged-in', this.getWarehouse);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>