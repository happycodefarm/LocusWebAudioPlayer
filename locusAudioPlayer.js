let pos = 0

document.addEventListener("keydown", function(e) {
  console.log(e.key)

  if (e.key === "Enter") {
      openFullscreen()
  }
  if (e.key === "ArrowRight") {
    playNext()
  }
  if (e.key === "ArrowLeft") {
      pos-=2
      if (pos<0) pos= 0

      playNext()
  }
}, false)


function openFullscreen() {

  let body = document.getElementById("container")
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) { /* Safari */
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) { /* IE11 */
    body.msRequestFullscreen();
  }
}



function init() {

  let player = document.getElementById("player")
  let source = document.createElement('source')
  source.setAttribute('id', "source")
  
  player.appendChild(source)

  playNext()

  player.play()

  player.addEventListener('ended', (event) => {
      playNext()
  })

  player.addEventListener('error', function(event) {
      console.log("player errror")
      playNext()
   }, true)


   player.addEventListener('progress', () => {
    const duration = player.duration
    if (duration > 0) {
      for (let i = 0; i < player.buffered.length; i++) {
        if ( player.buffered.start(player.buffered.length - 1 - i) < player.currentTime ) {
          document.getElementById('buffered-amount').style.width = `${  (player.buffered.end(player.buffered.length - 1 - i) * 100) / duration }%`
          break
        }
      }
    }
  })

  player.addEventListener('timeupdate', () => {
    const duration = player.duration
    if (duration > 0) {
      document.getElementById('progress-amount').style.width = `${ player.currentTime / duration * 100 }%`
    }
  })

}

function playNext() {
  let player = document.getElementById("player")
  let source = document.getElementById("source")
  let title = document.getElementById("title")
  let description = document.getElementById("description")

  postRequest(pos).then(function(response) {

      title.innerHTML = response.title
      description.innerHTML = response.description

      console.log("loading source " + response.url)

      source.setAttribute('src', response.url)
      source.setAttribute('type', 'audio/mpeg')
      player.load()
      player.play()
      //console.log(response)
      pos++
  })
}

function postRequest(args) {
	
	return new Promise(function(resolve, reject) {
		var xmlHttp = null;
		
		xmlHttp = getHTTPObject();
		xmlHttp.open("GET",'player.php?pos='+args, true);

		xmlHttp.setRequestHeader("Content-type", "application/json"); // json header
		xmlHttp.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"); // IE Cache Hack
		xmlHttp.setRequestHeader("Cache-Control", "no-cache"); // idem

		console.log('player.php?pos='+args);
		
		xmlHttp.onerror = function() {
			reject(Error('There was a network error.'));
		}
    
		xmlHttp.onload=function() {
			if (xmlHttp.status === 200) {  // Makes sure the document is ready to parse.
				var json = null;
				console.log(xmlHttp.responseText)
				try {
					json = JSON.parse(xmlHttp.responseText);
				} catch (err) {
					console.log("error json parse: " + args);
					console.log("error is " + xmlHttp.responseText);
					reject(Error('JSON parse error.'));
				}
				resolve(json);
			} else {
				reject(Error('Network error: ' + xmlHttp.statusText));
			}		
		}
		xmlHttp.send();
	});
}

function getHTTPObject() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
    }

    try {
		return new ActiveXObject("MSXML2.XMLHTTP.3.0");
	} catch (error) {
		console.log("Neither XHR or ActiveX are supported!");
		alert("Neither XHR or ActiveX are supported!", "error");
		return null;
    }
}
