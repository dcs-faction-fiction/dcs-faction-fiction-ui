<!--

The context selector is a selection component that will choose the game required data in order to operate it.
This includes faction, campaign, airbase and all remaining to make the other components work out of the box.

-->

<template>
  <md-field>
    <label v-if="type=='faction'">Faction</label>
    <label v-if="type=='campaign'">Campaign</label>
    <md-select v-model="localSelection">
      <md-option v-for="o in options" :key="o" :value="o">{{o}}</md-option>
    </md-select>
  </md-field>
</template>

<script>
export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    type: { 
      type: String,
      default: 'faction'
    },
    selection: {},
    // Used for hierarchy  when type is campaign and user is faction manager
    faction: String,
    // Used for hierarchy  when type is faction and user is campaign manager
    campaign: String
  },
  data() {
    return {
      localSelection: this.selection,
      options: []
    }
  },
  methods: {
    getItems() {
      var path = this.apiUrl
      var dataTransformer = a => a
      switch (this.type) {
        case 'faction':
          if (this.campaign) {
            path += '/campaignmanager-api/campaigns/'+this.campaign+'/factions'
            // These factions are more than simple string arrays
            dataTransformer = a => a.map(b => b.faction)
          } else {
            path += '/factionmanager-api/factions'
          }
          break
        case 'campaign':
          if (this.faction) {
            path += '/factionmanager-api/factions/'+this.faction+'/campaigns'
          } else {
            path += '/campaignmanager-api/campaigns'
          }
          break
      }
      fetch(path, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+localStorage.token
        },
      })
      .then(resp => resp.ok ? resp.json() : [])
      .then(dataTransformer)
      .then(data => this.options = data)
      .catch(err => console.log(err))
    }
  },
  watch: {
    faction() {
      this.getItems()
    },
    campaign() {
      this.getItems()
    },
    localSelection(val) {
      this.$emit('update:selection', val)
    }
  },
  created() {
    this.$eventHub.$on('logged-in', this.getItems);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>