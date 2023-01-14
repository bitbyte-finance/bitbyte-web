<template>
  <div class="swap-box">
    <div v-if="isCheckOver && !hasParent" class="invite-banner">
      <div class="left">
        <img src="@/assets/img/inviteBanner/icon-invite.png" alt="">
        <p>{{ $t('swap.inviteBanner[0]') }}</p>
      </div>
      <img class="icon-coin-medium" src="@/assets/img/inviteBanner/icon-coin-medium.png" alt="">
      <img class="icon-coin-small" src="@/assets/img/inviteBanner/icon-coin-small.png" alt="">
      <div @click="openInvitePop" class="btn-invite">
        <p>{{ $t('swap.inviteBanner[1]') }}</p>
      </div>
    </div>
    <Invite ref="Invite" ></Invite>

    <div class="Swap">
      <div >
        <div class="nav">
          <p class="active">{{ $te('header_en[0]') ? $t('header_en[0]') : $t('header[0]') }}</p>
          <p @click="$router.push('/Pool')">{{ $te('header_en[1]') ? $t('header_en[1]') : $t('header[1]') }}</p>
          <p @click="$router.push('/Mining')">{{ $te('header_en[2]') ? $t('header_en[2]') : $t('header[2]') }}</p>
          <p @click="$router.push('/farm')">{{ $te('header_en[4]') ? $t('header_en[4]') : $t('header[4]') }}</p>
        </div>
        <div class="form">
          <img class="swap-icon" @click="switchCoin" src="../assets/img/swap-icon.svg" alt="">
          <div class="input-group">
            <p>
              <span>{{ $t('swap.form[0]') }}</span>  <span v-show="coin1.address">{{ $t('swap.form[1]') }}{{common.balance(coin1) | hideDecimal}}</span>
            </p>
            <div>
              <div class="input-box">
                <input type="text" v-model="amount1" @input="amount1Input" placeholder="0.0">
              </div>
              <div class="btns">
                <div class="max" v-show="coin1.address" @click="max">{{ $t('swap.form[2]') }}</div>
                <SelectToken ref="SelectToken" v-model="coin1"  @change="coinChage(1)"></SelectToken>
              </div>
            </div>
          </div>
          <div class="input-group">
            <p>
              <span>{{ $t('swap.form[3]') }}</span> <span v-show="coin2.address">{{ $t('swap.form[1]') }} {{common.balance(coin2) | hideDecimal}}</span>
            </p>
            <div>
              <div class="input-box">
                <input type="text" v-model="amount2" @input="amount2Input"  placeholder="0.0">
              </div>
              <SelectToken v-model="coin2" @change="coinChage(2)"></SelectToken>
            </div>
          </div>
          <div class="price" v-if="price1&&price2">
            <img src="../assets/img/repeat.svg" alt="" @click=" showPrice1 = !showPrice1 ">
            <p v-if="showPrice1">1 {{coin1.name}} = {{price1 | hideDecimal(8)}} {{coin2.name}}</p>
            <p v-else>1 {{coin2.name}} = {{price2 | hideDecimal(8)}} {{coin1.name}}</p>
          </div>
          <div class="Approve" v-if="pairInfo&&pairInfo.coinList&&userInfo.isNetwork&&!isApprove">
            <div  @click="approve()">{{ $t('swap.btn[4]') }} {{coin1.name}} <span v-if="isLoading" class="loading" ></span></div>
          </div>
          <div class="btns" v-if="!userInfo.address">
            <div class="btn ConnectWallet" @click="connectWallet">{{ $t('header[3]') }}</div>
          </div>
          <div class="btns" v-else-if="!userInfo.isNetwork">
            <div class="btn ConnectWallet" @click="connectNetwork">{{ $t('swap.btn[0]') }}</div>
          </div>
          <div class="btns" v-else>
            <div class="btn" v-if="insufficient">{{ $t('swap.btn[1]') }}</div>
            <div class="btn" v-else-if="!amount1">{{ $t('swap.btn[2]') }}</div>
            <div class="btn" v-else-if="!coin1.address||!coin2.address">{{ $t('swap.select[0]') }}</div>

            <div class="btn" v-else-if="!pairInfo||!pairInfo.coinList">{{ $t('swap.btn[1]') }}</div>
            <div class="btn " :class="isApprove" v-else-if="this.priceImpact==='0'" >{{ $t('swap.btn[3]') }}</div>
            <div class="btn " :class="isApprove&&'active'" v-else-if="!this.priceImpact||this.priceImpact[0]==='<'||parseFloat(this.priceImpact)<=5" @click="ConfirmSwap">{{ $t('swap.btn[3]') }}</div>
            <div class="btn " :class="isApprove&&'Wrong'"  v-else-if="parseFloat(this.priceImpact)<=15" @click="ConfirmSwap">{{ $t('swap.btn[5]') }}</div>
            <div class="btn " v-else-if="parseFloat(this.priceImpact)>15" style="background:red;color:#fff">{{ $t('swap.btn[6]') }}</div>
          </div>
        </div>
        <!-- <p>{{pairInfo}}</p> -->
        <div class="info" v-if="amount1&&amount2&&coin1.address&&coin2.address&&pairInfo.coinList">
          <div>
            <div>
              <p>{{ $t('swap.info[0]') }}</p>
              <img src="../assets/img/questionMark.svg" alt="">
              <div class="tips">{{ $t('swap.info[1]') }}</div>
              <i class="arrow"></i>
            </div>
            <p>{{slippage}}%</p>
          </div>
          <div>
            <div>
              <p>{{ $t('swap.info[2]') }}</p>
              <img src="../assets/img/questionMark.svg" alt="">
              <div class="tips">{{ $t('swap.info[3]') }}</div>
              <i class="arrow"></i>
            </div>
            <p style="color: rgb(254, 173, 99)">
              <span  > {{priceImpact}} %</span>
            </p>
          </div>
          <div>
            <div>
              <p>{{ $t('swap.info[4]') }}</p>
              <img src="../assets/img/questionMark.svg" alt="">
              <div class="tips">{{ $t('swap.info[5]') }}</div>
              <i class="arrow"></i>

            </div>
            <p>{{ amountOutMin | hideDecimal  }} {{ coin2.name }}</p>
          </div>
          <div>
            <div>
              <p>{{ $t('swap.info[6]') }}</p>
              <!-- <img src="../assets/img/questionMark.svg" alt=""> -->
            </div>
            <p>{{fee | hideDecimal}} {{ coin1.name }}</p>
          </div>
        </div>
      </div>
      <SwapConfirm ref="SwapConfirm"
                   :pairInfo="pairInfo"
                   :coin1="coin1"
                   :coin2="coin2"
                   :price1="price1"
                   :price2="price2"
                   :amount1="amount1"
                   :amount2="amount2"
                   :amountOutMin ="amountOutMin"
                   :loadingPair ="loadingPair"
                   :fee="fee"
      ></SwapConfirm>
    </div>
  </div>
</template>
<script>

import SelectToken from '@/components/SelectToken.vue'
import SwapConfirm from '@/components/SwapConfirm.vue'
import Invite from '@/components/Invite.vue'

import { mapMutations,mapState } from "vuex";
export default {
  components: {
    SelectToken,
    SwapConfirm,
    Invite
  },
  computed: { 
    ...mapState(['userInfo','records','slippage','deadline']),
    amountOutMin(){
      if(this.amount2&&this.coin2&&this.coin2.decimals){
        // console.log(this.amount2)
        // console.log(this.coin2.decimals)
        // console.log(this.common.toWei(this.amount2,this.coin2.decimals))
        // console.log(this.BigNumber( this.common.toWei(this.amount2,this.coin2.decimals) ).multipliedBy(1-(this.slippage/100)).toFixed(1).split('.')[0])
        // return this.BigNumber( this.common.toWei(this.amount2,this.coin2.decimals) )
        return this.common.fromWei(this.BigNumber( this.common.toWei(this.amount2,this.coin2.decimals) ).multipliedBy(1-(this.slippage/100)).toFixed(1).split('.')[0],this.coin2.decimals)
      }else{
        return 0
      }
    },
  },
  data() {
    return {
      showPrice1:true,
      amount1:'',
      amount2:'',
      coin1:{},
      coin2:{},
      isLoading:false,
      isApprove:true,
      pairInfo:{},
      price1:'',
      price2:'',
      fee:'',
      priceImpact:'',
      insufficient:false,
      timer:null,
      loadingPair:false,
      date:0,
      hasParent: false,  // 当前地址是否有邀请人
      isCheckOver: false,
    };
  },
  mounted() {
    
    // this.coin1 = {address:"0xd74fbc5C01f5CC70F875EC7c0c2cc4303bD2C8dF"}
    // this.coin2 = {address:"0xb4756de238FfAA918A1EC6edDC21954F6f8cA496"}
    // this.pairInfo = {"coinList":[{"address":"0xd74fbc5C01f5CC70F875EC7c0c2cc4303bD2C8dF","balance":"65300000000000000000","decimals":"18","name":"BT","icon":"BT"},{"address":"0xb4756de238FfAA918A1EC6edDC21954F6f8cA496","balance":"65300000000000000000","decimals":"18","name":"IT","icon":"unknown"}],"pairAddress":"0xacdae586e1C13C03Db21297fFAC15Db797B9e1f4","totalSupply":"65300000000000000000","decimals":"18","balance":"65299999999999999000"}
    
    // setTimeout(()=>{
    //   this.amount1 = 1
    //   this.amount1Input()
    // },1000)
    // console.log( this.$hideDecimal)
    this.checkHasParent()
  },
  destroyed() {
    this.loadingPair = false
  },
  methods: {
    refresh(){
      this.amount1 = ''
      this.amount2 = ''
    },
    connectWallet(){
      this.$parent.$refs.header.$refs.User.ConnectWalletVisible = true
    },
    connectNetwork(){
      this.$parent.$refs.header.$refs.User.switchNetwork('heco')
    },
    ...mapMutations([ "setUserInfo","setRecords","resetRecords"]),
    showSettings(){
      this.ercMethods.getAmountIn('17500000','18000095','21111111')
      // this.ercMethods.getAmountOut('10000000','18000095','21111111')
      return
      this.$refs.TransactionSettings.show()
    },
    switchCoin(){
      if(new Date().getTime()-this.date>2000){
        this.date = new Date().getTime()
      }else{
        return
      }
      let coin1 = JSON.parse(JSON.stringify(this.coin1))
      let coin2 = JSON.parse(JSON.stringify(this.coin2))
      this.coin1 = coin2
      this.coin2 = coin1
      if(this.coin1&&this.coin1.address){
        this.routerAllowance()
      }
      if(this.pairInfo&&this.pairInfo.coinList){
        let coinList = JSON.parse(JSON.stringify(this.pairInfo.coinList)) 
        this.pairInfo.coinList = [coinList[1],coinList[0]]
      }
      this.amount1Input()
      if(!this.pairInfo||!this.pairInfo.coinList){
        this.amount2Input()
      }
      
    },
    ConfirmSwap(){
      if(this.isApprove){
        this.$refs.SwapConfirm.show()
      }
    },
    getPair(){
      //查询选中交易对是否有流动性信息
      if(this.loadingPair){return}
      this.loadingPair = true
      this.ercMethods.getPair(this.coin1.address,this.coin2.address,res=>{
        // console.log(res)
        let pairAddress = res.data
        if(res.code === 200){//有流动性信息则继续查询流动性详情
          this.ercMethods.pairInfo(res.data,res=>{
            console.log(res)
            this.loadingPair = false
            if(res.code === 200){
              this.insufficient = false
              if(this.ercMethods.toAddress(res.data.coinList[0].address) === this.ercMethods.toAddress(this.coin1.address)&&this.ercMethods.toAddress(res.data.coinList[1].address) === this.ercMethods.toAddress(this.coin2.address)){
                
                this.pairInfo = res.data
                this.pairInfo.coinList[0].decimals = this.coin1.decimals
                this.pairInfo.coinList[0].name = this.coin1.name
                this.pairInfo.coinList[0].icon = this.coin1.icon
                this.pairInfo.coinList[1].decimals = this.coin2.decimals
                this.pairInfo.coinList[1].name = this.coin2.name
                this.pairInfo.coinList[1].icon = this.coin2.icon
              }else if(this.ercMethods.toAddress(res.data.coinList[0].address) === this.ercMethods.toAddress(this.coin2.address)&&this.ercMethods.toAddress(res.data.coinList[1].address) === this.ercMethods.toAddress(this.coin1.address)){
                
                this.pairInfo = res.data
                let coinList = JSON.parse( JSON.stringify(res.data.coinList) )
                coinList[0].decimals = this.coin2.decimals
                coinList[0].name = this.coin2.name
                coinList[0].icon = this.coin2.icon
                coinList[1].decimals = this.coin1.decimals
                coinList[1].name = this.coin1.name
                coinList[1].icon = this.coin1.icon
                this.pairInfo.coinList = [coinList[1],coinList[0]]
              }
              console.log(this.pairInfo)
              this.pairInfo.pairAddress = pairAddress
              if(this.amount1){
                this.amount1Input()
              }else if(!this.amount1&&this.amount2){
                this.amount2Input()
              }
            }else{
              this.pairInfo = {}
              this.insufficient = true
            }
          })
        }else{//无流动性信息则提示用户创建流动性
         this.pairInfo = {}
         this.loadingPair = false
         this.insufficient = true
        }
        
        // console.log(res)
        // console.log(this.isCreate)
      })
    },
    coinChage(coin){//type
      if(coin===1){this.routerAllowance()}
      if(this.coin1.address&&this.coin2.address){
        this.pairInfo = {}
        if(this.coin1.address==this.coin2.address){
          if(coin === 1){
            this.coin2 = {}
            this.amount1Input()
          }else{
            this.coin1 = {}
            this.amount2Input()
          }
        }else{
          this.getPair()
        }
      }
    },
    approve(){//授权
      if(this.isLoading) return
      this.isLoading = true
      let address = this.coin1.address
      this.ercMethods.routerApprove(address,res=>{
        // console.log(res)
        if(res.code === 200){
          let obj = {
            hash:res.data,
            type:'approve',
            state:1,
            address:this.coin1.address,
            msg:`Approve ${this.coin1.name}`
          }
          this.setRecords(obj)
          this.receipt(res.data)
        }else{
          this.$toast(this.$t('toast[2]'))
          this.isLoading = false
        }
      })
    },
    receipt(hash){
      console.log(hash)
      this.ercMethods.receipt(hash,res=>{
        if(res.code == 200){
          if(res.msg){
            if(this.isApprove){
              let  logs = res.data.logs
              let log = logs[logs.length-1]
              let inputs = []
              this.decodeLog(inputs,log.data,log.topics)
            }else{
              this.routerAllowance()
            }
            //区块查询成功
          }else{
            this.$toast({
              message:res.msg,
              duration:5000,
              position:'top'
            })
            this.isLoading = false
            //区块查询失败
          }
        }else{
          setTimeout(()=>{
            this.receipt(hash)
          },2000)
        }
        
      })
    },
    routerAllowance(){
      let address = this.coin1.address
      this.ercMethods.routerAllowance(address,res=>{
        if(res.code===200&&res.data!=='0'){
          this.isApprove = true
        }else{
          this.isApprove = false
        }
        this.isLoading = false
      })
    },
    decodeLog(inputs,hexString,topics){
      let res = this.ercMethods.decodeLog(inputs,hexString,topics)
      console.log(res)
      this.isLoading = false
    },
    max(){
      if(this.coin1&&this.coin1.balance!==0){
        this.amount1 = this.ercMethods.fromWei(this.coin1.balance,this.coin1.deadline)
        if(this.pairInfo&&this.pairInfo.coinList){
          this.amount1Input()
        }
      }
      
      
    },
    amount1Input(){ 
      this.amount1 = this.amount1 + ""
      if(this.coin1&&this.coin1.decimals==='0'){
        this.amount1 = this.amount1.replace(/[^\d]/g,"");  //清除“数字”以外的字符 
      }else{
        // if(this.amount1[0]=='.'){
        //   this.amount1 = '0'+this.amount1
        // }
        this.amount1 = this.amount1.replace(/^\.$/g,"");  //清除第一个“.” 
        this.amount1 = this.amount1.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
      }  
      this.amount1 = this.amount1.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
      this.amount1 = this.amount1.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
      if(this.coin1&&this.coin1.decimals!=='0'){//根据精度控制小数位数
        let str = ''
        for (let i = 0; i < Number(this.coin1.decimals); i++) {
          str+= `\\d`
        }
        let reg = "^(\\-)*(\\d+)\\.("+str+").*$"
        this.amount1 = this.amount1.replace(RegExp(reg),'$1$2.$3');
      }
      if(this.amount1.indexOf(".")< 0 && this.amount1 !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        this.amount1= parseFloat(this.amount1);
      }
      this.insufficient = false
      if(this.coin1.address&&this.coin2.address&&this.pairInfo.coinList){
        // console.log(1)
        if(this.amount1>0){
          let amount1 = this.common.toWei(this.amount1,this.coin1.decimals)
          let fee = this.common.fromWei(this.BigNumber(this.common.toWei(this.amount1,this.coin1.decimals)).multipliedBy(0.003).toFixed(1).split('.')[0],this.coin1.decimals)
          // console.log(amount1)
          // console.log(this.pairInfo.coinList[0].balance)
          let num = this.common.getToAmount(amount1,this.pairInfo.coinList[0].balance,this.pairInfo.coinList[1].balance )
          // return
          console.log(num)
          let minmum =this.common.decimalsFilter(1,this.coin1.decimals)
          // if(this.coin1.balance === '0'){
          //   return
          // }
          if(fee*1 < minmum*1 ){
            console.log(1)
            this.fee = minmum
            amount1 = this.common.toWei(this.amount1,this.coin1.decimals) - this.common.toWei(minmum,this.coin1.decimals)
            
            num = this.common.getToAmount2(amount1,this.pairInfo.coinList[0].balance,this.pairInfo.coinList[1].balance )
            // console.log(num)
          }else{
            // console.log(2)
            this.fee = fee
          }
          this.amount2 = this.common.fromWei(num,this.coin2.decimals)
          this.setPrice()
        }else{
          this.amount2 =''
          this.price1 = ''
          this.price2 = ''
        }
      }else{
        // this.amount2 =''
        this.price1 = ''
        this.price2 = ''
      }
    },
    amount2Input(){ 
      this.amount2 = this.amount2 + ""
      if(this.coin2&&this.coin2.decimals==='0'){
        this.amount2 = this.amount2.replace(/[^\d]/g,"");  //清除“数字”以外的字符  
      }else{
        this.amount2 = this.amount2.replace(/^\.$/g,"");  //清除第一个“.” 
        this.amount2 = this.amount2.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
      }   
      this.amount2 = this.amount2.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
      this.amount2 = this.amount2.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
      if(this.coin2&&this.coin2.decimals!=='0'){//根据精度控制小数位数
        let str = ''
        for (let i = 0; i < Number(this.coin2.decimals); i++) {
          str+= `\\d`
        }
        let reg = "^(\\-)*(\\d+)\\.("+str+").*$"
        this.amount2 = this.amount2.replace(RegExp(reg),'$1$2.$3');
      }
      if(this.amount2.indexOf(".")< 0 && this.amount2 !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        this.amount2= parseFloat(this.amount2);
      }
      this.insufficient = false
      if(this.coin1.address&&this.coin2.address&&this.pairInfo.coinList){
        if(this.amount2>0){
          if(this.coin1.balance === '0'){
            return
          }
          let amount2 = this.common.toWei(this.amount2,this.coin2.decimals)
          let num = this.common.getFromAmount(amount2,this.pairInfo.coinList[0].balance,this.pairInfo.coinList[1].balance )
          this.amount1 = this.common.fromWei(num,this.coin1.decimals) 
          if(!this.amount1){
            this.insufficient = true
          }else{
            this.insufficient = false
          }
          this.setPrice()
        }else{
          this.amount1 =''
          this.price1 = ''
          this.price2 = ''
        }
      }else{
        // this.amount1 =''
        this.price1 = ''
        this.price2 = ''
      }
    },
    setPrice(){
      if(this.amount2 == 0){
        this.priceImpact = '0'
      }else if(this.BigNumber(this.amount2).div( this.common.balance(this.pairInfo.coinList[1]) )<0.0001){
        this.priceImpact = '<0.01'
      }else{
         this.priceImpact = Math.floor(this.BigNumber(this.amount2).div(this.common.balance(this.pairInfo.coinList[1]))*10000)/100
      }
      this.price1 = this.BigNumber(this.amount2).div(this.amount1).toFixed(18)
      this.price2 = this.BigNumber(this.amount1).div(this.amount2).toFixed(18)
      // console.log(this.price1)
    },
    openInvitePop () {
      this.$refs.Invite.show()
    },
    checkHasParent (address) {
      this.miningContract.parentOf(address || this.userInfo.address)
        .then(res => {
          this.isCheckOver = true
          this.hasParent = true
        })
        .catch(e => {
          this.isCheckOver = true
          this.hasParent = false
        })
    }
  },
  watch:{
    "userInfo.networkId": {
      deep: true,
      handler: function (newValue, oldValue) {
        this.amount1 = ''
        this.amount2 = ''
        this.price1 = ''
        this.price2 = ''
        this.coin1 = {}
        this.coin2 = {}
      }
    },
    "userInfo.address": {
      deep: true,
      handler: function (newValue, oldValue) {
        this.amount1 = ''
        this.amount2 = ''
        this.price1 = ''
        this.price2 = ''
        this.coin1 = {}
        this.coin2 = {}
        this.checkHasParent(newValue)
      }
    }
  }
};
</script>
<style lang='less' scoped>
.swap-box {
  .invite-banner {
    background: url("../assets/img/inviteBanner/invite-banner.svg") no-repeat;
    background-size: 100% 100%;
    width: 452px;
    height: 94px;
    margin: 85px auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 28px 0 35px;
    position: relative;
    .left {
      display: flex;
      align-items: center;
      & > img:first-child {
        width: 34px;
        height: 34px;
      }
      p {
        margin-left: 4px;
        max-width: 220px;
      }
    }
    p {
      font-size: 15px;
      font-family: AlibabaPuHuiTi_2_85_Bold;
      color: #FFFFFF;
      line-height: 21px;
    }
    .icon-coin-medium {
      position: absolute;
      top: 44px;
      left: 293px;
      width: 35px;
      height: 35px;
    }
    .icon-coin-small {
      position: absolute;
      top: 9px;
      left: 315px;
      width: 26px;
      height: 29px;
    }
    .btn-invite {
      width: 72px;
      height: 34px;
      background: linear-gradient(180deg, #A8D9FF 0%, #428CFF 100%);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .Swap {
    .testText{
      font-size: 28px;
      font-family: 'Helvetica Neue';
      width:250px;
      overflow: hidden;
    }
    width: 100%;
    max-width: 420px;
    // background:hska(0,0%,100%,.3);
    border-radius: 32px;
    background: rgba(107, 110, 120, .9);
    overflow: hidden;
    margin: 0 auto;
    box-shadow: 0px 15px 40px rgba(0, 0, 0, .3);
    position: relative;
    &::after{
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, .14);
      border-radius: 32px;
      filter: blur(5px);
      z-index: 0;
    }
    &>div{
      position: relative;
      z-index: 1;
      width: 100%;
      box-sizing: border-box;
      padding: 24px;
      .nav{
        display: none;
      }
      .form{
        position: relative;
        .swap-icon{
          position: absolute;
          top: 94px;
          left: 50%;
          margin-left: -16px;
          width: 32px;
          height: 32px;
        }
        .input-group{
          background: rgba(107, 110, 119, .8);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;

          &>p{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            padding:  0 ;

            span{
              height: 18px;
              font-size: 14px;
              font-weight: 500;
              line-height: 18px;
              color: rgba(255, 255, 255, .6);
              &:last-of-type{
                padding-left: 10px;
                text-align: right;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
          &>div{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            padding:  0 ;
            margin-top: 12px;
            .input-box{
              flex: 1;
              input{
                width: 100%;
                background: transparent;
                border: none;
                outline: none;
                font-size: 32px;
                height: 40px;
                line-height: 40px;
                font-weight: 600;
                color: #fff;
                &::placeholder{
                  color: rgba(255, 255, 255, .6);
                }
              }
            }
            .btns{
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              box-sizing: border-box;
              padding:  0 ;
              padding-left: 8px;
              .max{
                line-height: 22px;
                border-radius: 12px;
                border: 1px solid #A2A5B2;
                font-size: 12px;
                font-weight: 400;
                padding: 0 8px;
                color: #FFFFFF;
                cursor: pointer;
                user-select: none;
              }

            }

          }
        }
        .price{
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          margin-bottom: 16px;
          cursor: pointer;
          img{
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
          p{
            font-size: 14px;
            color: #fff;
          }
        }
        &>.Approve{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          margin-bottom: 16px;
          div{
            flex: 1;
            height: 56px;
            line-height: 56px;
            text-align: center;
            background: #2B7EFF;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            color: #FFFFFF;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            padding:  0 ;
            span{
              margin-left: 10px;
            }
            &:nth-of-type(2){
              margin-left: 16px;
            }
          }
        }
        &>.btns{
          .btn{
            height: 72px;
            line-height: 72px;
            border-radius: 12px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            background: #565A66;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            user-select: none;
            &.active{
              background: #2B7EFF;
              color: #FFFFFF;
            }
            &.Wrong{
              background-color: #ff6871;color:#fff
            }
            &.ConnectWallet{
              background: #393A3E;
              color: #FFFFFF;
            }
          }
        }
      }
      .info{
        margin-top: 24px;
        &>div{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          margin-bottom: 8px;
          &:last-of-type{
            margin: 0;
          }
          p{
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
            color: #FFFFFF;
          }
          &>div{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            padding:  0 ;
            position: relative;
            img{
              width: 14px;
              margin-left:4px ;
              &:hover{
                &+.tips{
                  display: block;
                  &+.arrow{
                    display: block;
                  }
                }
              }
            }
            .tips{
              position: absolute;
              background: rgba(107, 110, 119, 1);
              box-shadow: 0 2px 12px rgba(50, 50, 51, .12);
              padding: 12px;
              border-radius: 12px;
              font-size: 12px;
              color: #fff;
              width: 170px;
              box-sizing: border-box;
              left: -10px;
              bottom: 26px;
              display: none;
            }
            .arrow{
              display: none;
              content: "";
              width: 14px;
              height: 14px;
              box-sizing: border-box;
              border: 7px solid transparent;
              border-top-color: rgba(107, 110, 119, 1);
              position: absolute;
              bottom: 13px;
              right: 0;
            }

          }
          &>p{
            text-align: right;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    @media screen and (max-width: 600px){
      width: 92%;
      margin-top: 40px;
      box-sizing: border-box;
      &>div{
        .nav{
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 10px;
          padding-bottom: 10px;
          p{
            position: relative;
            line-height: 40px;
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            margin-left: 20px;
            &.active{
              color: #fff;
              font-size: 14px;
              cursor: default;
              &::after{
                position: absolute;
                left: 0;
                bottom: -10px;
                content: "";
                width: 40px;
                height: 2px;
                background: #fff;
              }
            }
          }
        }
        .form{
          .swap-icon{
            top: 76px;
          }
          .input-group{
            padding: 12px;
            div{
              .input-box{
                input{
                  font-size: 20px;
                  line-height: 30px;
                  height: 30px;
                }
              }
            }
          }
          .Approve{
            div{
              height: 46px;
              line-height: 46px;
              border-radius: 6px;
            }
          }
          .btns{
            .btn{
              height: 52px;
              line-height: 52px;
              border-radius: 6px;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 600px) {
    .invite-banner {
      width: 343px;
      height: 80px;
      background: url("../assets/img/inviteBanner/invite-banner-h5.svg") no-repeat;
      padding: 0 12px 0 10px;

      .icon-coin-medium {
        top: 0;
        left: 263px;
        width: 32px;
        height: 35px;
      }
      .icon-coin-small {
        position: absolute;
        top: -12px;
        left: 303px;
        width: 25px;
        height: 25px;
      }
      .btn-invite {
        width: 80px;
        height: 32px;
        background: linear-gradient(180deg, #A8D9FF 0%, #428CFF 100%);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        margin-top: 36px;
      }
    }
  }
}
</style>