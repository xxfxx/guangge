var header = {}
var userInfo = {
  teacher: {
    userId: ''
  },
  student: {
    userId: ''
  }
}
var openUniCode = ''
var sToken = ''

var common = {
  data: {
    timer: '',
    client: 'pc',
    timeNum: 0,
    controlTimeNum: 10,
    offsetTime: 0
  },
  created () {
    var hd = {type: 'request', keyword: 'headers'}
    if (window.opener) {
      window.opener.postMessage(JSON.stringify(hd), '*')
    }
    window.addEventListener('message', this.onMessage)
    // this.initialization()
    var nav = window.navigator.userAgent
    if (nav.indexOf('Windows NT') < 0) {
      this.client = 'App'
    }
  },
  mounted () {
    if (this.client && this.client === 'pc') return
    var that = this
    this.timer = setInterval(function(){
       that.getData()
    }, 500)
  },
  methods: {
    request (data, type, url, callback, methods, activityType) {
      var that = this
      // if (type == 0) {
      //   data.userId = userInfo.student ? userInfo.student.userId : ''
      // } else if (type == 1) {
      //   if (userInfo.teacher) {
      //     data.teacherId = userInfo.teacher.userId
      //   }
      // }
      if (activityType && activityType === 2) {
        $.ajax({
          contentType: 'application/json',
          data: data,
          dataType: "json",
          type: methods ? methods : "POST",
          timeout: 15000,
          headers: {
            'token': sToken,
            'uuid': header.uuid,
            'x-hf-learn-session-id': header['x-hf-learn-session-id']
          },
          url: SERVICE_APP_DOMAIN + url,
          success: function (data) {
            if (callback) {
              callback(0, data.data, data.code)
              console.log(data)
            }
            if (data.code !== 200) {
              that.showErrorMsg(data.errorMessage || data.message)
            }
            if ([301, 302, 303, 304, 305, 306].indexOf(data.code) >= 0 && activityType === 2) {
              that.request({cached: 0}, 2, '/study/common/Token/getStudentToken', this.refreshToken, 'GET')
            }
          },
          error: function (err) {
            var errorData
            if (err.response) {
              errorData = JSON.parse(err.response)
            } else {
              errorData = {
                message: '网络错误，请重试！'
              }
            }
            if (errorData.message) {
              if (typeof that.toastShow === 'function') { 
                that.toastShow(errorData.message)
              } else {
                that.showErrorMsg(errorData.message)
              }
            }
            if (callback) {
              callback(1, errorData.message)
            }
          }
        })
      } else {
        $.ajax({
          data: data,
          dataType: "json",
          type: methods ? methods : "POST",
          timeout: 15000,
          headers: {
            'uuid': header.uuid,
            'x-hf-learn-session-id': header['x-hf-learn-session-id']
          },
          url: XUE_DOMAIN + url,
          success: function (data) {
            if (data.code !== 200) {
              if (typeof that.toastShow === 'function') { 
                // that.toastFlagCont = data.message
                that.toastShow(data.message)
              } else {
                that.showErrorMsg(data.errorMessage || data.message)
              }
            }
            if (callback) {
              callback(0, data.data, data.code)
            }
          },
          error: function (err) {
            var errorData
            if (err.response) {
              errorData = JSON.parse(err.response)
            } else {
              errorData = {
                message: '网络错误，请重试！'
              }
            }
            if (errorData.message) {
              if (typeof that.toastShow === 'function') { 
                that.toastShow(errorData.message)
              } else {
                that.showErrorMsg(errorData.message)
              }
            }
            if (callback) {
              callback(1, errorData.message)
            }
          }
        })
      }
    },
    onMessage (dt, ty) {
      if (ty === 'app') {
        dt = JSON.parse(dt)
        if (dt.all.headers) {
          header = dt.all.headers
          userInfo.student.userId = dt.all.user.userId
          userInfo.teacher.userId = dt.all.user.teacherId || ''
          openUniCode = dt.all.openUniCode
        }
      } else {
        var data = JSON.parse(dt.data)
        if (data.type && data.type === 'response') {
          header = data.header
          userInfo.teacher.userId = data.teacherId
          openUniCode = data.openUniCode
        }
        if (data.type === 'weakup') {
          if (nw) {
            nw.Window.get().focus()
          }
          return
        }
      }
      this.request({}, 2, '/study/common/SystemController/getSystemDate', this.systemTime)
      this.initialization()
    },
    setStorage (type, arrList) {
      if (type === 'set') {
        if (Array.isArray(arrList)) {
          for (var i = 0; i <= arrList.length - 1; i++) {
            window.localStorage.setItem(arrList[i].key, arrList[i].value)
          }
        }
      } else {
        if (typeof arrList == 'string') {
          return window.localStorage.getItem(arrList)
        }
      }
    },
    getData () {
      var head = {type: 'request', keyword: 'all'}
      this.timeNum += 1
      if (header.uuid) {
        clearInterval(this.timer)
        this.timeNum = 0
      }
      if (this.timeNum > this.controlTimeNum) {
        clearInterval(this.timer)
      }
      if (WebViewBridge) {
        WebViewBridge.send(JSON.stringify(head));
      }
    },
    sendMessage (dt) {
      if (WebViewBridge) {
        WebViewBridge.send(JSON.stringify(dt));
      }
    },
    refreshToken (status, data) {
      if (!status) {
        console.log(data)
        if (data.token) {
          sToken = data.token
        } else {
          console.log('没有获取到token')
        }
      }
    },
    showErrorMsg (msg) {
      var dom = document.createElement('div')
      dom.className = 'error-msg'
      dom.innerText = msg
      document.body.appendChild(dom)
      setTimeout(function(){
        document.body.removeChild(dom)
      }, 3000)
    },
    systemTime (status, data) {
      if (!status) {
        var sysTime = data.date
        var curDate = new Date().getTime()
        this.offsetTime = sysTime - curDate
        console.log(this.offsetTime)
      }
    }
  }
}

