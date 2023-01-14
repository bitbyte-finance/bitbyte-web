<template>
<!-- :close-on-click-overlay = "false" -->
  <div class="SelectToken">
    <div class="select" @click="showPopup" v-if="modelVal&&modelVal.name">
      <img :src="setUrl(modelVal.name)" alt="">
      <div>
        <span>{{modelVal.name}}</span>
        <img src="../assets/img/arrow-bottom.svg" alt="">
      </div>
    </div>
    <div v-else class="select-token" @click="showPopup">{{ $t('swap.select[0]') }}</div>
    <van-popup v-model="widgetVisible" position="center" get-container="body"  
      :overlay-style="{backgroundColor: 'rgba(0,0,0,.5)'}" 
      class='popup'>
      <div class="top">
        <p>{{ $t('swap.select[1]') }}</p>
        <input type="text" v-model="value" :placeholder="$t('swap.select[2]')">
        <div class="close" @click="widgetVisible=false">
          <img src="../assets/img/close.svg" alt="">
        </div>
      </div>
      <ul v-if="value">
        <li :class="modelVal===item.name&&'active'" @click="selectToken(item)" v-for="(item,index) in serachList" :key="index">
          <img :src="setUrl(item.name)" alt="">
          <div>
            <p>{{item.name}}</p>
            <span>{{ $t('swap.form[1]') }}{{common.balance(item)|hideDecimal}}</span>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li :class="modelVal===item.name&&'active'" @click="selectToken(item)" v-for="(item,index) in coinList" :key="index">
          <img :src="setUrl(item.name)" alt="">
          <div>
            <p>{{item.name}}</p>
            <span>{{ $t('swap.form[1]') }}{{common.balance(item)|hideDecimal}}</span>
          </div>
        </li>
      </ul>
    </van-popup>
  </div>
</template>
<script>
import { mapMutations,mapState } from "vuex";
export default {
  model: {
    prop: 'modelVal',//指向props的参数名
    event: 'change'//事件名称
  },
  props:{
    modelVal:''
  },
  data() {
    return {
      widgetVisible:false,
      value:'',
      coinList:[],
      serachList:[]
    }
  },
  computed: { 
    ...mapState(['userInfo']) ,
  },
  mounted() {
    this.coinList = JSON.parse(localStorage.getItem('coinList'+this.userInfo.networkId))
    // 0x6010e1a66934C4D053E8866Acac720c4a093d956
  },
  methods:{
    showPopup(){ 
      this.getBalance()
      this.widgetVisible = true 
      this.value = ''
    },
    currCoin(){
      if(this.coinList.length<1||!this.modelVal.address||this.modelVal.balance)return
      let arr = this.coinList.filter(item=>{ 
        if( this.ercMethods.toAddress(item.address)  === this.ercMethods.toAddress(this.modelVal.address) ){ return item} 
      })
      if(arr.length>0){
          this.refreshBalance(arr[0])
        // return arr[0]
      }else{
        this.serachAddress(this.modelVal.address)
      }
    },
    serachAddress(address,isInput){
      let arr = this.coinList.filter(item=>{ 
        if(item.address === this.address){ return item} 
      })
      if(arr.length>0){
        this.$set(this.serachList,0,arr[0])
      }else{
        
        this.ercMethods.getCoinInfo(address,res=>{
          if(res.code === 200){
            this.setCoinList(res.data)
            if(isInput){
              this.$set(this.serachList,0,res.data)
            }
          }
        })
      }
    },
    serachName(name){
      let arr = this.coinList.filter(item=>{ 
        if(item.name.toLowerCase( ).indexOf(name.toLowerCase( ))>-1){ return item} 
      })
      if(arr.length>0){
        this.serachList = arr
      }
    },
    selectToken(selectCoin){
      // this.setCoinList([selectCoin])
      this.$emit('change',selectCoin);
      this.widgetVisible = false
    },
    setCoinList(obj){
      let arr = this.coinList.filter(item=>{ 
        if(item.address === obj.address){ return item} 
      })
      if(arr.length==0){
        let newList = JSON.parse(localStorage.getItem('coinList'+this.userInfo.networkId)).concat([obj])
        newList.sort((a,b)=>{
          return a.name.localeCompare(b.name)
        })
        localStorage.setItem('coinList'+this.userInfo.networkId,JSON.stringify(newList))
        this.coinList = JSON.parse(localStorage.getItem('coinList'+this.userInfo.networkId))
      }
      
    },
    getBalance(){
      this.coinList = JSON.parse(localStorage.getItem('coinList'+this.userInfo.networkId))
      this.coinList.forEach(item => {
        this.ercMethods.getBalance(item.address,res=>{
          if(res.code === 200){
            this.$set(item,'balance',res.data)
          }
        })
      })
    },
    refreshBalance(obj){
      if(window.ethereum.selectedAddress){
        this.ercMethods.getBalance(obj.address,res=>{
          if(res.code === 200){
            obj.balance = res.data
          }else{
            obj.balance = '0'
          }
          this.$emit('change',obj);
        })
      }
      
    },
    setUrl(name){
      try {
        return require(`../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../assets/img/coin/unknown.svg')
      }
    },
  },
  watch: {
    value(newVal,oldVal){
      // console.log(newVal.indexOf('0x'))
      this.serachList = []
      if(newVal.length===42&&this.ercMethods.toAddress(newVal).indexOf('0x')===0){
        this.serachAddress(newVal,true)
      }else{
        console.log('coinName')
        this.serachName(newVal)
      }
    },
    // "userInfo.address": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     if(newValue){
    //       this.getBalance()
    //       this.value = ''
    //     }
        
    //   }
    // }
  },
  
}
</script>
<style lang='less' scoped>
.SelectToken{
  .select{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding:  0 ;
    margin-left: 8px;
    cursor: pointer;
    user-select: none;
    &>img{
      width: 36px;
      height: 36px;
    }
    div{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-left:8px ;
      span{
        font-size: 24px;
        font-weight: 600;
        color: #FFFFFF;
      }
      img{
        width: 14px;
        height: 14px;
        margin-left:8px ;
      }
    }
  }
  .select-token{
    height: 40px;
    margin-left: 8px;
    line-height: 40px;
    background: #2B7EFF;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    padding: 0 18px;
    cursor: pointer;
  }
  @media screen and (max-width: 600px){
    .select{
      img{
        width: 26px;
        height: 26px;
      }
      div{
        span{
          font-size: 20px;
        }
      }
    }
    .select-token{
      height: 30px;
      line-height: 30px;
      padding: 0 8px;
      font-size: 14px;
    }
  }
}
.popup{
    // top:250px;
    // transform:translate3d(-50%,0,0);
    width: 344px;
    height: 600px;
    background: #565A66;
    border-radius: 12px;
    box-sizing: border-box;
    padding:  24px 0;
    &>.top{
      margin-bottom: 16px;
      padding:0 24px;
      box-sizing: border-box;
      width: 100%;
      position: relative;
      p{
        font-size: 16px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 20px;
        margin-bottom: 28px;
      }
      input{
        width: 100%;
        box-sizing: border-box;
        background: transparent;
        height: 48px;
        border-radius: 16px;
        border: 1px solid #2B7EFF;
        padding: 0 16px;
        font-size: 16px;
        font-weight: 500;
        color: #FFFFFF;
        outline: none;
        &::placeholder{
          color: rgba(255, 255, 255, .5);
        }
      }
      .close{
        position: absolute;
        right: 16px;
        top: -5px;
        cursor: pointer;
        img{
          width: 30px;
          height: 30px;
        }
      }
    }
    ul{
      li{
        padding: 0 24px;
        height: 65px;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        transition: all .3s;
        &:hover{
          background: rgba(255, 255, 255, .6);
        }
        &.active{
          background: rgba(255, 255, 255, .1);
        }
        img{
          width: 36px;
          margin-right: 16px;
        }
        div{
          p{
            font-size: 18px;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 22px;
          }
          span{
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, .5);
            line-height: 16px;
            margin-top: 4px;
          }
        }
      }
    }
  }

</style>
