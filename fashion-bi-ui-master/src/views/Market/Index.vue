<template>
  <div>
    <div class="tool">
      <div class="top-pane pane-wrap">
        <zy-pane title="行业数据查询" class="disabled" sub-title="INDUSTRY" ><img src="../../assets/INDUSTRY.png" width="80"></zy-pane>
        <zy-pane title="竞品数据查询" class="disabled" sub-title="COMPETITIVE PRODUCT" ><img src="../../assets/COMPETITIVE PRODUCT.png" width="80"></zy-pane>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped >
.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  .pane-wrap {
    display: flex;
    align-items: center;
    position: fixed;
    transform: translateY(-50%);
    top: 50%;
    .pane {
      margin-right: 20px;
    }
  }
}
</style>
