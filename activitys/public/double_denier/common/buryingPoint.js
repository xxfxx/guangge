var buryingPoint = {
	data: {
		// 双旦活动-查看任务详情
		buryingPointData: {
			action: 'click',
			fromPageName: 'main_Christmas',
			toPageName: '',
			toPageUrl: '',
			event: 'tab_label'
		}
	},
	methods: {
		sendBuryingPointMsg (actionId, dt, type) {
			if (openUniCode) {
				this.buryingPointData.openUniCode = openUniCode
				this.buryingPointData.actionId = actionId
				if (type && type === 1) {
					this.buryingPointData.fromPageName = dt
				} else {
					this.buryingPointData.fromPageName = dt + '?userId=' + userInfo.student.userId
				}
				this.buryingPointData.clientTs = Date.now()
				this.request(this.buryingPointData, 2, '/study/userLog/UserLog/saveActionInfo')
			}
		}
	}
}