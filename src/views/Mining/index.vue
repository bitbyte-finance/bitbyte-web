<template>
   <div class='trading'>
     <div >
      <div class="nav">
        <p @click="$router.push('/')">{{ $te('header_en[0]') ? $t('header_en[0]') : $t('header[0]') }}</p>
        <p @click="$router.push('/Pool')">{{ $te('header_en[1]') ? $t('header_en[1]') : $t('header[1]') }}</p>
        <p  class="active">{{ $te('header_en[2]') ? $t('header_en[2]') : $t('header[2]') }}</p>
        <p @click="$router.push('/farm')">{{ $te('header_en[4]') ? $t('header_en[4]') : $t('header[4]') }}</p>
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
        '97':[
          {
            coin:'ZBC',
            intervalCoin:'ZooR',
            address:'0x39E7f6488216a90F60149E1190b8058dB6A610D9',
            decimals:18,
            address2:'0x487eE5d805b3C95Eb23055DC92aaD29a89961f17',
            decimals2:18,
            bankAddress:'0x14FD650D857d665E0490aAEf113CB9a7Ef5428A4',
            totalAmount:'',
            isInvite:true,
            apy:'331%',
            apr:'120%',
          },
        ],
        '256':[
          {
            coin:'ZBC',
            intervalCoin:'ZooR',
            address:'0x1E48B3f37bFf8DEe62bd49dcb9AC403743d21Fb2',
            decimals:18,
            address2:'0x8EA184Db725E38d545E891409A4a77ca7017AfF3',
            decimals2:18,
            bankAddress:'0x298DF20082d86dBfd3a4b4773F48C15705A6F66A',
            totalAmount:'',
            isInvite:true,
            apy:'331%',
            apr:'120%',
          },
        ],
        '56':[
          {
            coin:'MZBC',
            intervalCoin:'ZBC',
            address:'0xF67087Fb42cb06A2F6Fd5e565F69244dF7A3c1E3',
            decimals:18,
            address2:'0x67Fa70a0B61c8390D0BE5c7370BFbC6126412F01',
            decimals2:18,
            bankAddress:'0xf1f7Ef4673e991f7A679DD8f2bA1de4f31636982',
            totalAmount:'',
            isInvite:true,
            apy:'140%',
            apr:'47%',
          },
          {
            coin:'ZBC',
            intervalCoin:'ZooR',
            address:'0x67Fa70a0B61c8390D0BE5c7370BFbC6126412F01',
            decimals:18,
            address2:'0x4F6182C83b2b0dce2cbe7deC85348f1c8Dd896b3',
            decimals2:18,
            bankAddress:'0x3a4112D4DaD40EFB478679D1f2B851f639206915',
            totalAmount:'',
            isInvite:true,
            apy:'156%',
            apr:'50%',
          },
        ],
        '128':[
          {
            coin:'MZBC',
            intervalCoin:'ZBC',
            address:'0x4077eeeb93c7772fc20f4e6c119dc2d33acd6bbf',
            decimals:18,
            address2:'0x3bd3956488e429dcecf6ee5e6e29660f7465d880',
            decimals2:18,
            bankAddress:'0xd3710CA8Aa896c82444d58D5768805C748eABAEF',
            totalAmount:'',
            isInvite:true,
            apy:'67%',
            apr:'23%',
          },
          {
            coin:'ZBC',
            intervalCoin:'ZooR',
            address:'0x3bd3956488e429dcecf6ee5e6e29660f7465d880',
            decimals:18,
            address2:'0xcbda8289fa4b9a594f08a5a803bf890c81ff0e1a',
            decimals2:18,
            bankAddress:'0xB0d1057870528a138D35cf952A8CBDAE02E53F99',
            totalAmount:'',
            isInvite:true,
            apy:'69%',
            apr:'24%',
          },
        ],
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
      this.nodeParent()
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
              this.refreshList()
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
              this.refreshList()
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

  margin-top: 100px; 
  box-shadow: 0px 15px 40px rgba(0, 0, 0, .3);
  position: relative;
  z-index: 0;
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