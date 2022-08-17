const getDayData = async day => {
  console.log('day', day);

  // make a POST request to the server with the day data and
  // that should return the updated list for that day

  // const response = await fetch('http://73.238.37.29:8563', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(day),
  // });
  // const data = await response.json();
  // console.log('data', data)
};

const calendar = new VanillaCalendar('#calendar', {
  // options
  actions: {
    clickDay: async (e, dates) => {
      const dayValues = dates[0].split('-');
      const dayObj = {
        day: dayValues[0],
        month: dayValues[1],
        year: dayValues[2],
      };

      await getDayData(dayObj);
    },
  },
});

calendar.init();
