<template>
  <van-popup v-model="widgetVisible" position="center" get-container="body"  
    :overlay-style="{}" 
    class='reward'>
    <div class="" v-if="state == 1 ">
      <div class="close" @click="widgetVisible=false"><img src="../../../assets/img/close.svg" alt=""></div>
      <h3>修改收益率</h3>
      <div class="cantainer">
        <div class="coin">
          <p v-if="info.coin.indexOf('/')===-1">
            <img :src="setUrl(info.coin)" alt="">
            <span>{{ info.coin }}</span>
          </p>
          <p v-else>
            <img :src="setUrl(info.coin.split('/')[0])" alt="">
            <img :src="setUrl(info.coin.split('/')[1])" alt="">
            <span>{{ info.coin }} </span>
          </p>
          <span>
            Harvest {{info.intervalCoin}}
          </span>
        </div>
        <p> 
          <span>当前1个{{info.coin }}每天产生{{rewardsEachPeriod}}个{{ info.intervalCoin }}</span>
        </p>
        <p v-clipboard:copy="info.bankAddress" v-clipboard:success="copySuccess" v-clipboard:error="copyError">{{info.bankAddress}}</p>
        <div class="inputBox">
          <div class="box"><input v-model="amount" type="text" @input="amountInput" :placeholder="`请输入1个${info.coin }每天产生${ info.intervalCoin }的数量`" ></div>
        </div>
      </div><div class="btn" @click="setRewardsRate">Confirm</div>
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
          decimals:'',
          address2:'',
          decimals2:'',
          bankAddress:'',
          decimals:'',
          totalAmount:'',
          isInvite:false,
        }
      }
    },
    depositAmount:'',
    intervalAmount:'',
    lockAmount:'',
  },
  data() {
    return {
      widgetVisible:false,
      state:1,//1:创建订单前 2:加载中 3:创建成功 4:创建失败
      text:'',
      balance:'',
      amount:'',
      isApprove:false,
      isLoading:false,
      rewardsEachPeriod:'',
    }
  },
  computed: { 
    ...mapState(['records','slippage','deadline']),
    
  },
  mounted() {
    
  },
  methods:{
    ...mapMutations(["setRecords"]),
    copySuccess(e) {  this.$toast(this.$t('toast[0]')) },
    copyError(e) {  this.$toast(this.$t('toast[1]')) },
    show(){ 
      this.amount = ''
      this.allRewardRates()
      this.state = 1
      this.widgetVisible = true 
    },
    allRewardRates(){
      this.miningContract.allRewardRates(this.info.bankAddress,res=>{
        if(res.code==200){
          this.rewardsEachPeriod = this.common.fromWei(res.data[res.data.length-1].rewardsEachPeriod,this.info.decimals2)
        }
      })
    },
    amountInput(){ 
      this.amount = this.amount + ""
      this.amount = this.amount.replace(/^\.$/g,"");  //清除第一个“.” 
      this.amount = this.amount.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
      this.amount = this.amount.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
      this.amount = this.amount.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
      if(this.amount.indexOf(".")< 0 && this.amount !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        this.amount= parseFloat(this.amount);
      }
    },
    setRewardsRate(){
      console.log(this.amount)
      if(!this.amount){
        this.$toast(this.$t('mining.deposit.normal[3]'))
        return
      }
      this.state = 2
      this.text = `${this.info.coin} 矿池收益修改为每天发放 ${ this.amount }个${this.info.intervalCoin} `
       this.miningContract.setRewardsRate( this.common.toWei(this.amount,this.info.decimals2),this.info.bankAddress ,res=>{
        if(res.code==200){
          let obj = {
            hash:res.data,
            type:'setRewards',
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
.reward{
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
      .coin{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: 20px;
        p{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          img{
            width: 36px;
            position: relative;
            z-index: 1;
            &:nth-of-type(2){
              margin-left: -10px;
              z-index: 0;
            }
          }
          span{
            font-size: 20px;
            font-weight: 500;
            color: #fff;
            margin-left: 8px;
          }
          overflow: hidden;
          flex: 1;
          &:last-of-type{
            flex: 1;
            justify-content: flex-start;
            overflow: hidden;
            box-sizing: border-box;
            padding-right: 10px;
            span{
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        &>span{
          font-size: 14px;
          color: rgba(255, 255, 255, .6);
        }
      }
      &>p{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        color: rgba(255, 255, 255, .6);
        height: 16px;
        margin-bottom: 10px;
        overflow: hidden;
        span{
          font-size: 14px;
          &:last-of-type{
            font-weight: 500;
            font-size: 16px;
            color: #fff;
            flex: 1;
            display: block;
            white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              
            box-sizing: border-box;
            padding-left: 10px;
            
          }
        }
        
      }
      .inputBox{
        border-radius: 10px;
        background: RGBA(111, 114, 122, 1);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  2px ;
        margin-top: 20px;
        .box{
          flex: 1;
          box-sizing: border-box;
          padding: 0 16px;
          input{
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: #fff;
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            &::placeholder{
              color: rgba(255, 255, 255, .6);
            }
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
