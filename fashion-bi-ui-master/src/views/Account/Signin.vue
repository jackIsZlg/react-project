<template>
  <form>
    <div class="txt-group">
      <zy-alert :show="error.length>0" type="error" >{{ error }}</zy-alert>
      <div class="row">
        <input type="text" placeholder="请输入手机号" @blur="onBlur" v-model="form.mobile" maxLength="11" class="txt txt-block txt-user">
      </div>
      <div class="row">
        <input type="password" placeholder="请输入密码" v-model="form.password" maxlength="16" class="txt txt-block txt-lock">
      </div>
      <div class="row">
        <zy-checkbox v-model="form.autoLogin">下次自动登录</zy-checkbox>
        <div class="txt-right" style="display:none">
          <router-link to="/password_reset">重置密码</router-link>
          <span style="display:inline-block;color:#ddd;margin:0 3px;">|</span>
          <router-link to="/join">注册账号</router-link>
        </div>
      </div>
    </div>
    <div class="row">
      <button type="button" @click="signin" :disabled="form.mobile.length!==11||form.password.length<6" class="btn btn-block">登 录</button>
      <div class="tips">
        可用DeepFashion账号直接登录
      </div>
    </div>
  </form>
</template>
<script>
export default {
  data () {
    return {
      form: {
        autoLogin: !!localStorage.token,
        mobile: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    onBlur () {
      if (/^1\d{10}$/.test(this.mobile)) {
        this.error = '请输入正确的手机号'
      } else {
        this.error = ''
      }
    },
    async signin () {
      try {
        let res = await this.$axios.formdata('/sso-api/login/phone', this.form)
        if (this.form.autoLogin) {
          localStorage.token = res.token
        } else {
          localStorage.removeItem('token')
        }
        sessionStorage.token = res.token
        this.$router.replace('/')
      } catch (error) {
        if (error.code === 'P01') {
          this.error = '请输入正确的手机号'
        } else if (error.code === 'L04') {
          this.error = '密码错误，请重新输入'
        } else if (error.code === 'L06') {
          this.error = '手机号未注册'
        } else {
          this.error = '网络连接失败，请检查网络'
        }
      }
    }
  }
}
</script>
