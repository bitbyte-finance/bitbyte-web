<template>
  <div class="earn">
<!--    <div v-if="!earnList || earnList.length <= 0" class="none-earn">
      <p>No earn found.</p>
    </div>-->
    <div class="loading-wrap" v-if="!earnList || earnList.length <= 0">
      <div class="loading"></div>
    </div>
    <div
        v-for="(e, i) in earnList"
        :key="'e'+i"
        class="earn-item"
        :class="e.class">
      <div @click="handleShowDetail(e, i)" class="header">
        <div class="left">
          <img :src="getImg(e.name)" alt="">
          <p>{{ e.name }}</p>
        </div>
        <img src="@/assets/img/bridge/icon-right-arrow.svg" alt="">
      </div>
      <div class="content">
        <div class="title">
          <p>{{ $t('bridge.earn.coinItem.pooled') }} {{ e.name }}:</p>
          <p>{{ $t('bridge.earn.coinItem.share') }}:</p>
        </div>
        <div class="amount">
          <p>{{ e.sumAmount }}</p>
          <p>{{ e.share || 0 }}%</p>
        </div>

        <!-- 测试用 -->
<!--        <div>
          <p>自己的份额数量：{{ e.amount }}</p>
          <p>池子实际流动的总数量: {{ e.realSumAmount }}</p>
        </div>-->

        <div class="btn-group">
          <div @click="openRemovePop(e)" class="btn">
            <p>{{ $t('bridge.earn.coinItem.btn.remove') }}</p>
          </div>
          <div @click="openAddPop(e)" class="btn">
            <p>{{ $t('bridge.earn.coinItem.btn.add') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div @click="openAddPop(false)" class="btn-add">
      <img src="@/assets/img/bridge/icon-circle-add.svg" alt="">
    </div>

    <remove-earn
        :current-bridge-address="currentBridgeAddress"
        v-if="isShowRemove"
        v-model="isShowRemove"
        :earn="currentHandleEarn"
        :contract="contract"
        @close="isShowRemove = false"></remove-earn>

    <add-earn
        :current-bridge-address="currentBridgeAddress"
        :contract="contract"
        :coin-list="coinList"
        :earn="currentAddEarn"
        v-model="isShowAddPop"
        @close="isShowAddPop = false"></add-earn>
  </div>
</template>

<script>
import removeEarn from './remove-earn'
import addEarn from './add-earn'
export default {
  name: 'Earn',
  components: {
    removeEarn,
    addEarn
  },
  props: {
    coinList: {
      type: Array,
      required: true
    },
    contract: Object,
    currentBridgeAddress: Array
  },
  data() {
    return {
      isShowRemove: false,
      isShowAddPop: false,
      earnList: [],
      currentHandleEarn: {
        name: '',
        amount: '',
        share: '',
        address: '',
        decimals: 18
      },
      currentAddEarn: {
        name: ''
      }
    }
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
    getEarnList () {
      this.earnList = []
      this.coinList.forEach(coin => {
        this.contract.getUserReserves([coin.address, window.ethereum.selectedAddress])
          .then(res => {
            try {

              const sumFee = this.common.fromWei(res._sumFee, Number(coin.decimals))
              const fee = this.common.fromWei(res._fee, Number(coin.decimals))
              const userBalance = this.common.fromWei(res._userBalance, Number(coin.decimals))
              const denominator = this.common.fromWei("100000000000000000000000000", Number(coin.decimals))

              /*console.log('income')
              console.log(`decimals:${Number(coin.decimals)}`)
              console.log(`sumFee:${sumFee}`)
              console.log(`fee:${fee}`)
              console.log(`userBalance:${userBalance}`)
              console.log(`denominator10000那个:${denominator}`)
              console.log(100000000000000000000000000)
              console.log((res._sumFee - res._fee) * res._userBalance / 100000000000000000000000000)*/


              // (res._sumFee - res._fee) * res._userBalance / 100000000000000000000000000
              let income = this.BigNumber(sumFee - fee).times(userBalance).div(denominator)
              // console.log(income)

              let earn = {
                name: coin.name,
                share: this.subNumber((this.BigNumber(res._userBalance).div(res._realReserve0)) * 100, 6),
                amount: this.subNumber(this.common.fromWei(res._userBalance, Number(coin.decimals)), 6),
                sumAmount: this.subNumber(this.common.fromWei(res._realReserve0, Number(coin.decimals)), 6),
                realSumAmount: this.common.fromWei(res._reserve0, Number(coin.decimals)),
                address: coin.address,
                decimals: coin.decimals,
                income: this.subNumber(income, 6),
                show: false,
                class: ''
              }
              earn = Object.assign(earn, res)
              // console.log(earn)
              this.earnList.push(earn)
            } catch (e) {
              console.log(e)
            }
          })
          .catch(e => {

          })
      })
    },
    subNumber (num, decimal) {  // 截断数字
      let numArr = num.toString().split('.')
      if (numArr.length > 1 && numArr[1].length > Number(decimal)) {
        let numStr = numArr[1].toString()
        return `${numArr[0]}.${numStr.substring(0, 6)}`
      }
      return num
    },
    openAddPop (e) {
      this.currentAddEarn = {
        name: ''
      }
      if (e) {
        this.currentAddEarn = e
      }
      this.isShowAddPop = true
    },
    openRemovePop (earn) {
      this.currentHandleEarn = earn
      this.isShowRemove = true
    },
    handleShowDetail (e, i) {
      let tempEarn = Object.assign({}, e)

      if (!e.show) {
        tempEarn.class = 'show-detail'
      } else {
        tempEarn.class = 'retraction-detail'
      }
      tempEarn.show = !tempEarn.show
      this.$set(this.earnList, i, tempEarn)
    }
  },
  watch: {
    coinList (n, o) {
      if (n && n.length > 0) {
        this.getEarnList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes stretchDetail {
  0% {
    height: 84px;
  }
  100% {
    height: 247px;
  }
}
@keyframes retraction {
  from {
    height: 247px;
  }
  to {
    height: 84px;
  }
}
.earn {
  width: 100%;
  box-sizing: border-box;
  padding-top: 12px;

  .loading-wrap {
    width: 100%;
    height: auto;
    text-align: center;
    margin-top: 50px;
    .loading{
      width: 100px;
      height: 100px;
    }
  }
  .none-earn {
    margin: 139px 0 7px 0;
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-family: Helvetica;
    color: #FFFFFF;
    line-height: 22px;
  }
  .show-detail {
    animation: stretchDetail .5s forwards;
  }
  .retraction-detail {
    animation: retraction .5s forwards;
  }
  .earn-item {
    width: 498px;
    height: 84px;
    background: rgba(107, 110, 119, .79);
    border-radius: 16px;
    margin-top: 16px;
    box-sizing: border-box;
    padding: 0 24px;
    overflow: hidden;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    // transition: .5s height;
    .header {
      height: 84px;
      width: 100%;
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
          margin-left: 16px;
          font-size: 18px;
          font-family: Helvetica;
          color: #FFFFFF;
          line-height: 22px;
        }
      }
      & > img:last-child {
        width: 20px;
        height: 20px;
        transform: rotate(90deg);
      }
    }
    .content {
      width: 100%;
      & > div {
        display: flex;
        justify-content: space-between;
        p {
          width: 50%;
          text-align: left;
        }
      }
      .title {
        font-size: 16px;
        font-family: Helvetica;
        color: rgba(255, 255, 255, .6);
        line-height: 19px;
      }
      .amount {
        font-size: 23px;
        font-family: Helvetica;
        color: #FFFFFF;
        line-height: 28px;
        margin-top: 12px;
      }
      .btn-group {
        font-size: 16px;
        font-family: Helvetica;
        color: #FFFFFF;
        line-height: 19px;
        margin-top: 24px;
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          cursor: pointer;
          p {
            width: auto;
          }
          &:nth-of-type(1) {
            width: 160px;
            border-radius: 16px;
            border: 1px solid #A2A5B2;
          }
          &:nth-of-type(2) {
            width: 274px;
            background: #393A3E;
            border-radius: 16px;
           }
        }
      }
    }
  }
  .btn-add {
    width: 100%;
    text-align: center;
    img {
      cursor: pointer;
    }
  }

  @media screen and (max-width: 600px) {
    .earn-item {
      width: 100%;
      .content {
        .amount {
          font-size: 14px;
          & > p:first-child {
            width: 100px;
            word-break: break-all;
            word-wrap: break-word;
          }
          & > p:nth-child(2) {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>