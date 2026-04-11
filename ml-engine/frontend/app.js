document.addEventListener('DOMContentLoaded', () => {
    // Map numerical months to names
    const monthNames = {
        1: 'JAN', 2: 'FEB', 3: 'MAR', 4: 'APR', 5: 'MAY', 6: 'JUN',
        7: 'JUL', 8: 'AUG', 9: 'SEP', 10: 'OCT', 11: 'NOV', 12: 'DEC'
    };

    // Fetch the ML output CSV
    fetch('../csv/2026_overflow_predictions.csv')
        .then(response => {
            if(!response.ok) throw new Error("Could not load CSV file. Ensure you are running python -m http.server");
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    processDashboardData(results.data);
                }
            });
        })
        .catch(err => {
            document.getElementById('overall-status').innerText = "Error Loading Data";
            document.getElementById('overall-status').style.color = "var(--danger)";
            console.error(err);
        });

    function processDashboardData(data) {
        let totalOverflowDays = 0;
        let highRiskMonthsSet = new Set();
        let overflowDataByMonth = {};

        // Arrays for Chart.js
        let chartLabels = [];
        let chartProbabilities = [];

        // Parse rows
        data.forEach(row => {
            if(!row.Date) return;

            // Chart data
            // Format date string beautifully (e.g. "Sep 15")
            let dateObj = new Date(row.Date);
            let displayDate = `${monthNames[dateObj.getMonth() + 1]} ${dateObj.getDate()}`;
            chartLabels.push(displayDate);
            chartProbabilities.push(row['Overflow_Probability_%']);

            // Range extraction logic
            if (row.Overflow_Prediction === 1) {
                totalOverflowDays++;
                let monthNum = row.Month;
                highRiskMonthsSet.add(monthNum);

                if (!overflowDataByMonth[monthNum]) {
                    overflowDataByMonth[monthNum] = [];
                }
                overflowDataByMonth[monthNum].push(dateObj);
            }
        });

        // 1. Update Summary Cards
        document.getElementById('total-days').innerText = totalOverflowDays;
        
        let sortedMonths = Array.from(highRiskMonthsSet).sort((a,b)=>a-b);
        let monthString = sortedMonths.map(m => monthNames[m]).join(", ");
        document.getElementById('high-risk-months').innerText = monthString || "None";
        
        let statusEl = document.getElementById('overall-status');
        if (totalOverflowDays > 0) {
            statusEl.innerText = "🚨 High Risk Detected";
            statusEl.style.color = "var(--danger)";
        } else {
            statusEl.innerText = "✅ Safe Zone";
            statusEl.style.color = "#4ade80";
        }

        // 2. Build Range Cards
        const grid = document.getElementById('month-grid');
        grid.innerHTML = "";

        if(sortedMonths.length === 0) {
            grid.innerHTML = "<p>No critical date ranges detected for 2026.</p>";
        } else {
            sortedMonths.forEach(mNum => {
                let dates = overflowDataByMonth[mNum];
                dates.sort((a,b) => a - b);

                // Group into continuous ranges
                let ranges = [];
                let start_date = dates[0];
                let prev_date = start_date;

                for(let i = 1; i < dates.length; i++) {
                    let curr_date = dates[i];
                    let diffTime = Math.abs(curr_date - prev_date);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                    if (diffDays === 1) {
                        prev_date = curr_date;
                    } else {
                        ranges.push(formatRange(start_date, prev_date));
                        start_date = curr_date;
                        prev_date = curr_date;
                    }
                }
                ranges.push(formatRange(start_date, prev_date));

                // Create DOM Element
                let card = document.createElement('div');
                card.className = "glass-card month-card fade-in";
                
                let rangeHTML = ranges.map(r => `<li>${r}</li>`).join("");

                card.innerHTML = `
                    <div class="risk-badge">${dates.length} Days Risk</div>
                    <div class="month-name">${monthNames[mNum]}</div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Date Ranges:</p>
                    <ul class="date-ranges">
                        ${rangeHTML}
                    </ul>
                `;
                grid.appendChild(card);
            });
        }

        // 3. Render Chart
        renderChart(chartLabels, chartProbabilities);
    }

    function formatRange(start, end) {
        let options = { month: 'short', day: '2-digit' };
        let s = start.toLocaleDateString('en-US', options);
        let e = end.toLocaleDateString('en-US', options);
        return s === e ? s : `${s} to ${e}`;
    }

    function renderChart(labels, dataPoints) {
        const ctx = document.getElementById('probabilityChart').getContext('2d');
        
        // Gradient for line
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(56, 189, 248, 0.8)");
        gradient.addColorStop(1, "rgba(56, 189, 248, 0.0)");

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Overflow Probability (%)',
                    data: dataPoints,
                    borderColor: '#38bdf8',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0', font: { family: 'Outfit' } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { family: 'Outfit', size: 14 },
                        bodyFont: { family: 'Outfit', size: 14 },
                        padding: 12,
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                        ticks: { color: '#94a3b8', font: { family: 'Outfit' }, maxTicksLimit: 12 }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                        ticks: { 
                            color: '#94a3b8', 
                            font: { family: 'Outfit' },
                            stepSize: 20,
                            callback: function(value) { return value + '%' }
                        }
                    }
                }
            }
        });
    }
});
