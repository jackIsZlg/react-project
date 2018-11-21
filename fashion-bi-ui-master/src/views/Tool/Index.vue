<template>
  <div>
    <div class="tool">
      <div class="top-pane pane-wrap">
        <zy-pane title="款式搭配推荐" class="disabled" sub-title="STYLE"><img src="../../assets/STYLE.png" width="80"></zy-pane>
        <zy-pane title="颜色搭配工具" class="disabled" sub-title="COLOUR" ><img src="../../assets/COLOUR.png" width="80"></zy-pane>
      </div>
      <div class="bottom-pane pane-wrap">
        <zy-pane title="在线企划白板" class="disabled" sub-title="PLANNING" ><img src="../../assets/PLANNING.png" width="80"></zy-pane>
        <zy-pane title="款式流行指数测试" class="disabled" sub-title="POPULAR"><img src="../../assets/POPULAR.png" width="80"></zy-pane>
        <zy-pane title="相似款式识图" class="disabled" sub-title="IDENTIFICATION"><img src="../../assets/IDENTIFICATION.png" width="80"></zy-pane>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped >
.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  align-items: center;
  .pane-wrap {
    display: flex;
     margin-top: 20px;
    align-items: center;
    .pane {
      margin-right: 20px;
    }
  }
}
</style>
