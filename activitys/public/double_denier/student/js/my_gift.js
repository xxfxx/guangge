var writeAddress = new Vue ({
  el: '#app',
  mixins: [common],
  data: {
    rewardInfo:[],
  },
  created: function () {
  },
  methods: {
    initialization () {
      this.request ({cached: 0},2,'/study/common/Token/getStudentToken',this.resultAuthentication,'GET');
    },
    resultAuthentication (status, data) {
      if (!status) {
        console.log (data);
        if (data.token) {
          sToken = data.token;
          this.request ({},0,'/activities/2/user-prizes',this.getDetail,'GET',2);
        } else {
          console.log ('没有获取到token');
        }
      }
    },
    getDetail (status, data, code) {
      if (!status && code === 200) {
        this.rewardInfo = data.items
      }
    },
    //添加收货地址
    addAddress (val) {
      window.location.href = './write_address.html?userPrizeId=' + val;
    },
  },
  filters: {
    dateformat (val) {
      var date = new Date (val);
      var Y = date.getFullYear () + '-';
      var M =
        (date.getMonth () + 1 < 10
          ? '0' + (date.getMonth () + 1)
          : date.getMonth () + 1) + '-';
      var D = date.getDate () + ' ';
      var h = ('0' + date.getHours()).slice(-2) + ':';
      var m = ('0' + date.getMinutes()).slice(-2);
      return Y + M + D + h + m;
    },
  },
});
