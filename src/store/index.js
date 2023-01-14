import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    userInfo:{
      address: "",
      balance: "",
      isNetwork: "",
      networkId:'',
    },
    records:[],
    slippage:0.5,
    deadline:20,
  },
  mutations: {
    setUserInfo(state,obj){
      // console.log(obj)
      Object.assign(state.userInfo, obj)
      // state.userInfo = obj
    },
    setRecords(state,obj){
      let hasObj = false
      for (let i = 0; i < state.records.length; i++) {
        const item = state.records[i];
        if(item.hash === obj.hash){
          hasObj = true
          Vue.set(state.records,i,obj)
          break 
        }
      }
      if(!hasObj){
        state.records.unshift(obj)
      }
      localStorage.setItem('records'+state.userInfo.address+state.userInfo.networkId,JSON.stringify(state.records))
    },
    setSlippage(state,val){
      state.slippage = val
    },
    setDeadline(state,val){
      state.deadline = val
    },
    resetRecords(state,arr){
      Vue.set(state,'records',arr)
    }

  },
  actions: {
  },
  modules: {
  }
})
