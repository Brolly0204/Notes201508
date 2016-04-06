function down(e) {//给它一个事件标识符："selfDargStart";其实就是事件类型
	this.x = this.offsetLeft;
	this.y = this.offsetTop;
	this.mx = e.pageX;
	this.my = e.pageY;
	if(this.setCapture) {
		this.setCapture();
		on(this,"mousemove",move);
		on(this,"mouseup",up);
	}else {
		//this.MOVE = move.bind(this);
		//this.UP = up.bind(this);
		var _this=this;
		this.MOVE = function(e){move.call(_this,e)};//间接绑定的方法没有e系统事件 需要传进来
		this.UP = function(e){up.call(_this,e)};
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	
	e.preventDefault();
	//通知:就是去指定的数组里按顺序执行相关的方法 "selfDragStart"保存的是-> clearEffect
	selfRun.call(this,"selfDragStart",e);//selfRun是让this里的自定义数组"selfDragStart"里的
	                                     // 方法按顺序执行
}

function move(e){//给它一个事件标识符叫"selfDragging"
	this.style.left=this.x+(e.pageX-this.mx)+"px";
	this.style.top=this.y+(e.pageY-this.my)+"px";
	                    //"selfDragging" 保存的是->getSpeed
	selfRun.call(this,"selfDragging",e);   //selfRun是让this里的自定义数组"selfDragging"里的
	                                  // 方法按顺序执行
}

function up(e){//给它一个事件标识符叫："selfDragEnd"/
	if(this.releaseCapture){
		this.releaseCapture();
		off(this,"mousemove",move);
		off(this,"mousedown",down)
	}else{
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);
		}                   // "selfDragEnd"保存的是-> fly drop
		selfRun.call(this,"selfDragEnd",e);    //selfRun是让this里的自定义数组"selfDragEnd"里的
                        // 方法按顺序执行
}

function clearEffect(){//清除动画 //当你再按下的时候清除上次的 fly和drag动画
	window.clearTimeout(this.dropTimer);
	window.clearTimeout(this.flyTimer);	
}

function getSpeed(e){//计算速度 能够在move运动中获取到单位时间的速度
	if(!this.prevPosi){
		this.prevPosi=e.pageX;//记录第一次作为上一次开始距离 第一次的时候把当前值设为做位上一次的
	}else{
		this.speed=e.pageX-this.prevPosi;//第二次 当前移动的距离减去上一次的距离=单位时间的速度
		this.prevPosi=e.pageX;     //再把这一次（第二次）的存为当前速度  下一次执行就是作为上次的距离
	}
}

//计算速度的算法：单位时间内运动的距离越长，则飞出去的速度越快
//关键是“单位时间”从那儿来？一个固定长度的时间段
	function fly(){//左右运动
		var maxRight=document.documentElement.clientWidth-this.offsetWidth;
		if(this.offsetLeft+this.speed>=maxRight){
			this.style.left=maxRight+"px";
			this.speed*=-1;
		}else if(this.offsetLeft+this.speed<=0){
			this.style.left=0;
			this.speed*=-1;
		}else{
			this.style.left=this.offsetLeft+this.speed+"px";
		}
		this.speed*=.97;//衰减
		
		if(Math.abs(this.speed)>=0.5){
			this.flyTimer=window.setTimeout(processThis(this,fly),15);//把this改成拖动元素的
		}
		
	}


function drop(){//上下运动
	if(!this.dropSpeed){
		this.dropSpeed=9;
		this.flag=0
	}else{
		this.dropSpeed+=9;
	}
	this.dropSpeed*=.97;
	var maxBottom=document.documentElement.clientHeight-this.offsetHeight;
	if(this.offsetTop+this.dropSpeed>=maxBottom){
		this.style.top=maxBottom+"px";
		this.dropSpeed*=-1;
		this.flag++;
	}else{
		this.style.top=this.offsetTop+this.dropSpeed+"px";
		this.flag=0;
	}
	if(this.flag<2){
		this.dropTimer=window.setTimeout(processThis(this,drop),15);
	}
	
}
