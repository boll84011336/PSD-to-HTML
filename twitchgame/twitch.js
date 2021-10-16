const errorMessage = '系統不穩定，請再試一次'
const API_URL = 'https://api.twitch.tv/kraken'
const CLIENT_ID = 'vex7okvg18rlwasna1b59nbtnxqgpw'
//$取名 是要用字串取代，為了讓名字不會跟其他衝突。
const STREAM_TEMPLATE = `<div class="stream">
				<img src="$preview"/>
				<div class="stream__data">
					<div class="stream__avatar">
						<img src="$logo"/>
					</div>
					<div class="stream__intro">               
						<div class="stream__title">
							$title
						</div>
						<div class="stream__channel">
							$name
						</div>                    
					</div>
				</div>
			</div>`

//取得前五名 data， title 先顯示第一個
getTopGames(games => {
	for(let game of games) {
		let element = document.createElement('li')
		element.innerText = game.game.name 
		document.querySelector('.navbar__nav').appendChild(element)
	}       
	chargeGame(games[0].game.name)
});   

// for layout
function addEmptyItem(){
	let element = document.createElement('div')
	element.classList.add('stream-empty')
	document.querySelector('.streams').appendChild(element)
}

//點遊戲換實況，代換 title
document.querySelector('.navbar__nav').addEventListener('click', e =>{
	if(e.target.tagName.toLowerCase() === 'li'){
		const gameName = e.target.innerText;
		chargeGame(gameName)        
	}
})   


//執行：代換 title -> 放上 streams
function chargeGame(gameName) {
	document.querySelector('h1').innerText = gameName
	document.querySelector('.streams').innerText = '' 
	getStreams(gameName, function(data){
		for(let stream of data) {
			appendStream(stream)           
		}    
		addEmptyItem()
		addEmptyItem()      
	})
}

//組 stream
function appendStream(stream) {
	let element = document.createElement('div');
	document.querySelector('.streams').appendChild(element);
	element.outerHTML = STREAM_TEMPLATE
		.replace('$preview', stream.preview.large)
		.replace('$logo', stream.channel.logo)
		.replace('$title', stream.channel.status)
		.replace('$name', stream.channel.name)
}

//呼叫API 拿資料 取得前五名
function getTopGames(callback) {      
	const request = new XMLHttpRequest();                    
	request.open('GET', `${API_URL}/games/top?limit=5`, true);
	request.setRequestHeader('Client-ID', CLIENT_ID)
	request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json')
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {    
			let games 
			try {
				games = JSON.parse(request.response).top
			} catch (error) {
				alert(errorMessage)
				return
			}             
			callback(games)
		}
	}
	request.onerror = function() {
			alert(errorMessage)
	}
	request.send();
}

//取得 streams，純data。 request不會有衝突，但避免混淆取不同名稱
function getStreams(gameName, callback) {
	const request2 = new XMLHttpRequest();                    
	request2.open('GET', `${API_URL}/streams?game=${encodeURIComponent(gameName)}`, true);
	request2.setRequestHeader('Client-ID', CLIENT_ID)
	request2.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json')
	request2.onload = function() {
		if (request2.status >=200 && request2.status <400) {
			let data 
			try {
				data = JSON.parse(request2.response).streams           
			} catch (error) {
				alert(errorMessage)
				return
			}
			callback(data)
		}
	}
	request2.onerror = () => {
		alert(errorMessage)
	}
	request2.send()
}     