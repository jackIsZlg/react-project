<template>
  <div>
    <div class="trend">
      <div class="top-pane pane-wrap">
        <zy-pane title="发布会" sub-title="FASHION SHOW" link="/trend/search"><img src="../../assets/FASHION SHOW.png" width="80"></zy-pane>
        <zy-pane title="Instagram" class="disabled"><img src="../../assets/ins.png" width="80"></zy-pane>
      </div>
      <div class="bottom-pane pane-wrap">
        <zy-pane title="订货会" class="disabled" sub-title="TRUNK SHOWS" ><img src="../../assets/COMPETITIVE PRODUCT.png" width="80"></zy-pane>
        <zy-pane title="批发/零售市场" class="disabled" sub-title="MARKET" ><img src="../../assets/MARKET.png" width="80"></zy-pane>
        <zy-pane title="品牌画册" class="disabled" sub-title="LOOK BOOK" ><img src="../../assets/LOOK BOOK.png" width="80"></zy-pane>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {}
  },
  mounted () {},
  components: {},
  methods: {}
}
</script>

<style lang="scss" scoped >
.trend {
  display: flex;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  align-items: center;
  .pane-wrap {
    display: flex;
    align-items: center;
    margin-top: 20px;
    .pane {
      margin-right: 20px;
    }
  }
}
</style>
