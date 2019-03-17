var jigsaw = new Vue({
	el: '#app',
	mixins: [pieces, common, alerts, buryingPoint],
	data: {
		isloaded: false,
		taskName: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
		isShowTasks: true,
		isHighLight: false,
		toastFlag: false,
		taskList: [],
		stageTwo: true,
		stageThree: true,
		currentStage: 1,
		blockNum: 0,
		goldNum: 0,
		currentExchangeTask: 0,
		generalUniPiecesList: [],
		currentGeneralId: '',
		isOpenGeneralPiece: 0,  // 是否开启万能拼块
		isShowPiecesList: false,
		usePieceNum: 0,   // 可用万能拼块数
		hasNum: 0,
		isFinishPieces: false,
		loading: false,
		loaderError: false,
		shareData: {},
		toastFlagCont: '求助成功',
		controlModelOpen: false
	},
	created () {
		window.history.forward(1)
	},
	mounted () {
		this.isloaded = true
	},
	watch: {
		// isShowPiecesList (newVal, oldVal) {
		// 	if (newVal) {
		//         document.addEventListener('touchstart', this.eventCollect, false)
		//     } else {
		//         document.removeEventListener('touchstart', this.eventCollect, false)
		//         document.removeEventListener('touchmove', this.moveEventCollect, {passive: false})
		//     }
		// }
	},
	methods: {
		initialization () {
			this.request({}, 0, '/study/blockActivity/StudentActivity/getBlockList', this.initPieces)
			this.request({pageSize: 1}, 0, '/study/blockActivity/StudentActivity/getTaskList', this.taskFun)
			this.request({}, 0, '/study/blockActivity/StudentActivity/getTaskReward', this.getRewards)
			this.request({}, 0, '/study/blockActivity/StudentActivity/getGeneralBlockList', this.generalPiecesList)
		},
		useUniversalPieces () {
			// this.isHighLight = true
			if (this.isOpenGeneralPiece === 1) {
				this.isShowPiecesList = true
			}
			
		},
		selectPiece (it) {
			if (this.usePieceNum > 0 && !this.finishTask && it.taskStatus === 1 && it.status === 0) {
				this.currentExchangeTask = it.taskId
				var idx = Math.ceil(it.taskId / 3)
				this.request({pageSize: idx}, 0, '/study/blockActivity/StudentActivity/getTaskList', this.filterCurTaskIsFinish)
			}
			if (this.usePieceNum === 0 && it.status === 0) {
				document.documentElement.scrollTop = 400
				document.body.scrollTop = 400
			}
		},
		filterCurTaskIsFinish (status, data) {
			if (!status) {
				var list = data.list
				var status = false
				for(var i = 0; i <= list.length - 1; i++) {
					if (this.currentExchangeTask === list[i].taskId && list[i].status === 1) {
						status = true
					}
				}
				if (status) {
					this.showMask('disableUserPic')
				} else {
					this.showMask('isUserPic')
				}
			}
		},
		taskFinish () {
			// var arr = []
			// for (var i = 1; i <= this.taskList.length - 1; i++) {
			// 	if (this.taskList[i].status === 3) {
			// 		arr.push(this.taskList[i])
			// 	}
			// }
			// if (arr.length > 0) {
			// 	var isBingPieces = this.setStorage('get', 'bingAllPiecesByGeneral')
			// 	if (+isBingPieces !== 1) {
			// 		this.showMask('getAllPicWithSkill')
			// 	}
			// } else {
			// 	var isBingPieces2 = this.setStorage('get', 'bingAllPiecesNoGeneral')
			// 	if (+isBingPieces2 !== 1) {
			// 		this.showMask('getAllPic')
			// 	}
			// }
		},
		exchangePieces () {
			this.request({taskId: this.currentExchangeTask}, 0, '/study/blockActivity/StudentActivity/generalComplete', this.selectPieceSuccess)
		},
		selectPieceSuccess (status, data, code) {
			if (status === 0) {
				// url 拼图链接  status 点亮成功 0 不成功 1 成功
				if (code === 200) {
					this.usePieceNum -= 1
					this.blingPieceModel(0, data.url, 2)
					this.request({}, 0, '/study/blockActivity/StudentActivity/getBlockList', this.initPieces)
					this.request({pageSize: this.currentStage}, 0, '/study/blockActivity/StudentActivity/getTaskList', this.taskFun)
					this.request({}, 0, '/study/blockActivity/StudentActivity/getTaskReward', this.getRewards)
				}
			}
		},
		taskFun (status, data, code) {
			if (status === 0) {
				if (code === 1133) {
					console.log('任务未开启')
					this.loading = false
					return
				}
				this.loading = false
				if (this.currentStage === 2) {
					this.stageTwo = false
				} else if (this.currentStage === 3) {
					this.stageThree = false
				}
				if (data.list) {
					this.taskList = data.list
				}
				this.loaderError = false
			} else {
				this.loading = false
				this.loaderError = true
				console.log('任务列表获取失败')
			}
		},
		// 刷新任务列表
		refreshTaskList () {
			this.loading = true
			this.loaderError = false
			this.request({pageSize: this.currentStage}, 0, '/study/blockActivity/StudentActivity/getTaskList', this.taskFun)
		},
		taskDetails (it) {
			if (!it.taskId) return
			this.request({taskId: it.taskId}, 0, '/study/blockActivity/StudentActivity/getTaskdetails', this.showDetails)
			this.sendBuryingPointMsg('main_Christmas-mission', 'main_Christmas')
		},
		showDetails (status, data) {
			if (status === 0) {
				var content = data.taskContent
				this.showMask('taskDetail', content)
			}
		},
		// 阶段tab切换
		changeStage (index) {
			this.taskList = []
			this.currentStage = index
			if ((index === 2 && this.stageTwo) || (index === 3 && this.stageThree)) return
			this.loading = true
			this.request({pageSize: index}, 0, '/study/blockActivity/StudentActivity/getTaskList', this.taskFun)
		},
		// 获取万能拼块和海贝数
		getRewards (status, data) {
			if (status === 0) {
				this.blockNum = data.blockNum
				this.goldNum = data.goldNum
			}
		},
		// 万能拼块获取列表
		generalPiecesList (status, data) {
			var isShowGuide = this.setStorage('get', 'guideGeneralPieces')
			console.log(isShowGuide, 1111111)
			var isHelp = []
			if (status === 0) {
				if (data.status === 1) {
					this.isOpenGeneralPiece = data.status
					if (data.hadUseNum < 3) {
						this.usePieceNum = (data.hasNum - data.hadUseNum) > 3 - data.hadUseNum ? 3 - data.hadUseNum : (data.hasNum - data.hadUseNum)
					}
					this.hasNum = data.hasNum
					this.generalUniPiecesList = data.list
					if (+isShowGuide !== 1) {
						if (data.hasNum === 0) {
							this.controlModelOpen = true
							this.showMask('getHelp')
						}
					} else {
						if (data.newNum > 0) {
							var ct = data.newNum + '位老师赠送你万能拼块'
							this.showMask('moreTeaSendPic', ct)
						}
					}
				}
			}
		},
		putGeneralBlockList () {
			this.request({}, 0, '/study/blockActivity/StudentActivity/putGeneralBlockList', this.putGeneralBlockCallback)
		},
		putGeneralBlockCallback (status, data) {
			if (!status) {
				console.log('success')
			}
		},
		requestTeacherHelp (dt) {
			this.currentGeneralId = dt.generalId
			this.request({generalId: dt.generalId}, 0, '/study/blockActivity/StudentActivity/submitRequest', this.reqHelpCallback)
		},
		reqHelpCallback (status, data, code) {
			if (status === 0 && code === 200) {
				this.toastShow('求助成功')
				for (var i = 0; i <= this.generalUniPiecesList.length - 1; i++) {
					if (this.generalUniPiecesList[i].generalId === this.currentGeneralId) {
						this.generalUniPiecesList[i].status = 1
					}
				}
			} else {
				this.toastShow('请求帮助失败')
			}
		},
		getGifts () {
			this.isFinishPieces = false
			this.alertBoxFlag = false
			this.controlModelOpen = false
			window.location.href = "./lucky_draw.html"
		},
		shareGifts () {
			this.isFinishPieces = false
			this.alertBoxFlag = false
			this.controlModelOpen = false
			this.jumpToTaskDetails('share', this.shareData)
			this.sendBuryingPointMsg('main_Christmas_chart-share', 'main_Christmas_chart')
		},
		shareGiftData (status, data) {
			if (status === 0) {
				if (data.scale) {
					this.isFinishPieces = true
					this.alertBoxFlag = true
					this.controlModelOpen = true
					this.shareData = data
				}
			}
		},
		blingPieces (it) {
			this.request({taskId: it.taskId}, 0, '/study/blockActivity/StudentActivity/complete', this.refreshDataList)
		},
		refreshDataList (status, data) {
			if (status === 0) {
				if (data.status === 1) {
					this.blingPieceModel(data.rewardGold, data.url, 1)
					this.request({}, 0, '/study/blockActivity/StudentActivity/getBlockList', this.initPieces)
					this.request({pageSize: this.currentStage}, 0, '/study/blockActivity/StudentActivity/getTaskList', this.taskFun)
					this.request({}, 0, '/study/blockActivity/StudentActivity/getTaskReward', this.getRewards)
				}
			}
		},
		blingPieceModel (rewardGold, imgUrl, type) {
			var noblingPiece = 0
			var useGeneralPieces = 0
			var cont = ''
			for (var i = 0; i <= this.plists.length - 1; i++) {
				if (this.plists[i].status === 0) {
					noblingPiece += 1
				}
				if (this.plists[i].status === 2) {
					useGeneralPieces += 1
				}
			}
			if (type === 1) {
				if (noblingPiece > 1) {
					cont = '成功点亮拼块!通过该任务共获得' + rewardGold + '海贝~'
					this.showMask('myTaskGetPic', cont, imgUrl)
				} else if (useGeneralPieces > 0) {
					this.showMask('getAllPicWithSkill')
				} else {
					cont = '所有拼块已全部点亮，并获得' + rewardGold + '海贝，只需拼对拼图，就可领取双旦礼物啦！'
					this.showMask('getAllPic', cont)
				}
			} else {
				if (noblingPiece > 1) {
					var cont = '成功点亮拼块!'
					this.showMask('myTaskGetPic', cont, imgUrl)
				} else {
					this.showMask('getAllPicWithSkill')
				}
			}
		},
		jumpToTaskDetails (ty, data) {
			var tk = ''
			switch (ty) {
				case 1:
					tk = {type: 'jump', keyword: 'uploadTestPaper'}
					break
				case 2:
					tk = {type: 'jump', keyword: 'lesson'}
					break
				case 3:
					tk = {type: 'jump', keyword: 'notebook'}
					break
				case 4:
					tk = {type: 'jump', keyword: 'mall'}
					break
				case 5:
					tk = {type: 'jump', keyword: 'review'}
					break
				case 6:
					tk = {type: 'jump', keyword: 'homework'}
					break
				case 7:
					tk = {type: 'jump', keyword: 'lesson'}
					break
				case 8:
					tk = {type: 'jump', keyword: 'homeworkUnfinsh'}
					break
				case 9:
					tk = {type: 'jump', keyword: 'lesson'}
					break
				case 'share':
					tk = {type: 'share', keyword: 'ChristmasActivities2018', dataSource: data}
					break
				default:
					break
			}
			console.log(tk)
			this.sendMessage(tk)
		},
		toastShow(msg){
			var that = this
			this.toastFlagCont = msg
			this.toastFlag = true
			setTimeout(function(){
				this.toastFlagCont = ''
                that.toastFlag = false;
			},1000)
		},
		closeModel () {
			if (!this.controlModelOpen) {
				this.alertBoxFlag = false
			}
		}
	}
})
