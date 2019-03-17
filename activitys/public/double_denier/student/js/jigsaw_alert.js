var alerts = {
  data: {
    alertBoxFlag: false, //是否展示通用弹框
    getSkillFlag: false, //是否展示万能拼图相关弹框
    alertBoxInfo: {
      //我的任务:获得拼图
      myTaskGetPic: {
        boxClass: 'get-pic',
        imgUrl: './img/pic6.png',
        title: '恭喜你!',
        detail: '成功点亮拼块!通过该任务共获得X海贝~',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '知道了',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
        }
      },
      //使用万能-获得全部拼图
      getAllPicWithSkill: {
        boxClass: 'get-pic',
        imgUrl: './img/my-pic.png',
        title: '恭喜你!',
        detail: '所有拼块已全部点亮，只需拼对拼图，就可抽取双旦礼物啦！',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '知道了',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.showMask('guidePieces')
          vm.setStorage('set', [{key: 'bingAllPiecesByGeneral', value: 1}])
        }
      },
      //未使用万能-获得全部拼图
      getAllPic: {
        boxClass: 'get-pic',
        imgUrl: './img/my-pic.png',
        title: '恭喜你!',
        detail: '所有拼块已全部点亮，只需拼对拼图，就可抽取双旦礼物啦！',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '知道了',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.showMask('guidePieces')
          vm.setStorage('set', [{key: 'bingAllPiecesNoGeneral', value: 1}])
        }
      },
      //请求帮助
      getHelp: {
        boxClass: 'get-help',
        imgUrl: './img/emoji_02.png',
        title: '',
        detail: '当前任务太难了您可以向老师请求帮助哦～',
        btnNum: 'one-btn',
        btnBgClass: 'blue-btn',
        btnText: '请求万能拼块',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.showMask('guideGeneralPieces')
        }
      },
      //老师赠送万能拼图
      teaSendPic: {
        boxClass: 'send-pic',
        imgUrl: './img/send-pic.png',
        title: '',
        detail: '海小风老师也来帮忙啦！老师赠送了你1块万能拼块哦～',
        btnNum: 'one-btn',
        btnBgClass: 'blue-btn',
        btnText: '开启万能拼块功能',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.showMask('guidePieces')
        }
      },
      //2位老师赠送万能拼图
      moreTeaSendPic: {
        boxClass: 'send-pic',
        imgUrl: './img/send-pic.png',
        title: '恭喜你！',
        detail: '2位老师赠送你万能拼块',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '知道了',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.putGeneralBlockList()
        }
      },
      //确定使用万能拼图吗
      isUserPic: {
        boxClass: 'is-use-pic',
        imgUrl: './img/send-pic.png',
        title: '确定使用万能拼块吗?',
        detail: '使用万能拼块可直接点亮拼块<br>没有完成任务的海贝奖励哦',
        btnNum: '2',
        btnBgClass: 'blue-btn',
        btnBgClassSec: 'orange-btn',
        btnText: '去做任务',
        btnTextSec: '立即使用',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          // vm.$data.isHighLight = false
        },
        ok: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.exchangePieces()
        }
      },
      //任务已完成不能再使用万能拼图点亮
      disableUserPic: {
        boxClass: 'send-pic',
        imgUrl: './img/send-pic.png',
        title: '',
        detail: '当前任务已完成，可直接点亮<br>您确定使用万能拼块吗？',
        btnNum: '2',
        btnBgClass: 'blue-btn',
        btnBgClassSec: 'orange-btn',
        btnText: '再想想',
        btnTextSec: '继续使用',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          // vm.$data.isHighLight = false
        },
        ok: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.exchangePieces()
        }
      },
      //虚拟奖励
      virtualReward: {
        boxClass: 'virtual-reward',
        imgUrl: './img/reward-virtual.png',
        title: '',
        detail: '  恭喜你获得10个海贝分享战绩可再领取一次礼品哦～',
        btnNum: '2',
        btnBgClass: 'blue-btn',
        btnBgClassSec: 'orange-btn',
        btnText: '查看礼物',
        btnTextSec: '立即分享',
        closeBtnFlag: true,
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          window.location.href = "./my_gift.html"
        },
        ok: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.shareRewards()
          vm.sendBuryingPointMsg('main_Christmas_seashell-share', 'main_Christmas_seashell')
        }
      },
      //实物奖励
      physicalReward: {
        boxClass: 'virtual-reward',
        imgUrl: './img/reward-virtual.png',
        title: '恭喜你!',
        detail: '获得小龙鱼颈枕一个',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '填写收货地址',
        closeBtnFlag: true,
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          window.location.href = './write_address.html?userPrizeId=' + vm.prizeId
        }
      },
      //无奖励弹框提示
      noReward: {
        boxClass: 'game-over',
        imgUrl: './img/no-reward-box.png',
        title: '',
        detail: '活动马上就要结束了<br>请尽快填写地址，否则我们将无法邮寄双旦礼物呢～',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '填写收货地址',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          window.location.href = './write_address.html?userPrizeId=' + vm.prizeRwardId
        }
      },

      //提交成功-再领一次
      getGiftMore: {
        detail: '礼物将会在活动结束后统一发放',
        btnText: '再领一次',
      },
      //提交成功-分享
      shareInfo: {
        detail: '礼物将会在活动结束后统一发放。<br>分享战绩可再领取一次礼品哦～',
        btnText: '立即分享',
      },
      //提交成功-只能查看礼物
      showGiftDetail: {
        detail: '查看礼物详情',
        btnText: '',
      },
      //任务详情
      taskDetail: {
        boxClass: 'task-details',
        imgUrl: '',
        title: '任务说明',
        detail: '',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '知道了',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
        }
      },
      //万能拼块新手引导
      guideGeneralPieces: {
        boxClass: 'guide-general-pieces',
        imgUrl: './img/new-guide.png',
        title: '万能拼图功能',
        detail: '第一步<br>万能拼块可直接点亮拼图拼块<br>每个老师最多给你1个<br>活动期间，你最多可使用3个<br>要珍惜哦~',
        btnNum: 'one-btn',
        btnBgClass: 'default-btn',
        btnText: '下一步',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.showMask('generalPiecesFinc')
        }
      },
      // 万能拼图功能
      generalPiecesFinc: {
        boxClass: 'guide-general-func',
        imgUrl: './img/alert-box1.png',
        title: '万能拼图功能',
        detail: '第二步<br>当有万能拼块时，可直接点击亮色的锁去使用',
        btnNum: 'one-btn',
        btnBgClass: 'default-btn',
        btnText: '我知道了',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
          vm.$data.controlModelOpen = false
          if (vm.$data.generalUniPiecesList.newNum > 0) {
            var cont = vm.$data.generalUniPiecesList.newNum + '位老师赠送你万能拼块'
            vm.showMask('moreTeaSendPic', cont)
          }
          vm.setStorage('set', [{key: 'guideGeneralPieces', value: 1}])
        }
      },
      // 拼拼图引导
      guidePieces: {
        boxClass: 'guide-pieces',
        imgUrl: './img/piece-tip.png',
        title: '',
        detail: '',
        // btnNum: 'one-btn',
        // btnBgClass: 'default-btn',
        // btnText: '我知道了',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
        }
      },
      // 立即分享
      shareSuccess: {
        boxClass: 'no-reward-box',
        imgUrl: './img/no-reward-box.png',
        title: '恭喜你!',
        detail: '可再抽取一次双旦礼物哦~',
        btnNum: 'one-btn',
        btnBgClass: 'orange-btn',
        btnText: '抽取礼物',
        cancel: function (vm) {
          vm.$data.alertBoxFlag = false
        }
      }
    },
    alertInfo: {}, //弹出框的渲染内容
  },
  watch: {
    alertBoxFlag: function (newVal, oldVal) {
      if (newVal) {
        document.addEventListener('touchstart', this.eventCollect, false)
      } else {
        document.removeEventListener('touchstart', this.eventCollect, false)
        document.removeEventListener('touchmove', this.moveEventCollect, {passive: false})
      }
    }
  },
  created () {},
  methods: {
    showMask: function (param, dt, img) {
      if (dt) {
        this.alertBoxInfo[param].detail = dt
      }
      if (img) {
        this.alertBoxInfo[param].imgUrl = img
      }
      this.alertBoxFlag = true
      this.alertInfo = this.alertBoxInfo[param]
    },
    showMaskPipe: function (param, config) {
      if (config && config.detail) {
        this.alertBoxInfo[param].detail = config.detail
      }
      if (config && config.imgUrl) {
        this.alertBoxInfo[param].imgUrl = config.imgUrl
      }
      if (config && config.btnTextSec) {
        this.alertBoxInfo[param].btnTextSec = config.btnTextSec
      }
      if (config && config.btnNum) {
        this.alertBoxInfo[param].btnNum = config.btnNum
      }
      if (config && config.btnTextSec === '再领一次') {
        var self = this
        this.alertBoxInfo[param].ok = function () {
          self.alertBoxFlag = false
        }
      }
      this.alertBoxFlag = true
      this.alertInfo = this.alertBoxInfo[param]
    },
    eventCollect (e) {
      e.stopPropagation()
      document.addEventListener('touchmove', this.moveEventCollect, {passive: false})
    },
    moveEventCollect (e) {
      e.stopPropagation()
      e.preventDefault()
      e.cancelBubble = false
    }
  }
};
