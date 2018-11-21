class ResetPasswordSuccess extends React.Component {
  render() {
    let { changeStep } = this.props
    return (
      <div className='login-panel'>
        <div className='reset-success'>
          <img src="https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1533031759590_540.png" alt="" />
          <div className='reset-success-tip'>
            密码重置成功<br />现在你可以用新密码登录
          </div>
        </div>
        <div className='login-footer'>
          <button className='btn-login black reset' onClick={() => changeStep(1)}>立即登录</button>
        </div>
      </div>
    )
  }
}

export default ResetPasswordSuccess