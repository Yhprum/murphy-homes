<script lang="ts">
  import { currency } from "$lib/formatters";
  import { Input, Label, Select } from "flowbite-svelte";
  import MortgageChart from "./MortgageChart.svelte";

  export let housePrice: number;
  export let downPaymentPercent: number;
  export let downPayment: number;
  export let loanAmount: number;

  export let interestRate: number;
  export let loanTerm: number;
  export let monthlyMortgagePayment: number;

  export let sixMonth: { principal: number; interest: number };
</script>

<div class="max-w-xl mx-auto py-12 divide-y md:max-w-4xl">
  <MortgageChart
    bind:loanTerm
    bind:interestRate
    bind:loanAmount
    bind:monthlyMortgagePayment
    bind:sixMonth
  />
  <div class="flex flex-row">
    <div class="flex-col">
      <Label class="block">
        <span>House Price</span>
        <Input type="number" class="mt-1 block w-full" bind:value={housePrice}>
          <span slot="left">$</span>
        </Input>
      </Label>
      <Label>
        <span>Down Payment</span>
        <Input
          class="mt-1 block w-full"
          type="number"
          name="downPayment"
          bind:value={downPaymentPercent}
        >
          <span slot="right">%</span>
        </Input>
        {#if housePrice && downPaymentPercent}
          <span>{currency(downPayment)} down payment</span>
        {/if}
      </Label>
      <Label class="block">
        <span>Loan Amount</span>
        <Input class="mt-1 block w-full" value={loanAmount || null} disabled>
          <span slot="left">$</span>
        </Input>
      </Label>
      <Label class="block">
        <span>Interest Rate</span>
        <Input type="number" step=".1" class="mt-1 block w-full" bind:value={interestRate}>
          <span slot="right">%</span>
        </Input>
      </Label>
      <Label class="block">
        <span>Loan Term</span>
        <Select class="mt-1 block w-full" placeholder="" bind:value={loanTerm}>
          <option value={30}>30 Years</option>
          <option value={20}>20 Years</option>
          <option value={15}>15 Years</option>
          <option value={10}>10 Years</option>
        </Select>
      </Label>
    </div>
    <div class="flex-col">
      <p>Monthly Payment</p>
      <p>{currency(monthlyMortgagePayment)}</p>
      <p>Total Payment</p>
      <p>{currency(monthlyMortgagePayment * loanTerm * 12)}</p>
      <p>Total Principal</p>
      <p>{currency(loanAmount)}</p>
      <p>Total Interest</p>
      <p>{currency(monthlyMortgagePayment * loanTerm * 12 - loanAmount)}</p>
    </div>
  </div>
</div>
