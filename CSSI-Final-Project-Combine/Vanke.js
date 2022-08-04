const inputPrices = document.querySelector("#stockInput");
const submitButton = document.querySelector("#submit");
let data = [];
const calculateButton = document.querySelector("#calc");
const message = document.querySelector(".emptyMessage");

async function printData() {
  const key = "TSQKEWYWPQ3IC0DX";
  const query = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=000002.SHZ&outputsize=full&apikey=${key}`;
  const r = await fetch(query);
  const retrievedData = await r.json();
  return retrievedData;
}

async function getData(originalData) {
  originalData = await originalData;
  const time = originalData["Time Series (Daily)"]
  let chartData = [];
  for (const item in time) {
    data.push(Number(time[item]["4. close"]));
    chartData.push([item, Number(time[item]["4. close"])]);
  }
  chartData = chartData.reverse();
  return chartData;
}
getData(printData()).then(inputData => {
  var dataSet = anychart.data.set(inputData);
  // map data for the line chart,
  // take x from the zero column and value from the first column
  var seriesData = dataSet.mapAs({ x: 0, value: 1 });

  // create a line chart
  var chart = anychart.line();

  /*var title = chart.title();
  title.text('Closing Prices of Stocks Throughout Several Days');
  title.fontSize(20);
  title.fontFamily("Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif");*/
  var title = chart.title();
  title.enabled(true);
  title.fontSize(28);
  title.fontFamily("Impact, Haettenschweiler, 'Arial Narrow', sans-serif");
  title.useHtml(true);
  title.text(
    "<br><a style=\"color:#FFFFFF;\">" +
    "Closing Prices of Stocks Throughout Several Days</a>"
  );

  var ytitle = chart.yAxis().title();
  ytitle.fontSize(18);
  ytitle.fontFamily("Impact, Haettenschweiler, 'Arial Narrow', sans-serif");
  ytitle.useHtml(true);
  ytitle.text(
    "<br><a style=\"color:#FFFFFF;\">" +
    "Stock Prices</a>"
  );
  // chart.yAxis().title('Stock Prices').stroke({
  //   color: "white",
  //   thickness: 5
  // });
  var xtitle = chart.xAxis().title();
  xtitle.text('Day');
  xtitle.fontSize(18);
  xtitle.fontFamily("Impact, Haettenschweiler, 'Arial Narrow', sans-serif");
  //xtitle.fontFamily("Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif");
  /*chart.xAxis().title('Day').stroke({
    color: "white",
    thickness: 5
  });*/

  var xlabels = chart.xAxis().labels();
  xlabels.fontFamily("Impact, Haettenschweiler, 'Arial Narrow', sans-serif");
  xlabels.fontSize(16);
  xlabels.fontColor("white");
  xlabels.fontWeight("bold");
  xlabels.rotation(90);
  xlabels.useHtml(false);

  var ylabels = chart.yAxis().labels();
  ylabels.fontFamily("Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif");
  ylabels.fontSize(16);
  ylabels.fontColor("white");
  ylabels.fontWeight("bold");
  ylabels.useHtml(false);
  // turn on the line chart animation
  chart.animation(true);

  // create a line series with the mapped data
  //var lineChart = chart.line(seriesData);
  chart.background().fill("#1c1427");
  // set the container id for the line chart
  chart.container('container');
  var firstSeries = chart.line(seriesData);
  firstSeries.stroke('3 #35AC5E')
  // draw the line chart
  chart.draw();
})
//let inputData = await getData(printData())
// create a data set on our data

//document.getElementById("submit").disabled = true;


calculateButton.addEventListener("click", e => {
  let max = 0;
  let start = 0;
  let end = 0;
  let finalStart = 0;
  let finalEnd = 0;
  data = data.reverse();
  while (end < data.length) {
    let profit = data[end] - data[start];
    if (profit < 0) {
      start=end;
    }
    else if(profit > max) {
        finalStart = start;
        finalEnd = end;
        max = profit
    }
   end++;
  }
   console.log(max);
  console.log(finalStart + " " + finalEnd); 
  let date = [];
  async function addDate() {
    let count = 0;
    let timeData = await printData();
    let time = timeData["Time Series (Daily)"];
     for (const item in time) {
       date.push(item);
     }
    date = date.reverse();
  }
  
  if (max <= 0) {
    message.innerHTML = `<div class = "emptyMessage"> There is no way to make a positive profit. <\div>`;
  }
    
  else {
  addDate().then(timeData => {
      message.innerHTML = `<section><div style="display: inline;"> The best day to buy your stock is day </div> <div style="display: inline;" class="has-text-success">${date[finalStart]}</div></section><section><div style="display: inline;">The best day to sell your stock is day </div><div style="display: inline;" class="has-text-success">${date[finalEnd]}</div></section>`;
  
    });
}
  document.getElementById("calc").disabled = true;
});