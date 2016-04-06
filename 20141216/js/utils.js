/**
 * Created by Jesus F on 2015/12/17 0017.
 */
var utils= {
    offset:function (curEle)
{
    var l = curEle.offsetLeft, t = curEle.offsetTop;
    var p = curEle.offsetParent;
    while (p.tagName.toLowerCase() != "body") {
        if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
            l += p.clientLeft;
            t += p.clientTop;
        }
        l += p.offsetLeft;
        t += p.offsetTop;
        p = p.offsetParent;
    }
    return {left: l, top: t};
}
};
