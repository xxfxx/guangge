
var TeacherData = null
var isLoading = false
$(document).ready(function() {
  var userId = getHtmlParam('userId')

   if($.browser.msie && $.browser.version < 10){
        $('body').addClass('ltie10');
    }
   var fullpage = $.fn.fullpage({
        // slidesColor: ['#6159D8', '#6159D8', '#6159D8', '#6159D8', '#6159D8'],
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7'],
        menu: '#menu',
        navigationPosition: 'right',
        afterRender: function () {
          $(function init () {
            console.log(userId)
            if (userId && userId > 0) {
              showIndex('#oldUser')
              isLoading =true
              $('#loading').show()
              getTeacherInformation(userId)
              ShareClink(userId)
              repeatBtnClick(userId)

            } else {
              showIndex('#visitor')
            }

            // $('.section3').hide()
          })
        },
      afterLoad: function (anchorLink,index) {
        if( index == 2) {
          var audio = $("#video1")[0];
          $('#pauseBtn').on('click',function () {
            $('.video-modal-mask').show()
          })
          $('#videolCloseBtn').on('click',function () {
            $('.video-modal-mask').hide()
            audio.pause();
          })
        }
        if(index==3){
          pageThreeIsShow(TeacherData)

        }
        if(index==4){
          pageFourLoad(TeacherData)

        }
        if(index==5){
          pageFifthLoad(TeacherData)

        }

        if (index == 6) {
          pageSixedLoad(TeacherData)
          var mySwiper = new Swiper ('#bannerSwiper', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable: true,
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: 6000,
            autoplayDisableOnInteraction: false
          })

        }
        if (index == 7) {
          pageSeventhLoad(TeacherData)

          mmodalCloseClick(userId)
          document.getElementById('qrcode').innerHTML = ""
          var qrText = PROJECT_DOMAIN+'/activitys/teaPhone/teacherDay_2018/form_pc_share.html' + '?userId='
            +userId
          new QRCode("qrcode",{text:qrText});
        }
       
     }
    });
   
});

function showIndex (id) {
  $('.page-index').css('display', 'none')
  $(id).css('display', 'block')
}
function getMapUrl(userId) {

  var shareLink = PROJECT_DOMAIN+'/activitys/teaPhone/teacherDay_2018/form_pc_share.html'
  $.ajax({
    type: 'POST',
    dataType: 'json',
    crossDomain: true,
    url: AUDIT_DOMAIN + APIS.getMapUrl ,
    data: {
      userId: userId,
      redirect: shareLink
    },
    success: function (res) {
      var data = res.data
      console.log('data:'+data)
      isLoading =false
      $('#loading').hide()

      var img = $('<img />',{src: data.map})
      $('#mapImage').html(img)

    },
    error: function () {
      isLoading =false
      $('#loading').hide()
      $('#net_err').show()
      $('oldUser').hide()
      console.log('网络异常,请稍后重试')
    }
  })
}
  /*
 * 判断是否显示试听课
 * trialTotal: 试听课总数
 *formalTotal: 正式总数
 * firstTrialDay: 第一次试听时间
 * firstFormalDay: 第一次正式课时间
 * regDate: 教师第一次注册授课系统时间
 * hfYear: 陪伴海风的年数
 * tfYear: 教师节年数
 */
  function getTeacherInformation(userId) {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      crossDomain: true,
      url: XUE_DOMAIN + APIS.getTeacherInformation,
      data: {
        userId: userId,
      },
      success: function (res) {

        console.log('data:'+data)
        if(res.code==200){
          var data = res.data
          TeacherData = data
          var  btime = timestampToData(data.regDate)
          $('#regDate').text(btime)
          $('#hfYear').text(data.hfYear)
          $('#tfYear').text(data.tfYear)
          getMapUrl(userId)

        }
        if(res.code==1012){
          showIndex('#visitor')
          isLoading = false
          $('#loading').hide()
        }


      },
      error: function () {
        $("#net_err").show()
        $('#oldUser').hide()
      }
    })
  }
  function pageThreeIsShow(data) {
    //如果试听课时小于30
    var isAttempt = !data.firstTrialDay||data.trialTotal<30
    var isAfficial =!data.firstFormalDay
    var isUsedroperty = !data.firstPropDate
    console.log("是否隐藏试听"+isAttempt)
    console.log("是否隐藏正课"+isAfficial)
    console.log("是否隐藏道具"+isUsedroperty)

    if (isAttempt) {
      console.log("隐藏试听课")
      $($('.section3 li')[0]).hide()
    }else {
      var firstTrialDay_C =  timestampToData(data.firstTrialDay)
      $($('.section3 li h3')[0]).text(firstTrialDay_C)
      $($('.section3 li span')[0]).text(data.trialTotal)
      $($('.section3 li span')[1]).text(data.firstPropstudent)
    }
    //如果正式课
    if(isAfficial) {
      console.log("隐藏正课")
      $($('.section3 li')[1]).hide()
    }else {
      var firstFormalDay_C =  timestampToData(data.firstFormalDay)
      console.log('****'+firstFormalDay_C)
      $($('.section3 li h3')[1]).text(firstFormalDay_C)
      $('#formalTotal').text(data.formalTotal)
    }
    //如果没送过道具
    if(isUsedroperty) {
      console.log("隐藏第一道具")
      $($('.section3 li')[2]).hide()
    }else {
      var firstPropDate_C =  timestampToData(data.firstPropDate)
      $($('.section3 li h3')[2]).text(firstPropDate_C)
      $('#firstPropstudent').text(data.firstPropstudent)
    }
    if(isAttempt&&isAfficial&&isUsedroperty) {
      console.log("隐藏当前页")
      $('.section3').remove()
      $($('#menu li')[2]).hide()
    }
  }
  function pageFourLoad (data) {
    if(data.teachedStudent==0||!data.teachedStudent) {
      console.log("隐藏当前页")
      $('.section4').remove()
      $($('#menu li')[3]).hide()
    }else {
      $('#section4_year').text(data.hfYear)
      $('#section4_people').text(data.teachedStudent)
      $('#section4_province').text(data.teachedStudentProviceCount)
    }
  }
  /*
  *totalPropNum   老师鼓励次数
  * usedQuiz  老师课件数目
  * correctHomeWork 作业数目
  * maxLessonCountDay 上课最多课程数日期
  *  maxLessonCount  一天上课最多课程数
  *  
  */
  function pageFifthLoad(data) {
    if(data.totalPropNum<10){

      $('#totalPropNum').html("<p>您在海风为学生们送上的多次鼓励让他们变得更加自信</p>")
    }else {
      $('#totalPropNum span').text(data.totalPropNum)
    }
    if(data.usedQuiz<30){
      $('#usedQuiz').html("<p>您准备的课件，让孩子们掌握了更多的知识</p>")
    }else {
      $('#usedQuiz span').text(data.usedQuiz)
    }
    if(data.correctHomeWork<30){
      $('#correctHomeWork').html("<p>认真负责的您，在授课期间还批改了大量作业</p>")
    }else {
      $('#correctHomeWork span').text(data.correctHomeWork)
    }
    if(data.maxLessonCountDay==0||!data.maxLessonCountDay){
      $('.section5-footer-box').hide()
    }else {
      $('#maxLessonCountDay').text(timestampToData(data.maxLessonCountDay))
      $('#maxLessonCount').text(data.maxLessonCount)
      $('#blessingCount').text(data.list.length)
    }
  }
  function renderStudentSwiper (list) {
    console.log(list)
    $('#oldUser .swiper-wrapper').empty()
    list.map(function (item, index) {
      var box = $('<div />',{class: 'swiper-slide'})
      var box_1 = $('<div />',{class: 'section6-box' })
      box.append(box_1)
      $('#oldUser .swiper-wrapper').append(box)
      renderStudentRow(item,box_1)
    })

  }
  function renderStudentRow (list,BoxItem) {
    list.map(function (item) {
      var div = $('<div />',{class: 'media-box'})
      var div_1 = $('<div />',{class: 'media-box-hd' })

      var img = $('<img/>', {src:"images/icon_hd.png",art:'' })

      div_1.append(img)
      div.append(div_1)
      var div_2 =  $('<div />',{class: 'media-box-bd' })
      var title_student  = nameFix(item.studentName ) + "     " + YearFix(item.firstLessonPlanTime)
      var h4 = $('<h4/>', {class: 'media-box-title', text: title_student})

      var p = $('<p/>', {class: 'media-box-desc', text: cutString(item.greetings,36)})
      div_2.append(h4,p)
      div.append(div_2)
      console.log("**********")
      console.log(BoxItem)

      $(BoxItem).append(div)
    })
  }
  function pageSixedLoad(data) {
   console.log(data.list)
    var sortList = data.list
    sortList.sort(function (a, b) {
      return a.firstLessonPlanTime < b.firstLessonPlanTime
    })
   renderStudentSwiper(splitArry(sortList,4))
  }
  function pageSeventhLoad(data) {
    $('#teacherName').text(data.teacherName)
    $('#number_blessing').text(data.list.length)
    var lastPageData =data.list.slice(0,3)
    lastPageData.map(function (item,index) {
      var title_student_7  = nameFix(item.studentName ) + "     " + YearFix(item.firstLessonPlanTime)
      $($('.section7-box .media-box-title')[index]).text(title_student_7)
      $($('.section7-box p')[index]).text(cutString(item.greetings,36))
    })

  }
  
  function timestampToData(timestamp) {
    var date = new Date(timestamp) //获取一个时间对象
    var year = date.getFullYear()// 获取完整的年份(4位,1970)
    var month = date.getMonth() +1 // 获取月份(0-11,0代表1月,用的时候记得加上1)
    var day = date.getDate()// 获取日(1-31)
    date.getTime() // 获取时间(从1970.1.1开始的毫秒数)
    date.getHours()// 获取小时数(0-23)
    date.getMinutes() // 获取分钟数(0-59)
    date.getSeconds() // 获取秒数(0-59)
    var  result = year + '年' + month + '月' + day +'日'
    return result
  }
  function splitArry(arr,len) {
    var arr_length = arr.length;
    var newArr = [];
    for(var i=0;i<arr_length;i+=len){
      newArr.push(arr.slice(i,i+len));
    }
    return newArr
  }
  function cutString(str, len) {
    //length属性读出来的汉字长度为1
    if(!str) return ''
    if(str.length <= len) {
      return str;
    }else {
      return (str.substring(0,len) + "...");
    }
  }
  function nameFix(name) {
    if(name=='海风学子') return "海风学子"
    if(name.length<4){
      return (name.substring(0,1) + "同学");
    }else {
      return (name.substring(0,2) + "同学");
    }
  }
  function YearFix(timestamp) {
    if(!timestamp) return ''
    var date_y= new Date(timestamp) //获取一个时间对象
    var year_m = date_y.getFullYear()// 获取完整的年份(4位,1970)

    var  result = year_m + '级'
    return result
  }
  function ShareClink(userId) {
    $('.btn-org').on('click',function () {
      $('.modal-mask').show()
    })
  }
  function repeatBtnClick (userId) {
    $('#repeatBtn').on('click',function () {
      $.fn.fullpage.moveTo(1, 0);
    })
  }
  function mmodalCloseClick(userId) {
    $('#modalCloseBtn').on('click',function () {
      $('.modal-mask').hide()
    })
  }
