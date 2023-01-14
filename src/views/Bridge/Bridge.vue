<template>
  <div class="bridge-page">
<!--    <p class="title">
      ZOOSwap breaks single-chain barriers and empowers ecological prosperity
    </p>
    <p class="sub-title">
      ZOOSwap starts with multi-chain Swap, The transaction is simpler
    </p>-->
    <div class="bridge-logo">
      <img src="@/assets/img/bridge/bridge-logo.svg" alt="">
    </div>
    <div class="bridge-form">
      <div class="form-item tabs">
        <div
            v-for="(tab, i) in tabOptions"
            :key="'tab'+i"
            @click="tabChange(i)"
            :class="{active: i === currentTab}"
            class="tab">
          <p>{{ tab }}</p>
        </div>
      </div>

      <!-- Bridge -->
      <div v-show="currentTab === 0" class="bridge">
        <p class="item-title choose-coin-title">{{ $t('bridge.bridge.form.chooseCoinTitle') }}</p>
        <div @click="isShowSelectCoin = true" class="form-item choose-coin">
          <div class="left">
            <img :src="getImg(currentCoin.name)" alt="">
            <p>
              {{ currentCoin.name }}
            </p>
          </div>
          <img src="@/assets/img/bridge/icon-right-arrow.svg" alt="">
        </div>

        <div class="select-chain-box">
          <div class="chain-from-to">
            <p>{{ $t('bridge.bridge.form.fromTo[0]') }}</p>
            <div class="select-chain">
              <div class="left">
                <img :src="currentChain[0].icon" alt="">
                <p>{{ currentChain[0].name }}</p>
              </div>
            </div>
          </div>

          <div class="chain-from-to-arrow">
            <img src="@/assets/img/bridge/icon-right-arrow-big.svg" alt="">
          </div>

          <!-- 打开选择链的弹窗  @click="showChainPop('to')" -->
          <div class="chain-from-to">
            <p>{{ $t('bridge.bridge.form.fromTo[1]') }}</p>
            <div class="select-chain">
              <div class="left">
                <img :src="currentChain[1].icon" alt="">
                <p>{{ currentChain[1].name }}</p>
              </div>
              <img src="@/assets/img/bridge/icon-right-arrow.svg" alt="">
            </div>
          </div>
        </div>

        <p class="item-title address-title">
          {{ $t('bridge.bridge.form.address.title') }}
        </p>

<!--        <input v-model="bridgeForm.address" class="form-item address-input" type="text" placeholder="Destination address" />-->

        <div class="form-item amount-input">
          <input v-model="bridgeForm.address" type="text" :placeholder="$t('bridge.bridge.form.address.placeholder')" />
          <div @click="setAddressMine" class="max">
            <p>{{ $t('bridge.bridge.form.address.btn') }}</p>
          </div>
        </div>

        <p class="address-warning">
          {{ $t('bridge.bridge.form.address.description[0]') }} <span>{{ $t('bridge.bridge.form.address.description[1]') }}</span>
        </p>

        <p class="item-title amount-title">{{ $t('bridge.bridge.form.amount.title') }}</p>
        <div class="form-item amount-input">
          <input v-model="bridgeForm.amount" type="text" :placeholder="$t('bridge.bridge.form.amount.placeholder')" />
          <div @click="setMaxAmount" class="max">
            <p>{{ $t('bridge.bridge.form.amount.btn') }}</p>
          </div>
        </div>
        <p class="balance">{{ $t('bridge.bridge.form.amount.balance') }}：{{ bridgeForm.balance }}</p>
        <div @click="approve" class="btn-approve">
          <span v-show="isShowApproveLoading" class="loading"></span>
          <p>{{ btnCrossChainText }}</p>
        </div>
<!--        <div class="limit-title">
          Daily cross-chain limit
        </div>
        <div class="cross-chain-limit">
          <p>0/9,999,999,999,999 ZBC</p>
          <div class="progress">
            <div class="current-progress"></div>
          </div>
        </div>-->
        <p @click="isShowRecord = true" class="history">
          {{ $t('bridge.bridge.form.history') }}
        </p>
      </div>

      <!-- Your Earn -->
      <Earn
          :contract="contractObj"
          :coin-list="selectCoinOptions.dataList"
          :current-bridge-address="currentBridgeAddress"
          v-show="currentTab === 1 && $store.state.userInfo.isNetwork"></Earn>

      <div v-show="currentTab === 1 && !$store.state.userInfo.isNetwork" class="none-network">
        <p>
          <span>Connect to a wallet</span>
          to view your liquidity.
        </p>
      </div>

    </div>

    <!-- 选择币种 -->
    <coin-popup
        v-bind="selectCoinOptions"
        v-model="isShowSelectCoin"
        @change="handleCoinChange"
        :isShowBalance="true"
        @close="isShowSelectCoin = false"></coin-popup>

    <!-- 选择链 -->
    <coin-popup
        type="chain"
        :sub-type="selectChainType"
        title="Select chain type"
        :is-show-balance="false"
        v-model="isShowSelectChain"
        @change="handleChainChange"
        @close="isShowSelectChain = false"></coin-popup>

    <!-- 确认跨链 -->
    <confirm-cross-chain
        v-model="isShowConfirmPop"
        ref="confirmCrossChainRef"
        :currentChain="currentChain"
        :cross-bridge-info="crossBridgeInfo"
        :contract-obj="contractObj"
        @close="isShowConfirmPop = false"></confirm-cross-chain>

    <!-- 跨链记录 -->
    <cross-chain-record
        v-if="isShowRecord"
        v-model="isShowRecord"
        @close="isShowRecord = false"
        :record-options="recordOptions"
    ></cross-chain-record>
  </div>
</template>

<script>
import coinPopup from './components/coin-popup'
import ConfirmCrossChain from "./components/confirm-cross-chain";
import crossChainRecord from './components/cross-chain-record'
import Earn from "./components/Earn";
import { BridgeContract } from "@/utils/BridgeContract";
import { mapState } from "vuex";
export default {
  name: 'Bridge',
  components: {
    ConfirmCrossChain,
    coinPopup,
    crossChainRecord,
    Earn
  },
  data() {
    return {
      isShowApproveLoading: false, // 授权按钮的loading
      isShowRecord: false,  // 跨链记录弹窗
      isShowConfirmPop: false,  // 确认跨链弹窗
      isShowSelectChain: false, // 打开选择链弹窗
      isShowSelectCoin: false,  // 打开选择币种弹窗
      currentTab: 0,
      tabOptions: [
        this.$t('bridge.bridge.tabs[0]'),
        this.$t('bridge.bridge.tabs[1]')
      ],
      currentCoin: {
        icon: require('@/assets/img/coin/unknown.svg'),
        name: '',
        address: '',
        decimals: '',
        totalSupply: '',
        balance: ''
      },
      currentChain: [
        {
          icon: require('@/assets/img/coin/unknown.svg'),
          name: 'UNKNOWN',
          id: 0,
          chainId: 0,
          // icon: require('@/assets/img/bridge/icon-heco.svg'),
          // id: window.ethereum.networkVersion,
        },
        {
          icon: require('@/assets/img/coin/unknown.svg'),
          name: 'UNKNOWN',
          id: 0,
          chainId: 0
        }
      ],
      selectChainType: 'from',
      bridgeForm: {
        address: '',
        amount: '',
        balance: 0
      },
      currentBridgeAddress: [], // 当前的正在操作的链对应的合约地址，下标0From，1To
      bridgeAddress: { // 业务上，合约地址和对应的链id等数据
        dev: {
          heco: {
            chainId: 256,
            factoryContractAddress: '0xD5cdf75dfF64FA0F3E100615e172fB1AC6Fb08Ce',
            routerContractAddress: '0xfb7D096Ca3B6E631A20B4C3915164aff2e19f1fe'
          },
          bsc: {
            chainId: 97,
            factoryContractAddress: '0x5EffF61e09D1A24a309Cb150a15Db99B42A6c9c7',
            routerContractAddress: '0x6331BB4Ca3dcb002f6f36A74204A1832111E0b0C'
          }
        },
        prod: {
          heco: {
            chainId: 128,
            factoryContractAddress: '0x7Bef4aB0284F93334659085E2332d48A7D7D4719',
            routerContractAddress: '0xc8065872317a57C2ae09fE677429225Bbaef635B'
          },
          bsc: {
            chainId: 56,
            factoryContractAddress: '0x7Bef4aB0284F93334659085E2332d48A7D7D4719',
            routerContractAddress: '0xc8065872317a57C2ae09fE677429225Bbaef635B'
          }
        }
      },
      contractObj: {},  // 合约对象
      selectCoinOptions: {
        // type: 'coin',
        title: 'Choose the cross-chain bridge asset',
        dataList: []
      },
      approved: false,  // 是否已经授权
      crossBridgeInfo: {
        coinAddress: '',
        amount: 0,
        accountAddress: '',
        decimal: 16,
        coinName: '',
        toChainId: '',
        toChainType: ''
      },
      recordOptions: {
        address: window.ethereum.selectedAddress,
        chainType: 0,
        coinName: ''
      },
      isCoinComplete: false,
      networkId: 0,  // 钱包当前连接的链id
      isDev: 'dev',
    }
  },
  computed: {
    ...mapState(['userInfo']),
    btnCrossChainText () {
      return this.approved ? this.$t('bridge.bridge.form.btn[1]') : this.$t('bridge.bridge.form.btn[0]')
    },
    coinList () {
      if (this.isCoinComplete) {
        return this.selectCoinOptions.dataList.slice(0)
      }
      return []
    }
  },
  watch: {
    'userInfo.address': { // 监听地址变化，则刷新余额
      deep: true,
      handler (n, o) {
        if(n && n !== o){
          this.getBalance(this.currentCoin)
        }
      }
    },
    "userInfo.networkId": { // 监听链id的变化
      deep: true,
      handler (n, o) {
        if (n !== o) {
          this.init(n)
        }
      }
    }
  },
  mounted() {
    // console.log(window.ethereum.networkVersion)

    this.init()
  },
  methods: {
    init (id) {
      if (Number(id) === Number(this.networkId)) {
        return
      }
      this.networkId = Number(id) || Number(window.ethereum.networkVersion)
      let tempAddress = []

      /*
       * 这下面的核心逻辑是:
       * 先判断是否是localhost本机服务，
       * 然后判断是火币链还是币安链，
       * 不同的情况分别取不同的配置去初始化合约对象
       */
      if (window.location.href.indexOf('localhost') > -1) {
        this.isDev = 'dev'
      } else {
        this.isDev = 'prod'
      }

      // TODO 临时配合测试用
      // this.isDev = 'dev'

      this.bridgeForm = {
        address: '',
        amount: '',
        balance: 0
      }

      tempAddress = this.handleContractAddress(this.isDev)
      // console.log(tempAddress)
      this.contractObj = new BridgeContract(tempAddress[0])
      this.contractObj.on('completeCoinList', this.handleCoinList)  // 订阅币种信息完成的事件
      this.contractObj.createRouterContract(tempAddress[1])

      // 重新初始化ToFactory合约对象
      this.contractObj.createToFactoryContract(this.currentBridgeAddress[2], this.currentChain[1].chainId)
      this.contractObj.createToRouterContract(this.currentBridgeAddress[3], this.currentChain[1].chainId)
    },
    handleContractAddress (type) {
      this.currentBridgeAddress = []  // 数组0为工厂合约，1为路由合约
      if (type === 'prod') {
        switch (this.networkId) {
          case 128: // HECO正式链
            this.currentBridgeAddress.push(
                this.bridgeAddress.prod.heco.factoryContractAddress,
                this.bridgeAddress.prod.heco.routerContractAddress,
                this.bridgeAddress.prod.bsc.factoryContractAddress,
                this.bridgeAddress.prod.bsc.routerContractAddress
            )
            const chain = {
              icon: require('@/assets/img/bridge/icon-heco.svg'),
              name: 'HECO',
              id: 2,
              chainId: 128
            }
            const chain_b = {
              icon: require('@/assets/img/bridge/icon-bsc.svg'),
              name: 'BSC',
              id: 3,
              chainId: 56
            }
            this.$set(this.currentChain, 0, chain)
            this.$set(this.currentChain, 1, chain_b)
            break
          case 56:  // BSC正式链
            this.currentBridgeAddress.push(
                this.bridgeAddress.prod.bsc.factoryContractAddress,
                this.bridgeAddress.prod.bsc.routerContractAddress,
                this.bridgeAddress.prod.heco.factoryContractAddress,
                this.bridgeAddress.prod.heco.routerContractAddress
            )
            const chain2 = {
              icon: require('@/assets/img/bridge/icon-heco.svg'),
              name: 'HECO',
              id: 2,
              chainId: 128
            }
            const chain2_b = {
              icon: require('@/assets/img/bridge/icon-bsc.svg'),
              name: 'BSC',
              id: 3,
              chainId: 56
            }
            this.$set(this.currentChain, 0, chain2_b)
            this.$set(this.currentChain, 1, chain2)
            break
          default:
            break
        }
      } else {
        switch (this.networkId) {
          case 256: // HECO测试链
            this.currentBridgeAddress.push(
                this.bridgeAddress.dev.heco.factoryContractAddress,
                this.bridgeAddress.dev.heco.routerContractAddress,
                this.bridgeAddress.dev.bsc.factoryContractAddress,
                this.bridgeAddress.dev.bsc.routerContractAddress
            )
            const chain = {
              icon: require('@/assets/img/bridge/icon-heco.svg'),
              name: 'HECO',
              id: 2,
              chainId: 256
            }
            const chain_b = {
              icon: require('@/assets/img/bridge/icon-bsc.svg'),
              name: 'BSC',
              id: 3,
              chainId: 97
            }
            this.$set(this.currentChain, 0, chain)
            this.$set(this.currentChain, 1, chain_b)
            break
          case 97:  // BSC测试链
            this.currentBridgeAddress.push(
                this.bridgeAddress.dev.bsc.factoryContractAddress,
                this.bridgeAddress.dev.bsc.routerContractAddress,
                this.bridgeAddress.dev.heco.factoryContractAddress,
                this.bridgeAddress.dev.heco.routerContractAddress
            )
            const chain2 = {
              icon: require('@/assets/img/bridge/icon-heco.svg'),
              name: 'HECO',
              id: 2,
              chainId: 256
            }
            const chain2_b = {
              icon: require('@/assets/img/bridge/icon-bsc.svg'),
              name: 'BSC',
              id: 3,
              chainId: 97
            }
            this.$set(this.currentChain, 0, chain2_b)
            this.$set(this.currentChain, 1, chain2)
            break
          default:
            break
        }
      }
      return this.currentBridgeAddress.slice(0)
    },
    getImg (name) {
      try {
        return require(`@/assets/img/coin/${name}.svg`)
      } catch (e) {
        return require('@/assets/img/coin/unknown.svg')
      }
    },
    setMaxAmount () {
      this.bridgeForm.amount = this.bridgeForm.balance
    },
    setAddressMine () {
      this.bridgeForm.address = window.ethereum.selectedAddress || ''
    },
    handleCoinList (event, data) {  // 币种列表查询的订阅方法
      let list = data.slice(0).map(c => {
        c.balance = this.common.fromWei(c.balance, Number(c.decimals))
        return c
      })
      this.selectCoinOptions.dataList = list

      this.handleCoinChange(this.selectCoinOptions.dataList[0])
      this.isCoinComplete = true
    },
    tabChange (i) { // Bridge / Your Earn tab切换
      this.currentTab = i
      if (i === 1) {

      }
    },
    handleCoinChange (coin) { // 币种change
      this.currentCoin = coin
      // this.getBalance(coin, this.bridgeForm.address)
      this.bridgeForm.balance = coin.balance

      this.recordOptions = {
        address: window.ethereum.selectedAddress,
        chainType: this.currentChain[0].id,
        coinName: this.currentCoin.name,
        pageNum: 1,
        pageSize: 1000
      }

      // 每次选择的币种变化，都重新初始化usdt合约对象并查询授权额度是否足够
      this.contractObj.createUsdtContract(this.currentCoin.address)
      this.contractObj.getAllowance(this.currentBridgeAddress[1])
        .then(res => {
          if (Number(res) <= 0) {
            // this.$toast('Insufficient authorization')
            this.approved = false
            return false
          }
          this.approved = true // 如果额度大于0，则证明是授权过了。 这个变量会控制按钮显示的文案。
        })
        .catch(e => {
          this.$toast(e)
        })
    },
    getBalance (coin, accountAddress) { // 获取代币余额
      // 参数：1.代币地址 2.回调 3.账户地址(不传则取当前钱包的地址)
      this.ercMethods.getBalance(coin.address,res => {
        if(res.code === 200){
          this.bridgeForm.balance = this.common.fromWei(res.data, Number(coin.decimals))
        }else{
          this.bridgeForm.balance = 0
        }
      }, accountAddress)
    },
    handleChainChange (chain, data) {  // 链 change
      if (data.subType === 'from') {
        this.$set(this.currentChain, 0, chain)
      } else {
        this.$set(this.currentChain, 1, chain)
      }
    },
    showChainPop (type) {
      this.selectChainType = type
      this.isShowSelectChain = true
    },
    approve () {
      if (!Number(this.bridgeForm.amount)) {
        this.$toast(this.$t('bridge.toast.crossChainForm.correctQuantity'))
        return
      }
      if (Number(this.bridgeForm.amount) < 10) {
        this.$toast(this.$t('bridge.toast.crossChainForm.minimum'))
        return
      }
      if (Number(this.bridgeForm.amount) > Number(this.bridgeForm.balance)) {
        this.$toast(this.$t('bridge.toast.crossChainForm.maximum'))
        return
      }
      if (this.isShowApproveLoading) {  // 防抖
        return
      }
      this.isShowApproveLoading = true

      if (this.approved) {  // 如果已经做完授权动作，则开始检测授权额度和跨链操作
        this.handleOpenCrossChainPop()
        return
      }

      // 请求授权
      this.contractObj.approve(this.currentBridgeAddress[1])
        .then(res => {
          this.receipt()
        })
        .catch(e => {
          this.$toast.fail(this.$t('bridge.toast.approve.failure'))
          this.isShowApproveLoading = false
        })

    },
    receipt () {
      this.contractObj.receipt()
        .then(res => {
          // console.log(res)
          this.$toast.success(this.$t('bridge.toast.approve.success'))
          this.isShowApproveLoading = false
          this.approved = true
        })
        .catch(e => {
          setTimeout(()=>{
            this.receipt()
          },2000)
        })
    },
    handleOpenCrossChainPop () {
      // 先查询授权额度，如果额度大于0，则打开 确认跨链的弹窗
      this.contractObj.getAllowance(this.currentBridgeAddress[1])
        .then(res => {
          this.isShowApproveLoading = false
          if (Number(res) <= 0) {
            this.$toast.fail(this.$t('bridge.toast.approve.allowance'))
            return false
          }

          this.crossBridgeInfo = {
            coinAddress: this.currentCoin.address,
            amount: this.bridgeForm.amount,
            accountAddress: this.bridgeForm.address,
            decimal: this.currentCoin.decimals,
            coinName: this.currentCoin.name,
            toChainId: this.currentChain[1].chainId,
            toChainType: this.currentChain[1].id
          }

          // 重新初始化ToFactory合约对象
          this.contractObj.createToFactoryContract(this.currentBridgeAddress[2], this.currentChain[1].chainId)
          this.contractObj.createToRouterContract(this.currentBridgeAddress[3], this.currentChain[1].chainId)
          this.isShowConfirmPop = true
          this.$nextTick(() => {
            this.$refs['confirmCrossChainRef'].getCharge()  // 获取手续费
          })
        })
        .catch(e => {
          this.$toast(e)
          this.isShowApproveLoading = false
        })
    },
  }
}
</script>

<style lang="less" scoped>
  .bridge-page {
    box-sizing: border-box;
    padding-top: 46px;
    .bridge-logo {
      width: 100%;
      text-align: center;
      margin-bottom: 62px;
      img {
        width: 283px;
        height: 89px;
      }
    }
    .title {
      font-size: 34px;
      font-family: Montserrat-Bold, Montserrat;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 42px;
      width: 100%;
      text-align: center;
      padding-top: 64px;
    }
    .sub-title {
      font-size: 18px;
      font-family: Montserrat-Medium, Montserrat;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 22px;
      width: 100%;
      text-align: center;
      margin-top: 40px;
    }
    .bridge-form {
      width: 544px;
      min-height: 534px;
      // max-height: 818px;
      border-radius: 32px;
      background: rgba(255, 255, 255, 0.3);
      margin: 48px auto 0 auto;
      box-sizing: border-box;
      padding: 24px 24px 23px 24px;
      position: relative;
      backdrop-filter: blur(10px);
      overflow: hidden;
      .tabs {
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 4px;
        .tab {
          width: 242px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          p {
            font-family: Montserrat-Medium, Montserrat;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.6);
          }
        }
        .active {
          background: #2B7EFF;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
          p {
            font-size: 18px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      .form-item {
        width: 496px;
        height: 56px;
        background: #565A66;
        border-radius: 16px;
        margin: 0 auto;
      }
      .bridge {
        .item-title {
          font-size: 18px;
          font-family: Montserrat-Regular, Montserrat;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 22px;
        }
        .choose-coin-title {
          margin: 24px 0 12px 0;
        }
        .choose-coin {
          box-sizing: border-box;
          padding: 0 24px 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          .left {
            display: flex;
            align-items: center;
            img {
              width: 36px;
              height: 36px;
            }
            p {
              font-size: 18px;
              font-family: Montserrat-Bold, Montserrat;
              font-weight: bold;
              color: #FFFFFF;
              line-height: 22px;
              margin-left: 8px;
            }
          }
        }
        .select-chain-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          .chain-from-to {
            width: 220px;
            display: flex;
            flex-wrap: wrap;
            // cursor: pointer;
            p {
              font-size: 18px;
              font-family: Montserrat-Bold, Montserrat;
              font-weight: bold;
              color: #FFFFFF;
              line-height: 22px;
            }
            .select-chain {
              margin-top: 12px;
              width: 220px;
              height: 64px;
              background: rgba(107, 110, 119, 0.8);
              border-radius: 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              box-sizing: border-box;
              padding: 0 16px;
              .left {
                display: flex;
                align-items: center;
                img {
                  width: 36px;
                  height: 36px;
                }
                p {
                  margin-left: 8px;
                }
              }
              & > img:last-child {
                width: 24px;
                height: 24px;
              }
            }
          }
          .chain-from-to-arrow {
            width: 24px;
            height: 24px;
            margin-top: 34px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .address-title {
          margin: 16px 0 12px 0;
        }
        .address-input {
          box-sizing: border-box;
          // background: transparent;
          border: none;
          background: #565A66;
          padding: 0 16px;
          font-size: 18px;
          font-weight: 400;
          color: #FFFFFF;
          outline: none;
          &::placeholder{
            color: rgba(255, 255, 255, .29);
          }
        }
        .address-warning {
          font-size: 14px;
          font-family: Montserrat-Regular, Montserrat;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.8);
          line-height: 18px;
          margin: 8px 0 16px 0;
          span {
            color: #E32C1E;
          }
        }
        .amount-title {
          margin-bottom: 12px;
        }
        .amount-input {
          padding: 0 16px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          input {
            border-radius: 16px;
            box-sizing: border-box;
            border: none;
            background: #565A66;
            font-size: 18px;
            font-weight: 400;
            color: #FFFFFF;
            outline: none;
            width: 100%;
            height: 100%;
            &::placeholder{
              color: rgba(255, 255, 255, .29);
            }
          }
          .max {
            width: 44px;
            height: 24px;
            border-radius: 12px;
            border: 1px solid #A2A5B2;
            font-size: 12px;
            font-family: Montserrat-Regular, Montserrat;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        }
        .balance {
          font-size: 14px;
          font-family: Montserrat-Regular, Montserrat;
          font-weight: 400;
          color: #FFFFFF;
          margin: 8px 0 16px 0;
        }
        .btn-approve {
          width: 496px;
          height: 72px;
          background: #393A3E;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          p {
            font-size: 16px;
            font-family: Montserrat-Bold, Montserrat;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 19px;
          }
        }
        .limit-title {
          font-size: 16px;
          font-family: Montserrat-SemiBold, Montserrat;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 19px;
          margin: 16px 0 8px 0;
        }
        .cross-chain-limit {
          width: 498px;
          p {
            font-size: 14px;
            font-family: Montserrat-SemiBold, Montserrat;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 18px;
            text-align: right;
            width: 100%;
          }
          .progress {
            width: 100%;
            height: 8px;
            background: #565A66;
            border-radius: 16px;
            position: relative;
            margin-top: 8px;
            .current-progress {
              background: #2B7EFF;
              border-radius: 16px;
              height: 100%;
              width: 150px;
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        }
        .history {
          font-size: 18px;
          font-family: Montserrat-Medium, Montserrat;
          font-weight: 500;
          color: #1D2BFF;
          line-height: 22px;
          text-decoration: underline #1D2BFF;
          margin-top: 16px;
          text-align: center;
          width: 100%;
          cursor: pointer;
        }
      }

      .none-network {
        width: 100%;
        height: 454px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
        span {
          color: #1D2BFF;
          text-decoration: underline;
        }
      }

    }

    @media screen and (max-width: 600px) {
      box-sizing: border-box;
      padding-top: 0;
      .bridge-logo {
        margin-bottom: 0;
      }
      .title, .sub-title {
        display: none;
      }
      .bridge-form {
        max-width: 92%;
        border-radius: 16px;
        margin-top: 20px;
        .form-item {
          width: 100%;
          height: 48px;
        }
        .tabs {
          width: 100%;
        }
        .select-chain-box {
          width: 100%;
          .chain-from-to {
            width: 45% !important;
            .select-chain {
              width: 100% !important;
              height: 48px !important;
            }
          }
        }
        .btn-approve {
          width: 100% !important;
          height: 64px !important;
        }
      }
    }
  }
</style>