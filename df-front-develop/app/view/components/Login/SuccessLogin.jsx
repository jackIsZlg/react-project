class SuccessLogin extends React.Component {
  componentDidMount() {
    setTimeout(this.props.successLogin, 1200)
  }

  render() {
    let { data } = this.props
    let style = {
      background: `url(${data.avatar}) no-repeat center/cover`
    }
    return (
      <div className="login-panel login-panel-7" style={style}>
        <div className="login-panel-master">
          <div className="avatar">
            <img src={data.avatar} alt='' />
          </div>
          <div className="nickname one-line">{data.nickname}</div>
          欢迎加入
        </div>
      </div>
    )
  }
}

export default SuccessLogin