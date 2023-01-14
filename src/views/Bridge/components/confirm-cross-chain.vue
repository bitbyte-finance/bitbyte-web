<template>
  <van-popup
      v-model="show"
      position="center"
      get-container="body"
      :close-on-click-overlay="false"
      @click-overlay="handleClose"
      :overlay-style="{backgroundColor: 'rgba(0,0,0,.5)'}">
    <div class="confirm-cross-chain">
      <div class="header">
        <img @click="handleClose" src="@/assets/img/bridge/icon-left-arrow.svg" alt="">
        <p>{{ $t('bridge.confirmCrossChain.title') }}</p>
      </div>
      <div class="content">
        <div class="from-to-box">
          <div class="chain-item">
            <p>{{ $t('bridge.bridge.form.fromTo[0]') }}</p>
            <img :src="currentChain[0].icon" alt="">
            <p>{{ currentChain[0].name }}</p>
          </div>
          <img src="@/assets/img/bridge/icon-right-arrow-big.svg" alt="">
          <div class="chain-item">
            <p>{{ $t('bridge.bridge.form.fromTo[1]') }}</p>
            <img :src="currentChain[1].icon" alt="">
            <p>{{ currentChain[1].name }}</p>
          </div>
        </div>
        <p class="item-title">{{ $t('bridge.confirmCrossChain.amount') }}</p>
        <div class="item-title item-text-medium">
          <p>{{ crossBridgeInfo.amount.toString().length > 20 ? crossBridgeInfo.amount.toString().substring(0, 20) + '...' : crossBridgeInfo.amount }}</p>
          <p>{{ crossBridgeInfo.coinName }}</p>
        </div>
        <hr />
        <div class="item-text-small">
          <p>{{ $t('bridge.confirmCrossChain.address') }}</p>
          <p>{{ subAddress(crossBridgeInfo.accountAddress) }}</p>
        </div>
        <p class="item-title">{{ $t('bridge.confirmCrossChain.actual') }}</p>
        <div class="item-title item-text-medium">
          <p>{{ actualAmount }}</p>
          <p>{{ crossBridgeInfo.coinName }}</p>
        </div>
        <hr />
        <div class="item-text-small">
          <p>{{ $t('bridge.confirmCrossChain.fee') }}</p>
          <p>{{ charge }} {{ crossBridgeInfo.coinName }}</p>
        </div>
        <p class="item-text-small description">
          {{ $t('bridge.confirmCrossChain.description') }}
        </p>
        <div @click="confirmCrossChain" class="btn-confirm">
          <span v-show="isShowBtnLoading" class="loading"></span>
          <p>{{ $t('bridge.confirmCrossChain.btn[0]') }}</p>
        </div>
        <p @click="handleClose">{{ $t('bridge.confirmCrossChain.btn[1]') }}</p>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'confirm-cross-chain',
  model: {
    prop: 'show',
    event: ['change', 'close']
  },
  props: {
    show: {
      required: true,
      default: false
    },
    currentChain: Array,
    crossBridgeInfo: Object,
    contractObj: Object
  },
  data() {
    return {
      isShowBtnLoading: false, // 按钮的loading动画,
      actualAmount: 0,
      charge: 0,
      coinAddressList: {
        heco: {
          dev: {
            SSD: '0xBcBf05c0706F28E23D3cF5C0bc0fc48eDBc00a3E',
            CD: '0xC9da7907cDB20753F6B101F075e0BD7908B98461',
            TZBC: '0x1E48B3f37bFf8DEe62bd49dcb9AC403743d21Fb2'
          },
          prod: {
            ZBC: '0x3bd3956488e429dcecf6ee5e6e29660f7465d880',
            USDT: '0xa71edc38d189767582c38a3145b5873052c3e47a'
          }
        },
        bsc: {
          dev: {
            SSD: '0x2334bfCc92c8E4f8Fac6Cd7a5351C0008AC0fD64',
            CD: '0xF3B83229EF1652Ae5B2f3B4e0E8124ee13Ed4B82',
            TZBC: '0x39E7f6488216a90F60149E1190b8058dB6A610D9'
          },
          prod: {
            ZBC: '0x67Fa70a0B61c8390D0BE5c7370BFbC6126412F01',
            USDT: '0x55d398326f99059ff775485246999027b3197955'
          }
        }
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    subAddress (address) {
      return `${address.substring(0, 12)}...${address.substring(address.length - 10, address.length)}`
    },
    confirmCrossChain () {  // 确认跨链方法
      if (this.isShowBtnLoading) {
        return
      }
      this.isShowBtnLoading = true
      this.getPoolAmount()  // 这个方法查询目标链代币池子额度是否足够
        .then(enough => {
          // 1.eth 2.hb 3. bian
          const options = [
            this.crossBridgeInfo.coinAddress, // 代币地址
            this.common.toWei(this.crossBridgeInfo.amount, this.crossBridgeInfo.decimal),  // 数量
            this.crossBridgeInfo.accountAddress,  // 账户地址
            this.currentChain[1].id
          ]

          // 跨链方法执行完了之后通过轮询查询日志的方式来确认是否成功
          this.contractObj.crossChain(options)
              .then(res => {
                this.receipt(res)
              })
              .catch(e => {
                console.log(e)
                this.$toast.fail(this.$t('bridge.toast.crossChain.failure'))
                this.isShowBtnLoading = false
              })
        })
        .catch(e => { // 如果跨链数量大于目标链的代币池子的流动数量则return
          console.log(e)
          this.$toast.fail(this.$t('bridge.toast.crossChain.targetQuota'))
          this.isShowBtnLoading = false
        })

    },
    receipt (hash) {
      this.contractObj.receipt(hash)
          .then(res => {
            // 0x1
            if (res.code === 200 && res.msg) {
              this.$toast.success(this.$t('bridge.toast.crossChain.success'))
              this.isShowBtnLoading = false
              this.handleClose()
            } else {
              // 如果不是成功状态，则继续轮询
              setTimeout(() => {
                this.receipt(hash)
              },2000)
            }

          })
          .catch(e => {
            setTimeout(() => {
              this.receipt(hash)
            },2000)
          })
    },
    getPoolAmount () {  // 查询目标链的代币池余额
      return new Promise((resolve, reject) => {
        let tempCoinAddress = ''
        switch (this.crossBridgeInfo.toChainType) {
          case 2:
            if (this.crossBridgeInfo.toChainId === 256) {
              tempCoinAddress = this.coinAddressList.heco.dev[this.crossBridgeInfo.coinName]
            } else {
              tempCoinAddress = this.coinAddressList.heco.prod[this.crossBridgeInfo.coinName]
            }
            break
          case 3:
            if (this.crossBridgeInfo.toChainId === 97) {
              tempCoinAddress = this.coinAddressList.bsc.dev[this.crossBridgeInfo.coinName]
            } else {
              tempCoinAddress = this.coinAddressList.bsc.prod[this.crossBridgeInfo.coinName]
            }
            break
          default:
            break
        }
        const params = [
          tempCoinAddress,
          window.ethereum.selectedAddress
        ]
        this.contractObj.getUserReserves(params, 'toRouterContract')
          .then(pool => {
            // debugger
            // console.log(this.common.fromWei(pool._reserve0, Number(this.crossBridgeInfo.decimal)))
            // console.log(this.common.fromWei(pool._realReserve0, Number(this.crossBridgeInfo.decimal)))
            // debugger

            const reserve = parseFloat(this.common.fromWei(pool._reserve0, Number(this.crossBridgeInfo.decimal)))
            const realReserve = parseFloat(this.common.fromWei(pool._realReserve0, Number(this.crossBridgeInfo.decimal)))

            // 将代币池子的数量转换成实际数量后再比对
            if (reserve >= this.crossBridgeInfo.amount && realReserve >= this.crossBridgeInfo.amount) {
              resolve(true)
            } else {
              reject(false)
            }
          })
          .catch(e => {
            reject(false)
          })
      })
    },
    getCharge () {  // 获取并计算手续费
      const options = {
        chainType: this.currentChain[1].id,
        coinName: this.crossBridgeInfo.coinName
      }

      this.$http.get('getFee', {params: options})
        .then(res => {
          // 计算实际到账数量
          this.charge = this.BigNumber(this.crossBridgeInfo.amount).times(this.BigNumber(res.data.crossFeeRate))
          this.actualAmount = (this.BigNumber(this.crossBridgeInfo.amount).minus(this.charge)).toFixed(4)
        })
        .catch(e => {

        })
    },
    handleChainType (id) {
      let type_ = 0
      switch (Number(id)) {
        case 256:
          type_ = 3
          break
        case 128:
          type_ = 3
          break
        case 97:
          type_ = 2
          break
        case 56:
          type_ = 2
          break
        default:
          break
      }
      return type_
    },
    handleClose () {
      if (!this.isShowBtnLoading) {
        this.$emit('close', false)
      }
    },
    backup () {
      try {
        const inputs = [
          {
            "indexed":true,
            "internalType":"address",
            "name":"sender",
            "type":"address"
          },
          {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
          }
        ]

        const logs = res.data.logs
        const log = logs[logs.length-1]
        // console.log(inputs,JSON.stringify(log.data),JSON.stringify(log.topics))
        const logResult = this.contractObj.decodeLog(inputs,log.data,log.topics)

        if (logResult[0]) {
          this.$toast('Cross-chain success!')
          this.isShowBtnLoading = false
        } else {
          this.$toast('Cross-chain failure!')
          this.isShowBtnLoading = false
        }
      } catch (e) {
        debugger
      }
    }
  }
}
</script>

<style lang="less" scoped>

.van-popup {
  background: none;
}
  .confirm-cross-chain {
    width: 420px;
    height: 615px;
    background: #565A66;
    border-radius: 12px;
    box-sizing: border-box;
    overflow: hidden;
    .header {
      width: 100%;
      height: 70px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0 24px;
      img {
        width: 16px;
        height: 16px;
      }
      p {
        margin-left: 17px;
        font-size: 18px;
        font-family: Montserrat-Bold, Montserrat;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 22px;
      }
    }
    .content {
      width: 100%;
      box-sizing: border-box;
      padding: 17px 24px 0 24px;
      .from-to-box {
        width: 372px;
        height: 129px;
        background: rgba(118, 123, 137, 0.8);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 16px;
        .chain-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          width: 96px;
          font-size: 16px;
          font-family: Montserrat-Medium, Montserrat;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 19px;
          p {
            width: 100%;
          }
          & > p:first-child {
            text-align: left;
          }
          & > p:last-child {
            text-align: right;
          }
          img {
            width: 36px;
            height: 36px;
            margin: 8px 0 16px 0;
          }
          &:nth-of-type(1) {
            img {
              margin-right: 3px;
            }
          }
          &:nth-of-type(2) {
            box-sizing: border-box;
            width: 155px;
            padding-right: 59px;
            & > p:first-child {
              margin-left: 8px;
            }
            & > p:last-child {
              box-sizing: border-box;
              padding-right: 3px;
            }
          }
        }
        & > img:nth-child(2) {
          margin-left: 59px;
        }
      }

      hr {
        height: 1px;
        background: rgba(255, 255, 255, .1);
        border: none;
        margin: 8px 0;
      }

      .item-title {
        font-size: 16px;
        font-family: Montserrat-SemiBold, Montserrat;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 19px;
        margin: 24px 0 16px 0;
      }
      .item-text-medium {
        font-weight: 500;
        margin: 0;
        display: flex;
        justify-content: space-between;
      }
      .item-text-small {
        font-size: 12px;
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
        line-height: 15px;
        display: flex;
        justify-content: space-between;
      }
      .description {
        margin-top: 24px;
        color: rgba(255, 255, 255, .8);
      }
      .btn-confirm {
        width: 372px;
        height: 48px;
        background: #393A3E;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 24px 0 8px 0;
        cursor: pointer;
        p {
          font-size: 16px;
          font-family: Montserrat-Bold, Montserrat;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 19px;
        }
      }
      & > p:last-child {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
        width: 100%;
        text-align: center;
      }
    }

    @media screen and (max-width: 600px) {
      width: 90%;
      height: auto;
      margin: 0 auto;
      .header {
        p {
          font-size: 16px;
        }
      }
      .content {
        width: 100%;
        .from-to-box {
          width: 100%;
          flex: 1;
          .chain-item {
            width: auto;
            &:nth-of-type(2) {
              padding-right: 0;
              p:first-child {
                margin: 0;
              }
            }
          }
          & > img:nth-child(2) {
            margin-left: 40px;
            width: 24px;
          }
        }
        .btn-confirm {
          width: 100%;
        }
      }
    }
  }
</style>