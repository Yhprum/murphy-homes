<script lang="ts">
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
      chart.data.datasets[0].data = principalData;
      chart.data.datasets[1].data = interestData;
      chart.data.datasets[2].data = balanceData;
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
          },
        ],
        labels: labels,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            min: 0,
          },
          yBalance: {
            position: "right",
            min: 0,
          },
        },
      },
    });
  });
</script>

<div style="height: 300px">
  <canvas bind:this={ctx} id="chart" />
</div>
