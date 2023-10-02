let numProcesses = 0;
let processesData = [];
let processIndex = 1;

function handleNumProcesses() {
  numProcesses = parseInt(document.getElementById('numProcesses').value);
  if (isNaN(numProcesses) || numProcesses <= 0) {
    alert('Invalid input. Please enter a valid number of processes.');
    return;
  }

  document.getElementById('numProcesses').disabled = true;
  document.getElementById('generateBtn').disabled = true;
  initializeProcessInputs();
}

function initializeProcessInputs() {
  const inputTableDiv = document.getElementById('inputTableDiv');
  inputTableDiv.innerHTML = '';

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Process</th>
      <th>Arrival Time</th>
      <th>Burst Time</th>
    </tr>
  `;

  for (let i = 0; i < numProcesses; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>P${processIndex}</td>
      <td><input type="number" id="arrivalTime${processIndex}" min="0" required></td>
      <td><input type="number" id="burstTime${processIndex}" min="1" required></td>
    `;
    table.appendChild(row);
    processIndex++;
  }

  inputTableDiv.appendChild(table);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Generate Scheduler';
  submitButton.addEventListener('click', generateScheduler);
  inputTableDiv.appendChild(submitButton);
}

function generateScheduler() {
  for (let i = 1; i <= numProcesses; i++) {
    const arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
    const burstTime = parseInt(document.getElementById(`burstTime${i}`).value);

    if (isNaN(arrivalTime) || isNaN(burstTime)) {
      alert('Invalid input. Please enter numeric values for arrival and burst times.');
      return;
    }

    processesData.push({ processId: i, arrivalTime, burstTime });
  }

  calculateAverageTime(processesData);
}

function calculateAverageTime(processesData) {
  // SJF CPU Scheduling Algorithm implementation
  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  // Sort processes based on arrival time
  processesData.sort((a, b) => a.arrivalTime - b.arrivalTime);

  // Calculate waiting times and turnaround times
  const waitingTimes = [];
  const turnaroundTimes = [];
  const ganttChart = [];

  while (processesData.length > 0) {
    let minBurstIndex = -1;
    let minBurstTime = Infinity;

    for (let i = 0; i < processesData.length; i++) {
      if (processesData[i].arrivalTime <= currentTime && processesData[i].burstTime < minBurstTime) {
        minBurstIndex = i;
        minBurstTime = processesData[i].burstTime;
      }
    }

    if (minBurstIndex === -1) {
      currentTime++;
      ganttChart.push('Idle');
    } else {
      const currentProcess = processesData.splice(minBurstIndex, 1)[0];
      const waitingTime = Math.max(0, currentTime - currentProcess.arrivalTime);
      totalWaitingTime += waitingTime;

      const turnaroundTime = waitingTime + currentProcess.burstTime;
      totalTurnaroundTime += turnaroundTime;

      waitingTimes.push(waitingTime);
      turnaroundTimes.push(turnaroundTime);

      for (let i = 0; i < currentProcess.burstTime; i++) {
        ganttChart.push(`P${currentProcess.processId}`);
      }

      currentTime += currentProcess.burstTime;
    }
  }

  const avgWaitTime = totalWaitingTime / numProcesses;
  const avgTurnaroundTime = totalTurnaroundTime / numProcesses;

  displayResults(processesData, waitingTimes, turnaroundTimes, avgWaitTime, avgTurnaroundTime, ganttChart);
}

function displayResults(processesData, waitingTimes, turnaroundTimes, avgWaitTime, avgTurnaroundTime, ganttChart) {
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>Process</th><th>Arrival Time (ms)</th><th>Burst Time (ms)</th><th>Waiting Time (ms)</th><th>Turnaround Time (ms)</th>';
  table.appendChild(headerRow);

  for (let i = 0; i < processesData.length; i++) {
    const { processId, arrivalTime, burstTime } = processesData[i];
    const waitingTime = waitingTimes[i];
    const turnaroundTime = turnaroundTimes[i];

    const row = document.createElement('tr');
    row.innerHTML = `<td>P${processId}</td><td>${arrivalTime}</td><td>${burstTime}</td><td>${waitingTime}</td><td>${turnaroundTime}</td>`;
    table.appendChild(row);
  }

 // outputDiv.appendChild(table);

  const avgWaitTimeDiv = document.createElement('div');
  avgWaitTimeDiv.innerHTML = `Average Waiting Time: ${avgWaitTime.toFixed(2)} ms`;
  outputDiv.appendChild(avgWaitTimeDiv);

  const avgTurnaroundTimeDiv = document.createElement('div');
  avgTurnaroundTimeDiv.innerHTML = `Average Turnaround Time: ${avgTurnaroundTime.toFixed(2)} ms`;
  outputDiv.appendChild(avgTurnaroundTimeDiv);

  const ganttChartDiv = document.createElement('div');
  ganttChartDiv.innerHTML = `Gantt Chart: ${ganttChart.join(' -> ')}`;
  outputDiv.appendChild(ganttChartDiv);

  // Remove the input table
  const inputTableDiv = document.getElementById('inputTableDiv');
  inputTableDiv.innerHTML = '';
}