const apiUrl= "https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery"
const errorMessage = "系統不穩定，請再試一次"
//抽獎 api
function getPrize(cb){
		let xhr = new XMLHttpRequest()                    
		xhr.open('GET', apiUrl, true)
		xhr.onload = function(){           
		if(xhr.status >= 200 && xhr.status <400){
			let data
			//try 如果回來的data不是JSON格式的話
			try {
				data = JSON.parse(xhr.response)
			} catch (err) {
				cb(errorMessage)
				return
			}              
			if(!data.prize){
				cb(errorMessage)
				return
			}
			cb(null, data)
		}
	}
	xhr.onerror = function(){
		alert('errorMessage')
	}
	xhr.send()        
}

//監聽抽獎
document.querySelector(".lottery-info__btn").addEventListener('click', () => { 
	getPrize(function(err, data){
		if(err){
			alert(err) 
			return
		}  

		const prizes = {
			FIRST: {
				className: 'first-prize',
				title: '恭喜你中頭獎了！日本東京來回雙人遊！',
			},
			SECOND: {
				className: 'second-prize',
				title: '二獎！90 吋電視一台！',
			},
			THIRD: {
				className: 'third-prize',
				title: '恭喜你抽中三獎：知名 YouTuber 簽名握手會入場券一張，bang！',
			},
			NONE: {
				className: 'none-prize',
				title: '銘謝惠顧',
			},
		}
		
		const {className,title} = prizes[data.prize]
		document.querySelector('.section-lottery').classList.add(className) 
		document.querySelector(".lottery-result__title").innerText = title 
		document.querySelector(".lottery-info").classList.add("hide")
		document.querySelector(".lottery-result").classList.remove("hide")
	})           
})   