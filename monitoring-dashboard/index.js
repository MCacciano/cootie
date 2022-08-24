const config = {
  type: 'line',
  data: {
    labels: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24,
    ],
    datasets: [
      {
        label: 'Furnace On and Off times',
        backgroundColor: 'maroon',
        borderColor: 'maroon',
        data: [],
      },
    ],
  },
  options: {
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          color: ['red', 'green'], // on === blue - off === red
          callback: function (value) {
            // change y axis labels from 0 and 1 to Off and On
            return value === 0 ? 'Off' : 'On';
          },
        },
      },
      x: {
        ticks: {
          beginAtZero: true,
          stepSize: 0.1,
          autoSkip: false,
        },
        title: {
          display: true,
          text: 'PLACEHOLDER FOR X AXIS LABEL',
          color: 'maroon',
          font: {
            size: '20px',
          },
        },
      },
    },
  },
};

// we create our chart on render to show it blank on the DOM
// instead of creating the first chart when we click a day
const chart = new Chart(document.querySelector('#furnace-chart'), config);

// fetch the furnace data from the server
async function fetchFurnaceData(data = null) {
  if (!data) return null;

  try {
    const response = await fetch('http://73.238.37.29:8563/qdb.php', {
      method: 'POST',
      body: data,
    });

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function updateChart(data = []) {
  if (data.length) {
    // grabbing the x and y values separately so we can set the xValues
    // to override the predefined 0 - 24 hour labels
    const yValues = data.map(({ action = '' }) => action);
    const xValues = data.map(({ hour = '', minute = '', second = '' }) => {
      return (parseInt(hour) + parseInt(minute) / 60 + parseInt(second) / 3600).toFixed(
        1
      );
    });

    // set the chart x axis data to response data
    chart.config.data.datasets[0].data = yValues;
    // we reset the labels because we're pre-defining them with 0 - 24 labels when no data is present
    chart.config.data.labels = xValues;

    chart.update();
  }
}

// both args come from the clickDay action in calendar
async function handleOnClickDay(e = null, dates = []) {
  // dates is an array of strings like so - "2022-01-31"
  const dayData = dates[0].split('-');

  const formData = new FormData();

  formData.append('day', dayData[2]);
  formData.append('month', dayData[1]);
  formData.append('year', dayData[0]);

  try {
    const furnaceData = await fetchFurnaceData(formData);

    console.log('furnaceData', furnaceData);

    updateChart(furnaceData);
  } catch (err) {
    console.error(err);
  }
}

const calendar = new VanillaCalendar('#calendar', {
  actions: { clickDay: handleOnClickDay },
});

calendar.init();
