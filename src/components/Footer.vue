<template>
  <div class="footer">
    <div class="apply-token">
      <img src="@/assets/img/icon-apply-token.svg" alt="">
      <a href="https://forms.gle/aPFyNsJdQbcYBXs4A" target="_blank">{{ $t('footer.listingToken') }}</a>
    </div>
    <div class="icon-box">
      <img
          v-for="(icon, i) in footerIcons"
          @click="openUrl(icon.url)"
          :key="'icon'+i" :src="icon.icon" alt="">
    </div>
    <div class="website-description">
      <p>© 2021 Bitbyte.finance. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      footerIcons: [
        // {
        //   icon: require('@/assets/img/icon-telegram.svg'),
        //   url: 'https://t.me/ZBC_Chain'
        // },
        {
          icon: require('@/assets/img/icon-twitter.svg'),
          url: 'https://twitter.com/Bitbyte_Finance'
        },
        {
          icon: require('@/assets/img/icon-facebook.svg'),
          url: 'https://www.facebook.com/Bitbyte.Finance'
        }
      ],
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    openUrl (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
  .footer {
    width: 100%;
    position: absolute;
    bottom: 20px;
    z-index: 0;
    .apply-token {
      margin: 0 auto;
      width: 180px;
      height: 40px;
      background: rgba(255, 255, 255, .30);
      border-radius: 12px;
      font-size: 16px;
      font-family: Montserrat-Medium, Montserrat;
      font-weight: 500;
      line-height: 19px;
      box-sizing: border-box;
      padding: 0 19px;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        color: #FFFFFF;
        text-decoration-line: underline;
        margin-left: 8px;
      }
    }
    .icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 16px;
      img {
        width: 24px;
        height: 25px;
        cursor: pointer;
        &:nth-child(n+2) {
          margin-left: 48px;
        }
      }
    }
    .website-description {
      width: 100%;
      padding-top: 5px;
      box-sizing: border-box;

      p {
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-family: Montserrat-Light, Montserrat;
        font-weight: 300;
        color: #FFFFFF;
        line-height: 18px;
      }
    }
  }
</style>