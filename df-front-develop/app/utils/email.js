const nodemailer = require('nodemailer')
// 统计错误信息
function sendErrorEmail(params, ctx) {
  console.log('lalalalala', params.message, params.stack, ctx)
  let tmp = ''
  if (!params.source) {
    params.source = 'node'
    params['错误内容'] = params.message
    params['错误信息'] = params.stack
    params['请求链接'] = ctx.request.url
  }
  Object.keys(params).forEach((key) => {
    tmp += `<div><b>${key}:</b><span>${params[key]}</span></div>`
  })
  nodemailer.createTestAccount(() => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.exmail.qq.com',
      port: 465,
      auth: {
        user: 'try@zhiyitech.cn',
        pass: '19910505ylYL'
      }
    })  
    let mailOptions = {
      from: '"错误信息" <try@zhiyitech.cn>', 
      to: 'abu@zhiyitech.cn,anan@zhiyitech.cn,try@zhiyitech.cn', 
      subject: `来自${params.source}的错误信息信息`, 
      text: 'hi abu!!! 错误来了', 
      html: tmp 
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      return null
    })
  })
}
module.exports = sendErrorEmail
