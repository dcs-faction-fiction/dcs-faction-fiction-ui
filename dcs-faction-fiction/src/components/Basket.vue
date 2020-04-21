<!--


-->

<template>
  <div>
<br/>
    <select v-model="selectedItem">
      <option v-for="i in availableItems" :key="i">{{i}}</option>
    </select>
    <input v-model="selectedQuantity"/>
    <button @click="add">ADD</button>
    <br/>
    
    Basket({{estimate}}c): {{basket}}
    <br/>
    <button @click="buy">BUY</button>
    <button @click="emptyBasket">EMPTY BASKET</button>
<br/><br/>
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
      availableItems: [],
      selectedItem: undefined,
      selectedQuantity: 1,
      estimate: 0,
      basket: {}
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
        this.availableItems = data.warehouseItems
        this.selectedItem = this.selectedItem ? this.selectedItem : this.availableItems[0]
      })
      .catch(err => console.log(err))
    },
    emptyBasket() {
      this.basket = {}
      this.estimate = 0
    },
    add() {
      var count = this.basket[this.selectedItem]
      count = count ? count : 0
      count = count + parseInt(this.selectedQuantity)
      this.$set(this.basket, this.selectedItem, count)
      this.calculateBasket()
    },
    calculateBasket() {
      var req = {items: []}
      for (const prop in this.basket) {
        req.items.push({name: prop, amount: this.basket[prop]})
      }
      fetch(this.apiUrl+'/common-api/warehouseestimate', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer' + localStorage.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req)
      })      
      .then(r => r.json())
      .then(data => this.estimate = data)
      .catch(err => console.log(err))
    },
    buy() {
      // BUY
      var req = {items: []}
      for (const prop in this.basket) {
        req.items.push({name: prop, amount: this.basket[prop]})
      }
      fetch(this.apiUrl+'/factionmanager-api/factions/'+localStorage.faction+'/campaigns/'+localStorage.campaign+'/warehouse', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer' + localStorage.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req)
      })
      .then(() => {
        this.emptyBasket()
        this.$eventHub.$emit('warehouse-update')
      })
      .catch(err => console.log(err))
    }
  },
  created() {
    this.$eventHub.$on('logged-in', this.loadAvailableItems);
  },
  beforeDestroy() {
    this.$eventHub.$off('logged-in');
  }
}
</script>

<style>

</style>