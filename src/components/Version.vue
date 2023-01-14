<template>
  <div class="Version">
    <p>Version:</p>
    <div class="btn-version" @click="openUrl('https://bitbyte.finance/#/')">
      <p>V2</p>
    </div>
    <div class="btn-version current">
      <p>V1(old)</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Version',
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  methods: {
    openUrl (url) {
      window.open(url)
    }
  }
}
</script>

<style lang="less" scoped>
  .Version {
    width: 100%;
    height: 64px;
    background: rgba(255, 255, 255, 0.3);
    // filter: blur(5px);
    font-size: 16px;
    font-family: Montserrat-Bold, Montserrat;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-version {
      width: 120px;
      height: 40px;
      box-shadow: 0px 2px 8px 0px rgba(49, 128, 238, 0.1);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 34px;
      cursor: pointer;
      &:nth-of-type(2) {
        margin-left: 24px;
      }
    }
    .current {
      background: #2B7EFF;
    }
    @media screen and (max-width: 600px){
      .btn-version {
        margin-left: 12px;
      }
    }
  }
</style>