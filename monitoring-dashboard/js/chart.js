// pre defined hour labels
const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  24,
];

const chartData = {
  labels: hours,
  datasets: [
    {
      label: 'Furnace On and Off times',
      backgroundColor: 'maroon',
      borderColor: 'maroon',
      data: [],
      stepped: true,
    },
  ],
};

function createCustomTooltip(context) {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip');

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.innerHTML = '<table></table>';
    document.body.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  let tooltipModel = context.tooltip;
  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  // Set Text
  if (tooltipModel.body) {
    let titleLines = tooltipModel.title || [];
    let bodyLines = tooltipModel.body.map(item => item.lines);

    let innerHtml = '<thead>';

    titleLines.forEach(function (title) {
      innerHtml += '<tr><th>' + title + '45zb </th></tr>';
    });
    innerHtml += '</thead><tbody>';

    bodyLines.forEach(function (body, i) {
      let colors = tooltipModel.labelColors[i];
      let style = 'background:' + colors.backgroundColor;
      style += '; border-color:' + colors.borderColor;
      style += '; border-width: 1px';
      let span = '<span style="' + style + '"></span>';
      innerHtml += '<tr><td>' + span + body + '</td></tr>';
    });
    innerHtml += '</tbody>';

    let tableRoot = tooltipEl.querySelector('table');
    tableRoot.innerHTML = innerHtml;
  }

  let position = context.chart.canvas.getBoundingClientRect();
  let bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

  // Display, position, and set styles for font
  tooltipEl.style.background = 'white';
  tooltipEl.style.border = 'solid 1px black';
  tooltipEl.style.borderRadius = '5px';
  tooltipEl.style.opacity = 1;
  tooltipEl.style.position = 'absolute';
  tooltipEl.style.marginTop = '5px';
  tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
  tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
  tooltipEl.style.font = bodyFont.string;
  tooltipEl.style.padding = '2px';
  tooltipEl.style.pointerEvents = 'none';
}

const config = {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      ticks: {
        precision: 0, // removes the decimals between y axis 0 (Off) and 1 (On)
      },
    },
    scales: {
      y: {
        ticks: {
          color: ['red', 'blue'], // on === blue - off === red
          callback: function (value) {
            // change y axis labels from 0 and 1 to Off and On
            return value === 0 ? 'Off' : 'On';
          },
        },
      },
      x: {
        title: {
          display: true,
          text: '',
          color: 'maroon',
          font: {
            size: '20px',
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
        external: createCustomTooltip,
      },
    },
  },
};

const createChart = (data = []) => {
  if (data.length) {
    // set the x and y to make the chart have a dynamic x axis
    const actions = data.map(({ action = '', hour = '' }) => ({
      x: hour,
      y: action,
    }));

    // only set the y points with a predefined x axis
    // const actions = furnaceData.map(({ action = '' }) => action);

    // set the chart data to the configured response data (actions)
    chartData.datasets[0].data = actions;

    // set the x axis title to the day, month and year
    config.options.scales.x.title.text = `${data[0].day} /  ${data[0].month} / ${data[0].year}`;
  }

  // create the chart here so it waits for the request to finish with updated data
  new Chart(document.querySelector('#furnace-chart'), config);
};

// this is in a function because we're using async/await
const getFurnaceData = async () => {
  try {
    const result = await fetch('http://73.238.37.29:8563', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const furnaceData = await result.json();

    console.log('furnaceData', furnaceData);

    createChart(furnaceData);
  } catch (err) {
    console.error(err);
    createChart();
  }
};

getFurnaceData();
