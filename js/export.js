chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if(request.message == "START"){

    // get values
    // --------------------------------------------------
    let hardware = $("#hardware").val();
    let currency = $("#currency").val();
    let electricityValue = $("#electricityValue").val();

    // income
    // --------------------------------------------------
    let btcRate = 0;
    let incomeMonthCurrency = 0;
    let incomeMonthBTC = 0;

    try{

      btcRate = parseFloat(/\s+BTC\s+=\s+(\d+\.?\d*|\.\d+)\s+JPY/g.exec($("small").text())[1]);

      $("h3").each(function( index ) {

        let regex = /You could be making\s+([0-9|,|\/.]+)\s+JPY\/month/g.exec($( this ).text());

        if(regex && regex[1]){
          incomeMonthCurrency = parseFloat(regex[1].replace(/,/g,""));
        }

      });

      if(btcRate == 0 ){
        throw new Error("btcRate is not caputured")
      }

      if(incomeMonthCurrency == 0 ){
        throw new Error("incomeMonthCurrency is not caputured")
      }

      incomeMonthBTC = incomeMonthCurrency / btcRate;

      if(incomeMonthBTC == 0 ){
        throw new Error("incomeMonthBTC is not caputured")
      }

      //
      // // send background
      // // --------------------------------------------------
      // console.log(hardware)
      // console.log(currency)
      // console.log(electricityValue)
      // console.log(btcRate)
      // console.log(incomeMonthCurrency)
      // console.log(incomeMonthBTC)
      // console.log(nextHardware);

    }catch(e){

      console.trace(e);

    }finally {

      // next hardware uri
      // --------------------------------------------------
      let nextHardware = null;

      $("#hardware option").each(function(index) {
        if($(this).val() == hardware){
          if($("#hardware option")[index + 1]){
            nextHardware = $($("#hardware option")[index + 1]).val();
            return 0;
          }
        }
      });

      // sendMessage
      // --------------------------------------------------
      chrome.runtime.sendMessage(
        {
          message: "PROFITABILITY",
          profitability :{
            hardware : hardware ? hardware : null,
            currency : currency ? currency : null,
            electricityValue : electricityValue ? electricityValue : null,
            btcRate : btcRate ? btcRate : null,
            incomeMonthCurrency : incomeMonthCurrency ? incomeMonthCurrency : null,
            incomeMonthBTC : incomeMonthBTC ? incomeMonthBTC : null,
            timestamp : new Date().getTime(),
          },
          nextHardware : nextHardware,
          nextHardwareUri : nextHardware ? "https://www.nicehash.com/profitability-calculator/" + nextHardware + "?e=" + electricityValue + "&currency=" + currency : null
        }, function(response) {

      });

    }

  }

});
