const API_URL = "http://localhost:8080"

Vue.use(VueLayers)

var app = new Vue({ 
  el: '#root',
  data: {
    token: '',
    airbases: ['KUTAISI', 'MAYKOP'],
    selectedAirbase: 'KUTAISI',
    campaigns: [],
    factions: [],
    campaignFactions: [],
    selectedCampaign: '',
    selectedFaction: '',
    selectedCampaignFaction: '',
    credits: 0,
    estimate: 0,
    warehouse: {},
    newBasketName: "UH_1H",
    newBasketAmount: 1,
    basket: {},
    units: [],
    map: {
      zoom: 7,
      center: [41, 43],
      rotation: 0
    }
  },
  methods: {
    getRequest: function(url, consumer) {
      var t = this
      fetch(API_URL+url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer' + this.token
        }
      })
      .then(res => res.json())
      .then(data => consumer.call(t, data))
      .catch(err => console.log(err))
    },
    setRequest: function(method, url, body, consumer){
      var t = this
      fetch(API_URL+url, {
        method: method.toUpperCase(),
        headers: {
          'Authorization': 'Bearer' + this.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(data => consumer.call(t, data))
      .catch(err => console.log(err))
    },
    fetchAll: function() {
      this.fetchFactions()
      this.fetchCampaigns()
    },
    fetchFactions: function() {
      this.getRequest('/factionmanager-api/factions', data => {
        this.factions = data
        this.selectedFaction = this.selectedFaction ? this.selectedFaction : data[0]
      })
    },
    fetchCampaigns: function() {
      this.getRequest('/campaignmanager-api/campaigns', data => {
        this.campaigns = data
        this.selectedCampaign = this.selectedCampaign ? this.selectedCampaign : data[0]
        
        this.fetchCampaignFactions()
      })
    },
    fetchCampaignFactions: function() {
      if (!this.selectedCampaign) {
        return;
      }
      this.getRequest('/campaignmanager-api/campaigns/'+this.selectedCampaign+'/factions', data => {
        this.campaignFactions = data
        this.selectedCampaignFaction = this.selectedCampaignFaction ? this.selectedCampaignFaction : data[0].faction

        this.fetchWarehouse()
        this.fetchUnits()
        this.fetchCredits()
      })
    },
    fetchCredits: function() {
      if (!this.selectedCampaign || !this.selectedFaction) {
        return;
      }
      this.getRequest('/factionmanager-api/factions/'+this.selectedFaction+'/campaigns/'+this.selectedCampaign+'/credits', data => {
        this.credits = data
      })
    },
    fetchUnits: function() {
      if (!this.selectedCampaign || !this.selectedFaction) {
        return;
      }
      this.getRequest('/factionmanager-api/factions/'+this.selectedFaction+'/campaigns/'+this.selectedCampaign+'/units', data => {
        this.units = data
      });
    },
    fetchWarehouse: function() {
      this.getRequest('/factionmanager-api/factions/'+this.selectedFaction+'/campaigns/'+this.selectedCampaign+'/warehouse', data => {
        var wh = {}
        data.items.forEach(i => wh[i.name] = i.amount)
        this.warehouse = wh
      })
    },
    addCampaign: function() {
      var name = prompt("New campaign name")
      this.setRequest('post', '/campaignmanager-api/campaigns', {name: name}, data => {
        this.fetchPicklists()
      })
    },
    addFaction: function() {
      var name = prompt("New faction name")
      this.setRequest('post', '/factionmanager-api/factions', {name: name}, data => {
        this.fetchPicklists()
      })
    },
    addFactionToCampaign: function() {
      var req = {
        faction: this.selectedFaction,
        airbase: this.selectedAirbase
      }
      this.setRequest('post', '/campaignmanager-api/campaigns/'+this.selectedCampaign+'/factions', req, data => {
        this.fetchPicklists()
      })
    },
    emptybBasket: function() {
      this.basket = {}
      this.estimate = 0
    },
    addToBasket: function() {
      var count = this.basket[this.newBasketName]
      count = count ? count : 0
      count = count + this.newBasketAmount
      this.basket[this.newBasketName] = count
      this.calculateBasket()
    },
    calculateBasket: function() {
      var req = {items: []}
      for (const prop in this.basket) {
        req.items.push({name: prop, amount: this.basket[prop]})
      }
      this.setRequest('post', '/common-api/warehouseestimate', req, data => {
        this.estimate = data
      })
    },
    buyBasket: function() {
      var req = {items: []}
      for (const prop in this.basket) {
        req.items.push({name: prop, amount: this.basket[prop]})
      }
      this.setRequest('post', '/factionmanager-api/factions/'+this.selectedFaction+'/campaigns/'+this.selectedCampaign+'/warehouse', req, data => {
        this.emptybBasket()
        this.fetchAll()
      })
    }
  },
  mounted() {
    if (localStorage.token) {
      this.token = localStorage.token
      this.fetchAll()
    }
  },
  watch: {
    token(newToken) {
      localStorage.token = newToken
      this.fetchAll()
    }
  }
});
