"use strict;"

// onInstalled
// -----------------------------------------------------
chrome.runtime.onInstalled.addListener(function (object) {

});

// onMessage
// -----------------------------------------------------
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if(request.message == "START"){

    // Start first PROFITABILITY
    // -----------------------------------------------------
    chrome.tabs.create({url:"https://www.nicehash.com/profitability-calculator/intel-cpu-q9450-266ghz?e=25&currency=JPY"}, async tab => {
        chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
            if (info.status === 'complete' && tabId === tab.id) {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.tabs.sendMessage(tab.id, {message: "START"}, function(response) {
                  // console.log(response);
                });
            }
        });
    });

  }else if(request.message == "PROFITABILITY"){

    console.log(request);

    // store data
    // -----------------------------------------------------
    if(
      request.profitability.hardware &&
      request.profitability.currency &&
      request.profitability.electricityValue > 0 &&
      request.profitability.btcRate > 0 &&
      request.profitability.incomeMonthCurrency > 0 &&
      request.profitability.incomeMonthBTC > 0 &&
      request.profitability.timestamp > 0
    ){
      localStorage.setItem("PROFITABILITY_" + request.profitability.hardware, JSON.stringify(request.profitability));
    }

    // Start next PROFITABILITY
    // -----------------------------------------------------
    if(request.nextHardwareUri){
       setTimeout(() => {

        chrome.tabs.create({url:request.nextHardwareUri}, async tab => {
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tab.id, {message: "START"}, function(response) {
                      // console.log(response);
                    });
                }
            });
        });

        chrome.tabs.remove(sender.tab.id, function() {});

      },3000);

    }

  }

});
