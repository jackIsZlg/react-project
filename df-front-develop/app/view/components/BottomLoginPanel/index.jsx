
/**
 * 页面底部提示登录查看图片组件
 * @author ABU
 * @param {Object} props 
 * @param {String} props.loginUrl 登录页面URL
 * @param {String} props.registerUrl 注册页面URL
 * @param {Boolean} props.show 是否显示
 */
export default ({ loginUrl, show }) => {
  return (
    <div className={`bottom-login ${show ? 'show' : ''}`} >
      <div style={{
        fontSize: 30,
        marginTop: 29,
        color: '#fff'
      }}
      >
        登录/注册后可查看全部图片
      </div>
      <div style={{ marginTop: 30 }}>
        <span>
          <a className="bottom-login-btn"
            href={loginUrl || '/login'}
          >
            登录/注册
          </a>
          {/* <a href={registerUrl || '/login'}>注册</a> */}
        </span>
      </div>
    </div>)
}