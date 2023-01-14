<template>
  <van-popup v-model="widgetVisible" position="center" get-container="body"  
    :overlay-style="{}" 
    class='LiquidityConfirm'>
    <div class="" v-if="widgetVisible&&state == 1 && pairInfo">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <h3>{{ $t('pool.content.add.confirm.s1[0]') }}</h3>
      <div class="receive" >
        <p v-if="pairInfo.totalSupply"> {{ pairBalance()  | hideDecimal  }} </p>
        <p v-else>100%</p>
        <img :src="setUrl(pairInfo.coinList[0].icon)" alt="">
        <img :src="setUrl(pairInfo.coinList[1].icon)" alt="">
      </div>
      <h3>{{pairInfo.coinList[0].name}}/{{pairInfo.coinList[1].name}} {{ $t('pool.content.add.confirm.s1[1]') }}</h3>
      <p>{{ $t('pool.content.add.confirm.s1[2]') }} {{slippage}}% {{ $t('pool.content.add.confirm.s1[3]') }}</p>
      <div class="info">
        <div>
          <p>{{pairInfo.coinList[0].name}} {{ $t('pool.content.add.confirm.s1[4]') }}</p>
          <p> <img :src="setUrl(pairInfo.coinList[0].icon)" alt=""> <span>{{ amount1  | hideDecimal }}</span> </p>
        </div>
        <div>
          <p>{{pairInfo.coinList[1].name}} {{ $t('pool.content.add.confirm.s1[4]') }}</p>
          <p> <img :src="setUrl(pairInfo.coinList[1].icon)" alt=""> <span>{{ amount2  | hideDecimal }}</span> </p>
        </div>
        <div class="rate">
          <p>{{ $t('pool.content.add.confirm.s1[5]') }}</p>
          <p> <span>1 {{pairInfo.coinList[0].name}} = {{ BigNumber( amount2 ).div( amount1).toFixed(18) | hideDecimal }} {{pairInfo.coinList[1].name}}</span> </p>
        </div>
        <div>
          <p></p>
          <p> <span>1 {{pairInfo.coinList[1].name}} = {{ BigNumber(amount1).div(amount2).toFixed(18) | hideDecimal  }} {{pairInfo.coinList[0].name}}</span> </p>
        </div>
        <div>
          <p>{{ $t('pool.content.add.confirm.s1[6]') }}</p>
          <!-- <p>{{common.fromWei(amount1,pairInfo.coinList[0].decimals)}}</p> -->
          <p v-if="pairInfo.totalSupply"> <span>{{ BigNumber(common.toWei(amount1,pairInfo.coinList[0].decimals)).div(BigNumber(common.toWei(amount1,pairInfo.coinList[0].decimals)).plus(pairInfo.coinList[0].balance)).multipliedBy(100) | hideDecimal }}</span> % </p>
          <p v-else>100%</p>
        </div>
      </div>
      <div class="btn" @click="addLiquidity">{{ $t('pool.content.add.confirm.s1[7]') }}</div>
    </div>
    <div  v-if="state == 2">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="load">
        <div class="loading"></div>
        <h3>{{ $t('pool.content.add.confirm.s2[0]') }}</h3>
        <p>{{text}}</p>
        <span>{{ $t('pool.content.add.confirm.s2[1]') }}</span>
      </div>
    </div>
    <div  v-if="state == 3">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../assets/img/complete.svg" alt="">
        <h3>{{ $t('pool.content.add.confirm.s3[0]') }}</h3>
        <p>{{text}}</p>
        <div class="btn" @click="widgetVisible=false">{{ $t('pool.content.add.confirm.s3[1]') }}</div>
      </div>
    </div>
    <div  v-if="state == 4">
      <div class="close" @click="widgetVisible=false"><img src="../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../assets/img/fail.svg" alt="">
        <h3>{{ $t('pool.content.add.confirm.s4[0]') }}</h3>
        <div class="btn" @click="widgetVisible=false">{{ $t('pool.content.add.confirm.s4[1]') }}</div>
      </div>
    </div>
  </van-popup>
</template>
<script>

import { mapMutations,mapState } from "vuex";
export default {
  
  computed: { ...mapState(['records','deadline','slippage']) },
  props:{
    pairInfo:'',
    amount1:'',
    amount2:''
  },
  data() {
    return {
      widgetVisible:false,
      state:1,//1:创建订单前 2:加载中 3:创建成功 4:创建失败
      text:'',
      timer:null
    }
  },
  mounted() {
    
  },
  methods:{
    ...mapMutations(["setRecords"]),
    setUrl(name){
      try {
        return require(`../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../assets/img/coin/unknown.svg')
      }
    },
    show(){ 
      this.state = 1
      this.widgetVisible = true 
      // this.setTime()
      
    },
    pairBalance(){
      let num = this.common.fromWei(this.BigNumber(this.common.toWei(this.amount1,this.pairInfo.coinList[0].decimals)).div(this.pairInfo.coinList[0].balance).multipliedBy(this.pairInfo.totalSupply).toFixed(1).split('.')[0],this.pairInfo.decimals)
      return num
    },
    setTime(){
      this.timer = setInterval(()=>{
        console.log(new Date().getTime())
        console.log(this.pairInfo.blockTimestampLast)
      },1000)
    },
    addLiquidity(){
      
      let deadline = Math.floor(new Date().getTime()/1000) + this.deadline*60
      this.text = `Supplying ${this.$hideDecimal(this.amount1)} ${this.pairInfo.coinList[0].name} and ${this.$hideDecimal(this.amount2)} ${this.pairInfo.coinList[1].name}`
      let amountADesired = this.common.toWei(this.amount1,this.pairInfo.coinList[0].decimals)
      let amountAMin = this.common.toWei(this.amount1*(1-(this.slippage/100)),this.pairInfo.coinList[0].decimals) 
      let amountBDesired = this.common.toWei(this.amount2,this.pairInfo.coinList[1].decimals)
      let amountBMin = this.common.toWei(this.amount2*(1-(this.slippage/100)),this.pairInfo.coinList[1].decimals) 
      if(amountAMin==='0'){
        

        this.$toast( `The amount of ${this.pairInfo.coinList[0].name} is 0 after slippage calculation and cannot be traded`)
        return
      }else if(amountBMin==='0'){
        this.$toast(`The amount of  ${this.pairInfo.coinList[1].name} is 0 after slippage calculation and cannot be traded`)
        return
      }
      this.state =2
      this.ercMethods.addLiquidity(
        this.pairInfo.coinList[0].address,
        this.pairInfo.coinList[1].address,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        deadline,res=>{
        if(res.code==200){
          let obj = {
            hash:res.data,
            type:'liquidity',
            state:1,
            pairAddress:this.pairInfo.pairAddress,
            msg:this.text
          }
          
          this.setRecords(obj)
          this.state =3
        }else{
          console.log(res)
          this.state =4
        }
      })
    },
    
  },
  watch:{
    widgetVisible(newval,oldval){
      console.log(newval,oldval)
      if(!newval){
        clearInterval(this.timer)
      }
    }
  },
  components: {
  }
}
</script>
<style lang='less' scoped>
.LiquidityConfirm{
  background: rgba(0,0,0,0);
  top:250px;
  transform:translate3d(-50%,0,0);
  &>div{
    width: 344px;
    background: #565A66;
    border-radius: 12px;
    top: 120px;
    box-sizing: border-box;
    padding: 30px 20px;
    &>.close{
      position: absolute;
      right: 0;
      top: 0;
      padding: 10px;
      line-height: 0;
      font-size: 0;
      cursor: pointer;
      img{
        width: 30px;
        height: 30px;
      }
    }
    &>h3{
      font-size: 18px;
      line-height: 20px;
      font-weight: normal;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    &>p{
      font-size: 12px;
      font-weight: 400;
      color: rgba(255, 255, 255, .6);
      line-height: 18px;
      margin-bottom: 25px;
    }
    .receive{
      display: flex;
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 16px;
      p{
        font-size: 26px;
        color: #fff;
        margin: 0;
        font-weight: 600;
        margin-right: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      img{
        width: 36px;
        height: 36px;
        position: relative;
        z-index: 1;
        &:last-of-type{
          left: -10px;
          z-index: 0;
        }
      }
    }
    .info{
      div{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        margin-bottom: 10px;
        &.rate{
          margin-bottom: 5px;
        }
        &:last-of-type{
          margin-bottom: 0;
        }
        p{
          color: #fff;
          font-size: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          img{
            width: 20px;
            margin-right: 5px;
          }
          &:last-of-type{
            z-index: 0;
            padding-left: 10px;
            flex: 1;
            overflow: hidden;
            padding-left: 12px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            box-sizing: border-box;
            span{
              text-align: right;
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .btn{
      height: 60px;
      line-height: 60px;
      border-radius: 30px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      background: #2B7EFF;
      color: #FFFFFF;
      margin-top: 25px;
    }
    .load{
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      padding-top: 40px;
      .loading{
        width: 50px;
        height: 50px;
        margin-bottom: 20px;
      }
      h3{
        color: #fff;
        font-weight: normal;
        margin-bottom: 16px;
      }
      p{
        font-size: 16px;
        color: #fff;
        margin-bottom: 16px;
        white-space:normal; word-break:break-all;
      }
      span{
        font-size: 12px;
        color: #fff;
      }
    }
    .complete{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-top: 40px;
      img{
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
      }
      h3{
        color: #fff;
        font-weight: normal;
        margin-bottom: 16px;
      }
      p{
        color: #2B7EFF;
        font-size: 14px;
      }
      &>div{
        width: 100%;
      }
    }
  }
  @media screen and (max-width: 600px){
    top: 100px;
    width: 100%;
    &>div{
      width: 90%;
      margin: 0 auto;
      &>.close{
        right: 5%;
      }
    }
  }
}
</style>
