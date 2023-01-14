<template>
  <van-popup
      v-model="show"
      position="center"
      get-container="body"
      :close-on-click-overlay="false"
      @click-overlay="handleClose"
      :overlay-style="{backgroundColor: 'rgba(0,0,0,.5)'}">
    <div class="coin-popup">
      <div class="header">
        <p>{{ title }}</p>
        <img @click="handleClose" src="@/assets/img/close.svg" alt="">
      </div>
      <div
          @click="selectCoin(coin)"
          v-for="(coin, i) in currentList"
          :key="'coin'+i"
          class="coin-item">
        <div class="left">
          <img :src="getImg(coin.name)" alt="">
          <p>{{ coin.name }}</p>
        </div>
        <p v-if="isShowBalance">{{ coin.balance.toString().length > 20 ? coin.balance.toString().substring(0, 20) + '...' : coin.balance }}</p>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'coin-popup',
  model: {
    prop: 'show',
    event: ['change', 'close']
  },
  props: {
    show: {
      required: true,
      default: false
    },
    title: String,
    isShowBalance: Boolean,
    dataList: Array,
    type: String,
    subType: String
  },
  data() {
    return {
      coinList: [
        {
          icon: require('@/assets/img/coin/USDT.svg'),
          name: 'USDT'
        },
        {
          icon: require('@/assets/img/coin/ZBC.svg'),
          name: 'ZBC'
        }
      ],
      chainList: [
        {
          icon: require('@/assets/img/bridge/icon-heco.svg'),
          name: 'HECO'
        },
        {
          icon: require('@/assets/img/bridge/icon-bsc.svg'),
          name: 'BSC'
        },
        {
          icon: require('@/assets/img/bridge/icon-eth.svg'),
          name: 'Ethereum'
        }
      ]
    }
  },
  computed: {
    currentList () {
      let list = []
      switch (this.type) {
        case 'coin':
          list = Object.assign({}, this.coinList)
          break
        case 'chain':
          list = Object.assign({}, this.chainList)
          break
        default:
          list = Object.assign({}, this.dataList)
          break
      }
      return list
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
    handleClose () {
      this.$emit('close', false)
    },
    selectCoin (coin) {
      this.$emit('change', coin, {
        type: this.type,
        subType: this.subType
      })
      this.handleClose()
    }
  }
}
</script>

<style lang="less" scoped>
  .van-popup {
    background: none;
  }
  .coin-popup {
    width: 402px;
    height: 469px;
    background: #565A66;
    border-radius: 12px;
    .header {
      padding: 24px 24px 33px 24px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      p {
        font-size: 16px;
        font-family: Montserrat-Medium, Montserrat;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 19px;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
    .coin-item {
      padding: 24px;
      box-sizing: border-box;
      width: 100%;
      height: 64px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        font-size: 18px;
        font-family: Montserrat-Medium, Montserrat;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 22px;
      }
      .left {
        display: flex;
        align-items: center;
        img {
          width: 36px;
          height: 36px;
          margin-right: 16px;
        }
      }
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
</style>