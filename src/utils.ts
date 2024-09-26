import { callBackMessage, loginData } from "./types"

export const Login = (
  url: any,
  data: loginData,
  callback: (message: callBackMessage) => void
) => {
  const username = data.username + (data.domain || "")

  const challengeCallback = (response) => {
    const token = response.challenge,
      i = info(
        {
          username: username,
          password: data.password,
          ip: data.ip || response.client_ip,
          acid: data.ac_id,
          enc_ver: enc,
        },
        token
      ),
      hmd5 = pwd(data.password, token)

    let chkstr = token + username
    chkstr += token + hmd5
    chkstr += token + data.ac_id
    chkstr += token + (data.ip || response.client_ip)
    chkstr += token + n
    chkstr += token + type
    chkstr += token + i

    const os = getOS()
    const params = {
      action: "login",
      username: username,
      password: "{MD5}" + hmd5,
      ac_id: data.ac_id,
      ip: data.ip || response.client_ip,
      chksum: chksum(chkstr),
      info: i,
      n: n,
      type: type,
      os: os.device,
      name: os.platform,
      double_stack: data.double_stack,
    }

    const authCallback = (resp) => {
      if (resp.error == "ok") {
        return callback({
          error: "ok",
          message: "",
        })
      }
      //Process Error Message
      const message = error(resp.ecode, resp.error, resp.error_msg)
      if (typeof resp.ploy_msg != "undefined") {
        message = resp.ploy_msg
      }
      return callback({
        error: "fail",
        message: message,
      })
    }
    srunPortal(url, params, authCallback)
  }
  const params = {
    username: username,
    ip: data.ip || "",
  }
  getChallenge(url, params, challengeCallback)
}
