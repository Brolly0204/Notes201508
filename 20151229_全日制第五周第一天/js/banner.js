"use strict";

//当页面加载完成后我们在进行图片的延迟加载
window.onload = function () {
    //图片加载
    $(".inner img").each(function () {
        var _this = this;//当前图片保存到_this中
        var trueImg = $(this).attr("trueImg");  //获取img上的自定义属性存储的图片地址
        var oImg = new Image;
        oImg.src = trueImg;
        oImg.onload = function () {
            $(_this).prop("src", trueImg).fadeIn(500);  //prop设置内置属性
        };
    });
};

(function () {
    var step = 1;//->当前显示的那一张图片的索引
    var autoTimer = null;//->存储我们自动轮播定时器的返回值

    //给inner的宽度设置初始值
    var $inner = $(".inner");
    var $count = $inner.children("div").length;//$count=divList
    $inner.css({
        width: $count * 1000,
        left: -1000
    });

    //实现自动轮播
    //把第一张放末尾一份,每隔3000ms执行一次运动,让$inner的left一直变小...当我们已经到达最后一张(和第一张长得一样),过了3000ms后,在往后走就没有了,此时我们让left立马回到第一张的位置,并且让step=2,这样的话接下来就会运动到第二张的位置了
    function autoMove() {
        step++;           //当为最后一张的时候step=5  step=5+1=6
        if (step >= $count) {     //当step=5+1=$count=6 的时候
            $inner.css("left", -1000);//变为第二张 也就是和最后一张一样的那张
            step = 2;                //接着从第二张 step=1 继续下去 设为step=2
        }
        $inner.stop().animate({left: -step * 1000}, 500, "linear");
        changeTip();
    }

    autoTimer = window.setInterval(autoMove, 3000);

    //实现焦点对齐
    var $innerTip = $(".innerTip");
    var $innerTipList = $innerTip.children("li");

    function changeTip() {
        var tempStep = step;
        if (tempStep <= 0) {//step=0时 也就是 4.jpg 变为tiplist中第四个，索引为3那个
            tempStep = $innerTipList.length - 1;
        } else if (tempStep >= ($count - 1)) {//step=5时 也就是最后一张 1.jpg 让tip变为tiplist中的第1个，索引为0那个
            tempStep = 0;
        } else {
            tempStep--;//否则就是说step从1开始的 tip应该是索引第0个 step从2（tempStep=2）;开始的 tip应该是索引第1（tempStep--;）个
        }
        $innerTipList.each(function (index, curLi) {
            curLi.className = index === tempStep ? "select" : null;
        });
    }

    //点击焦点实现切换
    $innerTipList.click(function () {
        window.clearInterval(autoTimer);
        var index = $(this).index();
        step = index + 1;//点击（tip.index）索引0 对应 (step)索引1 （tip.index）对应 索引1-(step)索引2
        $inner.stop().animate({left: -step * 1000}, 500, "linear");// $inner.stop()停止上一次动作
        changeTip();

        autoTimer = window.setInterval(autoMove, 3000);
    });

    //点击左右按钮实现切换
    var $link = $(".outer>a");
    $link.click(function () {
        window.clearInterval(autoTimer);

        if ($(this).hasClass("innerLeft")) {
            //->向左的按钮
            step--;
            if (step < 0) {//当到第二张1.jpg时 在点击左按钮时变为此时的第五张4.jpg，然后计数从step=3（3.jpg）开始
                $inner.css("left", -($count - 2) * 1000);
                step = $count - 3;
            }
            $inner.stop().animate({left: -step * 1000}, 500, "linear");
            changeTip();
        } else {
            //->向右的按钮 ->和自动的效果是一样的
            autoMove();
        }

        autoTimer = window.setInterval(autoMove, 3000);
    });
})();