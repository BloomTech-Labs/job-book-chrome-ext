chrome.runtime.onMessage.addListener(request => {
  if (request.type === "getUrl") {
    chrome.storage.sync.get(['token'], function(result) {
      if (result.token === undefined) {
        return chrome.runtime.sendMessage({type: "getToken"}) 
      }
    });
    console.log(request.title)
    console.log(request.url)
   
    // Here we are creating a iframe, setting some styles and appending iframe to document to run react as iframe src
    const modal = document.createElement('iframe');
    modal.setAttribute("style", "border: none; display: block; height: 60%; width: 200px; overflow: hidden; position: fixed; right: 0px; top: 0px; left: auto; float: none; width: auto; z-index: 2147483647; background: transparent;")
    modal.id = "jobSave"
    document.body.appendChild(modal)

    const iframe = document.getElementById("jobSave")
    iframe.src = chrome.runtime.getURL('./index.html')
    iframe.frameBorder = 0;
  }

  if (request.type === "getTokenFromLocalStorage") {
    
  }
})



