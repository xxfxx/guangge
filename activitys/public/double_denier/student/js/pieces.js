var pieces = {
	data: {
		ulist: [],
		domW: 0,
		domH: 0,
		latticeNums: 3,
	    curT: 0,    // mousedown事件top值
		curL: 0,    // mousedown事件left值
		ctop: 0,    // 当前拼块的top值
		cleft: 0,   // 当前拼块的left值
		changeY: 0,   // move y值
		changeX: 0,   // move x值
		cliX: 0,      // mousemove事件clientX值
		cliY: 0,      // mousemove事件clientY值
		el: '',    // 当前头东的拼块
		isMove: false,
		piecesList: {
			'1': {pieceImg: 'piece5', realIndex: 5},
			'2': {pieceImg: 'piece9', realIndex: 9},
			'3': {pieceImg: 'piece1', realIndex: 1},
			'4': {pieceImg: 'piece2', realIndex: 2},
			'5': {pieceImg: 'piece8', realIndex: 8},
			'6': {pieceImg: 'piece4', realIndex: 4},
			'7': {pieceImg: 'piece3', realIndex: 3},
			'8': {pieceImg: 'piece6', realIndex: 6},
			'9': {pieceImg: 'piece7', realIndex: 7},
		},
		plists: [],
		finishTask: false
	},
	created () {
		// this.setPieces()
	},
	mounted () {
	},
	methods: {
		initPieces (status, data) {
			if (status === 0) {
				if (data.list && data.list.length === 9) {
					var noShow = []
					var stage2 = []
					var stage3 = []
					
					if (this.plists.length === 0) {
						this.setPieces()
					}

					this.plists = data.list
					// 判断各阶段任务是否开启
					for(var i = 0; i <= data.list.length - 1; i++) {
						if ([4,5,6].indexOf(i + 1) >= 0) {
							if (data.list[i].taskStatus === 0) {
								stage2.push(i)
							}
						}
						if ([7,8,9].indexOf(i + 1) >= 0) {
							if (data.list[i].taskStatus === 0) {
								stage3.push(i)
							}
						}
						if (data.list[i].status === 0) {
							noShow.push(data.list[i])
						}
					}
					if (stage2.length === 0) {
						this.stageTwo = false
					}
					if (stage3.length === 0) {
						this.stageThree = false
					}
					if (noShow.length === 0) {
						this.isShowTasks = false
						this.finishTask = true
						this.taskFinish()
					}
				}
			}
		},
		setPieces () {
			var that = this
			var dom = document.getElementsByClassName('jigsaw_modal')[0]
			this.domW = dom.offsetWidth - 0.5
			this.domH = dom.offsetHeight - 0.5
			var pieceW = this.domW / this.latticeNums - 2
			var pieceH = this.domH / this.latticeNums - 2
			for (var i = 1; i <= 9; i++) {
				console.log(i)
				var cDom = document.createElement('li')
				var imgDom = document.createElement('img')
				cDom.className = 'jigsaw_piece'
				cDom.style.width = pieceW + 'px'
				cDom.style.height = pieceH + 'px'
				cDom.setAttribute('data-label', i)
				var w = pieceW * (i - (+Math.ceil(i/this.latticeNums) * this.latticeNums - this.latticeNums) - 1)
				var h = pieceH * (Math.ceil(i/this.latticeNums) - 1)
				// cDom.style.background = "url('./img/pieces/" + this.piecesList[i].pieceImg + ".png') no-repeat";
				// cDom.style.backgroundSize = "100% 100%"
				imgDom.src = "./img/pieces/" + this.piecesList[i].pieceImg + ".png"
				imgDom.style.width = pieceW - 2 + 'px'
				imgDom.style.height = pieceH - 2 + 'px'
				cDom.style.top = h + 'px'
				cDom.style.left = w + 'px'
				cDom.appendChild(imgDom)
				this.ulist.push(cDom.outerHTML)
			}
			dom.innerHTML = this.ulist.join('')
		    document.addEventListener('gesturestart', function(event) {
		      event.preventDefault();
		    })
		    that.listenPieces()
		},
		randomPieces () {
			var temp = '', top, left
			var len = this.ulist.length - 1
			for (var i = len - 1; i >= 0; i--) {
				var dm = document.getElementsByClassName('jigsaw_piece')
				var rmd = parseInt(Math.random() * len)
				top = dm[rmd].style.top
				left = dm[rmd].style.left
				label = dm[rmd].getAttribute('data-label')
				dm[rmd].style.top = dm[i].style.top
				dm[rmd].style.left = dm[i].style.left
				dm[rmd].setAttribute('data-label', dm[i].getAttribute('data-label'))
				dm[i].style.top = top
				dm[i].style.left = left
				dm[i].setAttribute('data-label', label)
			}
		},
		listenPieces () {
			var w = document.getElementsByClassName('jigsaw_modal')[0]
			w.addEventListener('mousedown', this.mousedownPieces)
			w.addEventListener('touchstart', this.mousedownPieces)
		},
		mousedownPieces (e) {
			e.stopPropagation()
			if (this.isMove) {
	        	this.trunToStartPoint()
	        }
	        if (e.touches && e.touches.length > 1) {
	     		return
	        }
	      	this.el = e.target.parentNode
			if (this.el.className !== 'jigsaw_piece') return
			var scrollT = document.body.scrollTop || document.documentElement.scrollTop
			this.curT = e.clientY || e.touches[0].clientY
			this.curL = e.clientX || e.touches[0].clientX
			if (scrollT) {
				this.curT += scrollT
			}
			this.ctop = +this.el.style.top.replace(/px/, '')
			this.cleft = +this.el.style.left.replace(/px/, '')
			document.addEventListener('mousemove', this.movePieces, false)
			document.addEventListener('mouseup', this.upPieces)
			document.addEventListener('touchmove', this.movePieces, {passive: false})
			document.addEventListener('touchend', this.upPieces)
		},
		movePieces (e) {
			if (e.touches && e.touches.length > 1) {
				this.cancelMouseEvent()
				return
			}
			this.isMove = true
			e.cancelBubble = false
			this.cliX = e.clientX || e.touches[0].clientX
			this.cliY = e.clientY || e.touches[0].clientY
			var scrollT = document.body.scrollTop || document.documentElement.scrollTop
			if (scrollT) {
				this.cliY += scrollT
			}
			e.stopPropagation()
      		e.preventDefault()
			this.changeY = this.ctop - (this.curT - this.cliY)
			this.changeX = this.cleft - (this.curL - this.cliX)
			this.el.style.top = this.ctop - (this.curT - this.cliY) + 'px'
			this.el.style.left = this.cleft - (this.curL - this.cliX) + 'px'
			this.el.style.opacity = .5
			this.el.style.zIndex = 10
			document.addEventListener('touchend', this.upPieces)
			document.addEventListener('mouseup', this.upPieces)
		},
		upPieces () {
			this.cancelMouseEvent()
			if (!this.isMove) {
				return
			}
			this.isMove = false
			var domAll = document.getElementsByClassName('jigsaw_piece')
			var parent = domAll[0].parentNode
			var top = 0
			var left = 0
			parentNode(parent)
			function parentNode (parent) {
				top += parent.offsetTop
				left += parent.offsetLeft
				if (parent.parentNode && typeof parent.parentNode.offsetTop !== 'undefined') {
					parentNode(parent.parentNode)
				}
			}
	
			if (this.el) {
				this.el.style.opacity = 1
				this.el.style.zIndex = ''
			}
			if (+this.cliY >= this.domH + top || +this.cliX >= this.domW + left || +this.cliX <= left || +this.cliY <= top) {
				this.el.style.top = this.ctop + 'px'
				this.el.style.left = this.cleft + 'px'
				return
			}
			this.getAllPiecesPosition(domAll, top, left)
		},
		cancelMouseEvent () {
			document.removeEventListener('mousemove', this.movePieces, false)
			document.removeEventListener('mouseup', this.upPieces)
			document.removeEventListener('touchend', this.upPieces)
			document.removeEventListener('touchmove', this.movePieces, {passive: false})
		},
		trunToStartPoint () {
			this.el.style.top = this.ctop + 'px'
			this.el.style.left = this.cleft + 'px'
			this.el.style.opacity = 1
		},
		getAllPiecesPosition (domAll, top, left) {
			var type = false
			if (domAll && domAll.length > 0) {
				for(var j = 0; j < domAll.length; j++) {
					var t = +domAll[j].style.top.replace(/px/, '')
					var l = +domAll[j].style.left.replace(/px/, '')
					var label = domAll[j].dataset.label
					if (+this.cliY >= t + top && +this.cliY <= t + (this.domH / this.latticeNums - (this.latticeNums - 1)) + top && +this.cliX >= l + left && +this.cliX <= l + (this.domW / this.latticeNums - (this.latticeNums - 1)) + left && label !== this.el.dataset.label) {
						type = true
						domAll[j].style.top = this.ctop + 'px'
						domAll[j].style.left = this.cleft + 'px'
						domAll[j].dataset.label = this.el.dataset.label
						this.el.style.top = t + 'px'
						this.el.style.left = l + 'px'
						this.el.setAttribute('data-label', label)
						console.log(label)
						// console.log(t, l, ctop, cleft, domAll[j].dataset.label, el.dataset.label)
					}
				}
				if (!type) {
					this.trunToStartPoint()
				}
				this.checkPieces()	
			}
		},
		checkPieces () {
			var checkList = document.getElementsByClassName('jigsaw_piece')
			var arr = []
			var str = []
			var order = ''
			if (checkList && checkList.length > 0) {
				for(var j = 1; j <= checkList.length; j++) {
					var lb = +checkList[j-1].dataset.label
					arr.push(lb)
				}
				console.log(arr)
				var list = Object.keys(this.piecesList)
				for(var i = 0; i <= list.length - 1; i++) {
					str.push(this.piecesList[i + 1].realIndex)
				}
				if (arr.join('') == str.join('')) {
					var element = document.getElementsByClassName('jigsaw_modal')[0]
					element.removeEventListener('mousedown', this.mousedownPieces)
          			element.removeEventListener('touchstart', this.mousedownPieces)
					// setTimeout(function () {
					// 	console.log('拼图完成')
					// }, 1000)
					for(var i = 1; i <= list.length; i++) {
						for(it in this.piecesList) {
							if (this.piecesList[it].realIndex === i) {
								order += it
							}
						}
					}
					// console.log(order)
					this.request({blockOrder: order}, 0, '/study/blockActivity/StudentActivity/submitWithFinishLog', this.finishPieces)
				}
			}
		},
		finishPieces (status, data) {
			if (!status) {
				console.log('拼图完成')
				// this.alertBoxFlag = true
				this.request({cached: 0}, 2, '/study/common/Token/getStudentToken', this.resultAuthentication, 'GET')
				this.request({}, 0, '/study/blockActivity/StudentActivity/share', this.shareGiftData)
			}
		},
		resultAuthentication (status, data) {
			if (!status) {
				if (data.token) {
          			sToken = data.token
          			this.request(JSON.stringify({activityType: 2, type: 1}), 2, '/activities/2/lottery-times', this.getLotteryTimes, 'POST', 2)
          		}
			}
		},
		getLotteryTimes () {}
	}
}
