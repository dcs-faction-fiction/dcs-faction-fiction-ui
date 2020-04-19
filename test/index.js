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
    newUnit: {
      type: '',
      lat: 0,
      lon: 0
    },
    newBasketPossibleTypesUnits: [
      "BRADLEY",
      "ABRAMS"
    ],
    newBasketPossibleTypes: [
      "JET_FUEL_TONS",
      "AVIATION_GASOLINE_TONS",
      "MW50_TONS",
      "DIESEL_TONS",
      "F_14_B",
      "F_15_C",
      "F_16_C",
      "F_A_18_C",
      "SU_27",
      "SU_33",
      "MIG_29_S",
      "UH_1H",
      "KA_50",
      "AIM_120_B",
      "AIM_120_C",
      "AIM_54_A_MK_47",
      "AIM_54_A_MK_60",
      "AIM_54_C_MK_47",
      "AIM_7_F",
      "AIM_7_M",
      "AIM_7_MH",
      "AIM_9_L",
      "AIM_9_M",
      "AIM_9_P5",
      "AIM_9_X",
      "R_27_ER",
      "R_27_ET",
      "R_27_R",
      "R_27_T",
      "R_73",
      "R_60",
      "R_77",
      "AGM_122",
      "AGM_154_A",
      "AGM_154_C",
      "AGM_65_D",
      "AGM_65_E",
      "AGM_65_F",
      "AGM_65_G",
      "AGM_65_H",
      "AGM_65_K",
      "AGM_84_D",
      "AGM_88_C",
      "VIKHR"
    ],
    newBasketName: "JET_FUEL_TONS",
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
        this.fetchWarehouse()
        this.fetchCredits()
      })
    },
    buyUnit: function() {
      var req = {}
      req.type = this.newUnit.type
      req.location = {}
      req.location.latitude = this.newUnit.lat
      req.location.longitude = this.newUnit.lon
      req.location.altitude = 0
      req.location.angle = 0
      this.setRequest('post', '/factionmanager-api/factions/'+this.selectedFaction+'/campaigns/'+this.selectedCampaign+'/units', req, data => {
        this.fetchUnits()
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
