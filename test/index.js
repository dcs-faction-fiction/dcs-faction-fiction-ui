const API_URL = "http://localhost:8080"

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
    units: []
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

        this.fetchUnits()
      })
    },
    fetchUnits: function() {
      if (!this.selectedCampaign || !this.selectedFaction) {
        return;
      }
      this.getRequest('/factionmanager-api/factions/'+this.selectedFaction+'/campaigns/'+this.selectedCampaign+'/units', data => {
        this.units = data
        console.log(data)
      });
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
