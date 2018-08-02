$(document).ready(function() {

	//初始化地图
	var map = new AMap.Map('container');

	//初始化截屏插件
	var captureObj = new NiuniuCaptureObject(); //生成实例
	captureObj.InitNiuniuCapture(); //初始化控件
	captureObj.PluginLoadedCallback = function(success) { //初始化完毕
	}
	captureObj.FinishedCallback = function(type, x, y, width, height, info, content, localpath) { //截屏完毕
		console.log('type----' + type); //type<0 需要重新安装控件;type=1 截图完成;type=2 取消截图;type=3 保存截图到本地;type=4 剪贴板获取截图
		console.log('x----' + x);
		console.log('y----' + y);
		console.log('width----' + width);
		console.log('height----' + height);
		console.log('info----' + info);
		console.log('content----' + content);
		console.log('localpath----' + localpath);

		var timestamp = Date.parse(new Date());
		var imgSrc = 'data:image/png;base64,' + content;
		$('#jietu').attr('href', imgSrc);
		$("#jietu").attr('download', timestamp + '.png');
		$('#jietu')[0].click();
	}

	$('#capture1').on('click', function() {

		var captureRet = captureObj.DoCapture("pic.jpg" /*后缀名*/ , 0 /*是否隐藏当前窗口*/ , 3 /*截屏方式：0：表示普通截图；1：表示截取指定区域，区域由x、y、width、height参数指定；2：表示截取当前桌面；3: 表示截图时先弹出一个提示窗口；4: 从剪贴板中获取图片*/ , 0, 0, 0, 0);

		if(captureRet != emCaptureSuccess) { //没有安装控件
			ShowDownLoad();
		}
	});

	//根据是否是Chrome新版本来控制下载不同的控件安装包
	function ShowDownLoad() {
		if(captureObj.IsNeedCrx()) {
			ShowChromeInstallDownload();
		} else {
			ShowIntallDownload();
		}
	}

	function ShowChromeInstallDownload() {
		var ret = confirm("您需要先下载Chrome扩展安装包进行安装，点击确定继续!");

		if(ret) {
			window.location.href = "http://www.ggniu.cn/download/CaptureInstallChrome.exe";
		}

	}

	function ShowIntallDownload() {
		var ret = confirm("您需要先下载控件进行安装，点击确定继续!");

		if(ret) {
			window.location.href = "http://www.ggniu.cn/download/CaptureInstall.exe";
		}
	}

	//自动截屏
	$("#capture2").click(function() {
		html2canvas($("#contbox"), {
			foreignObjectRendering: true,
			useCORS: true,
			height: $("#contbox").outerHeight() + 20,
			width: $("#contbox").outerWidth() + 20,
			onrendered: function(canvas) {
				//将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
				var timestamp = Date.parse(new Date());
				//把截取到的图片替换到a标签的路径下载
				$("#jietuAuto").attr('href', canvas.toDataURL());
				//下载下来的图片名字
				$("#jietuAuto").attr('download', timestamp + '.png');
				//document.body.appendChild(canvas);
				$('#jietuAuto')[0].click();
			}
			//可以带上宽高截取你所需要的部分内容
		});
	});


	//初始化鼠标插件
	var mouseTool = new AMap.MouseTool(map);
	
	//清空
	$('#all_delete').on('click',function(){
        map.clearMap();
    })


	//绘圆
	$('#drawCircle').on('click', function() {
		mouseTool.circle();
	});
	//绘折线
	$('#drawLine').on('click', function() {
		mouseTool.polyline({
			lineJoin: 'round',
			lineCap: 'round'
		});
	})

	//绘点
	$('#drawSport').on('click', function() {
		$('#marker-panel').show();
	})

	//标记跟随鼠标
	$('#marker_close').on('click', function() {
		$('#marker-panel').hide();
	})

	$('#marker_map').on('click', function() {
		mouseTool.marker({
			icon: new AMap.Icon({
				image: 'img/marker/102-map-marker.png'
			})
		})
		document.onmousemove = function() {
			$('#markerMap_div').show();
			var div = document.getElementById("markerMap_div");
			if(!div) {
				return;
			}
			var intX = window.event.clientX;
			var intY = window.event.clientY;
			div.style.left = intX + 10 + "px";
			div.style.top = intY - 20 + "px";
		};

	})
	$('#marker_pin').on('click', function() {
		mouseTool.marker({
			icon: new AMap.Icon({
				image: 'img/marker/pin_location_red32.png'
			})
		})

		document.onmousemove = function() {
			$('#markerPin_div').show();
			var div = document.getElementById("markerPin_div");
			if(!div) {
				return;
			}
			var intX = window.event.clientX;
			var intY = window.event.clientY;
			div.style.left = intX + 10 + "px";
			div.style.top = intY - 20 + "px";
		};

	})
	$('#marker_flag').on('click', function() {
		mouseTool.marker({
			icon: new AMap.Icon({
				image: 'img/marker/634-flag-red32.png'
			})
		})
		document.onmousemove = function() {
			$('#markerFlag_div').show();
			var div = document.getElementById("markerFlag_div");
			if(!div) {
				return;
			}
			var intX = window.event.clientX;
			var intY = window.event.clientY;
			div.style.left = intX + 10 + "px";
			div.style.top = intY - 20 + "px";
		};

	})

	AMap.event.addListener(mouseTool, 'draw', function(e) {
		mouseTool.close(); //关闭鼠标功能
		var contextMenu = new AMap.ContextMenu(); //创建右键菜单
		var type = e.obj.CLASS_NAME;
		if(type == 'AMap.Circle') {
			var circle = new AMap.Circle();
			circle = e.obj;

			//右键放大
			contextMenu.addItem("放大一级", function() {
				map.zoomIn();
			}, 0);
			//右键缩小
			contextMenu.addItem("缩小一级", function() {
				map.zoomOut();
			}, 1);

			var bounds = circle.getBounds(); //圆形外切矩形范围
			var southWest = bounds.getSouthWest();
			var northEast = bounds.getNorthEast();

			var maxLng = northEast.getLng();
			var maxLat = northEast.getLat();
			var minLng = southWest.getLng();
			var minLat = southWest.getLat();

			contextMenu.addItem("删除标记", function() {
				map.remove(e.obj);
			}, 2);
		} else {
			if(type != 'AMap.Polyline') {

				$('#markerMap_div').hide();
				$('#markerPin_div').hide();
				$('#markerFlag_div').hide();
				document.onmousemove = null;
				var marker = new AMap.Marker();
				marker = e.obj;
				var lng = marker.getPosition().getLng();
				var lat = marker.getPosition().getLat();

			}

			contextMenu.addItem("删除标记", function() {
				map.remove(e.obj);
			}, 0);
		}
		e.obj.on('rightclick', function(e) {
			contextMenu.open(map, e.lnglat);
		});

	});

})