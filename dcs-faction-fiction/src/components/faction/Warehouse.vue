<!--


-->

<template>
  <div v-if="airbase">
    Warehouse of {{airbase}}:
    <span class="csv" v-for="w in warehouse.items" :key="w.name">
      {{w.name}}({{w.amount}})
    </span>
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
      .then(data => this.warehouse = data)
      .catch(err => console.log(err))
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
    this.$eventHub.$on('warehouse-update', this.getWarehouse);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
    this.$eventHub.$off('warehouse-update');
  }
}
</script>

<style>
.csv + .csv:before {
  content: ", ";
}
</style>