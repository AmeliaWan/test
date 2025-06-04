// let hourData = [], dayData = [], monthData = [];
// let dayDataReady = false;
// const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// function getWasteType() {
//   return document.getElementById('wasteType').value;
// }

// function updateChart() {
//   const month = document.getElementById('monthSlider').value;
//   const day = document.getElementById('daySlider').value;
//   const wasteType = getWasteType();

//   const showDaySlider = (wasteType === 'temp');
//   const showMonthSlider = (wasteType === 'temp' || wasteType === 'monthly_compare');
//   document.getElementById('daySliderRow').style.display = showDaySlider ? 'flex' : 'none';
//   document.getElementById('monthSliderRow').style.display = showMonthSlider ? 'flex' : 'none';

//   if (wasteType === 'heating_waste' || wasteType === 'cooling_waste') {
//     const months = monthData.map(row => {
//       const parts = row.Datetime.split("-");
//       return monthNamesFull[parseInt(parts[1], 10) - 1];
//     });

//     const y = monthData.map(row =>
//       parseFloat(wasteType === 'heating_waste' ? row['heating_waste'] : row['cooling_waste'])
//     );

//     Plotly.newPlot('chart', [{
//       x: months,
//       y: y,
//       type: 'scatter',
//       mode: 'lines+markers',
//       name: wasteType === 'heating_waste' ? 'Heating Waste (kWh)' : 'Cooling Waste (kWh)'
//     }], {
//       title: wasteType === 'heating_waste' ? 'Monthly Heating Waste (kWh)' : 'Monthly Cooling Waste (kWh)',
//       xaxis: { title: 'Month' },
//       yaxis: { title: 'Waste (kWh)' }
//     });
//     return;
//   }

//   if (wasteType === 'monthly_compare') {
//     const filtered = dayData.filter(row => new Date(row.datetime).getMonth() + 1 == month);
//     const days = filtered.map(row => new Date(row.datetime).getDate());
//     const energy = filtered.map(row => parseFloat(row.energy_waste_kWh || 0));
//     const money = filtered.map(row => parseFloat(row.money_waste_AUD || 0));

//     console.log("energy array:", energy);

//     Plotly.newPlot('chart', [
//       {
//         x: days,
//         y: energy,
//         name: 'Energy Waste (kWh)',
//         type: 'scatter',
//         mode: 'lines+markers',
//         yaxis: 'y',
//         line: { color: 'blue' }
//       },
//       {
//         x: days,
//         y: money,
//         name: 'Money Waste (AUD)',
//         type: 'scatter',
//         mode: 'lines+markers',
//         yaxis: 'y2',
//         line: { color: 'orange' }
//       }
//     ], {
//       title: `Daily Waste in ${monthNamesFull[month - 1]}`,
//       xaxis: { title: 'Day of Month' },
//       yaxis: { title: 'Energy Waste (kWh)', side: 'left' },
//       yaxis2: { title: 'Money Waste (AUD)', overlaying: 'y', side: 'right' }
//     });
//     return;
//   }

//   const dateStr = `2019-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//   const filtered = hourData.filter(row => row.datetime.startsWith(dateStr));
//   const x = filtered.map(row => row.datetime.split(' ')[1]);
//   const y1 = filtered.map(row => parseFloat(row["indoor temp"]));
//   const y2 = filtered.map(row => parseFloat(row["outdoor temp"]));

//   Plotly.newPlot('chart', [
//     { x, y: y1, name: 'Indoor Temperature', type: 'scatter' },
//     { x, y: y2, name: 'Outdoor Temperature', type: 'scatter' },
//     { x, y: Array(x.length).fill(22), mode: 'lines', name: 'Comfort Min (22°C)', line: { dash: 'dot', color: 'green' } },
//     { x, y: Array(x.length).fill(26), mode: 'lines', name: 'Comfort Max (26°C)', line: { dash: 'dot', color: 'red' } }
//   ], {
//     title: `Temperature on ${dateStr}`,
//     xaxis: { title: 'Time' },
//     yaxis: { title: 'Temp °C' }
//   });
// }

// Papa.parse("average_hour.csv", {
//   download: true,
//   header: true,
//   complete: function(results) {
//     hourData = results.data.filter(row => row.datetime);
//     updateChart();
//   }
// });

// Papa.parse("average_day.csv", {
//   download: true,
//   header: true,
//   complete: function(results) {
//     dayData = results.data.filter(row => row.datetime);
//     dayDataReady = true;
//     updateChart();
//   }
// });

// Papa.parse("average_waste_month.csv", {
//   download: true,
//   header: true,
//   complete: function(results) {
//     monthData = results.data.filter(row => row.Datetime);
//     updateChart();
//   }
// });

// document.getElementById('monthSlider').addEventListener('input', (e) => {
//   document.getElementById('monthValue').textContent = e.target.value;
//   updateChart();
// });

// document.getElementById('daySlider').addEventListener('input', (e) => {
//   document.getElementById('dayValue').textContent = e.target.value;
//   updateChart();
// });

// document.getElementById('wasteType').addEventListener('change', updateChart);

let hourData = [], dayData = [], monthData = [];
const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

function getWasteType() {
  return document.getElementById('wasteType').value;
}

function updateChart() {
  const month = document.getElementById('monthSlider').value;
  const day = document.getElementById('daySlider').value;
  const wasteType = getWasteType();

  document.getElementById('daySliderRow').style.display = (wasteType === 'temp') ? 'flex' : 'none';
  document.getElementById('monthSliderRow').style.display = (['temp', 'energy_daily', 'money_daily'].includes(wasteType)) ? 'flex' : 'none';

  if (wasteType === 'energy_daily') {
    const filtered = dayData.filter(row => new Date(row.datetime).getMonth() + 1 == month);
    const days = filtered.map(row => new Date(row.datetime).getDate());
    const energy = filtered.map(row => parseFloat(row.energy_waste_kWh || 0));

    Plotly.newPlot('chart', [{
      x: days,
      y: energy,
      name: 'Energy Waste (kWh)',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: 'blue' }
    }], {
      title: `Daily Energy Waste in ${monthNames[month - 1]}`,
      xaxis: { title: 'Day of Month' },
      yaxis: { title: 'Energy Waste (kWh)' }
    });
    return;
  }

  if (wasteType === 'money_daily') {
    const filtered = dayData.filter(row => new Date(row.datetime).getMonth() + 1 == month);
    const days = filtered.map(row => new Date(row.datetime).getDate());
    const money = filtered.map(row => parseFloat(row.money_waste_AUD || 0));

    Plotly.newPlot('chart', [{
      x: days,
      y: money,
      name: 'Money Waste (AUD)',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: 'orange' }
    }], {
      title: `Daily Money Waste in ${monthNames[month - 1]}`,
      xaxis: { title: 'Day of Month' },
      yaxis: { title: 'Money Waste (AUD)' }
    });
    return;
  }

  if (wasteType === 'heating_waste' || wasteType === 'cooling_waste') {
    const months = monthData.map(row => {
      const parts = row.Datetime.split("-");
      return monthNames[parseInt(parts[1], 10) - 1];
    });
    const y = monthData.map(row =>
      parseFloat(wasteType === 'heating_waste' ? row['heating_waste'] : row['cooling_waste'])
    );

    Plotly.newPlot('chart', [{
      x: months,
      y: y,
      type: 'scatter',
      mode: 'lines+markers',
      name: wasteType === 'heating_waste' ? 'Heating Waste (kWh)' : 'Cooling Waste (kWh)'
    }], {
      title: wasteType === 'heating_waste' ? 'Monthly Heating Waste (kWh)' : 'Monthly Cooling Waste (kWh)',
      xaxis: { title: 'Month' },
      yaxis: { title: 'Waste (kWh)' }
    });
    return;
  }

  if (wasteType === 'temp') {
    const dateStr = `2019-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const filtered = hourData.filter(row => row.datetime.startsWith(dateStr));
    const x = filtered.map(row => row.datetime.split(' ')[1]);
    const y1 = filtered.map(row => parseFloat(row["indoor temp"]));
    const y2 = filtered.map(row => parseFloat(row["outdoor temp"]));

    Plotly.newPlot('chart', [
      { x, y: y1, name: 'Indoor Temp', type: 'scatter' },
      { x, y: y2, name: 'Outdoor Temp', type: 'scatter' },
      { x, y: Array(x.length).fill(22), mode: 'lines', name: 'Comfort Min (22°C)', line: { dash: 'dot', color: 'green' } },
      { x, y: Array(x.length).fill(26), mode: 'lines', name: 'Comfort Max (26°C)', line: { dash: 'dot', color: 'red' } }
    ], {
      title: `Temperature on ${dateStr}`,
      xaxis: { title: 'Time' },
      yaxis: { title: 'Temp (°C)' }
    });
    return;
  }
}

// === Load Data ===
Papa.parse("average_hour.csv", {
  download: true,
  header: true,
  complete: function(results) {
    hourData = results.data.filter(row => row.datetime);
    updateChart();
  }
});

Papa.parse("average_day.csv", {
  download: true,
  header: true,
  complete: function(results) {
    dayData = results.data.filter(row => row.datetime);
    updateChart();
  }
});

Papa.parse("average_waste_month.csv", {
  download: true,
  header: true,
  complete: function(results) {
    monthData = results.data.filter(row => row.Datetime);
    updateChart();
  }
});

// === Event Listeners ===
document.getElementById('monthSlider').addEventListener('input', (e) => {
  document.getElementById('monthValue').textContent = e.target.value;
  updateChart();
});

document.getElementById('daySlider').addEventListener('input', (e) => {
  document.getElementById('dayValue').textContent = e.target.value;
  updateChart();
});

document.getElementById('wasteType').addEventListener('change', updateChart);