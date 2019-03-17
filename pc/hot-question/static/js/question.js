let mixin = {
  methods: {
    request(el, type, url, callback, complete) {
      let that = el
      $.ajax({
        data: {
          userType: type
        },
        dataType: 'json',
        type: 'POST',
        url,
        success: function (data) {
          // that.questionList = data.data
          callback(data.data)
        },
        complete: function (params) {
          complete(params)
        }
      })
    }
  }
}

