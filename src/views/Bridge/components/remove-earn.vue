<template>
  <van-popup
      v-model="show"
      position="center"
      get-container="body"
      :close-on-click-overlay="false"
      @click-overlay="handleClose"
      :overlay-style="{backgroundColor: 'rgba(0,0,0,.5)'}">
    <div class="remove-earn">
      <div class="header">
        <img @click="handleClose" src="@/assets/img/bridge/icon-left-arrow.svg" alt="">
        <p>{{ $t('bridge.removeEarn.title') }}</p>
      </div>
      <div class="content">
        <div class="amount-box">
          <p>{{ $t('bridge.removeEarn.amount') }}</p>
          <p class="current-amount">{{ currentAmount }}%</p>
          <el-slider v-model="currentAmount" :show-tooltip="false"></el-slider>
          <div class="btn-shortcuts">
            <div @click="setAmount(25)" class="normal">
              <p>25%</p>
            </div>
            <div @click="setAmount(50)"  class="normal">
              <p>50%</p>
            </div>
            <div @click="setAmount(75)"  class="normal">
              <p>75%</p>
            </div>
            <div @click="setAmount(100)"  class="normal max">
              <p>MAX</p>
            </div>
          </div>
        </div>
        <div class="btn-group">
<!--          <div class="btn small primary">
            <p>Approve</p>
          </div>-->
          <div @click="removeEarn" class="btn large normal">
            <span v-show="isShowBtnLoading" class="loading"></span>
            <p>{{ btnText }}</p>
          </div>
        </div>
        <div class="position-info">
          <p class="title">Your Position</p>
          <div>
            <div class="left">
              <img :src="getImg(earn.name)" alt="">
              <p>{{ earn.name }}</p>
            </div>
            <p>{{ earn.amount }}</p>
          </div>
          <div>
            <p>{{ $t('bridge.removeEarn.share') }}</p>
            <p>{{ earn.share || 0 }} %</p>
          </div>
          <div>
            <p>{{ $t('bridge.removeEarn.income') }}</p>
            <p>{{ earn.income }}</p>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'remove-earn',
  model: {
    prop: 'show',
    event: ['change', 'close']
  },
  props: {
    show: {
      required: true,
      default: false
    },
    earn: Object,
    contract: Object,
    currentBridgeAddress: Array
  },
  data() {
    return {
      currentAmount: 0,
      isShowBtnLoading: false,  // 按钮的loading
      approved: false,  // 当前币种是否已经授权
    }
  },
  computed: {
    btnText () {
      return this.approved ? this.$t('bridge.removeEarn.btn[1]') : this.$t('bridge.removeEarn.btn[0]')
    },
  },
  created() {
  },
  mounted() {
    this.getApproveAllowance(this.earn)  // 获取授权额度
  },
  methods: {
    getImg (name) {
      try {
        return require(`@/assets/img/coin/${name}.svg`)
      } catch (e) {
        return require('@/assets/img/coin/unknown.svg')
      }
    },
    getApproveAllowance (coin) {
      if (this.isShowBtnLoading) {
        return
      }
      this.isShowBtnLoading = true
      // 查询授权额度，如果额度小于0，则显示授权按钮
      // 先要初始化一下usdt合约对象
      this.contract.createUsdtContract(coin.address)
      this.contract.getAllowance(this.currentBridgeAddress[1])
          .then(res => {
            this.isShowBtnLoading = false
            if (Number(res) <= 0) {
              this.$toast.fail(this.$t('bridge.toast.approve.allowance'))
              this.approved = false
              return false
            }
            this.approved = true
          })
          .catch(e => {
            this.$toast(e)
            this.isShowBtnLoading = false
          })
    },
    removeEarn () {
      if (this.isShowBtnLoading) {
        return
      }
      this.isShowBtnLoading = true
      if (!this.approved) { // 如果没有授权，则执行授权方法
        this.approve()
      } else {
        this.getPoolAmount()
          .then(enough => {
            const params = [
              this.earn.address,
              this.common.toWei(this.BigNumber(this.earn.amount).times(this.currentAmount / 100), this.earn.decimals),
              window.ethereum.selectedAddress,
              new Date().getTime() + 10000
            ]

            this.contract.removeLiquidity(...params)
                .then(res => {
                  this.isShowBtnLoading = false
                  this.$toast.fail(this.$t('bridge.toast.earn.remove.success'))
                  this.handleClose()
                })
                .catch(e => {
                  this.$toast.fail(this.$t('bridge.toast.earn.remove.failure'))
                  this.isShowBtnLoading = false
                })
          })
          .catch(e => {
            this.$toast.fail(this.$t('bridge.toast.earn.poolQuota'))
            this.isShowBtnLoading = false
          })
      }
    },
    getPoolAmount() {
      return new Promise((resolve, reject) => {
        const userAmount = this.BigNumber(this.earn.amount).times(this.currentAmount / 100).plus(this.earn.income)
        const params = [
          this.earn.address,
          window.ethereum.selectedAddress
        ]

        this.contract.getUserReserves(params)
            .then(pool => {
              // console.log(this.common.fromWei(pool._reserve0, Number(this.earn.decimals)))
              // console.log(this.common.fromWei(pool._realReserve0, Number(this.earn.decimals)))
              // debugger

              const reserve = parseFloat(this.common.fromWei(pool._reserve0, Number(this.earn.decimals)))
              const realReserve = parseFloat(this.common.fromWei(pool._realReserve0, Number(this.earn.decimals)))

              // 将代币池子的数量转换成实际数量后再比对
              if (reserve >= userAmount && realReserve >= userAmount) {
                resolve(true)
              } else {
                reject(false)
              }
            })
            .catch(e => {
              console.log(e)
              // debugger
              reject(false)
            })
      })
    },
    setAmount (num) {
      this.currentAmount = num
    },
    handleClose () {
      if (!this.isShowBtnLoading) {
        this.$emit('close', false)
      }
    },
    approve () {
      // 请求授权
      this.contract.approve(this.currentBridgeAddress[1])
          .then(res => {
            this.receipt(res)
          })
          .catch(e => {
            this.$toast.fail(this.$t('bridge.toast.approve.failure'))
            this.isShowBtnLoading = false
          })
    },
    receipt (hash) {
      this.contract.receipt(hash)
          .then(res => {
            this.$toast.success(this.$t('bridge.toast.approve.success'))
            this.isShowBtnLoading = false
            this.approved = true
          })
          .catch(e => {
            setTimeout(()=>{
              this.receipt(hash)
            },2000)
          })
    },
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background: none;
}
  .remove-earn {
    width: 420px;
    height: 540px;
    background: #565A66;
    border-radius: 12px;
    .header {
      height: 70px;
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, .1);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      padding: 0 24px;
      p {
        text-align: center;
        width: 100%;
        font-size: 18px;
        font-family: Helvetica;
        color: #FFFFFF;
        line-height: 22px;
      }
    }
    .content {
      width: 100%;
      box-sizing: border-box;
      padding-top: 17px;
      .amount-box {
        width: 372px;
        height: 194px;
        border-radius: 16px;
        border: 1px solid #8590A0;
        margin: 0 auto;
        padding: 16px;
        box-sizing: border-box;
        & > p:first-child {
          width: 100%;
          font-size: 16px;
          font-family: Helvetica;
          color: #FFFFFF;
          line-height: 19px;
        }
        .current-amount {
          width: 100%;
          font-size: 24px;
          font-family: Helvetica;
          color: #FFFFFF;
          line-height: 29px;
          margin-top: 24px;
        }
        /deep/ .el-slider {
          margin-top: 13px;
          .el-slider__runway {
            margin: 0;
            width: 340px;
            height: 8px;
            background: #45474C;
            border-radius: 4px;
          }
        }
        .btn-shortcuts {
          margin-top: 29px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .normal {
            width: 64px;
            height: 40px;
            background: #868994;
            border-radius: 20px;
            border: 1px solid #A2A5B2;
            font-size: 18px;
            font-family: Helvetica;
            color: #FFFFFF;
            line-height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .max {
            width: 98px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
      .btn-group {
        margin: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn {
          font-size: 16px;
          font-family: Helvetica;
          color: #FFFFFF;
          line-height: 19px;
          border-radius: 12px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .small {
          width: 180px;
        }
        .large {
          width: 372px;
        }
        .primary {
          background: #2B7EFF;
        }
        .normal {
          background: #393A3E;
        }
        .disabled {
          border-radius: 12px;
          border: 1px solid #A2A5B2;
          color: rgba(255, 255, 255, .6);
        }

      }
      .position-info {
        margin-top: 8px;
        box-sizing: border-box;
        padding: 0 24px;
        .title {
          font-size: 16px;
          font-family: Helvetica;
          color: #FFFFFF;
          line-height: 19px;
        }
        & > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          font-family: Helvetica;
          color: #FFFFFF;
          line-height: 19px;
          &:nth-of-type(1) {
            font-size: 18px;
            font-family: Helvetica;
            color: #FFFFFF;
            line-height: 22px;
            margin-top: 13px;
            .left {
              display: flex;
              align-items: center;
              img {
                width: 36px;
                height: 36px;
                margin-right: 8px;
              }
            }
          }

          &:nth-of-type(2) {
            margin: 16px 0 8px 0;
          }
        }
      }
    }
  }
@media screen and (max-width: 600px) {
  .van-popup {
    width: 92%;
  }
  .remove-earn {
    width: 100%;
    .content {
      .amount-box {
        width: 100%;
        /deep/ .el-slider {
          width: 100%;
          .el-slider__runway {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>