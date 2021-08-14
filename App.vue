<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定
			// #endif
			
			// // #ifdef APP-PLUS 
			// plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) { 
			//   uni.request({ 
			//     url: 'http://www.javanx.cn/update/', 
			//     data: { 
			//       version: widgetInfo.version, 
			//       name: widgetInfo.name
			//     }, 
			//     success: (result) => {
			//       var data = result.data;
			//       if (data.update && data.wgtUrl) { 
			//         uni.downloadFile({ 
			//           url: data.wgtUrl, 
			//           success: (downloadResult) => { 
			//             if (downloadResult.statusCode === 200) { 
			//               plus.runtime.install(downloadResult.tempFilePath, { 
			//                 force: false
			//               }, function() { 
			//                 console.log('install success...'); 
			//                 plus.runtime.restart(); 
			//               }, function(e) {
			//                // 这里的错误很重要，最好能记录的服务器日志中，方便调试或以后维护了解更新错误情况，及时解决
			//                // 如何更新到服务器？
			//                // 调用一个接口，将e返回咯
			//                console.error('install fail...'); 
			//               }); 
			//             } 
			//           } 
			//         }); 
			//       } 
			//     } 
			//   }); 
			// }); 
			// // #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
