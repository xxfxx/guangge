var luckyDraw = new Vue({
  el: '#luckyDraw',
  mixins: [common, alerts, buryingPoint],
  data () {
    return {
      drawToggle: false,
      timer: null,
      loopTime: 200,
      rw: 1,
      prizes: [],                       // 全部奖品列表
      remainingLotteryTimes: 0,         // 剩余抽奖次数
      prizeId: null,                    // 当前抽中奖品Id
      sortNo: null,                     // 当前抽中奖品对应的排序号
      ownPrizes: [],                    // 获得的奖品
      previewImg: false,                // 预览我的拼块
      prizeRwardId: ''
    }
  },
  computed: {
    showTwoPrizes () {
      var prizes = this.ownPrizes.sort(function (a, b) {
        return a.createTime - b.createTime
      })
      if (prizes.length > 2) {
        return prizes.slice(-2)
      }
      return prizes
    }
  },
  methods: {
    initialization () {
      this.request({ cached: 0 }, 2, '/study/common/Token/getStudentToken', this.resultAuthentication, 'GET')
    },
    resultAuthentication (status, data) {
      if (status === 0) {
        if (data.token) {
          sToken = data.token
          this.request({}, 2, '/activities/2/prizes', this.setPrizes, 'GET', 2) // 获取奖品列表
          this.request({}, 2, '/activities/2/user-prizes', this.getPrizesRecord, 'GET', 2) // 获取中奖纪录
          this.request({}, 2, '/activities/2/lottery-times', this.getLotteryTimes, 'GET', 2) // 获取剩余抽奖次数
        } else {
          console.log('没有获取到token')
        }
      }
    },
    setPrizes (code, data) {
      if (!code && data.items) {
        this.prizes = data.items.sort(function (a, b) {
          return a.sortNo - b.sortNo
        })
      }
    },
    getPrizesRecord (code, data) {
      if (!code && data.items) {
        var self = this
        data.items.forEach(function (element) {
          self.ownPrizes.push(element.prizeImageUrl)
        })
        this.noticeWriteAddress(data.items)
      }
    },
    getLotteryTimes (code, data) {
      if (!code) {
        this.remainingLotteryTimes = data.remaining
      }
    },
    playGame () {
      if (!navigator.onLine) {
        return this.showErrorMsg('网络异常~')
      }
      if (this.remainingLotteryTimes <= 0 || this.drawToggle) return
      this.drawToggle = true
      this.loopRewards()
      this.request({}, 2, '/activities/2/user-prizes', this.getDrawResult, 'POST', 2) // 抽奖
    },
    getDrawResult (status, data, code) {
      var self = this
      clearInterval(self.timer)
      if (status === 1 || code !== 200) {  //code = 1, 是 error
        var rd = document.getElementById('rd' + (self.rw - 1))     // 这里的rw是下一个将要添加跳动的方格，所以 -1
        if (rd) { rd.style.background = "#FFF5E1" }                 // 抽奖接口报错，则马上停止动画，并恢复初始状态
        console.log('接口出错了')
        self.drawToggle = false
        // self.showErrorMsg(errorData.message)
        return
      }
      self.prizeId = data.id
      if (data.prizeSortNo) {
        self.sortNo = data.prizeSortNo
      } else {
        self.getCurrentSortNo(data.prizeId)
      }
      self.loopTime = 100
      self.loopRewards()
      self.slowLoop(data)
    },
    getCurrentSortNo (id) {
      for (var i = 0; i < this.prizes.length; i++) {
        if (this.prizes[i].id === id) {
          this.sortNo = this.prizes[i].sortNo
          break;
        }
      }
    },
    loopRewards (num, data) {
      var afterRound = false
      var self = this
      this.timer = setInterval(function () {
        if (num !== 'undefined' && self.rw === num) {
          if (afterRound) {
            var times = data ? data.lotteryTimes.remaining : self.remainingLotteryTimes
            clearInterval(self.timer)
            self.remainingLotteryTimes = times          // 动画停止后，改变剩余次数
            if (typeof data.prizeImageUrl === 'undefined') {
              self.ownPrizes.push('./img/reward-virtual.png')
            } else {
              self.ownPrizes.push(data.prizeImageUrl)     // 动画停止后，改变中奖纪录图片
            }
            var config = {}
            if (data.prizeType === 2) {
              var detail
              if (data.lotteryTimes.gained === 1) {
                detail = '恭喜你获得' + data.prizeIntegral + '个海贝，分享战绩可再领取一次礼品哦～'
              } else {
                detail = '恭喜你获得' + data.prizeIntegral + '个海贝～'
                if (data.lotteryTimes.consumed === 1) {
                  var btnTextSec = '再领一次'
                } else {
                  var btnNum = 1
                }
              }
              config = {
                detail: detail,
                btnTextSec: btnTextSec,
                btnNum: btnNum
              }
              self.showMaskPipe('virtualReward', config)
            } else {
              config = {
                detail: '获得' + data.prizeName + '一个',
                imgUrl: data.prizeImageUrl
              }
              self.showMaskPipe('physicalReward', config)
            }
            self.drawToggle = false                     // 打开抽奖开关
          }
          afterRound = true
        }

        var rd = document.getElementById('rd' + self.rw)
        rd.style.background = "#FFE8C7"
        if (self.rw !== 1) {
          var pre = document.getElementById('rd' + (self.rw - 1))
          pre.style.background = "#FFF5E1"
        } else {
          var pre = document.getElementById('rd' + 8)
          pre.style.background = "#FFF5E1"
        }
        self.rw++
        if (self.rw > 8) {
          self.rw = 1
        }
      }, self.loopTime)
    },
    slowLoop (data) {
      var self = this
      setTimeout(function () {
        clearInterval(self.timer)
        self.loopTime = 200
        self.loopRewards(+self.sortNo, data)
      }, 2000)
    },
    shareRewards () {
      this.request({}, 2, '/study/blockActivity/StudentActivity/share', this.shareGiftData)
      this.sendBuryingPointMsg('main_Christmas-share', 'main_Christmas')
    },
    shareGiftData (status, data) {
      if (status === 0) {
        if (data.scale) {
          var share = { type: 'share', keyword: 'ChristmasActivities2018', dataSource: data }
          this.sendMessage(share)
        }
      }
    },
    goMyGift () {
      window.location.href = "./my_gift.html"
    },
    openPreviewImg () {
      this.previewImg = true
      document.body.style.overflow = 'hidden'
    },
    closePreviewImg () {
      this.previewImg = false
      document.body.style.overflow = 'auto'
    },
    noticeWriteAddress (items) {
      var time = new Date('2018/12/15 00:00:00').getTime()
      var dt = new Date().getTime()
      var prizeRwardId = ''
      for (var i = 0; i <= items.length - 1; i++) {
        if ((dt + this.offsetTime) >= time && items[i].prizeType === 1 && typeof items[i].receiver === 'undefined') {
          prizeRwardId = items[i].id
        }
      }
      if (prizeRwardId) {
        this.prizeRwardId = prizeRwardId
        this.showMask('noReward')
      }
    }
  }
})
