var writeAddress = new Vue({
	el: '#app',
	mixins: [alerts, common, buryingPoint],
	data: {
		maskFlag:false,   //黑色背景的flag
		alertBoxFlag:false,
		confirmFlag:false, //二次确认弹框
		alertMsg:'请填写完整信息',  //弹出框的提示信息
		subData:'',    //提交的对象
		userPrizeId:'',
		name:'',
		phone:'',
		address:'',
		provinceName:'',   //收件人省份
		cityNName:'',   //城市名字
		areaName:'',    //收件人地区
		province: [],
		cities: [],
		areaList: [],
		curProvince: '',
		curCity: '',
		curArea: '',
		pca: '',
		toastFlag:false,
		loaderError: false,
		getGiftMoreFlag:'1',   //1 是再领一次  0立即分享
	},
	created:function(){
	},
	methods: {
		initialization () {
			this.request({}, 2, '/study/common/Token/getStudentToken?cached=0', this.resultAuthentication, 'GET');
			this.userPrizeId=this.GetQueryString('userPrizeId')
		},
		resultAuthentication (status, data) {
			if (!status) {
			  console.log(data)
			  if (data.token) {
				sToken = data.token
				this.request({parentId: 0}, 0, '/study/Mall/getAreaList', this.getProvince, 'GET')
			  } else {
				console.log('没有获取到token')
			  }
			}
		},
		//获取地址栏参数
		GetQueryString(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
		changeProvinces (val) {
			this.request({parentId: val.target.value}, 0, '/study/Mall/getAreaList', this.getCities, 'GET')
		},
		changeCities (val) {
			this.request({parentId: val.target.value}, 0, '/study/Mall/getAreaList', this.getAreas, 'GET')
		},
		getProvince (status, data) {
			if (!status) {
				this.province = data.areas
			}
		},
		getCities (status, data) {
			if (!status) {
				this.cities = data.areas
			}
		},
		getAreas (status, data) {
			console.log(data);
			if (!status) {
				this.areaList = data.areas
			}
		},
		submitAddrMsg () {
			for (var i = 0; i <= this.province.length - 1; i++) {
				if (this.province[i].id === this.curProvince) {
					this.pca += this.province[i].areaName
					this.provinceName=this.province[i].areaName
				}
			}
			for (var i = 0; i <= this.cities.length - 1; i++) {
				if (this.cities[i].id === this.curCity) {
					this.pca += this.cities[i].areaName
					this.cityNName=this.cities[i].areaName
				}
			}
			for (var i = 0; i <= this.areaList.length - 1; i++) {
				if (this.areaList[i].id === this.curArea) {
					this.pca += this.areaList[i].areaName
					this.areaName=this.areaList[i].areaName
				}
			}
			this.subData={
				"userPrizeId": this.userPrizeId,
				// "userPrizeId":"",
				"name": this.name,
				"phone": this.phone,
				"provinceId": this.curProvince,
				"province": this.provinceName,
				"cityId": this.curCity,
				"city": this.cityNName,
				"areaId": this.curArea,
				"area": this.areaName,
				"address": this.address
			}
			for(var key in this.subData){
				console.log(key)
				if(this.subData[key]==""){
					this.toastFlag=true;
                    this.toastShow();					
					return false;
				}
			}
			if(this.phone.length!=11){
				this.toastFlag=true;
				this.toastShow();	
				return false;
			}
			this.maskFlag=true;
			this.confirmFlag=true;
		},
		//二次确认
		secConfirm(){
			this.request(JSON.stringify(this.subData),0, '/activities/2/receivers', this.sendMsg,'POST',2)
		/* 	this.confirmFlag=false;
			this.maskFlag=false; */
		},
		sendMsg(status,data, code){
			if (status === 0) {
				if(code===200){
					// this.alertBoxFlag=false;
					this.confirmFlag=false;
					// this.showMask('getGiftMore');
					// this.maskFlag=true;
					this.getTimes();
				}
				else{
					this.confirmFlag=false;
                    this.maskFlag=false;
				}
			}
			else{
				console.log(data);
			}
		},
		toastShow(){
			setTimeout(function(){
				writeAddress.toastFlag=false;
			},1000)
		},
       //查看剩余抽奖次数
		getTimes(){
			this.request({}, 0, '/activities/2/lottery-times', this.getTimesFun, 'GET',2);
		},
		getTimesFun(status,data,code){
            if (status === 0) {
				if (code ===200) {
					// 已消耗的抽奖次数  获取到的抽奖次数
					this.maskFlag=true;
					if(data.consumed==1&&data.gained==1){
						this.showMask('shareInfo');
						this.getGiftMoreFlag=0;
						return
					}
					if(data.consumed==1&&data.gained==2){
						this.showMask('getGiftMore');
						this.getGiftMoreFlag=1;
						return
					}
					this.showMask('showGiftDetail');
				}
				else{
					console.log('错误')
				}
			} else {
				console.log('错误')
			}
		},
		seeGiftDetail(){
			window.location.href='./my_gift.html'
		},
		dialogClose(){
			this.confirmFlag=false;
			this.maskFlag=false;
		},
		getMore(){
			//1 再领一次
			if(this.getGiftMoreFlag==1){
				window.location.href="./lucky_draw.html"
			}else{
				this.shareGifts();
				this.sendBuryingPointMsg('main_Christmas_buy-share', 'main_Christmas_buy')
			}
		},
		shareGifts () {
			this.request({}, 0, '/study/blockActivity/StudentActivity/share', this.shareGiftData)
		},
		shareGiftData (status, data) {
			if (status === 0) {
				if (data.scale) {
					this.jumpToTaskDetails('share', data)
				}
			}
		},
		jumpToTaskDetails (ty, data) {
			var tk = ''
			switch (ty) {
				case 'share':
					tk = {type: 'share', keyword: 'ChristmasActivities2018', dataSource: data}
					break
				default:
					break
			}
			console.log(tk)
			this.sendMessage(tk)
		}
	}
})
