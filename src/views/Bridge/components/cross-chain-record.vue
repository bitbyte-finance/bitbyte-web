<template>
  <van-popup
      v-model="show"
      position="center"
      get-container="body"
      :close-on-click-overlay="false"
      @click-overlay="handleClose"
      :overlay-style="{backgroundColor: 'rgba(0,0,0,.5)'}">
    <div class="cross-chain-record">
      <div class="header">
        <img @click="handleClose" src="@/assets/img/bridge/icon-left-arrow.svg" alt="">
        <p>{{ $t('bridge.crossChainRecord.title') }}</p>
      </div>
      <hr />
      <div class="content">
        <div v-for="(h, i) in historyList" :key="'h'+i" class="record-item">
          <div class="chain-state">
            <div class="chain">
              <img :src="handleChainIcon(h.fromChain)" alt="">
              <p>{{ h.fromChain }}</p>
              <img src="@/assets/img/bridge/icon-right-arrow-big.svg" alt="">
              <img :src="handleChainIcon(h.toChain)" alt="">
              <p>{{ h.toChain }}</p>
            </div>
            <div class="state" :class="handleStatusClass(h.status)">{{ h.statusText }}</div>
          </div>
          <p class="datetime">{{ h.dateTimeText }}</p>
          <div class="info-title">
            <p>{{ $t('bridge.crossChainRecord.assets') }}</p>
            <p>{{ $t('bridge.crossChainRecord.quantity') }}</p>
            <p>{{ $t('bridge.crossChainRecord.fee') }}</p>
          </div>
          <div class="info-text">
            <p>{{ h.coinName }}</p>
            <p>{{ h.amount }}</p>
            <p>{{ h.crossFee }}</p>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'cross-chain-record',
  model: {
    prop: 'show',
    event: ['change', 'close']
  },
  props: {
    show: {
      required: true,
      default: false
    },
    recordOptions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      historyList: []
    }
  },
  created() {
  },
  mounted() {
    this.fetchHistory()
  },
  methods: {
    fetchHistory () {
      this.$http.get('getHistoryTrade', {params: this.recordOptions})
          .then(res => {
            // console.log(res.data)
            this.historyList = res.data.records.map(h => {
              h.amount = this.common.fromWei(h.amount, Number(h.decimalPlaces))
              h.crossFee = this.common.fromWei(h.crossFee, Number(h.decimalPlaces))
              h['statusText'] = this.handleStatusText(h.status)
              h['dateTimeText'] = this.handleDateTime(h.createTimeLong)
              return h
            })

            // console.log(this.historyList)
          })
          .catch(e => {
            this.$toast.fail(e)
          })
    },
    handleStatusClass (status) {
      let class_ = 'failure'
      switch (Number(status)) {
        case 1:
          class_ = 'state-pending'
          break
        case 2:
          class_ = 'state-failure'
          break
        case 3:
          class_ = 'state-complete'
          break
        case 4:
          class_ = 'state-failure'
          break
        default:
          class_ = 'state-pending'
          break
      }
      return class_
    },
    handleStatusText (status) {
      let text = 'failure'
      switch (Number(status)) {
        case 1:
          text = 'Pending'
          break
        case 2:
          text = 'Failure'
          break
        case 3:
          text = 'Complete'
          break
        case 4:
          text = 'Failure'
          break
        default:
          text = 'Failure'
          break
      }
      return text
    },
    handleDateTime (date) {
      const d = new Date(date * 1000)
      const year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      let hour = d.getHours()
      let minute = d.getMinutes()
      let second = d.getSeconds()

      if (month.toString().length === 1) {
        month = `0${month}`
      }
      if (day.toString().length === 1) {
        day = `0${day}`
      }
      if (hour.toString().length === 1) {
        hour = `0${hour}`
      }
      if (minute.toString().length === 1) {
        minute = `0${minute}`
      }
      if (second.toString().length === 1) {
        second = `0${second}`
      }

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    handleChainIcon (name) {
      let name_ = name.substring(0, name.indexOf('chain')).toLowerCase()
      return require(`@/assets/img/bridge/icon-${name_}.svg`)
    },
    handleClose () {
      this.$emit('close', false)
    },
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background: none;
}
  .cross-chain-record {
    width: 544px;
    height: 615px;
    background: #565A66;
    border-radius: 12px;
    overflow-y: scroll;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    hr {
      width: 100%;
      height: 1px;
      background: #FFFFFF;
      opacity: 0.1;
      border: none;
    }
    .header {
      height: 70px;
      width: 100%;
      box-sizing: border-box;
      padding: 24px;
      font-size: 18px;
      font-family: Montserrat-Bold, Montserrat;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      p {
        text-align: center;
        width: 100%;
      }
    }
    .content {
      padding: 8px 24px 0 24px;
      width: 100%;
      box-sizing: border-box;
      height: auto;
      overflow-y: scroll;
      .record-item {
        height: 136px;
        width: 100%;
        box-sizing: border-box;
        padding: 16px 0;
        border-bottom: 1px solid rgba(255, 255, 255, .1);
        .chain-state {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .chain {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-family: Montserrat-Medium, Montserrat;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 19px;
            p {
              margin-left: 8px;
            }
            img {
              width: 24px;
              height: 24px;
            }
            & > img:nth-of-type(2) {
              margin: 0 16px;
              width: 16px;
              height: 16px;
            }
          }
          .state {
            font-size: 12px;
            font-family: Montserrat-Medium, Montserrat;
            font-weight: 500;
            line-height: 15px;
          }
          .state-complete {
            color: #37DA96;
          }
          .state-pending {
            color: #FFD22B;
          }
          .state-failure {
            color: #E32C1E;
          }
        }

        & > p:nth-child(2) {
          font-size: 12px;
          font-family: Montserrat-Regular, Montserrat;
          font-weight: 400;
          color: rgba(255, 255, 255, .6);
          line-height: 15px;
          margin-top: 12px;
        }

        .info-title {
          display: flex;
          justify-content: space-between;
          margin: 12px 0 8px 0;
          font-size: 12px;
          font-family: Montserrat-Regular, Montserrat;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 15px;
          & > p:first-child {
            width: 40px;
          }
          & > p:nth-child(n+2) {
            width: 171px;
          }
          & > p:last-child {
            text-align: right;
          }
        }
        .info-text {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-family: Montserrat-Medium, Montserrat;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 18px;
          & > p:first-child {
            width: 40px;
          }
          & > p:nth-child(n+2) {
            width: 171px;
          }
          & > p:last-child {
            text-align: right;
          }
        }
      }
    }
  }
@media screen and (max-width: 600px) {
  .van-popup {
    width: 92%;
  }
  .cross-chain-record {
    width: 100%;
    .header {
      font-size: 16px;
      p {
        width: 90%;
      }
    }
    .content {
      width: 100%;
      .record-item {
        width: 100%;
      }
    }
  }
}
</style>