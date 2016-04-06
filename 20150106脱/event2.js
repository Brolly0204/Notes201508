function on(ele,type,fn){//如果事件类型是以self为前缀的，则说明这是自定义事件，则单独定义数组来处理
	if(/^self/.test(type)){
		if(!ele["self"+type]){//如果没有self+type这个数组就创建一个数组
			ele["self"+type]=[];	
		}
		var a=ele["self"+type];
		for(var i=0;i<a.length;i++){//把fn添加到数组里 并避免重复
			if(a[i]==fn)return;
		}
		a.push(fn);
		return;//处理完了自定义方法则结束。不需要再去当系统事件再执行了。
	}
	
	if(ele.addEventListener){
		ele.addEventListener(type,fn,false);
		return;	
	}
	if(!ele["onEvent"+type]){
		ele["onEvent"+type]=[];//创建一个前缀为onEvent的事件池 （数组）
		ele.attachEvent("on"+type,function(){run.call(ele)});//给ele的type这个事件行为绑定解决this问题的run方法
		                            //run里调用这个数组run是用来遍历这个数组 并让数组里方法执行
		//ele.attachEvent("on"+type,processThis(ele,run));
	}
	var a=ele["onEvent"+type];//
	for(var i=0;i<a.length;i++){//防止数组里添加的fn有重复
		if(a[i]==fn)return;
		}
		a.push(fn);       //没有重复的就添加到数组里
		
}

function run(){//让数组里的事件方法按顺序执行
	var e=window.event;//IE系统事件
	var type=e.type;//找到当前的事件类型（onclick、onmouse）
	if(!e.target){
		e.target=e.srcElement;
		e.stopPropagation = function(){ e.cancelBubble = true;};//IE取消冒泡
		e.preventDefault = function(){ e.returnValue = false;};//IE阻止默认行为
		e.pageX = e.clientX +(document.documentElement.scrollLeft||document.body.scrollLeft);
		e.pageY = e.clientY +(document.documentElement.scrollTop||document.body.scrollTop);
		}

	var a=this["onEvent"+type];//this里有储存的这个事件类型的数组拿出来
	if(a){
	for(var i=0;i<a.length;i++){//按顺序遍历并执行这个数组里的方法
	if(typeof a[i]=="function"){//如果是方法就改变里面的this为当前元素并执行
		a[i].call(this,e);//把run的事件对象e传给数组里的方法
		}else{               //如果不是方法 就删除掉
			a.splice(i,1);
			i--;
			}
	}
	}
}

function off(ele,type,fn){//移除事件
	if(ele.removeEventListener){
		ele.removeEventListener(type,fn,false);	
	}
	var a=ele["onEvent"+type];
	if(a){
		for(var i=0;i<a.length;i++){
			if(a[i]==fn){
				a[i]=null;//先将要删除的fn为null 在run方法里判断是不是方法类型 不是就将它删除 避免直接删除造成数组塌陷
				//a.splice(i,1);
				break;
				
			}
				
		}
	}
	
}

/*
	[fn1,fn2,fn3,fn4,fn5]
	i=0;
	[fn4,fn5];
	i++;
	i==1
*/
function processThis(obj,fn){
				return function(e){fn.call(obj,e)}	
}
//on(oDiv1,"selfDragStart",clearEffect);
//on(oDiv1,"selfDragging",getSpeed);
//on(oDiv1,"selfDragEnd",fly);
//on(oDiv1,"selfDragEnd",);
//所谓的drop通知，就是当A（拖拽模块）执行的时候，去和事件标识符对应的数组里遍历执行相关方法的过程
function selfRun(selfType,event){//selfType是指自定义的事件，event是系统事件
	var a=this["self"+selfType];//这个数组是原来设计好的。
	if(a){
		for(var i=0;i<a.length;i++){
			a[i].call(this,event);//遍历执行。并且使数组里的方法在运行的时候，里面的this要指向当前的这个元素（this），还要能让这个方法得到系统的事件对象event;
		}                        //把传给run的系统事件传给数组里的方法
	}
}



