<template>
  <div class='AddLiquidity'>
    <div class="form">
      <img class="swap-icon" src="../../assets/img/plus.svg" alt="">
      <div class="input-group">
        <p> <span>{{ $t('pool.content.add.form[0]') }}</span> <span>{{ $t('swap.form[1]') }}{{common.balance(coin1) | hideDecimal}}</span> </p>
        <div>
          <div class="input-box">
            <input type="text" v-model="amount1" @input="amount1Input" placeholder="0.0">
          </div>
          <div class="btns">
            <div class="max" @click="max">{{ $t('swap.form[2]') }}</div>
            <SelectToken ref="SelectToken1" v-model="coin1" @change="coinChage(1)" ></SelectToken>
          </div>
        </div>
      </div>
      <div class="input-group">
        <p> <span>{{ $t('pool.content.add.form[0]') }}</span> <span>{{ $t('swap.form[1]') }}{{common.balance(coin2) | hideDecimal}}</span> </p>
        <div>
          <div class="input-box">
            <input type="text"  v-model="amount2" @input="amount2Input" placeholder="0.0">
          </div>
          <SelectToken ref="SelectToken2" v-model="coin2"  @change="coinChage(2)"></SelectToken>
        </div>
      </div>
      <p  class="rate" v-if="coin1.name&&coin2.name"> 
        <span v-if="isCreate">1{{coin1.name}} = {{ this.amount2&&this.amount1? (BigNumber(this.amount2).div(this.amount1) ) :'--' }} {{coin2.name}} </span> 
        <span v-else>1{{coin1.name}} = {{price | hideDecimal}} {{coin2.name}} </span> 
      </p>
      <p class="rate" v-if="coin1.name&&coin2.name&&amount1&&amount2"> 
        <span>{{ $t('pool.content.add.form[1]') }}</span>
        <span v-if="isCreate">100%</span>
        <span v-else> {{ShareOfPool() | hideDecimal}} % </span>
        
      </p>
      <div class="Approve" v-if="!isApprove1||!isApprove2">
        <div v-if="coin1&&coin1.name&&!isApprove1" @click="approve(1)">{{ $t('swap.btn[4]') }} {{coin1.name}} <span v-if="isLoading&&loadingType===1" class="loading" ></span></div>
        <div v-if="coin2&&coin2.name&&!isApprove2" @click="approve(2)">{{ $t('swap.btn[4]') }} {{coin2.name}} <span v-if="isLoading&&loadingType===2" class="loading" ></span></div>
      </div>
      <div class="btns" v-if="!userInfo.address">
          <div class="btn ConnectWallet" @click="connectWallet">{{ $t('header[3]') }}</div>
        </div>
        <div class="btns" v-else-if="!userInfo.isNetwork">
          <div class="btn ConnectWallet" @click="connectNetwork">{{ $t('swap.btn[0]') }}</div>
        </div>
      <div class="btns" v-else>
        <div class="btn" :class="coin1.name&&coin2.name&&amount1>0&&amount2>0&&isApprove1&&isApprove2&&'active'"  @click="ConfirmLiquidity">{{isCreate?$t('pool.content.add.btn[2]'):$t('pool.content.add.btn[1]')}}{{ $t('pool.content.add.btn[0]') }}</div>
      </div>
      <div class="position" v-if="pairInfo&&pairInfo.totalSupply">
        <h3>{{ $t('pool.content.add.position[0]') }}</h3>
        <div>
          <p> 
            <img v-if="pairInfo.coinList[0].icon" :src="setUrl(pairInfo.coinList[0].icon)" alt="">
            <img v-if="pairInfo.coinList[1].icon" :src="setUrl(pairInfo.coinList[1].icon)" alt=""> 
            {{ pairInfo.coinList[0].name+'/'+pairInfo.coinList[1].name }}</p>
          <p>{{common.fromWei(pairInfo.totalSupply,pairInfo.decimals) | hideDecimal}}</p>
        </div>
        
        <div>
          <p>{{ $t('pool.content.add.position[1]') }}</p>
          <p>{{ pairInfo.balance === '0'?0:BigNumber(pairInfo.balance).div(pairInfo.totalSupply).multipliedBy(100).toFixed(18) | hideDecimal}}%</p>
        </div>
        <div>
          <p>{{pairInfo.coinList[0].name}}</p>
          <p>{{common.fromWei(pairInfo.coinList[0].balance,pairInfo.coinList[0].decimals) | hideDecimal}}</p>
        </div>
        <div>
          <p>{{pairInfo.coinList[1].name}}</p>
          <p>{{common.fromWei(pairInfo.coinList[1].balance,pairInfo.coinList[1].decimals) | hideDecimal}}</p>
        </div>
      </div>
    </div>
    <!-- <div class="pairInfo">
      <p v-if="coin1.name">
        {{coin1.name}}精度:{{coin1.decimals}} <span v-if="pairInfo&&pairInfo.totalSupply">矿池余额:{{ common.fromWei(pairInfo.coinList[0].balance,coin1.decimals) }}</span> 
      </p>
      <p v-if="coin2.name">
        {{coin2.name}}精度:{{coin2.decimals}} <span v-if="pairInfo&&pairInfo.totalSupply">矿池余额:{{common.fromWei(pairInfo.coinList[1].balance,coin2.decimals)}}</span> 
      </p>
      <p v-if="pairInfo&&pairInfo.totalSupply">交易对总量：{{pairInfo.totalSupply}},精度：{{pairInfo.decimals}},本人占比：{{pairInfo.balance}}</p>
    </div> -->
    <LiquidityConfirm 
      :pairInfo = "pairInfo" 
      :amount1 = "amount1"
      :amount2 = "amount2"
      ref="LiquidityConfirm">
    </LiquidityConfirm>
  </div>
</template>
<script>

import { mapMutations,mapState } from "vuex";
import SelectToken from '@/components/SelectToken.vue'
import LiquidityConfirm from '@/components/LiquidityConfirm.vue'
export default {
  components: {
    SelectToken,
    LiquidityConfirm
  },
  data() { 
    return {
      isLoading:false,
      amount1:'',
      amount2:'',
      coin1:'',
      coin2:'',
      isCreate:false,//当前选中交易对是否需要创建流动性
      isApprove1:true,
      isApprove2:true,
      loadingType:0,//1:coin1 2:coin2 3:Add liquidity
      pairInfo:{},
      price:'',
      timer:null
    }
  },
  computed: { ...mapState(['userInfo','slippage']) },  
  mounted() {
    
    if(this.$route.params.address1){
      this.coin1={address:this.$route.params.address1}
      this.coin2={address:this.$route.params.address2}
      
      setTimeout(()=>{
        this.$refs.SelectToken1.currCoin()
        this.$refs.SelectToken2.currCoin()
      },500)
    }
    
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  methods: {
    ...mapMutations([ "setRecords"]),
    connectWallet(){
      this.$parent.$parent.$refs.header.$refs.User.ConnectWalletVisible = true
    },
    connectNetwork(){
      this.$parent.$parent.$refs.header.$refs.User.switchNetwork('heco')
    },
    max(){
      this.amount1 = this.common.fromWei(this.coin1.balance,this.coin1.decimals)
      this.amount1Input()
    },
    getPair(){
      clearTimeout(this.timer)
      //查询选中交易对是否有流动性信息
      if(!this.coin1.address||!this.coin2.address)return
      this.ercMethods.getPair(this.coin1.address,this.coin2.address,res=>{
        // console.log(res)
        if(res.code === 200){//有流动性信息则继续查询流动性详情
          this.ercMethods.pairInfo(res.data,res=>{
            this.timer = setTimeout(()=>{this.getPair()},3000)
            if(res.code === 200){
              if(this.ercMethods.toAddress(res.data.coinList[0].address) === this.ercMethods.toAddress(this.coin1.address)&&
              this.ercMethods.toAddress(res.data.coinList[1].address) === this.ercMethods.toAddress(this.coin2.address)){
                this.pairInfo = res.data
                this.pairInfo.coinList[0].decimals = this.coin1.decimals
                this.pairInfo.coinList[0].name = this.coin1.name
                this.pairInfo.coinList[0].icon = this.coin1.icon
                this.pairInfo.coinList[1].decimals = this.coin2.decimals
                this.pairInfo.coinList[1].name = this.coin2.name
                this.pairInfo.coinList[1].icon = this.coin2.icon
                // console.log(this.common.fromWei(this.pairInfo.coinList[1].balance,this.pairInfo.coinList[1].decimals))
                // console.log(this.common.fromWei(this.pairInfo.coinList[0].balance,this.pairInfo.coinList[0].decimals))
                this.price = this.BigNumber( 
                  this.common.fromWei(this.pairInfo.coinList[1].balance,this.pairInfo.coinList[1].decimals) 
                  ).div(
                    this.common.fromWei(this.pairInfo.coinList[0].balance,this.pairInfo.coinList[0].decimals)
                  ).toFixed(18)
                
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
                this.price = this.BigNumber(
                  this.common.fromWei(this.pairInfo.coinList[1].balance,this.pairInfo.coinList[1].decimals)
                  ).div(
                    this.common.fromWei(this.pairInfo.coinList[0].balance,this.pairInfo.coinList[0].decimals) 
                  ).toFixed(18)
              }else{
                this.pairInfo = {
                  balance:'',
                  decimals:'',
                  coinList:[
                    this.coin1,
                    this.coin2,
                  ],
                  pairAddress:'',
                  totalSupply:''
                }
              }
              // this.price = Math.floor(this.price*100000000)/100000000
            }
            
          })
          this.isCreate = false
        }else{//无流动性信息则提示用户创建流动性
          this.pairInfo = {
            balance:'',
            decimals:'',
            coinList:[
              this.coin1,
              this.coin2,
            ],
            pairAddress:'',
            totalSupply:''
          }
          this.isCreate = true
        }
        
      })
    },
    ConfirmLiquidity(){
      if(!(this.amount1>0&&this.amount2>0)){
        this.$toast(this.$t('toast[3]'))
        return
      }
      if(!this.coin1.address||!this.coin2.address){
        this.$toast(this.$t('toast[4]'))
        return
      }
      if(!this.isApprove1){
        this.$toast(`${ this.coin1.name } not approved`)
        return
      }
      if(!this.isApprove2){
        this.$toast(`${ this.coin2.name } not approved`)
        return
      }
      let tokenA = this.coin1.address
      let tokenB = this.coin2.address
      let amountADesired = this.common.toWei(this.amount1,this.coin1.decimals)
      let amountBDesired = this.common.toWei(this.amount2,this.coin2.decimals)
      
      let amountAMin = this.common.toWei(this.amount1*(1-(this.slippage/100)),this.coin1.decimals)
      let amountBMin = this.common.toWei(this.amount2*(1-(this.slippage/100)),this.coin2.decimals)
      if(amountADesired*1>this.coin1.balance*1){
        this.$toast(`${ this.coin1.name } ${this.$t('toast[5]')}`)
        return
      }
      if(amountBDesired*1>this.coin2.balance*1){
        this.$toast(`${ this.coin2.name } ${this.$t('toast[5]')}`)
        return
      }
      this.$refs.LiquidityConfirm.show(tokenA,tokenB,amountADesired,amountBDesired,amountAMin,amountBMin)
    },
    coinChage(coin){//type
      if(this.coin1.address&&this.coin2.address){
        if(this.coin1.address==this.coin2.address){
          if(coin === 1){
            this.coin2 = {}
          }else{
            this.coin1 = {}
          }
        }else{
          this.getPair()
        }
        this.price = ''
        this.pairInfo = {}
        this.amount1 = ''
        this.amount2 = ''
        if(this.userInfo.isNetwork){
          if(this.coin1&&this.coin1.address){
            this.routerAllowance(1)
          }
          if(this.coin2&&this.coin2.address){
            this.routerAllowance(2)
          }
        }
      }
    },
    approve(coin){//授权
      if(this.isLoading) return
      this.isLoading = true
      this.loadingType = coin
      let address
      if(coin===1){
        address = this.coin1.address
      }else{
        address = this.coin2.address
      }
      this.ercMethods.routerApprove(address,res=>{
        // console.log(res)
        if(res.code === 200){
          let obj = {
            hash:res.data,
            type:'approve',
            state:1,
            address:coin===1?this.coin1.address:this.coin2.address,
            msg:`Approve ${coin===1?this.coin1.name:this.coin2.name}`
          }
          this.setRecords(obj)
          this.receipt(res.data,coin)
        }else{
          this.$toast(this.$t('toast[2]'))
          this.isLoading = false
        }
      })
    },
    receipt(hash,coin){
      // console.log(hash)
      this.ercMethods.receipt(hash,res=>{
        if(res.code == 200){
          if(res.msg){
            if(this.isApprove1&&this.isApprove2){
              let  logs = res.data.logs
              let log = logs[logs.length-1]
              let inputs = []
              this.decodeLog(inputs,log.data,log.topics)
            }else{
              this.routerAllowance(coin)
            }
            //区块查询成功
          }else{
            this.$toast({
              message:'EVM rolled back the transaction, please try again',
              duration:5000,
              position:'top'
            })
            this.isLoading = false
            //区块查询失败
          }
        }else{
          setTimeout(()=>{
            this.receipt(hash,coin)
          },2000)
        }
        
      })
    },
    routerAllowance(coin){
      let address
      if(coin===1){
        address = this.coin1.address
      }else{
        address = this.coin2.address
      }
      this.ercMethods.routerAllowance(address,res=>{
        // console.log(res)
        if(coin===1){
          if(res.code===200&&res.data!=='0'){
            this.isApprove1 = true
          }else{
            this.isApprove1 = false
          }
        }else if(coin===2){
          if(res.code===200&&res.data!=='0'){
            this.isApprove2 = true
          }else{
            this.isApprove2 = false
          }
        }
        this.isLoading = false
      })
    },
    decodeLog(inputs,hexString,topics){
      let res = this.ercMethods.decodeLog(inputs,hexString,topics)
      console.log(res)
      this.isLoading = false
    },
    amount1Input(){ 
      this.amount1 = this.amount1 + ""
      if(this.coin1&&this.coin1.decimals==='0'){
        this.amount1 = this.amount1.replace(/[^\d]/g,"");  //清除“数字”以外的字符  
      }else{
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
        this.amount1 = this.amount1.replace(RegExp(reg),'$1$2.$3');//只能输入12个小数
      }
      if(this.amount1.indexOf(".")< 0 && this.amount1 !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        this.amount1= parseFloat(this.amount1);
      }
      if(this.coin1.address&&this.coin2.address&&this.price){
        if(this.amount1>0&&this.price!=0){
          console.log(1111)
          let amount2 = this.BigNumber( this.common.toWei(this.amount1,this.pairInfo.coinList[0].decimals) ).div(this.pairInfo.coinList[0].balance).multipliedBy(this.pairInfo.coinList[1].balance)
          // console.log(amount2.toFixed(1).split('.')[0])
          this.amount2 = this.common.fromWei(amount2.toFixed(1).split('.')[0],this.pairInfo.coinList[1].decimals)
        }else{
          this.amount2 =''
        }
      }
      
    },
    amount2Input(){ 
      this.amount2 = this.amount2 + ""
      if(this.coin2&&this.coin2.decimals==='0'){
        this.amount2 = this.amount2.replace(/[^\d]/g,"");  //清除“数字”以外的字符 
      }else{
        // if(this.amount2[0]=='.'){
        //   this.amount2 = '0.'
        // }
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
        this.amount2 = this.amount2.replace(RegExp(reg),'$1$2.$3');//只能输入12个小数
      }
      if(this.amount2.indexOf(".")< 0 && this.amount2 !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        this.amount2= parseFloat(this.amount2);
      }
      if(this.coin1.address&&this.coin2.address&&this.price){
        if(this.amount2>0&&this.price!=0){
          let rate = this.BigNumber( this.common.toWei(this.amount2,this.pairInfo.coinList[1].decimals) ).div(this.pairInfo.coinList[1].balance).multipliedBy(this.pairInfo.coinList[0].balance)
          this.amount1 = this.common.fromWei(rate.toFixed(8).split('.')[0],this.pairInfo.coinList[0].decimals)
        }else{
          this.amount1 =''
        }
      }
    },
    setUrl(name){
      try {
        return require(`../../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../../assets/img/coin/unknown.svg')
      }
    },
    ShareOfPool(){
      let rate = this.BigNumber(this.amount1).div(
          this.BigNumber(this.amount1).plus( 
            this.common.fromWei(this.pairInfo.coinList[0].balance,this.pairInfo.coinList[0].decimals) 
          )
        ).multipliedBy(100).toFixed(18)
      // if(rate === '0.00000000'){
      //   return '<0.00000001'
      // }else{
      //   rate = rate.replace(/0+$/g,"")
      //   if(rate[rate.length-1] === '.'){
      //     return  rate.split('.')[0]
      //   }else{
          return  rate
      //   }
      // }

    } 
  },
  watch: {
    
    "userInfo.networkId": {
      deep: true,
      handler: function (newValue, oldValue) {
        this.amount1 = ''
        this.amount2 = ''
        this.price = ''
        this.coin1 = {}
        this.coin2 = {}
      }
    },
    "userInfo.address": {
      deep: true,
      handler: function (newValue, oldValue) {
        this.amount1 = ''
        this.amount2 = ''
        this.price = ''
        this.coin1 = {}
        this.coin2 = {}
      }
    }
  },
}
</script>
<style lang='less' scoped>
.AddLiquidity{
  padding-top: 32px;
  .form{
    position: relative;
    .swap-icon{
      position: absolute;
      top: 104px;
      left: 50%;
      margin-left: -14px;
      width: 28px;
      height: 28px;
    }
    .input-group{
      background: rgba(107, 110, 119, .8);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      &:first-of-type{
        margin-bottom: 32px;
      }
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
    .rate{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 24px;
      span{
        font-size: 16px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
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
        &.ConnectWallet{
          background: #393A3E;
          color: #FFFFFF;
        }
      }
    }
    
  }
  .position{
    margin-top: 24px;
    h3{
      font-size: 18px;
      font-weight: normal;
      color: #FFFFFF;
      line-height: 22px;
      margin-bottom: 16px;
    }
    div{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 8px;
      &:first-of-type{
        margin-bottom: 16px;
      }
      p{
        font-size: 16px;
        line-height: 20px;
        color: #FFFFFF;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        
        img{
          position: relative;
          z-index: 1;
          width: 36px;
          height: 36px;
          &:last-of-type{
            z-index: 0;
            margin-left: -10px;
            margin-right: 10px;
          }
          
        }
        &:last-of-type{
            // z-index: 0;
            // left: -10px;
            // // flex: 1;
            display: block;
            padding-left: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
      }
    }
  }
  @media screen and (max-width: 600px){
    .AddLiquidity{
      padding-top: 20px;
    }
    .form{
      .swap-icon{
        top: 87px;
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
      .position{
        div{
          p{
            
            img{
              width: 26px;
              height: 26px;
             
            }
          }
        }
      }
    }
  }
}
</style>