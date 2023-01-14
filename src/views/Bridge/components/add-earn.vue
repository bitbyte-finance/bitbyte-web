<template>
  <van-popup
      v-model="show"
      position="center"
      get-container="body"
      :close-on-click-overlay="false"
      @click-overlay="handleClose"
      :overlay-style="{backgroundColor: 'rgba(0,0,0,.5)'}">
    <div class="add-earn">
      <div class="header">
        <img @click="handleClose" src="@/assets/img/bridge/icon-left-arrow.svg" alt="">
        <p>{{ $t('bridge.addEarn.title') }}</p>
      </div>
      <div class="content">
        <p>{{ $t('bridge.addEarn.please') }}</p>
        <div class="add-box">
          <div class="balance">
            <p>{{ $t('bridge.addEarn.import') }}</p>
            <p>{{ $t('bridge.bridge.form.amount.balance') }}: {{ addEarnForm.balance }}</p>
          </div>
          <div class="input-wrap">
            <input v-model="addEarnForm.amount" type="text" placeholder="0.0" />
            <div class="right">
              <div @click="setMax" class="btn-max">
                <p>{{ $t('bridge.bridge.form.amount.btn') }}</p>
              </div>
              <div @click="isShowCoinList = !isShowCoinList" class="btn-select">
                <p>{{ addEarnForm.name }}<i class="el-icon-arrow-down el-icon--right"></i></p>
                <div v-show="isShowCoinList" class="select-coin-list">
                  <div
                      v-for="(coin, i) in coinList"
                      :key="'coin'+i"
                      @click="handleSelectCoin(coin)"
                      class="coin-item">
                    <img :src="getImg(coin.name)" alt="">
                    <div>
                      <p>{{ coin.name }}</p>
                      <p>{{ coin.balance.toString().length > 15 ? coin.balance.toString().substring(0, 15) + '...' : coin.balance }}</p>
                    </div>
                  </div>
                  <div class="pop-arrow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <div @click="handleAddEarn" class="btn large">
            <span v-show="isShowBtnLoading" class="loading"></span>
            <p>{{ btnText }}</p>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'add-earn',
  model: {
    prop: 'show',
    event: ['change', 'close']
  },
  props: {
    show: {
      required: true,
      default: false
    },
    coinList: {
      type: Array,
      required: true
    },
    contract: Object,
    earn: Object,
    currentBridgeAddress: Array
  },
  data() {
    return {
      isShowBtnLoading: false,  // 按钮的loading
      isShowCoinList: false,
      addEarnForm: {
        amount: '',
        balance: '',
        name: 'Select Token',
        decimals: 0,
        address: ''
      },
      approved: false // 当前币种是否已经授权
    }
  },
  computed: {
    btnText () {
      return this.approved ? this.$t('bridge.addEarn.btn[1]') : this.$t('bridge.addEarn.btn[0]')
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getImg (name) {
      try {
        return require(`@/assets/img/coin/${name}.svg`)
      } catch (e) {
        return require('@/assets/img/coin/unknown.svg')
      }
    },
    setMax () {
      this.addEarnForm.amount = this.addEarnForm.balance
    },
    handleSelectCoin (coin) { // 选中coin的事件
      this.addEarnForm = Object.assign(this.addEarnForm, coin)
      if (!coin || !coin.name || coin.name === 'Select Token') {
        this.approved = false
        return
      }

      this.isShowBtnLoading = true

      // 每次选择的币种变化，都重新初始化usdt合约对象并查询授权额度是否足够
      this.contract.createUsdtContract(coin.address)
      this.contract.getAllowance(this.currentBridgeAddress[1])
          .then(res => {
            if (Number(res) <= 0) {
              // this.$toast('Insufficient authorization')
              this.approved = false
              this.isShowBtnLoading = false
              return false
            }
            this.approved = true // 如果额度大于0，则证明是授权过了。 这个变量会控制按钮显示的文案。
            this.isShowBtnLoading = false
          })
          .catch(e => {
            this.$toast(e)
            this.isShowBtnLoading = false
          })
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
    handleAddEarn () {
      if (!Number(this.addEarnForm.amount))  {
        this.$toast(this.$t('bridge.toast.crossChainForm.correctQuantity'))
        return
      }
      if (this.isShowBtnLoading) {
        return
      }
      this.isShowBtnLoading = true
      if (!this.approved) {
        this.approve()
      } else {
        const params = [
          this.addEarnForm.address,
          this.common.toWei(this.addEarnForm.amount, this.addEarnForm.decimals),
          window.ethereum.selectedAddress,
          new Date().getTime() + 10000
        ]
        this.contract.addLiquidity(params)
            .then(res => {
              this.isShowBtnLoading = false
              this.$toast.success(this.$t('bridge.toast.earn.add.success'))
              this.handleClose()
            })
            .catch(e => {
              this.$toast.fail(this.$t('bridge.toast.earn.add.failure'))
              this.isShowBtnLoading = false
            })
      }
    },
    handleClose () {
      if (!this.isShowBtnLoading) {
        this.$emit('close', false)
      }
    },
  },
  watch: {
    earn (n, o) {
      if (n.name && n.name !== o.name) {
        this.coinList.forEach(coin => {
          if (coin.name === n.name) {
            this.handleSelectCoin(coin)
          }
        })
      } else {
        this.handleSelectCoin({
          amount: '',
          balance: '',
          name: 'Select Token',
          decimals: 0,
          address: ''
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background: none;
}
@keyframes showCoinList {
  from {
    height: 0;
    opacity: 0;
    bottom: -40px;
  }
  to {
    // height: 120px;
    height: auto;
    opacity: 1;
    top: 44px;
  }
}

  .add-earn {
    width: 544px;
    min-height: 500px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    backdrop-filter: blur(10px);

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
      padding: 24px;
      box-sizing: border-box;
      & > p:first-child {
        font-size: 18px;
        font-family: Helvetica;
        color: #FFFFFF;
        line-height: 22px;
      }
      .add-box {
        width: 496px;
        height: 120px;
        background: rgba(107, 110, 119, .8);
        border-radius: 12px;
        margin-top: 13px;
        padding: 16px;
        box-sizing: border-box;
        .balance {
          font-size: 14px;
          font-family: Helvetica;
          color: rgba(255, 255, 255, 0.6);
          line-height: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .input-wrap {
          margin-top: 30px;
          height: 40px;
          display: flex;
          input {
            box-sizing: border-box;
            border: none;
            background: none;
            color: #FFFFFF;
            outline: none;
            width: 100%;
            height: 100%;
            font-size: 32px;
            font-family: Helvetica;
            line-height: 38px;
            &::placeholder{
              color: rgba(255, 255, 255, .6);
            }
          }
          .right {
            display: flex;
            align-items: center;
            & > div {
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }
            .btn-max {
              width: 44px;
              height: 24px;
              border-radius: 12px;
              border: 1px solid #A2A5B2;
              font-size: 12px;
              font-family: Helvetica;
              color: #FFFFFF;
              line-height: 14px;
              cursor: pointer;
            }
            .btn-select {
              width: 144px;
              height: 40px;
              background: #2B7EFF;
              border-radius: 8px;
              margin-left: 8px;
              font-size: 16px;
              font-family: Helvetica;
              color: #FFFFFF;
              line-height: 19px;
              position: relative;

              .select-coin-list {
                position: absolute;
                top: -44px;
                right: -16px;
                // height: 120px;
                height: auto;
                width: 250px;
                background: #565A66;
                border-radius: 8px;
                transition: all 1s;
                animation: showCoinList .3s forwards;
                .coin-item {
                  display: flex;
                  box-sizing: border-box;
                  padding: 12px 24px;
                  border-radius: 8px;
                  width: 100%;
                  height: 60px;
                  &:hover {
                    background: rgba(255, 255, 255, .1);
                  }
                  img {
                    margin-right: 16px;
                  }
                  & > div:last-child {
                    & > p:last-child {
                      font-size: 12px;
                      font-family: Montserrat-Regular, Montserrat;
                      font-weight: 400;
                      color: rgba(255, 255, 255, .5);
                      line-height: 15px;
                    }
                  }
                }
                .pop-arrow {
                  top: -6px;
                  left: 50%;
                  margin-right: 3px;
                  border-bottom-color: #ebeef5;
                  border-width: 6px;
                  filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
                  &:after {
                    position: absolute;
                    display: block;
                    width: 0;
                    height: 0;
                    border-color: transparent;
                    border-style: solid;
                  }
                }
              }
            }
          }
        }
      }
      .btn-group {
        font-size: 16px;
        font-family: Helvetica;
        color: #FFFFFF;
        line-height: 19px;
        height: 72px;
        margin-top: 179px;
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          height: 100%;
          background: #393A3E;
          cursor: pointer;
        }
        .large {
          width: 496px;
        }
      }
    }
  }

@media screen and (max-width: 600px) {
  .van-popup {
    width: 92%;
  }
  .add-earn {
    width: 100%;
    .content {
      width: 100%;
      .add-box {
        width: 100%;
        .input-wrap {
          .right {
            .btn-select {
              width: 100px;
              font-size: 14px;
            }
          }
        }
      }
      .btn-group {
        width: 100%;
        .large {
          width: 100%;
        }
      }
    }
  }
}
</style>