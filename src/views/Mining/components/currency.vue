<template>
  <div class='currency'>
    <div class="mask " v-if="widgetLoading">
      <div class="loading"></div>
    </div>
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
        {{ $t('mining.currency[0]') }} {{info.intervalCoin| hideDecimal}}
      </span>
    </div>
    <p @click="showApy=true" > 
      <span class="apy">{{ $t('mining.currency[1]') }} <img src="../../../assets/img/questionMark.svg" alt=""></span>
      <span>{{info.apy}}</span>
    </p>
    <p> 
      <span>{{ $t('mining.currency[2]') }}({{ info.coin.indexOf('/')===-1?info.coin:'LP' }})</span>
      <span>{{ details.depositAmount| hideDecimal }}</span>
    </p>
    <p v-if="details.depositAmount!=0"> 
      <span>{{ $t('mining.currency[3]') }}({{ info.intervalCoin }})</span>
      <span v-if="info.isInvite">{{ isInvite?details.intervalAmount*0.9:details.intervalAmount*0.8| hideDecimal }}</span>
      <span v-else>{{ details.intervalAmount| hideDecimal }}</span>
    </p>
    <p> 
      <span>{{ $t('mining.currency[4]') }}({{ info.coin.indexOf('/')===-1?info.coin:'LP' }})</span>
      <span>{{ details.lockAmount | hideDecimal }}</span>
    </p>
    <p v-if="info.totalAmount"> 
      <span>{{ $t('mining.currency[5]') }}({{ info.coin.indexOf('/')===-1?info.coin:'LP' }})</span>
      <span v-if="info.totalAmount - details.lockAmount>0">{{ (info.totalAmount - details.lockAmount) | hideDecimal }}</span>
      <span v-else>0</span>
    </p>
    
    <p v-if="details.depositAmount!=0"> 
      <span>{{ $t('mining.currency[6]') }}</span>
      <span>{{formatDate(details.time)}}</span>
    </p>
    <div class="btns" >
      <div class="btn active Approve" v-if="!isApprove"  @click="approve()"> {{ isLoading?$t('mining.btn[0]'):$t('swap.btn[4]')}}<span v-if="isLoading" class="loading" ></span></div>
      <div class="btn" :class="isApprove&&'active'" @click="deposit">{{ $t('mining.btn[1]') }}</div>
      <div class="btn  "  v-if="isApprove" :class="details.intervalAmount!=='0'&&'active'" @click="withdraw">{{ $t('mining.btn[2]') }}</div>
    </div>
    <div class="btns" v-if="isManager" style="margin-top: 10px;">
      <div class="btn active" @click="$refs.Reward.show()" >修改收益率</div>
    </div>
    
    <Withdraw ref="Withdraw" :info= "info"  :depositAmount = "details.depositAmount"  :intervalAmount ="info.isInvite?(isInvite?details.intervalAmount*0.9:details.intervalAmount*0.8):details.intervalAmount"></Withdraw>
    <Deposit ref="Deposit" :info= "info" :lockAmount = "details.lockAmount" :depositAmount = "details.depositAmount" :intervalAmount = "details.intervalAmount"></Deposit>
    <Reward ref="Reward" :info= "info" :lockAmount = "details.lockAmount" :depositAmount = "details.depositAmount" :intervalAmount = "details.intervalAmount"></Reward>
    
    <van-popup v-model="showApy" position="center" get-container="body" class='apyBox'>
      <div class="container">
        <div>
          <p>{{ $t('mining.currency[7]') }}:</p>
          <span>{{info.apr}}</span>
        </div>
        <div>
          <p>{{ $t('mining.currency[8]') }}:</p>
          <span>{{info.apy}}</span>
        </div>
        <p>{{ $t('mining.currency[9]') }}</p>


      </div>
    </van-popup>
  
  </div>
</template>
<script>
import { mapMutations,mapState } from "vuex";
import Withdraw from './withdraw.vue'
import Deposit from './deposit.vue'
import Reward from './reward.vue'

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
          totalAmount:'',
          isInvite:false,
          apy:'',
          apr:'',
        }
      }
    },
    isInvite:false,
  },
  components: {
    Withdraw,Deposit,Reward
  },
  data() { 
    return {
      showApy:false,
      isLoading:false,
      details:{
        time:'',
        depositAmount:'0',
        intervalAmount:'0',
        lockAmount:'0',
      },
      isApprove:false,
      widgetLoading:true,
      isManager:false,
      
    }
  },
  mounted() {
    
  },
  methods: {
    formatDate(date) {
      var date = new Date(date*1000);
      var YY = date.getFullYear() + '-';
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return YY + MM + DD +" "+hh + mm + ss;
    },
    setUrl(name){
      try {
        return require(`../../../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../../../assets/img/coin/unknown.svg')
      }
    },
    ...mapMutations([ "setUserInfo","setRecords","resetRecords"]),
    stakeParams(){
      this.miningContract.stakeParams(this.info.bankAddress,res=>{
        // console.log(res)
        if(res.code==200){
          //每个周期的区块数
          //每个周期质押一个币能得到的的奖励数量
          //总锁仓量
          //用户质押的数量
          //用户质押的区块号
          //获得的收益数量（不含已提收益）
          // console.log(res.data)
          this.details.lockAmount =  this.common.fromWei(res.data[2],this.info.decimals)
          this.details.depositAmount = this.common.fromWei(res.data[3],this.info.decimals)
          // this.details.blockNumber = this.common.fromWei(res.data[3],this.info.decimals)
          this.details.time = res.data[4]
          this.details.intervalAmount = this.common.fromWei(res.data[5],this.info.decimals2)
        }else{
          this.details.time = ''
          this.details.depositAmount = '0'
          this.details.intervalAmount = '0'
        }
        this.widgetLoading = false
        // console.log(this.details)
      })
    },
    refresh(){
      // console.log(res)
      this.stakeParams()
      this.allowance()
      this.manager()
    },
    approve(){//授权
      if(this.isLoading) return
      this.isLoading = true
      this.miningContract.approve(this.info.address,this.info.bankAddress,res=>{
        if(res.code === 200){
          let obj = {
            hash:res.data,
            type:'bankApprove',
            state:1,
            address:this.info.address,
            bankAddress:this.info.bankAddress,
            msg:`Approve ${this.info.coin}`
          }
          this.setRecords(obj)
          this.receipt(res.data)
        }else{
          this.isLoading = false
          this.$toast(this.$t('toast[2]'))
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
              this.allowance(true)
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
    allowance(isRotation){
      if(this.isApprove){return}
      this.miningContract.allowance(this.info.address,this.info.bankAddress,res=>{
        if(res.code==200&&res.data!=='0'){
          this.isApprove = true
        }else{
          this.isApprove = false
        }
        if(isRotation){
          console.log(isRotation)
          this.isLoading = false
        }
        
      })
    },
    decodeLog(inputs,hexString,topics){
      let res = this.ercMethods.decodeLog(inputs,hexString,topics)
      console.log(res)
      // this.isLoading = false
    },
    manager(){
      if(this.isManager){return}
      this.miningContract.manager(this.info.bankAddress,res=>{
        if(res.code==200){
          this.isManager = true
        }
      })
    },
    withdraw(){
      // if(new Date().getTime()-this.details.time*1000<86400000){
      //   this.$alert({
      //     title: this.$t('alert.point[0]'),
      //     message: this.$t('mining.message[0]'),theme: 'round-button',
      //     confirmButtonColor:'#2B7EFF',
      //     confirmButtonText: this.$t('alert.point[1]')
      //   })
      //   return
      // }
      // if(this.details.intervalAmount ==='0'){
      //   this.$alert({
      //     title: this.$t('alert.point[0]'),
      //     message: this.$t('mining.message[1]'),theme: 'round-button',
      //     confirmButtonColor:'#2B7EFF',
      //     confirmButtonText: this.$t('alert.point[1]')
      //   })
      //   // this.$refs.Withdraw.show()
      // }else{
        this.$refs.Withdraw.show()
      // }
      
    },
    deposit(){
      if(!this.isApprove){
        this.$alert({
          title: this.$t('alert.warning[0]'),
          message: this.$t('alert.warning[1]'),theme: 'round-button',
          confirmButtonColor:'#2B7EFF',
          confirmButtonText: this.$t('alert.point[1]')
        })
        return
      }
      this.$refs.Deposit.show()
      // if(this.info.isInvite){
      //   this.$alert({
      //     title: this.$t('alert.warning[0]'),
      //     message: this.info.coin+this.$t('mining.message[2]'),theme: 'round-button',
      //     confirmButtonColor:'#2B7EFF',
      //     confirmButtonText: this.$t('alert.point[1]')
      //   }).then(() => {
          
      //   });
      // }
      
    },
  },
}
</script>
<style lang='less' scoped>
.currency{
  width: 100%;
  background: #70727B;
  border-radius: 22px;
  padding:  20px ;
  box-sizing: border-box;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  
  &>.mask{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding:  0 ;
    left: 0;
    top: 0;
    background:#70727B ;
    div{
      width: 100px;
      height: 100px;
    }
  }
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
          z-index: 0;
          margin-left: -10px;
        }
      }
      span{
        font-size: 20px;
        font-weight: 500;
        color: #fff;
        margin-left: 8px;
        
      }
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
    @media screen and (max-width: 600px){
      p{
        img{
          width: 20px;
          &:nth-of-type(2){
            margin-left: -6px;
          }
        }
        span{
          font-size: 18px;
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
    
    &:last-of-type{
      margin-bottom: 20px;
    }
    span{
      font-size: 14px;
      &.apy{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        cursor: pointer;
        img{
          width: 14px;
          height: 14px;
          margin-left: 4px;
        }
      }
      &:last-of-type{
        flex: 1;
        text-align: right;
        box-sizing: border-box;
        padding-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        font-size: 16px;
        color: #fff;
      }  
    }
    &:first-of-type{
      height: 30px;
      span{
        &:last-of-type{
          font-size: 30px;
          color: #FFC958;  
        }
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
    .btn{
      flex: 1;
      height: 42px;
      line-height: 42px;
      text-align: center;
      border-radius: 16px;
      border: 1px solid #A2A5B2;  
      font-size: 16px;
      font-weight: bold;
      color: rgba(255, 255, 255, .8);
      &.active{
        color: #fff;
        background: #2B7EFF;
        border: 1px solid #2B7EFF; 
      }
      &:first-of-type{
        margin-right: 10px;
      }
      // &.Approve{
      //   flex: none;
      //   width: 120px;
        
      // }
    }
  }
}
.apyBox{
  background: rgba(0,0,0,0);
  top:250px;
  transform:translate3d(-50%,0,0);
  &>.container{
    width: 244px;
    background: #565A66;
    border-radius: 12px;
    top: 120px;
    box-sizing: border-box;
    padding: 30px 20px;
    &>div{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 12px;
      font-size: 16px;
      line-height: 12px;
      p{
        color: #fff;
        
      }
      span{
        color: #FFC958;
      }
    }
    &>p{
      font-size: 14px;
      color: rgba(255, 255, 255, .6);
      padding-top: 10px;
    }
  }
}
</style>