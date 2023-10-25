<script lang="ts">
  import { currency, percent } from "$lib/formatters";
  import { RATE } from "$lib/functions";
  import { Heading, Input, Label, Select } from "flowbite-svelte";

  // export let mortgage;
  export let sixMonth: { principal: number; interest: number };

  // Overall Inputs
  let moneyCost = 3;
  let inflation = 3;
  let localPropertyTaxRate = 1.5;
  let marginalPersonalIncomeTaxRate = 22;
  let years = 5;
  let buyCommission = 0;
  let sellCommission = 5.8;
  let saltDeductions = 4500;
  let deductions = 1000;
  let filingStatus = "single";

  // Home Rental Inputs
  let rent = 2500;
  let utilitiesRent = 100;
  let rentersInsurance = 25;
  $: monthlyRentEstimate = rent + utilitiesRent + rentersInsurance;
  $: securityDeposit = rent;
  $: annualRentEstimate = monthlyRentEstimate * 12 + securityDeposit * (moneyCost / 100);
  $: totalRentEstimate =
    (monthlyRentEstimate * 12 * ((1 + inflation / 100) ** years - 1)) / (inflation / 100) +
    securityDeposit * (1 + moneyCost / 100) ** years -
    securityDeposit;

  // Home Ownership Inputs
  export let housePrice: number;
  export let downPaymentPercent: number;
  export let downPayment: number;

  export let interestRate: number;
  export let loanTerm: number;
  export let monthlyMortgagePayment: number;
  // Ownership Utilites/Other Recurring
  let electricity = 100;
  let gas = 50;
  let internet = 50;
  let sewage = 20;
  let water = 150;
  let trash = 25;
  let hoa = 100;
  let homeownersInsurance = 100;
  let mainenance = 100;
  let other = 0;
  // prettier-ignore
  $: monthlyOwnRecurring = electricity + gas + internet + sewage + water + trash + hoa + homeownersInsurance + mainenance + other;
  // One-Time Items
  let closingCost = 6000;
  let homeImprovements = 10000;
  let sellingCost = 2000;
  $: propertyTax = (housePrice * localPropertyTaxRate) / 100 / 12;
  $: monthlyOwnEstimate = monthlyOwnRecurring + propertyTax + monthlyMortgagePayment;
  $: annualOwnEstimate =
    (monthlyOwnEstimate - sixMonth.principal - ownDeductionTotal / 12) * 12 +
    downPayment * (moneyCost / 100);
  $: totalOwnEstimate =
    monthlyMortgagePayment * (years * 12) +
    ((monthlyOwnRecurring + propertyTax - sixMonth.principal - ownDeductionTotal / 12) *
      12 *
      ((1 + inflation / 100) ** years - 1)) /
      (inflation / 100) +
    downPayment * (1 + moneyCost / 100) ** years -
    downPayment;
  $: console.log(monthlyOwnEstimate, sixMonth.principal, ownDeductionTotal / -12);

  // Deductible Expenses Estimate
  $: mortgageInterest = sixMonth.interest * 12;
  $: annualPropertyTax = housePrice * (localPropertyTaxRate / 100);
  $: deductibleTotal = mortgageInterest + annualPropertyTax + saltDeductions + deductions;

  let standardDeduction = 13850;
  $: expensesMinusStd = deductibleTotal - standardDeduction;
  $: saltCapAdj = Math.min(10000 - annualPropertyTax - saltDeductions, 0);
  $: expensesMinusStdAdj =
    expensesMinusStd + saltCapAdj > standardDeduction ? expensesMinusStd + saltCapAdj : 0;
  $: ownDeductionTotal =
    mortgageInterest + annualPropertyTax > expensesMinusStdAdj
      ? expensesMinusStdAdj * (marginalPersonalIncomeTaxRate / 100)
      : (mortgageInterest + annualPropertyTax) * (marginalPersonalIncomeTaxRate / 100);

  // Results
  $: ownMinusRent = totalOwnEstimate - totalRentEstimate;
  $: breakevenTotal =
    ownMinusRent +
    closingCost +
    homeImprovements +
    housePrice * (sellCommission / 100) +
    sellingCost +
    0;
  $: breakevenCompound = RATE(years, undefined, housePrice * -1, housePrice + breakevenTotal);
</script>

<div class="max-w-xl mx-auto py-12 md:max-w-4xl flex flex-row">
  <div class="flex flex-col">
    <Heading tag="h3">Inputs</Heading>
    <Heading tag="h5">Overall Inputs</Heading>
    <Label class="block">
      <span>Estimated Cost of Money (1-5 years)</span>
      <Input type="number" class="mt-1 block w-full" step="0.01" bind:value={moneyCost}>
        <span slot="right">%</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Estimated Inflation Rate (1-5 years)</span>
      <Input type="number" class="mt-1 block w-full" step="0.01" bind:value={inflation}>
        <span slot="right">%</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Local Property Tax Rate</span>
      <Input type="number" class="mt-1 block w-full" step="0.01" bind:value={localPropertyTaxRate}>
        <span slot="right">%</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Marginal Personal Income Tax Rate</span>
      <Input
        type="number"
        class="mt-1 block w-full"
        step="0.01"
        bind:value={marginalPersonalIncomeTaxRate}
      >
        <span slot="right">%</span>
      </Input>
    </Label>
    <Label class="block">
      <span class="font-bold">Years to use for multi-year assessment</span>
      <Input type="number" class="mt-1 block w-full" bind:value={years} />
    </Label>
    <Label class="block">
      <span>Real estate commission rate - Buying</span>
      <Input type="number" class="mt-1 block w-full" bind:value={buyCommission}>
        <span slot="right">%</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Real estate commission rate - Selling</span>
      <Input type="number" class="mt-1 block w-full" bind:value={sellCommission}>
        <span slot="right">%</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Estimated State & Local Income Taxes - itemized federal deductions (4)</span>
      <Input type="number" class="mt-1 block w-full" bind:value={saltDeductions}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Other itemized tax deductions (4)</span>
      <Input type="number" class="mt-1 block w-full" bind:value={deductions}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Tax Filing Status</span>
      <Select
        class="mt-1 block w-full"
        items={[
          { value: "single", name: "Single" },
          { value: "married", name: "Married" },
        ]}
        placeholder=""
        bind:value={filingStatus}
      />
    </Label>

    <Heading tag="h5">Home Rental Inputs</Heading>
    <p>All costs are monthly (divide annual costs by 12)</p>
    <Label class="block">
      <span>Monthly Rent</span>
      <Input type="number" class="mt-1 block w-full" bind:value={rent}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Monthly utilities/services paid by renter (1)</span>
      <Input type="number" class="mt-1 block w-full" bind:value={utilitiesRent}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Renter's Insurance</span>
      <Input type="number" class="mt-1 block w-full" bind:value={rentersInsurance}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Security Deposits/last month's rent</span>
      <Input type="number" class="mt-1 block w-full" bind:value={securityDeposit}>
        <span slot="left">$</span>
      </Input>
    </Label>

    <Heading tag="h5">Home Ownership Inputs</Heading>
    <Label class="block">
      <span>Home Price</span>
      <Input type="number" class="mt-1 block w-full" bind:value={housePrice}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Downpayment Percent</span>
      <Input type="number" class="mt-1 block w-full" bind:value={downPaymentPercent}>
        <span slot="right">%</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Mortgage Interest Rate</span>
      <Input type="number" class="mt-1 block w-full" bind:value={interestRate}>
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
    <p>Utilities and other recurring costs (1,2)</p>
    <p>All costs are monthly (divide annual costs by 12)</p>
    <Label class="block">
      <span>Electricity</span>
      <Input type="number" class="mt-1 block w-full" bind:value={electricity}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Gas</span>
      <Input type="number" class="mt-1 block w-full" bind:value={gas}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Internet/streaming/cable</span>
      <Input type="number" class="mt-1 block w-full" bind:value={internet}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Sewage</span>
      <Input type="number" class="mt-1 block w-full" bind:value={sewage}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Water</span>
      <Input type="number" class="mt-1 block w-full" bind:value={water}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Trash collection</span>
      <Input type="number" class="mt-1 block w-full" bind:value={trash}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Homeowner's Assoc Fees (HOA)</span>
      <Input type="number" class="mt-1 block w-full" bind:value={hoa}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Homeowner's insurance</span>
      <Input type="number" class="mt-1 block w-full" bind:value={homeownersInsurance}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Home maintenance costs</span>
      <Input type="number" class="mt-1 block w-full" bind:value={mainenance}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Other Expenses</span>
      <Input type="number" class="mt-1 block w-full" bind:value={other}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <p>One-Time or Episodic Items related to Home Purchase</p>
    <Label class="block">
      <span>Estimated Home purchase closing costs - mortgage, escrow, etc.</span>
      <Input type="number" class="mt-1 block w-full" bind:value={closingCost}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Estimated Home improvements following purchase</span>
      <Input type="number" class="mt-1 block w-full" bind:value={homeImprovements}>
        <span slot="left">$</span>
      </Input>
    </Label>
    <Label class="block">
      <span>Estimated Cost of selling - staging, repairs, etc.</span>
      <Input type="number" class="mt-1 block w-full" bind:value={sellingCost}>
        <span slot="left">$</span>
      </Input>
    </Label>
  </div>
  <div class="flex flex-col">
    <Heading tag="h3">Results</Heading>
    <table>
      <thead>
        <tr>
          <th />
          <th>Rent</th>
          <th>Own</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monthly Cash Payments</td>
          <td>{currency(monthlyRentEstimate)}</td>
          <td>{currency(monthlyOwnEstimate)}</td>
        </tr>
        <tr>
          <td>Annual Cost Estimate Year 1</td>
          <td>{currency(annualRentEstimate)}</td>
          <td>{currency(annualOwnEstimate)}</td>
        </tr>
        <tr>
          <td>Total Annual Cost Estimate Over {years} years</td>
          <td>{currency(totalRentEstimate)}</td>
          <td>{currency(totalOwnEstimate)}</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Estimated Appreciation Required to Breakeven</th>
          <th>{years} years</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ownership Cost minus Rent Cost</td>
          <td>{currency(ownMinusRent)}</td>
        </tr>
        <tr>
          <td>Estimated Home purchase closing costs</td>
          <td>{currency(closingCost)}</td>
        </tr>
        <tr>
          <td>Estimated Home improvements following purchase</td>
          <td>{currency(homeImprovements)}</td>
        </tr>
        <tr>
          <td>Estimated Commission upon selling home</td>
          <td>{currency(housePrice * (sellCommission / 100))}</td>
        </tr>
        <tr>
          <td>Estimated Cost of selling - staging, repairs, etc.</td>
          <td>{currency(sellingCost)}</td>
        </tr>
        <tr>
          <td>Other Costs</td>
          <td>{currency(0)}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td>
            {currency(breakevenTotal)}
          </td>
        </tr>
        <tr>
          <td>% of home price</td>
          <td>{percent(breakevenTotal / housePrice)}</td>
        </tr>
        <tr>
          <td>Average compound appreciation rate to breakeven</td>
          <td>{percent(breakevenCompound)}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
