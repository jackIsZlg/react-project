import base from '../../common/baseModule'

// ?forwardStr=Lw==
let _forward = base.queryString('forwardStr')

base.login(base.base64decode(_forward), true)
