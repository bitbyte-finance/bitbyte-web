<template>
   <div class='trading'>
     <div >
      <div class="nav">
        <p @click="$router.push('/')">{{ $te('header_en[0]') ? $t('header_en[0]') : $t('header[0]') }}</p>
        <p @click="$router.push('/Pool')">{{ $te('header_en[1]') ? $t('header_en[1]') : $t('header[1]') }}</p>
        <p @click="$router.push('/Mining')" >{{ $te('header_en[2]') ? $t('header_en[2]') : $t('header[2]') }}</p>
        <p class="active">{{ $te('header_en[4]') ? $t('header_en[4]') : $t('header[4]') }}</p>
      </div>
      <div>
        <Currency :ref="'currency'+index" v-for="(item,index) in list" :key="index" :info = "item" :isInvite="isInvite"></Currency>
      </div>
    </div>
   </div>
</template>
<script>
import { mapMutations,mapState } from "vuex";
import Currency from './components/currency.vue'
export default {
  components: {
    Currency
  },
  computed: { ...mapState(['userInfo','records']) },
  data() { 
    return {
      list:[],
      miningInfo:{
        '56':[
          {
            coin:'USDT/ZBC',
            intervalCoin:'ZooR',
            address:'0xAA9835a6F07e87aF6C7cb47522f86A46Db379f99',
            address2:'0x67Fa70a0B61c8390D0BE5c7370BFbC6126412F01',
            bankAddress:'0x784A911310d158A86a06374a70747C2db164cf7b',
            decimals:18,
            decimals2:18,
            totalAmount:'',
            isInvite:true,
            apy:'176%',
            apr:'57%',
          },
          {
            coin:'ZBC/ZooR',
            intervalCoin:'ZooR',
            address:'0x534DED2D2563E2dcE27BA8096FaEf2f300a050C1',
            address2:'0x67Fa70a0B61c8390D0BE5c7370BFbC6126412F01',
            bankAddress:'0x3D32bCff9F5714a98fea2169C8005a165257ECd3',
            decimals:18,
            decimals2:18,
            totalAmount:'',
            isInvite:true,
            apy:'208%',
            apr:'69%',
          }
        ],
        '128':[
          {
            coin:'USDT/ZBC',
            intervalCoin:'ZOOR',
            address:"0xaf21DC61ad2045132F1f2a0DB69F0b08A4D63092",
            address2:'0xcbda8289fa4b9a594f08a5a803bf890c81ff0e1a',
            bankAddress:"0x028cf5342d7BF56f96FC1117bd5e2D420be59BA4",
            decimals:18,
            decimals2:18,
            totalAmount:'',
            isInvite:true,
            apy:'160%',
            apr:'54%',
          },
          {
            coin:'ZBC/ZooR',
            intervalCoin:'ZOOR',
            address:"0xEBDDB35550EDc191fa1270C049cC88578F7B5B9c",
            address2:'0xcbda8289fa4b9a594f08a5a803bf890c81ff0e1a',
            bankAddress:"0x4F6182C83b2b0dce2cbe7deC85348f1c8Dd896b3",
            decimals:18,
            decimals2:18,
            totalAmount:'',
            isInvite:true,
            apy:'132%',
            apr:'46%',
          },
        ],
        '97':[
          {
            coin:'MZBC/ZBC',
            intervalCoin:'ZOOR',
            address:'0x52C252251719a657599F1Ce7d0924E19B1D6C37B',
            address2:'0x487eE5d805b3C95Eb23055DC92aaD29a89961f17',
            bankAddress:'0x5e54997AF531d894b5620D99aE77F55C909Ee405',
            decimals:18,
            totalAmount:'',
            isInvite:true,
            apy:'331%',
            apr:'120%',
          }
        ],
        '256':[
          {
            coin:'MZBC/ZBC',
            intervalCoin:'ZOOR',
            address:'0xEe5acCa2A1c16EFf098126d2bFE9A32BbFfC3c3F',
            address2:'0x8EA184Db725E38d545E891409A4a77ca7017AfF3',
            bankAddress:'0xCC4E3C154b1cBB3D5461B72e0E5A35Db9DbD65a1',
            decimals:18,
            totalAmount:'',
            isInvite:true,
            apy:'331%',
            apr:'120%',
          },
        ]
      },
      timer:null,
      isInvite:false,
    }
  },
  mounted() {
    
    if(this.userInfo.networkId&&this.miningInfo[this.userInfo.networkId]){
      this.list = JSON.parse(JSON.stringify(this.miningInfo[this.userInfo.networkId]))
      setTimeout(()=>{this.refreshList()},1000)
    }
  },
  methods: {
    refreshList(){
      // this.nodeParent()
      for (const key in this.$refs) {
        if(this.$refs[key]&&this.$refs[key][0]){
          this.$refs[key][0].refresh()
        }
      }
      this.timer = setTimeout(()=>{
        this.refreshList()
      },3000)
    },
    nodeParent(){
      if(this.isInvite){return}
      this.miningContract.nodeParent(this.userInfo.address,res=>{
        if(res.code === 200){
          this.isInvite = true
        }
      })
    
    }
  },
  watch: {
    "userInfo.networkId": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue){
          if(this.miningInfo[this.userInfo.networkId]){
            this.list = []
            setTimeout(()=>{
              this.list = JSON.parse(JSON.stringify(this.miningInfo[this.userInfo.networkId]))
              setTimeout(()=>{this.refreshList()},1000)
            },100)
          }
        }
      }
    },
    "userInfo.address": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue){
          if(this.miningInfo[this.userInfo.networkId]){
            this.list = []
            setTimeout(()=>{
              this.list = JSON.parse(JSON.stringify(this.miningInfo[this.userInfo.networkId]))
              setTimeout(()=>{this.refreshList()},1000)
            },100)
          }
        }
      }
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
}
</script>
<style lang='less' scoped>
.trading {
  width: 100%;
  max-width: 420px;
  // background:hska(0,0%,100%,.3);
  border-radius: 32px;
  background: rgba(107, 110, 120, .9);
  overflow: hidden;
  margin: 0 auto;
  z-index: 0;
  margin-top: 100px; 
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
        // padding-left: 10px;
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
</style>