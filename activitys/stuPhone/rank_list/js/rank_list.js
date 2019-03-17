var vm = new Vue ({
  el: '.rank_list_box',
  data: {
    url: XUE_DOMAIN,
    list: [],
    newList: [],
    questionListData: [],
    pageSize: '300',
    pageIndex: '1',
    userId: '',
    getDataFlag: true,
    gradeName:'', //学霸榜名字
    homeWorkTimes: '', //完成作业次数
    reward: '', //获得奖励
    ranking: '', //排名
    isFetch: '', //是否领取奖励   0没有领取过,1领取过
    openBoxFlag: true, //打开宝箱按钮  默认显示 打开宝箱按钮
    maskFlag: false, //遮罩层flag
    openUniCode: '', //埋点时的unicode
    moneyDetailShow:false
  },
  created () {
    var _self = this;
    this.userId = this.getQueryString ('userId');
    this.getRankingList ();
    this.getScore ();
  },
  mounted: function () {
    this.$nextTick (function () {
      // 代码保证 this.$el 在 document 中
      // window.addEventListener ('scroll', this.onScroll);
    });
  },
  filters: {
    wordsNum: function (value) {
      if(value.length>5){
          return value.substring(0,5)+"...";
      }
      else{
        return value;
      }
    }
  },
  methods: {
    onScroll: function () {
      var _self = this;
      $ ('.rank_content_box').scroll (function () {
        var scrollTop = $ (this).scrollTop (); //当前已经滚动的距离
        var scrollHeight = $ ('.rank_content').height (); //被滚动元素的高度
        var windowHeight = $ (this).height (); //当前可视的页面高度
        if (scrollTop + windowHeight >= scrollHeight) {
          if (_self.getDataFlag) {
            _self.getDataFlag = false;
            _self.getRankingList ();
          }
        }
      });
    },
    getQueryString: function (key) {
      var reg = new RegExp ('(^|&)' + key + '=([^&]*)(&|$)');
      var result = window.location.search.substr (1).match (reg);
      return result ? decodeURIComponent (result[2]) : null;
    },
    //名次查询
    getScore: function () {
      var _self = this;
      $.ajax ({
        type: 'post',
        url: this.url + '/study/activity/StudentAward/getScoreApp',
        ContetnType: 'application/json',
        data: {
          userId: _self.userId,
        },
        success: function (res) {
          if (res.code == 200) {
            _self.homeWorkTimes = res.data.homeWorkTimes;
            _self.ranking = res.data.ranking;
            _self.reward = res.data.reward;
            _self.isFetch = res.data.isFetch;
          }
        },
        error: function (res) {
          console.log (res);
        },
      });
    },
    //上榜名单
    getRankingList: function () {
      var _self = this;
      $.ajax ({
        type: 'post',
        url: this.url + '/study/activity/StudentAward/getRankingList',
        ContetnType: 'application/json',
        data: {
          pageSize: _self.pageSize,
          pageIndex: _self.pageIndex,
          userId: _self.userId,
        },
        success: function (res) {
          if (res.code == 200) {
            _self.gradeName = res.data.gradeName;
            ++_self.pageIndex;
            if (_self.pageIndex - 1 <= res.data.pages) {
              res.data.list.forEach (function (item, index) {
                _self.list.push (item);
                _self.getDataFlag = true;
              });
            } else {
              _self.getDataFlag = false;
            }
          }
        },
        error: function (res) {
          console.log (res);
        },
      });
    },
    //领取奖励按钮
    getReward: function () {
      var _self = this;
      if (!window.localStorage.getItem ('openUniCode')) {
        _self.getUnicode ();
      } else {
        $.ajax ({
          type: 'post',
          url: this.url + '/study/activity/StudentAward/getRewardApp',
          ContetnType: 'application/json',
          data: {
            userId: _self.userId,
          },
          success: function (res) {
            if (res.code == 200) {
              _self.maskFlag = true;
            }
          },
          error: function (res) {
            console.log (res);
          },
        });
      }
    },
    //打开宝箱
    openBox: function () {
      var _self=this;
      this.openBoxFlag = false;
      setTimeout(function(){
        _self.moneyDetailShow=true;
      },500)
    },
    //确定领取海贝
    receiveSure: function () {
      this.getScore ();
      this.maskFlag = false;
    },
    //立即领取按钮 获取unicode
    getUnicode: function () {
      var clientTs = new Date ().getTime ();
      var _self = this;
      $.ajax ({
        type: 'post',
        url: this.url + '/study/userLog/UserLog/getOpenUniCode',
        ContetnType: 'application/json',
        data: {
          clientTs: clientTs,
          appName: 'rankingList',
          version: '3.3.36',
        },
        success: function (res) {
          if (res.code == 200) {
            var openUniCode = res.data.openUniCode;
            window.localStorage.setItem ('openUniCode', openUniCode);
            _self.openUniCode = window.localStorage.getItem ('openUniCode');
            _self.collectData ();
            _self.maskFlag = true;
          }
        },
        error: function (res) {
          console.log (res);
        },
      });
    },
    collectData: function () {
      var clientTs = new Date ().getTime ();
      var _self = this;
      $.ajax ({
        type: 'post',
        url: this.url + '/study/userLog/UserLog/saveActionInfo',
        ContetnType: 'application/json',
        data: {
          clientTs: clientTs,
          actionId: 'rankPage-receiveReward',
          fromPageName: 'rankPage',
          openUniCode: _self.openUniCode,
        },
        success: function (res) {
          _self.getReward ();
        },
        error: function (res) {
          console.log (res);
        },
      });
    },
  },
});
