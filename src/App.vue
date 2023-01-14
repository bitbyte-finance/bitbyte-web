<template>
  <div id="app">
    <Header ref="header"></Header>
    <Version />
    <router-view/>
    <Footer />
  </div>
</template>
<script>
import { mapMutations,mapState } from "vuex";
import coin from "@/utils/coinList.json"
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer'
import Version from '@/components/Version'
export default {
  name:'App',
  components:{
    Header,
    Footer,
    Version
  },
  computed: { ...mapState(['userInfo','records']) },
  created() {
    const lan = localStorage.getItem('zooswap-lang')
    this.$i18n.locale = lan || 'en'
  },
  mounted() {
  },
  methods:{
    refreshCoinList(){
      // console.log(!localStorage.getItem('coinList'+this.userInfo.networkId))
      if(!localStorage.getItem('coinList'+this.userInfo.networkId)||localStorage.getItem('coinList'+this.userInfo.networkId)=='[]'){
        if(coin[window.ethereum.networkVersion]){
          let newList = coin[window.ethereum.networkVersion]
          newList.sort((a,b)=>{
            return a.name.localeCompare(b.name)
          })
          localStorage.setItem('coinList'+this.userInfo.networkId,JSON.stringify(newList))
        }else{
          localStorage.setItem('coinList'+window.ethereum.networkVersion,'[]')
        }
      }else{
        if(coin[window.ethereum.networkVersion]){
          let newList = coin[window.ethereum.networkVersion]
          let oldList = JSON.parse(localStorage.getItem('coinList'+this.userInfo.networkId))
          let arr = []
          newList.forEach(item => {
            let hasCoin = false
            for (let i = 0; i < oldList.length; i++) {
              const el = oldList[i];
              if(this.ercMethods.toAddress(item.address)  === this.ercMethods.toAddress(el.address)){
                hasCoin = true
                break
              }
            }
            if(!hasCoin){
              arr.push(item)
            }
          });
          oldList = arr.concat(oldList)
          oldList.sort((a,b)=>{
            return a.name.localeCompare(b.name)
          })
          localStorage.setItem('coinList'+this.userInfo.networkId,JSON.stringify(oldList))
        }
      }
    },
  },
  watch: {
    "userInfo.networkId": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue){
          this.refreshCoinList()
        }
        
      }
    }
  },
}
</script>
<style lang="less">
#app{
  width: 100%;
  min-height: 100vh;
  background:  url('assets/img/swap-bg02.png') no-repeat center 118px;
  background-size: 550px 632px;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 150px;
}
/* ios input阴影 */
input {
outline: none;
-webkit-appearance: none;
/*去除系统默认的样式*/
-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
/* 点击高亮的颜色*/
}


//IOS点击阴影
select{
-webkit-tap-highlight-color: transparent;
-webkit-touch-callout: none;
-webkit-user-select: none;
user-select:none;
}
</style>
