<script lang="ts">
  import { currency } from "$lib/formatters";
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";

  let chart: Chart;
  let ctx: any;

  export let loanTerm: number;
  export let interestRate: number;
  export let loanAmount: number;
  export let monthlyMortgagePayment: number;
  export let sixMonth: { principal: number; interest: number };

  let interestData: number[] = [];
  let principalData: number[] = [];
  let balanceData: number[] = [];
  let labels: number[] = [];

  function partitionToYears(array: number[]) {
    return array.reduce((prev, cur, i) => {
      prev[Math.floor(i / 12)] = (prev[Math.floor(i / 12)] || 0) + cur;
      return prev;
    }, [] as number[]);
  }

  $: {
    interestData = [];
    principalData = [];
    balanceData = [];
    labels = [];
    let balance = loanAmount;
    for (let i = 0; i < loanTerm * 12; i++) {
      labels[i] = i;
      interestData[i] = (interestRate / 100 / 12) * balance;
      principalData[i] = monthlyMortgagePayment - interestData[i];
      balance -= principalData[i];
      balanceData[i] = balance;
    }
    sixMonth = { interest: interestData[6], principal: principalData[6] };
    if (chart) {
      chart.data.labels = [...Array(loanTerm)].map((_, i) => i + 1);
      chart.data.datasets[0].data = partitionToYears(principalData);
      chart.data.datasets[1].data = partitionToYears(interestData);
      chart.data.datasets[2].data = balanceData.filter((_, i) => i % 12 === 11);
      chart.update();
    }
  }

  onMount(() => {
    chart = new Chart(ctx, {
      data: {
        datasets: [
          {
            type: "bar",
            label: "Pricipal",
            data: principalData,
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "Interest",
            data: interestData,
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Balance",
            data: balanceData,
            yAxisID: "yBalance",
            pointStyle: false,
          },
        ],
        labels: labels,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            min: 0,
            title: {
              display: true,
              text: "Payments",
            },
          },
          yBalance: {
            position: "right",
            min: 0,
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: "Balance",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => "Year " + context[0].label,
              label: function (context) {
                return context.dataset.label + ": " + currency(context.parsed.y);
              },
            },
          },
        },
      },
    });
  });
</script>

<div style="height: 300px">
  <canvas bind:this={ctx} id="chart" />
</div>
