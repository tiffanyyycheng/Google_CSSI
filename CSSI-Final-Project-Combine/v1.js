const inputPrices = document.querySelector("#stockInput");
const submitButton = document.querySelector("#submit");
let data = [];
const calculateButton = document.querySelector("#calc");
const message = document.querySelector(".emptyMessage");

function checkData(strData) {
  for (let i = 0; i < strData.length; i++) {
    if (strData[i].includes(" ") || strData[i].includes(","))
      return false;
  }
  return true;
}

function getData(data) {
  let chartData = [];
  let date = '';
  for (let i = 0; i < data.length; i++) {
    let index = i + 1;
    date = '' + index;
    chartData.push([date, data[i]]);
  }
  console.table(chartData);
  return chartData;

}
submitButton.addEventListener("click", e => {
  calculateButton.classList.remove("hidden");
  const strData = inputPrices.value.split(', '); // create a string array
 
  if (checkData(strData) === false) {
    alert("Please enter your input in the correct format");
  }
    else if(checkData && strData.length<2) alert("Please enter a valid array of stock prices. \nYour input should have more than 1 stock prices")
  else {
    for (let i = 0; i < strData.length; i++) {
      //convert string array into number
      //push the in the data
      data.push(Number(strData[i]));
    }


    // create a data set on our data
    var dataSet = anychart.data.set(getData(data));

    // map data for the line chart,
    // take x from the zero column and value from the first column
    var seriesData = dataSet.mapAs({ x: 0, value: 1 });

    // create a line chart
    var chart = anychart.line();

    // configure the chart title text settings
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
    var xtitle = chart.xAxis().title();
    xtitle.text('Day');
    xtitle.fontSize(18);
    xtitle.fontFamily("Impact, Haettenschweiler, 'Arial Narrow', sans-serif");

    var xlabels = chart.xAxis().labels();
    xlabels.fontFamily("Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif");
    xlabels.fontSize(18);
    xlabels.fontColor("white");
    xlabels.fontWeight("bold");
    xlabels.useHtml(false);

    var ylabels = chart.yAxis().labels();
    ylabels.fontFamily("Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif");
    ylabels.fontSize(18);
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
    document.getElementById("submit").disabled = true;
  }
});

calculateButton.addEventListener("click", e => {
  let max = 0;
  let start = 0;
  let end = 1;
  let finalStart = 0;
  let finalEnd = 0;
  while (start <= end && (start < data.length || end < data.length)) {
    let profit = data[end] - data[start];
    if (profit < 0) start++;
    else if (end < data.length) {
      if (profit > max) {
        finalStart = start;
        finalEnd = end;
        max = profit
      }
      end++;
    }
    else {
      while (start < data.length) {
        profit = data[end] - data[start];
        start++;
        if (profit > max) {
          finalStart = start;
          finalEnd = end;
          max = profit
        }
      }
    }
    console.log(finalStart + " " + finalEnd);
    console.log(max + " " + profit);
  }
  console.log(max);
  if (max <= 0) {
    message.innerHTML = `<div class = "emptyMessage"> There is no way to make a positive profit. <\div>`;
  }
  else {
    message.innerHTML = `<section><div style="display: inline;"> The best day to buy your stock is day </div> <div style="display: inline;" class="has-text-success">${Math.round(finalStart + 1)}</div></section><section><div style="display: inline;">The best day to sell your stock is day </div><div style="display: inline;" class="has-text-success">${Math.round(finalEnd + 1)}</div></section>`;;
  }
  document.getElementById("calc").disabled = true;
})