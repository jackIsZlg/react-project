<template>
  <div class="zy-concat">
    <i class="iconfont icon-mail"/><div class="zy-concat-content">
      &nbsp;联系我们 <a href="mailto:fashionBI@zhiyitech.cn">fashionBI@zhiyitech.cn</a>
    </div>
  </div>
</template>
<style  lang="scss" scoped >
.icon-mail{
  color: #1890ff
}
.zy-concat {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  box-shadow: 0px 2px 4px 0px rgba(86, 86, 86, 0.5);
  border-radius: 20px;
  position: fixed;
  right: 10px;
  bottom: 50px;
  z-index: 2;
  color: #666666;
  font-size: 12px;
  transition: all 400ms;
  overflow: hidden;
  .zy-concat-content {
    white-space:nowrap;
    display: none;
  }
  &:hover {
    width: 235px;
    .zy-concat-content {
      display: inline-block;
    }
  }
}

a {
  color: #666666;
}
</style>
