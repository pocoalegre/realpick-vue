<template>
  <!-- 底栏区 -->
  <div class="foot">
    <p>Copyright © 2021 版权所有</p>
  </div>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>
.foot {
  background-color: #f7f7f7;
  margin: 20px auto;
  text-align: center;
  width: 100%;
}

.foot p {
  display: inline-block;
  vertical-align: middle;
  font-size: x-small;
  opacity: 0.6;
  user-select: none;
}
</style>