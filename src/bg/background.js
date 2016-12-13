function showPageAction(tabId, changeInfo, tab) {
  if (tab.url.hostname === "apps.carleton.edu" || tab.url.hostname === "thehub.carleton.edu") {
    chrome.pageAction.show(tabId);
  }
}

chrome.tabs.onUpdated.addListener(showPageAction);

//function for making requests to RateMyProfessor
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  let xhr = new XMLHttpRequest();

  xhr.onload = function() {
    callback(xhr.responseText);
  }

  xhr.onerror = function() {
    callback();
  }

  xhr.open(request.method, request.url, true);
  xhr.send();

  return true;
});
