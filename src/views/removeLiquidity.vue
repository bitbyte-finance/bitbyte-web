<template>
  <div class='removeLiquidity' v-loading="loading">
    <div>
      <div class="header">
        <div @click="$router.go(-1)">
          <img src="../assets/img/back.svg" alt="">
        </div>
        <p>{{ $t('pool.content.remove.title') }}</p>
      </div>
      <div class="form">
        <div class="slider-group">
          <p>{{ $t('pool.content.remove.form[0]') }}</p>
          <h3>{{amount}}%</h3>
          <el-slider v-model="amount" :show-tooltip="false"></el-slider>
          <ul>
            <li @click="amount=25">25%</li>
            <li @click="amount=50">50%</li>
            <li @click="amount=75">75%</li>
            <li @click="amount=100">MAX</li>
          </ul>
        </div>
        <div class="amount-group">
          <div>
            <p>
              <img :src="setUrl(coin1.name)" alt="">{{coin1.name}}
            </p>
            <p>{{common.fromWei(amount1,coin1.decimals) | hideDecimal}}</p>
          </div> 
          <div>
            <p>
              <img :src="setUrl(coin2.name)" alt="">{{coin2.name}}
            </p>
            <p>{{common.fromWei(amount2,coin2.decimals) | hideDecimal}}</p>
          </div>    
            
        </div>
        <div class="Price" v-if="info.balance1!=='0'&&info.balance2!=='0'">
          <div>
            <p>{{ $t('pool.content.remove.form[1]') }}</p>
            <p> <span>1 {{coin1.name}} = {{ BigNumber(common.fromWei(info.balance2,coin2.decimals)).div(common.fromWei(info.balance1,coin1.decimals)).toFixed(18)  | hideDecimal }} {{coin2.name}}</span>  </p>
          </div>
          <div>
            <p></p>
            <p> <span>1 {{coin2.name}} = {{ BigNumber(common.fromWei(info.balance1,coin1.decimals)).div(common.fromWei(info.balance2,coin2.decimals)).toFixed(18) | hideDecimal }} {{coin1.name}}</span> </p>
          </div>
        </div>
        <div class="btns" >
          <div  class="active" @click="approve" v-if="!isApprove">{{ $t('pool.content.remove.btn[0]') }} <span v-if="isLoading" class="loading" ></span></div>
          <div :class="isApprove&&amount1>0&&amount2>0&&'active'" @click="RemoveConfirm">{{ $t('pool.content.remove.btn[1]') }}</div>
        </div>
        <div class="position" >
          <h3>{{ $t('pool.content.remove.position[0]') }}</h3>
          <div>
            <p> 
              <img :src="setUrl(coin1.name)" alt="">
              <img :src="setUrl(coin2.name)" alt=""> 
              {{ coin1.name+'/'+coin2.name }}</p>
            <p>{{common.fromWei(pairInfo.balance,pairInfo.decimals) | hideDecimal}}</p>
          </div>
          <div>
            <p>{{ $t('pool.content.remove.position[1]') }}</p>
            <p>{{this.info.YourPoolShare}} %</p>
          </div>
          <div>
            <p>{{coin1.name}}</p>
            <p>{{common.fromWei(this.info.balance1,coin1.decimals) | hideDecimal}}</p>
          </div>
          <div>
            <p>{{coin2.name}}</p>
            <p>{{common.fromWei(this.info.balance2,coin2.decimals) | hideDecimal}}</p>
          </div>
        </div>
      </div>
    </div>
    <RemoveLiquidityConfirm 
      :pairInfo = "pairInfo" 
      :coin1 = "coin1" 
      :coin2 = "coin2" 
      :amount1 = "amount1"
      :amount = "amount"
      :amount2 = "amount2"
      :info = "info"
      ref="RemoveLiquidityConfirm">
    </RemoveLiquidityConfirm>
  </div>
</template>
<script>
import { mapMutations,mapState } from "vuex";
import RemoveLiquidityConfirm from '@/components/RemoveLiquidityConfirm.vue'
export default {
  components: {
    RemoveLiquidityConfirm
  },
  data() { 
    return {
      loading:false,
      amount:0,
      isLoading:false,
      amount1:'',
      amount2:'',
      isApprove:true,
      pairInfo:{},
      coin1:{},
      coin2:{},
      info:{
        YourPoolShare:'',
        balance1:'',
        balance2:'',
      },
      pairAddress:'',
      timer:null
    }
  },
  computed: { ...mapState(['userInfo']) },  
  mounted() {
    if(this.$route.params.coin1){
      this.coin1=this.$route.params.coin1
      this.coin2=this.$route.params.coin2
      this.loading = true
      this.getPair()
    }else{
      // this.coin1 = {"name":"IT","address":"0xb4756de238FfAA918A1EC6edDC21954F6f8cA496","decimals":"18"}
      // this.coin2 = {"name":"BT","address":"0xd74fbc5C01f5CC70F875EC7c0c2cc4303bD2C8dF","decimals":"18"}
      // this.getPair()
      this.$router.replace('/pool')
    }
    // this.pairAllowance(1)
  },
  destroyed(){
    clearTimeout(this.timer)
  },
  methods: {
    ...mapMutations([ "setRecords"]),
    refresh(){
      this.amount = 0
      this.getPair()
    },
    getPair(){
      //查询选中交易对是否有流动性信息
      clearTimeout(this.timer)
      this.ercMethods.getPair(this.coin1.address,this.coin2.address,res=>{
        if(res.code === 200){//有流动性信息则继续查询流动性详情
          this.pairAddress = res.data
          this.pairAllowance(true)
          this.ercMethods.pairInfo(res.data,res=>{
            // console.log(res)
            this.timer = setTimeout(()=>{this.getPair()},3000)
            if(res.code === 200){
              this.pairInfo = res.data
              this.pairInfo.coinList[0].decimals = this.coin1.decimals
              this.pairInfo.coinList[0].name = this.coin1.name
              this.pairInfo.coinList[0].icon = this.coin1.icon
              this.pairInfo.coinList[1].decimals = this.coin2.decimals
              this.pairInfo.coinList[1].name = this.coin2.name
              this.pairInfo.coinList[1].icon = this.coin2.icon
              // console.log(this.pairInfo)
              this.setInfo()
            }
          })
          this.isCreate = false
        }else{//无流动性信息则提示用户创建流动性
          this.isCreate = true
        }
        this.loading = false
        
        // console.log(res)
        // console.log(this.isCreate)
      })
    },
    setInfo(){
      this.info={
        YourPoolShare:this.YourPoolShare(),
        balance1:this.balance(1),
        balance2:this.balance(2),
      }
    },
    YourPoolShare(){
      let num = Math.floor(this.BigNumber(this.pairInfo.balance).div(this.pairInfo.totalSupply).multipliedBy(10000))/100
      return num
    },
    balance(type){
      if(this.pairInfo.coinList){
        let rate = this.BigNumber(this.pairInfo.balance).div(this.pairInfo.totalSupply)
        if(type === 1){
          return rate.multipliedBy(this.pairInfo.coinList[0].balance).toFixed(1).split('.')[0]
        }else{
          return rate.multipliedBy(this.pairInfo.coinList[1].balance).toFixed(1).split('.')[0]
        }
      }
      
    },
    setUrl(name){
      try {
        return require(`../assets/img/coin/${name}.${name === 'BNG' ? 'png' : 'svg'}`)
      } catch (e) {
        return require('../assets/img/coin/unknown.svg')
      }
    },
    RemoveConfirm(){
      if(this.amount==0){
        this.$toast(this.$t('toast[3]'))//请选择数量
        return
      }
      if(!this.isApprove||this.amount1===0||this.amount2==0){
        return
      }
      this.$refs.RemoveLiquidityConfirm.show()
    },
    approve(){//授权
      if(this.isLoading) return
      this.isLoading = true
      this.ercMethods.pairApprove(this.pairAddress,res=>{
        // console.log(res)
        if(res.code === 200){
          let obj = {
            hash:res.data,
            type:'approvePair',
            state:1,
            pairAddress:this.pairAddress,
            msg:`Approve ${this.coin1.name} and ${this.coin2.name} `
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
      // console.log(hash)
      this.ercMethods.receipt(hash,res=>{
        if(res.code == 200){
          if(res.msg){
            this.pairAllowance()
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
    pairAllowance(isRotation){
      // console.log(this.pairAddress)
      this.ercMethods.pairAllowance(this.pairAddress,res=>{
        if(res.code===200&&res.data!=='0'){
          this.isApprove = true
        }else{
          this.isApprove = false
        }
        if(!isRotation){
          this.isLoading = false
        }
        
      },true)
    },
    
  },
  watch:{
    amount(newVal,oldVal){
      if(this.info.balance1){
        this.amount1 = this.BigNumber(this.info.balance1).multipliedBy(newVal).div(100).toFixed(1).split('.')[0]
        this.amount2 = this.BigNumber(this.info.balance2).multipliedBy(newVal).div(100).toFixed(1).split('.')[0]
      }
      
    },
    "userInfo.networkId": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue){
          this.$router.replace('/pool')
        }
      }
    },
    "userInfo.address": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue){
          this.$router.replace('/pool')
        }
      }
    }
  }
}
</script>
<style lang='less' scoped>
.removeLiquidity{
  width: 420px;
  border-radius: 32px;
  background: rgba(107, 110, 120, .9);
  // background:hska(0,0%,100%,.3);
  overflow: hidden;
  margin: 0 auto;
  margin-top: 100px;
  box-shadow: 0px 15px 40px rgba(0, 0, 0, .3);
  position: relative;
  padding: 24px;
  box-sizing: border-box;
  /deep/.el-loading-mask{
    background: rgba(255,255,255,.5);
  }
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
    .header{
      position: relative;
      height: 56px;
      margin-bottom: 20px;
      p{
        font-size: 18px;
        line-height: 56px;
        border-bottom: 1px solid rgba(255, 255, 255, .2);
        color: #fff;
        text-align: center;
      }
      &>div{
        position: absolute;
        left: -16px;
        top: 0;
        width: 56px;
        height: 56px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        img{
          width: 24px;
          height: 24px;
        }
      }
      
    }
    .form{
      .amount-group{
        border: 1px solid rgba(255, 255, 255, .2);
        margin-bottom: 12px;
        border-radius: 10px;
        padding: 20px;
        &>div{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          margin-bottom: 16px;
          &:last-of-type{
            margin-bottom: 0;
          }
          p{
            font-size: 16px;
            display: flex;
            flex-direction: row;
            align-items: center;
            box-sizing: border-box;
            padding:  0 ;
            color: #fff;
            font-weight: 500;
            img{
              width: 30px;
              margin-right: 10px;
            }
          }
        }
      }
      .slider-group{
        border: 1px solid rgba(255, 255, 255, .2);
        margin-bottom: 12px;
        border-radius: 10px;
        padding: 20px;
        p{
          font-size: 16px;
          color: #fff;
        }
        h3{
          font-size: 40px;
          line-height: 80px;
          color: #fff;
        }
        /deep/.el-slider{
          .el-slider__runway{
            height: 2px;
            .el-slider__bar{
              height: 2px;
            }
            .el-slider__button-wrapper
            {
              top: -18px;
            }
            .el-slider__button{
              background: #2B7EFF;
              border-color: #2B7EFF;
            }
          }
        }
        ul{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          margin-top: 15px;
          li{
            width: 60px;
            height: 34px;
            text-align: center;
            line-height: 34px;
            background-color: #2B7EFF;
            border: 1px solid transparent;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            overflow: hidden;
            color: rgb(255, 255, 255);
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
      &>div{
        flex: 1;
        background-color: rgba(107, 110, 119, .75);
        cursor: pointer;
        color: #fff;
        height: 48px;
        line-height: 50px;
        border-radius: 16px;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        span{
          margin-left: 5px;
        }
        &.active{
          background: #2B7EFF;
        }
        &:nth-of-type(2){
          margin-left: 12px;
        }
      }
    }
  }
  
  .Price{
    div{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 8px;
      &:last-of-type{
        margin-bottom: 20px;
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
        padding-right: 15px;
        img{
          position: relative;
          z-index: 1;
          width: 36px;
          height: 36px;
          &:last-of-type{
            z-index: 0;
            left: -10px;
          }
        }
        overflow: hidden;
        &:last-of-type{
          overflow: hidden;
          
          span{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            }
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
            left: -10px;
          }
        }
        &:last-of-type{
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
    width: 92%;
    margin-top: 20px;
    &>div{
      .form{
        .slider-group{
          padding: 12px;
          h3{
            font-size: 30px;
            line-height: 60px;
          }
          ul{
            margin-top: 10px;
            li{
              width: auto;
              padding: 0 12px;
            }
          }
        }
        .amount-group{
          padding: 12px;
          &>div{
            margin-bottom: 10px;
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
}
</style>