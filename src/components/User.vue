<template>

  <div class="user"  @click="hideNetList">
    <ul class="list" :class="!showNetList&&'none'">
<!--      <li @click="switchNetwork('256')">heco</li>
      <li  @click="switchNetwork('97')">bsc</li>-->
      <li @click="switchNetwork('128')">HECO</li>
      <li  @click="switchNetwork('56')">BSC</li>
    </ul>
    <!-- <p>{{userInfo.address}}</p> -->
    <div v-if="userInfo.address" class="Account" >
      <div class="network" v-if="nets[userInfo.networkId]" @click.stop="showNetList=!showNetList">{{ nets[userInfo.networkId].chainName }}</div>
      <p v-if="!nets[userInfo.networkId]" class="Wrong" @click.stop="showNetList=!showNetList">Wrong Network</p>
      <p v-else-if="num === 0" @click="showAccount">
        <!-- {{userInfo.address.substring(0,6)}}....{{ userInfo.address.substring(userInfo.address.length-4,userInfo.address.length) }} -->
        <img class="MetaMask" src="../assets/img/wallet.svg" alt="">
      </p>
      <p v-else class=" active" @click="showAccount"> {{num}} Pending <span class="loading" ></span> </p>
    </div>
    <div v-else class="btn" @click="showConnectWallet">{{ $t('header[3]') }}</div>
    <!-- :close-on-click-overlay = "false" -->
    <van-popup v-model="ConnectWalletVisible" position="center" get-container="body"  
      :overlay-style="{backgroundColor: 'rgba(0,0,0,0.5)'}" 
      class='popup'>
      <div>
        <div class="top">
          <p>{{ $t('user.connect[0]') }}</p>
          <img @click="ConnectWalletVisible=false" src="../assets/img/close.svg" alt="">
        </div>
        <div class="btn MetaMask" :class="userInfo.address&&'active'" @click="login(true)">
          <p>{{ $t('user.connect[1]') }}</p>
          <img src="../assets/img/MetaMask.png" alt="">
        </div>
        <div v-if="nets[networkId]" class="btn heco" :class="userInfo.address&&'active'" @click="login(true)">
          <p>{{ nets[networkId].chainName }}</p>
          <img v-if="networkId=='97'||networkId=='56'" src="../assets/img/icon-bsc.svg" alt="">
          <img v-if="networkId=='128'||networkId=='256'"  src="../assets/img/icon-heco.svg" alt="">
        </div>
         <div v-else class="btn heco" :class="userInfo.address&&'active'" @click="login(true)">
          <p>Connect Wallet</p>
        </div>
        <!-- <div class="btn">
          <p>WalletConnect</p><img src="../assets/img/WalletConnect.png" alt="">
        </div> -->
        <!-- <p>{{ $t('user.connect[2]') }}<span>{{ $t('user.connect[3]') }},</span>{{ $t('user.connect[4]') }}</p> -->
      </div>
    </van-popup>
    <van-popup v-model="AccountVisible" position="center" get-container="body"  
      :overlay-style="{backgroundColor: 'rgba(0,0,0,0.5)'}" 
      class='popup'>
      <div>
        <div class="top">
          <p>{{ $t('user.account[0]') }}</p>
          <img @click="AccountVisible=false" src="../assets/img/close.svg" alt="">
        </div>
        <div class="info">
          <div class="Connected">
            <p>{{ $t('user.account[1]') }}</p>
            <!-- <div @click="ConnectWalletVisible = true">Change</div> -->
          </div>
          <div class="invite" v-clipboard:copy="inviteLink" v-clipboard:success="copyInviteLink" v-clipboard:error="copyError">
            <img  src="../assets/img/invite.svg" alt="">
            <!-- <span>{{$t('user.account[4]')}}</span> -->
          </div>
          <div class="Account">
            <img class="MetaMask" src="../assets/img/MetaMask.png" alt="">
            <img class="huobi" v-if="networkId=='97'||networkId=='56'" src="../assets/img/icon-bsc.svg" alt="">
            <img class="huobi" v-if="networkId=='128'||networkId=='256'"  src="../assets/img/icon-heco.svg" alt="">
            <p>{{userInfo.address.substring(0,6)}}....{{ userInfo.address.substring(userInfo.address.length-4,userInfo.address.length) }}</p>
          </div>
          <div class="btns">
            <div v-clipboard:copy="userInfo.address" v-clipboard:success="copySuccess" v-clipboard:error="copyError">
              <img src="../assets/img/copy.svg" alt="">
              {{ $t('user.account[2]') }}
            </div>
            <div @click="openAddress" v-if="nets[userInfo.networkId]">
              <img src="../assets/img/view.svg" alt="">
              {{ $t('user.account[3]') }}{{nets[userInfo.networkId].chainName}}
            </div>
            <div @click="openInvite" >
              <img src="../assets/img/bind.svg" alt="">
              {{ $t('user.invite[3]') }}
            </div>
          </div>
        </div>
        <p v-if="records.length<1">{{ $t('user.account[5]') }}</p>
        <p v-else>Recent Transactions <span @click="clearRecords">(clear all)</span></p>
        <ul v-if="records.length>0" class="records">
          <li v-for="(item,index) in records" :key="index" @click="openHash(item)">
            <p>{{ item.msg }}</p>
            <span class="loading" v-if="item.state===1"></span>
            <img v-else-if="item.state===2" src="../assets/img/success.svg" alt="">
            <img v-else-if="item.state===3" src="../assets/img/fail.svg" alt="">
          </li>
        </ul>
      </div>
    </van-popup>
    
    <Invite ref="Invite" ></Invite>
    <div class="float" v-show="showFloat" @click="openInvite"><img src="../assets/img/bind.svg" alt=""></div>
  </div>
  
</template>
<script>
import Invite from '@/components/Invite.vue'
import { mapMutations,mapState } from "vuex";
export default {
  props:{
    
  },
  components:{Invite},
  computed: { 
    ...mapState(['userInfo','records']),
    num(){
      let arr = this.records.filter(item=>{return item.state === 1})
      return arr.length
    }, 
  },
  data() {
    return {
      showFloat:false,
      showNetList:false,
      ConnectWalletVisible:false,
      AccountVisible:false,
      isLogin:false,
      networkId:'',
      inviteLink:'',
      nets:{
        '56':{
          chainId: "0x38",
          chainName: 'BSC',
          nativeCurrency:
              {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
              },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com/'],
        },
        '128':{
          chainId: "0x80",
          chainName: 'Heco',
          nativeCurrency:
              {
                name: 'HT',
                symbol: 'HT',
                decimals: 18
              },
          rpcUrls: ['https://http-mainnet.hecochain.com'],
          blockExplorerUrls: ['https://hecoinfo.com/'],
        },
        '97':{
          chainId: "0x61",
          chainName: 'BSC',
          nativeCurrency:
              {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
              },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
          blockExplorerUrls: ['https://testnet.bscscan.com/'],
        },
        '256':{
          chainId: "0x100",
          chainName: 'HECO',
          nativeCurrency:
              {
                  name: 'HT',
                  symbol: 'HT',
                  decimals: 18
              },
          rpcUrls: ['https://http-testnet.hecochain.com'],
          blockExplorerUrls: ['https://testnet.hecoinfo.com/'],
        },
      },
    }
  },
  mounted() {
    this.setNetworkId()
    if(localStorage.getItem('isLogin')){
      this.login()
    }
  },
  methods:{
    copyInviteLink(e) {  this.$toast(this.$t('user.invite[9]') ) },
    setNetworkId(){
      if(this.userInfo.networkId||window.ethereum.networkVersion){
        this.networkId = this.userInfo.networkId||window.ethereum.networkVersion
        console.log(window.ethereum)
      }else{
        setTimeout(()=>{
          this.setNetworkId()
        },1000)
      }
    },
    ...mapMutations([ "setUserInfo","setRecords",'resetRecords']),
    copySuccess(e) {  this.$toast(this.$t('toast[0]')) },
    copyError(e) {  this.$toast(this.$t('toast[1]')) },
    hideNetList(){ this.showNetList=false }, 
    clearRecords(){
      localStorage.removeItem('records'+this.userInfo.address+this.userInfo.networkId)
      this.resetRecords([])
      
    },
    openAddress(){
      window.open(`${this.nets[this.networkId].blockExplorerUrls}/address/${this.userInfo.address}`)
    },
    openInvite(){
      this.$refs.Invite.show()
    }, 
    openHash(item){
      window.open(`${this.nets[this.networkId].blockExplorerUrls}/tx/${item.hash}`)
    },
    showConnectWallet(){ 
      this.ConnectWalletVisible = true 
    },
    showAccount(){
      this.inviteLink = `${window.location.origin}/#/?networkId=${this.userInfo.networkId}&invite=${this.userInfo.address}`
      this.AccountVisible = true

    },
    change(){
      this.ercMethods.swap()
    },
    login(firstLogin){
      if(this.isLogin) return
      if(!window.ethereum){
        this.$toast('Can not detected Ethereum wallet ')
        return
      }
      this.isLogin = true
      this.ercMethods.login(res=>{
        if(res.code == 200){
          //128 ：HECO 110151 ：NFT
          this.isLogin = false
          let userInfo = {
            address: res.address,
            balance: res.balance,
            isNetwork: false,
            networkId:res.networkId,

          }
          if(this.nets[userInfo.networkId]){
            userInfo.isNetwork = true
          }
          this.setUserInfo(userInfo)
          localStorage.setItem('isLogin',true)
          if(firstLogin){
            this.ConnectWalletVisible = false
          }
          this.refreshUser()
        }else{
          this.isLogin = false
          this.logout()
        }
      })
    },
    logout(){
      this.setUserInfo({
        address: "",
        balance: "",
        isNetwork: "",
        networkId:''
      })
      localStorage.removeItem('isLogin')
    },
    refreshUser(){
      setTimeout(()=>{
        if(this.userInfo.address){
          this.login()
          this.refreshRecords()
        }
      },3000)
    },
    refreshRecords(){
      if(this.records.length>0){
        this.records.forEach(item => {
          if(item.state===1){
            this.receipt(item)
          }
        });
      }
    },
    receipt(data){
      let obj = JSON.parse(JSON.stringify(data))
      this.ercMethods.receipt(obj.hash,res=>{
        if(res.code == 200){
          console.log(obj.type)
          // console.log(res)
          if(res.msg){
            let inputs,hexString,topics,logs,log
            switch (obj.type) {
              case "liquidity":
                // inputs=[
                //   {internalType: "uint256",name: "value",type: "uint256"},
                //   {indexed: true,internalType: "address",name: "from",type: "address"},
                //   {indexed: true,internalType: "address",name: "to",type: "address"},
                // ]
                // let enventTopics = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                // if(!obj.pairAddress){
                //   inputs = [
                //     { "indexed": true, "internalType": "address",  "name": "token0", "type": "address" },
                //     { "indexed": true, "internalType": "address", "name": "token1", "type": "address" },
                //     { "internalType": "address", "name": "pair", "type": "address" },
                //     { "internalType": "uint256", "name": "", "type": "uint256" }
                //   ]
                //   enventTopics ="0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9"
                // }
                // let  logs = res.data.logs.filter(item=>{
                //   return (this.ercMethods.toAddress(item.address) === this.ercMethods.toAddress(obj.pairAddress)||this.ercMethods.toAddress(item.address)===this.ercMethods.toAddress(this.ercMethods.contractAddress().factory)) && item.topics[0]===enventTopics
                // })
                // let log = logs[0]
                // hexString = log.data
                // topics = [log.topics[1],log.topics[2]]
                // this.decodeLog(inputs,hexString,topics,obj)
                this.successLog(obj)
                break;
              case "approve":
                this.routerAllowance(obj)
                break
              case "approvePair":
                this.pairAllowance(obj)
                break
              case "bankApprove":
                this.bankAllowance(obj)
                break
              case "swap":
                // inputs = [
                //   { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
                //   { "internalType": "uint256", "name": "amount0In", "type": "uint256" },
                //   { "internalType": "uint256", "name": "amount1In", "type": "uint256"},
                //   { "internalType": "uint256", "name": "amount0Out", "type": "uint256" },
                //   { "internalType": "uint256", "name": "amount1Out", "type": "uint256" },
                //   { "indexed": true, "internalType": "address", "name": "to", "type": "address"}
                // ]
                // enventTopics = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
                // logs = res.data.logs.filter(item=>{
                //   return this.ercMethods.toAddress(item.address) === this.ercMethods.toAddress(obj.pairAddress) && item.topics[0]===enventTopics
                // })
                // log = logs[0]
                // hexString = log.data
                // topics = [log.topics[1],log.topics[2]]
                // this.decodeLog(inputs,hexString,topics,obj)
                this.successLog(obj)
                break
              case "remove":
                // inputs = [
                //   {  "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
                //   { "internalType": "uint256", "name": "amount0", "type": "uint256" },
                //   { "internalType": "uint256", "name": "amount1", "type": "uint256" },
                //   { "indexed": true, "internalType": "address", "name": "to", "type": "address" }
                // ]
                // enventTopics = "0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496"
                // logs = res.data.logs.filter(item=>{
                //   return this.ercMethods.toAddress(item.address) === this.ercMethods.toAddress(obj.pairAddress) && item.topics[0]===enventTopics
                // })
                // log = logs[0]
                // console.log(log)
                // hexString = log.data
                // topics = [log.topics[1],log.topics[2]]
                // this.decodeLog(inputs,hexString,topics,obj)
                this.successLog(obj)
                break
              case "withdraw":
                console.log(obj)
                inputs = [
                  {"internalType": "address","name": "account","type": "address"},
					        {"internalType": "uint256","name": "amount","type": "uint256"}
                ]
                logs = res.data.logs
                log = logs[logs.length-1]
                hexString = log.data
                topics = log.topics
                this.decodeLog(inputs,hexString,topics,obj)
                break
              case "deposite":
                inputs = [
                  { "internalType": "address", "name": "account", "type": "address" },
                  { "internalType": "uint256", "name": "amount", "type": "uint256" },
                ]
                logs = res.data.logs
                log = logs[logs.length-1]
                hexString = log.data
                topics = log.topics
                this.decodeLog(inputs,hexString,topics,obj)
                break
              case "withdrawRewards":
                inputs = [
                  {"internalType": "address", "name": "account", "type": "address" },
					        {"internalType": "uint256", "name": "amount", "type": "uint256"} 
                ]
                logs = res.data.logs
                log = logs[logs.length-1]
                hexString = log.data
                topics = log.topics
                this.decodeLog(inputs,hexString,topics,obj)
                break
                
              case "setRewards":
                inputs = [{"internalType": "uint256","name": "blockNumber","type": "uint256"},{"internalType": "uint256","name": "rewardsEachPeriod","type": "uint256"}]
                logs = res.data.logs
                log = logs[logs.length-1]
                hexString = log.data
                topics = log.topics
                this.decodeLog(inputs,hexString,topics,obj)
                break
              case "invite":
                inputs = [
                  {"internalType": "address", "name": "child", "type": "address"},
					        {"internalType": "address","name": "parent","type": "address"}
                ]
                logs = res.data.logs
                log = logs[logs.length-1]
                hexString = log.data
                topics = log.topics
                this.decodeLog(inputs,hexString,topics,obj)
                break
                
              default:
                break;
            }
          }else{
            obj.state = 3
            this.$notify.error({
              title: 'error',
              message: obj.msg,
            });
            this.setRecords(obj)
            //区块查询失败
          }
        }
      })
    },
    decodeLog(inputs,hexString,topics,data){
      let result = this.ercMethods.decodeLog(inputs,hexString,topics)
      console.log(result)
      if(result[0]){
        this.successLog(data)
      }
    },
    successLog(data){
      let obj = JSON.parse(JSON.stringify(data))
      obj.state = 2
      this.setRecords(obj)
      this.$notify({
        title: 'success',
        message: obj.msg,
        type: 'success'
      });
    },
    get(data){
      let obj = JSON.parse(JSON.stringify(data))
    },
    bankAllowance(data){
      let obj = JSON.parse(JSON.stringify(data))
      this.miningContract.allowance(obj.address,obj.bankAddress,res=>{
        if(res.code===200&&res.data!=='0'){
          obj.state = 2
          this.$notify({
            title: 'success',
            message: obj.msg,
            type: 'success'
          });
        }else{
          obj.state = 3
          this.$notify.error({
            title: 'error',
            message: obj.msg,
          });
        }
        this.setRecords(obj)
      })
    },
    pairAllowance(data){
      let obj = JSON.parse(JSON.stringify(data))
      let address = obj.pairAddress
      console.log(address)
      this.ercMethods.pairAllowance(address,res=>{
        if(res.code===200&&res.data!=='0'){
          obj.state = 2
          this.$notify({
            title: 'success',
            message: obj.msg,
            type: 'success'
          });
        }else{
          obj.state = 3
          this.$notify.error({
            title: 'error',
            message: obj.msg,
          });
        }
        this.setRecords(obj)
      })
    },
    routerAllowance(data){
       let obj = JSON.parse(JSON.stringify(data))
      let address = obj.address
      this.ercMethods.routerAllowance(address,res=>{
        if(res.code===200&&res.data!=='0'){
          obj.state = 2
          this.$notify({
            title: 'success',
            message: obj.msg,
            type: 'success'
          });
        }else{
          obj.state = 3
          this.$notify.error({
            title: 'error',
            message: obj.msg,
          });
        }
        this.setRecords(obj)
      })
    },
    switchNetwork: async function (type) {
        let ethereum = window.ethereum;
        console.log(type)
        console.log(this.nets[type])
        let data = [this.nets[type]]
        console.log(data)
        const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data}).catch()
        if (tx) {
          console.log(tx)
        }
    },
  },
  watch:{
    "userInfo.address": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue&&newValue!=oldValue&&localStorage.getItem('records'+newValue+this.userInfo.networkId)){
          this.resetRecords(JSON.parse(localStorage.getItem('records'+newValue+this.userInfo.networkId)))
        }else{
          this.resetRecords([])
        }
      }
    },
    "userInfo.networkId": {
      deep: true,
      handler: function (newValue, oldValue) {
        if(newValue&&newValue!=oldValue&&localStorage.getItem('records'+this.userInfo.address+this.userInfo.networkId)){
          this.resetRecords(JSON.parse(localStorage.getItem('records'+this.userInfo.address+this.userInfo.networkId)))
        }else{
          this.resetRecords([])
        }
      }
    }
  }
}
</script>
<style lang='less' scoped>
.user{
  position: relative;
  z-index: 1;
  &>.list{
    position: absolute;
    top: 40px;
    width: 102px;
    left: 0;
    background: #74767f;
    border-radius: 12px;
    padding: 10px;
    height: 84px;
    box-sizing: border-box;
    transition: all .3s;
    overflow: hidden;
    &.none{
      height: 0;
      padding: 0 10px;
    }
    li{
      font-size: 16px;
      line-height: 32px;
      text-align: left;
      height: 32px;
      cursor: pointer;
      color: #fff;
    }
  }
  &>.btn{
    font-size: 16px;
    font-weight: 500;
    padding: 0 14px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    background: rgba(255, 255, 255, .29);
    border-radius: 12px;
    color: #fff;
  }
  &>.Account{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding-left: 2px;
    padding-right: 2px;
    height: 40px;
    text-align: center;
    cursor: pointer;
    background: rgba(255, 255, 255, .29);
    border-radius: 12px;
    color: #fff;
    p{
      line-height: 36px;
      height: 36px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      // margin-left: 16px;
      background: rgba(107, 110, 119, 0.8);
      border-radius: 12px;
      padding:0 10px;
      img{
        width: 26px;
        // margin-left: 10px;
      }
      &.Wrong{
        background-color: rgb(255, 104, 113);
      }
      &.active{
        background: #3B99FC;

      }
    }
    .network{
      padding: 0 10px;
    }
  }
  @media screen and (max-width: 600px){
    &>.btn{
      font-size: 14px;
      height: 36px;
      line-height: 36px;
    }
    &>.Account{
      height: 32px;
      p{
        line-height: 30px;
        height: 30px;
        padding: 0 6px;
        font-size: 14px;
        img{
          height: 20px;
        }
      }
    }
  }
  .float{
    width: 50px;
    height: 50px;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding:  0 ;
    img{
      width: 20px;
    }
    background: red;
    position: fixed;
    right: 10px;
    bottom: 200px;
    z-index: 100;
  }
}
.popup{
  background: rgba(0,0,0,0);
  top:250px;
  transform:translate3d(-50%,0,0);
  &>div{
    background: #565A66;
    border-radius: 12px;
    width: 400px;
    padding: 24px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    .top{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 32px;
      p{
        font-size: 18px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
      }
      img{
        width: 26px;
        height: 26px;
        position: relative;
        top: -4px;
        right: -4px;
        cursor: pointer;
      }
    }
    .btn{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 24px ;
      height: 54px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      border: 1px solid #A2A5B2;
      margin-bottom:16px ;
      cursor: pointer;
      img{
        width: 30px;
        height: 30px;
      }
      &.heco{
        display: none;
      }
      p{
        font-size: 14px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 20px;
        
      }
      &.active{
        p{
          position: relative;
          padding-left: 16px;
          &::after{
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: #43DB82;
            position: absolute;
            left: 0;
            top: 6px;
          }
        }
      }
    }
    &>p{
      font-size: 16px;
      // font-weight: 500;
      color: #FFFFFF;
      line-height: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      margin-bottom: 20px;
      font-weight: bold;
      span{
        color: #FFC958;
        cursor: pointer;
        font-weight: normal;
        font-size: 14px;
      }
    }
    &>span{
      color: #fff;
      font-size: 12px;
    }
    .inputBox{
      margin-top: 12px;
      background:rgba(107, 110, 119,.8) ;
      border-radius: 12px;
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding:  0 ;
      &>.input{
        flex: 1;
        input{
          height: 48px;
          box-sizing: border-box;
          width: 100%;
          outline: none;
          border:none;
          color: #fff;
          font-size: 12px;
          padding-left: 10px;
          background: transparent;
          &::placeholder{
            color: rgba(255, 255, 255, .6);
          }
        }
      }
      &>.clear{
        width: 38px;
        height: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        img{
          width: 20px;

          background: #565A66;
          border-radius: 50%;
        }
      }
    }
    
    &>.bind{
      text-align: center;
      line-height: 56px;
      margin-top: 20px;
      color: #fff;
      height: 56px;
      background: #393A3E;
      border-radius: 12px;
      cursor: default;
      user-select: none;
     display: flex;
     flex-direction: row;
     justify-content: center;
     align-items: center;
     box-sizing: border-box;
     padding:  0 ;
     span{
       margin-left: 10px;
     }
      &.active{
        cursor: pointer;
        background:rgba(59, 153, 252, 1) ;
      }
    }
    .info{
      padding:  20px ;
      border-radius: 16px;
      border: 1px solid #A2A5B2;
      margin-bottom: 32px;
      position: relative;
      .Connected{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        p{
          font-size: 14px;
          color: rgba(255, 255, 255, .6);
        }
        div{
          width: 64px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          box-shadow: 0px 0px 4px 0px #3B99FC;
          border-radius: 12px;
          border: 1px solid #3B99FC;
          font-size: 12px;
          color: #3B99FC;
          cursor: pointer;
          user-select: none;
        }
      }
      &>.invite{
        position: absolute;
        right: 24px;
        top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        img{
          width: 30px;
        }
        span{
          color: #fff;
          font-size: 12px;
        }
      }
      .Account{
        display: flex;
        flex-direction: row;
        // justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        margin-top: 13px;
        margin-bottom: 16px;
        img{
          width: 24px;
          height: 24px;
          &.huobi{
            display: none;
          }
        }
        p{
          font-size: 20px;
          color: rgba(255, 255, 255, .8);
          line-height: 30px;
          margin-left: 8px;
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
          // flex: 1;
          display: flex;
          flex-direction: row;
          // justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          padding:  0 ;
          font-size: 12px;
          color: rgba(255, 255, 255, .6);
          cursor: pointer;
          user-select: none;
          img{
            width: 14px;
            margin-right: 2px;
          }
          &:last-of-type{
            img{
              width: 16px;
            }
          }
        }
      }
    }
    .records{
      max-height: 330px;
      overflow: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      li{
        color: #fff;
        font-size: 14px;
        line-height: 16px;
        // height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding:  0 ;
        cursor: pointer;
        margin-bottom: 12px;
        img{
          width: 16px;
        }
      }
    }
    
  }
  @media screen and (max-width: 600px){
    width: 100%;
    top: 100px;
    &>div{
      width: 92%;
      margin: 0 auto;
      .btn{
        &.MetaMask{
          display: none;
        }
        &.heco{
          display: flex;
        }
      }
      .info{
        .Account{
          img{
            &.MetaMask{
              display: none;
            }
            &.huobi{
              display: block;
            }
          }
        }
      }
        
    }
  }
}

</style>
