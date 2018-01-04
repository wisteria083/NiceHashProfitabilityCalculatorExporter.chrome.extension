"use strict;"

let formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

let profitabilities = [];

for (var key in localStorage){

  if(key.indexOf('PROFITABILITY') != -1) {
    let profitability = JSON.parse(localStorage.getItem(key));
    profitability.timestamp = formatDate(new Date(profitability.timestamp),"YYYY-MM-DD hh:mm:ss");
    profitabilities.push(profitability);
  }

}

let $table = $("#tabulator-profitability");

$table.tabulator({
  columns:[
    {title:"ハード", field:"hardware"},
    {title:"通貨", field:"currency"},
    {title:"電気代", field:"electricityValue"},
    {title:"Currency/Month", field:"incomeMonthCurrency"},
    {title:"BTC/Month", field:"incomeMonthBTC"},
    {title:"BTC Rate", field:"btcRate"},
    {title:"timestamp", field:"timestamp"},
  ],
});

$("#tabulator-controls  button[name=download]").on("click", function(){$table.tabulator("download", "csv", "Tabulator Example Download.csv");});

console.log(profitabilities)

$table.tabulator("setData",profitabilities);

$(function(){

  $('.start').on('click', function() {
    chrome.runtime.sendMessage({message: "START"},function(response) {
    });
  });

});
