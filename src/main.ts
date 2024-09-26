import { callBackMessage } from "./types"
import { Login } from "./utils"

const main = (): void => {
  const username: String = ""
  const password: String = ""
  const acid = "1"
  const ip = $("#user_ip").val()

  const params = {
    username: $.trim(username).toLowerCase(),
    domain: "",
    password: password,
    ac_id: acid,
    ip: ip,
    double_stack: 0,
  }
  if ($("#domain").val() != undefined) {
    params.domain = $("#domain").val()
  }
  const ua = window.navigator.userAgent
  const md = new MobileDetect(ua)
  const mobile = md.mobile()
  if (
    (!mobile && portal.DoubleStackPC) ||
    (mobile && portal.DoubleStackMobile)
  ) {
    params.double_stack = 1
  }

  Login(host, params, (data: callBackMessage): void => {
    if (data.error == "ok") {
      if (
        (!mobile && portal.DoubleStackPC) ||
        (mobile && portal.DoubleStackMobile)
      ) {
        const doubleHost = location.protocol + "//"
        if (isIPV6) {
          doubleHost += portal.AuthIP || location.hostname
        } else {
          if (portal.AuthIP6 != "") {
            portal.AuthIP6 = "[" + portal.AuthIP6 + "]"
          }
          params.ac_id = "3"
          doubleHost += portal.AuthIP6 || location.hostname
        }
        params.double_stack = 0
        params.ip = ""
        $.Login(doubleHost, params, function (data) {
          //Redirect Success Page
          location.href =
            "./srun_portal_success" +
            location.search +
            "&srun_domain=" +
            params.domain
        })
      } else {
        location.href =
          "./srun_portal_success" +
          location.search +
          "&srun_domain=" +
          params.domain
      }
    } else {
      //先下线在上线
      if (data.message == "IpAlreadyOnlineError") {
        IpAlreadyRetryAuth(params)
      } else {
        if (data.message == "NoResponseDataError") {
          showLog(username)
          return
        }
        if (data.message == "PasswordIsNotSafe") {
          const customMessage =
            '<i class="layui-layer-ico layui-layer-ico2"></i>\u60A8\u7684\u5BC6\u7801\u662F\u5F31\u5BC6\u7801\uFF0C\u8BF7\u4FEE\u6539\u540E\u518D\u8FDB\u884C\u8BA4\u8BC1<a href="https://uc.cup.edu.cn/#/reset/index" target="_blank" style="display: block;">\u70B9\u51FB\u4FEE\u6539</a>'
          showErrorMessage("您的密码是弱密码，请修改后再进行认证点击修改")
          $(".layui-layer-dialog .layui-layer-content").html(customMessage)
          return
        }
        //Show Error Message
        showErrorMessage(data.message)
      }
    }
  })
}
