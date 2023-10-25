<script lang="ts">
  import { Tabs, TabItem } from "flowbite-svelte";
  import Mortgage from "$lib/components/Mortgage.svelte";
  import RentVsBuy from "$lib/components/RentVsBuy.svelte";
  import { PMT } from "$lib/functions";

  let housePrice = 400000;
  let downPaymentPercent = 20;
  $: downPayment = housePrice * (downPaymentPercent / 100);
  $: loanAmount = housePrice * (1 - downPaymentPercent / 100);

  let interestRate = 7.5;
  let loanTerm = 30;
  $: monthlyMortgagePayment = PMT(interestRate / 100 / 12, loanTerm * 12, -loanAmount);

  let sixMonth = { principal: 0, interest: 0 };
</script>

<Tabs style="underline">
  <TabItem open title="Mortgage Calc">
    <Mortgage
      bind:housePrice
      bind:downPaymentPercent
      bind:downPayment
      bind:loanAmount
      bind:interestRate
      bind:loanTerm
      bind:monthlyMortgagePayment
      bind:sixMonth
    />
  </TabItem>
  <TabItem title="Rent vs Buy">
    <RentVsBuy
      bind:housePrice
      bind:downPaymentPercent
      bind:downPayment
      bind:interestRate
      bind:loanTerm
      bind:monthlyMortgagePayment
      bind:sixMonth
    />
  </TabItem>
</Tabs>
