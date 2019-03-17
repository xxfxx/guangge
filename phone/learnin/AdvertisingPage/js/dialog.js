    var isIOS = /Mac\s+OS/i.test(navigator.userAgent) || /Mac/i.test(navigator.platform);

    function addUser() {
        //dialogRegistration.style.display = '';
        // alert(222);
        var messageToRn = {
            isClickQuery: true
        };
        WebViewBridge && WebViewBridge.send(JSON.stringify(messageToRn));

    }