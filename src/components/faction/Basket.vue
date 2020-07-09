<!--


-->

<template>
  <div>

    <div class="md-layout md-gutter md-alignment-center-left">
      <div class="md-layout-item md-size-50">
        <md-field>
          <label>Type</label>
          <md-select v-model="selectedItem">
            <md-option v-for="i in availableItems" :key="i" :value="i">{{i}}</md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-size-10">
        <md-field>
          <label>Amount</label>
          <md-input v-model="selectedQuantity"/>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-button @click="add">Add to basket</md-button>
      </div>
    </div>
    <div class="md-layout md-alignment-center-left">
      <div class="md-layout-item">
        Basket<br/>
        <span class="csv" v-for="(qty, name) in basket" :key="name">
          {{name}}({{qty}}) <button @click="basketPlus(name)">+</button> <button @click="basketMinus(name)">-</button>
        </span>
      </div>
    </div>

    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item">
        Cost to buy: ({{estimate}}c)
      </div>
    </div>

    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item">
        
    <md-button @click="buy">BUY</md-button>
    <md-button @click="emptyBasket">EMPTY BASKET</md-button>
      </div>
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
      this.basketSumAlgeb(this.selectedItem, this.selectedQuantity);
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
    basketPlus(name) {
      this.basketSumAlgeb(name, 1);
    },
    basketMinus(name) {
      this.basketSumAlgeb(name, -1);
    },
    basketSumAlgeb(name, num) {
      var count = this.basket[name]
      count = count ? count : 0
      count = parseInt(count) + parseInt(num)
      if (count > 0) {
        this.$set(this.basket, name, count)
      } else {
        delete this.basket[name]
      }
      this.calculateBasket()
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
        this.$eventHub.$emit('credits-update')
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
.csv + .csv:before {
  content: ", ";
}
</style>