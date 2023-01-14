<template>
  <van-popup v-model="widgetVisible" position="center" get-container="body"  
    :overlay-style="{}" 
    class='withdraw'>
    <div class="" v-if="state == 1 ">
      <div class="close" @click="widgetVisible=false"><img src="../../../assets/img/close.svg" alt=""></div>
      <h3>{{ $t('mining.withdraw.normal[0]') }}</h3>
      <div class="cantainer">
        <div>
          <div>
            <span>{{ $t('mining.withdraw.normal[1]') }} ( {{ info.coin.indexOf('/')===-1?info.coin:'LP' }} )</span>
            <p>{{depositAmount}} </p>
          </div>
          <img v-if="info.coin.indexOf('/')===-1" :src="setUrl(info.coin)" alt="">
          <img v-if="info.coin.indexOf('/')>-1" :src="setUrl(info.coin.split('/')[0])" alt="">
          <img v-if="info.coin.indexOf('/')>-1" :src="setUrl(info.coin.split('/')[1])" alt="">
        </div>
        <div class="withdrawBtn" :class="depositAmount!=='0'&&'active'" @click="withdraw">{{ $t('mining.withdraw.normal[0]') }}{{ $t('mining.withdraw.normal[1]') }} </div>
      </div>
      <div class="cantainer">
        <div>
          <div>
            <span>{{ $t('mining.withdraw.normal[2]') }} ( {{ info.intervalCoin }} )</span>
            <p >{{intervalAmount | hideDecimal}}</p>
          </div>
          <img :src="setUrl(info.intervalCoin)" alt="">
        </div>
        <div class="withdrawBtn"  :class="intervalAmount!=='0'&&'active'" @click="withdrawRewards">{{ $t('mining.withdraw.normal[0]') }}{{ $t('mining.withdraw.normal[2]') }}</div>
      </div>
      
    </div>
    <div  v-if="state == 2">
      <div class="close" @click="widgetVisible=false"><img src="../../../assets/img/close.svg" alt=""></div>
      <div class="load">
        <div class="loading"></div>
        <h3>{{ $t('mining.withdraw.s2[0]') }}</h3>
        <p>{{text}}</p>
        <span>{{ $t('mining.withdraw.s2[1]') }}</span>
      </div>
    </div>
    <div  v-if="state == 3">
      <div class="close" @click="widgetVisible=false"><img src="../../../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../../../assets/img/complete.svg" alt="">
        <h3>{{ $t('mining.withdraw.s3[0]') }}</h3>
        <p>{{text}}</p>
        <div class="btn" @click="widgetVisible=false">{{ $t('mining.withdraw.s3[1]') }}</div>
      </div>
    </div>
    <div  v-if="state == 4">
      <div class="close" @click="widgetVisible=false"><img src="../../../assets/img/close.svg" alt=""></div>
      <div class="complete">
        <img src="../../../assets/img/fail.svg" alt="">
        <h3>{{ $t('mining.withdraw.s4[0]') }}</h3>
        <div class="btn" @click="widgetVisible=false">{{ $t('mining.withdraw.s4[1]') }}</div>
      </div>
    </div>
  </van-popup>
</template>
<script>

import { mapMutations,mapState } from "vuex";
export default {
  
  
  props:{
    info:{
      type:Object,
      default:()=>{
        return {
          coin:'',
          intervalCoin:'',
          address:'',
          bankAddress:'',
          decimals:'',
          totalAmount:'',
          isInvite:false,
          apy:''
        }
      }
    },
    depositAmount:'',
    intervalAmount:''
  },
  data() {
    return {
      widgetVisible:false,
      state:1,//1:创建订单前 2:加载中 3:创建成功 4:创建失败
      text:'',
    }
  },
  computed: { 
    ...mapState(['records','slippage','deadline']),
    
  },
  mounted() {
  },
  methods:{
    ...mapMutations(["setRecords"]),
    show(){ 
      this.state = 1
      this.widgetVisible = true 
    },
    withdraw(){
      if(this.depositAmount==='0'){return}
      this.state = 2
      this.text = `Withdraw ${ this.depositAmount } ${this.info.coin}  ${ this.intervalAmount>0?'and'+this.intervalAmount+this.info.intervalCoin:''  } `
      this.miningContract.withdraw(this.info.bankAddress,res=>{
        if(res.code==200){
          let obj = {
            hash:res.data,
            type:'withdraw',
            state:1,
            bankAddress:this.info.bankAddress,
            address:this.info.address,
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
    withdrawRewards(){
      if(this.intervalAmount==='0'){return}
      this.state = 2
      this.text = `Withdraw ${ this.intervalAmount } ${this.info.intervalCoin}`
      this.miningContract.withdrawRewards(this.info.bankAddress,res=>{
        if(res.code==200){
          let obj = {
            hash:res.data,
            type:'withdrawRewards',
            state:1,
            bankAddress:this.info.bankAddress,
            address:this.info.address,
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
    setUrl(name){
      try {
        return require(`../../../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../../../assets/img/coin/unknown.svg')
      }
    },
  },
  components: {
  }
}
</script>
<style lang='less' scoped>
.withdraw{
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
    .cantainer{
      background: RGBA(111, 114, 122, 1);
      border-radius: 22px;
      padding: 20px;
      margin-bottom: 20px;
      &:last-of-type{
        margin: 0;
      }
      &>div{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        margin-bottom: 16px;
        &.withdrawBtn{
          height: 50px;
          line-height: 50px;
          border-radius: 30px;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
          margin-top: 10px;
          justify-content: center;
          border: 1px solid #A2A5B2;  
          font-size: 16px;
          font-weight: bold;
          color: rgba(255, 255, 255, .8);
          &.active{
            color: #fff;
            background: #2B7EFF;
            border: 1px solid #2B7EFF; 
          }
        }
        &:last-of-type{
          margin-bottom: 0;
        }
        img{
          width: 36px;
          height: 36px;
          position: relative;
          z-index: 1;
          &:nth-of-type(1){
            left: 10px;
          }
          &:last-of-type{
            left: 0;
          }
        }
        div{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          box-sizing: border-box;
          padding:  0 ;
          flex: 1;
          overflow: hidden;
          p{
            width: 100%;
            color: #fff;
            font-size: 20px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          span{
            color: rgba(255, 255, 255, .6);
            font-size: 14px;
          }
        }
        
      }
    }
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
      text-align: center;
    }
    .btn{
      height: 50px;
      line-height: 50px;
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
