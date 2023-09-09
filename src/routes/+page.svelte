<script lang="ts">
  import { currency } from "$lib/formatters";
  import { PMT } from "$lib/functions";

  let housePrice = 400000;
  let downPayment = 80000;
  $: loanAmount = housePrice - downPayment;

  let interestRate = 7.5;
  let loanTerm = 30;
  $: monthlyPayment = PMT(interestRate / 100 / 12, loanTerm * 12, -loanAmount);

  let rent = 2500;
  let utilities = 100;
  let utilitiesRent = 80;
  let extraUtilities = 200;
  let homeownersInsurance = 100;

  let closingCosts = 5000;
</script>

<div class="max-w-xl mx-auto py-12 divide-y md:max-w-4xl">
  <div class="flex flex-row">
    <div class="flex-col">
      <label class="block">
        <span>House Price</span>
        <input type="number" class="mt-1 block w-full" bind:value={housePrice} />
      </label>
      <label>
        <span>Down Payment</span>
        <input
          class="mt-1 block w-full"
          type="number"
          name="downPayment"
          bind:value={downPayment}
        />
        {#if housePrice && downPayment}
          <span>{((downPayment / housePrice) * 100).toFixed(2)}% of House Price</span>
        {/if}
      </label>
      <label class="block">
        <span>Loan Amount</span>
        <input class="mt-1 block w-full" value={loanAmount || null} disabled />
      </label>
      <label class="block">
        <span>Interest Rate</span>
        <input type="number" step=".1" class="mt-1 block w-full" bind:value={interestRate} />%
      </label>
      <label class="block">
        <span>Loan Term</span>
        <select class="mt-1 block w-full" bind:value={loanTerm}>
          <option value={30}>30 Years</option>
          <option value={20}>20 Years</option>
          <option value={15}>15 Years</option>
          <option value={10}>10 Years</option>
        </select>
      </label>
    </div>
    <div class="flex-col">
      <p>Monthly Payment</p>
      <p>{currency(monthlyPayment)}</p>
      <p>Total Payment</p>
      <p>{currency(monthlyPayment * loanTerm * 12)}</p>
      <p>Total Principal</p>
      <p>{currency(loanAmount)}</p>
      <p>Total Interest</p>
      <p>{currency(monthlyPayment * loanTerm * 12 - loanAmount)}</p>
    </div>
  </div>

  <h3>Montly Costs</h3>
  <table>
    <thead>
      <tr>
        <th />
        <th>Own</th>
        <th>Rent</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Rent</td>
        <td />
        <td>{currency(rent)}</td>
      </tr>
      <tr>
        <td>Mortgage</td>
        <td>{currency(monthlyPayment)}</td>
        <td />
      </tr>
      <tr>
        <td>Income Lost on Down Payment</td>
        <td>{currency((downPayment * 0.05) / 12)}</td>
        <td />
      </tr>
      <tr>
        <td>Utilities (electric/internet)</td>
        <td>{currency(utilities)}</td>
        <td>{currency(utilitiesRent)}</td>
      </tr>
      <tr>
        <td>Utilities (gas/water/trash/etc.)</td>
        <td>{currency(extraUtilities)}</td>
        <td />
      </tr>
      <tr>
        <td>Property Taxes</td>
        <td>{currency((housePrice * 0.015) / 12)}</td>
      </tr>
      <tr>
        <td>Homeowner's/Renter's Insurance</td>
      </tr>
      <tr>
        <td>Home maintenance costs</td>
      </tr>
      <tr>
        <td>Home equity buildup ("savings")</td>
      </tr>
      <tr>
        <td>Monthly tax benefit est of home ownership (a)</td>
      </tr>
    </tbody>
  </table>

  <h3>Non-Montly Costs (the big stuff!)</h3>
  <table>
    <thead>
      <tr>
        <th />
        <th>Buy</th>
        <th>Sell</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Closing costs - mortgage and escrow (est.)</td>
        <td>{currency(closingCosts.toFixed(2))}</td>
        <td />
      </tr>
      <tr>
        <td>Home Improvements?</td>
        <td>$?</td>
        <td />
        <td>May be recovered in sale price</td>
      </tr>
      <tr>
        <td>Home Value Appreciation</td>
        <td />
        <td>{currency(housePrice * (1 + 0.015) ** 5 - housePrice)}</td>
      </tr>
      <tr>
        <td>Cost of Selling: Agent Commision</td>
        <td />
        <td>{currency(housePrice * (1 + 0.015) ** 5 * 0.055)}</td>
      </tr>
      <tr>
        <td>Cost of Selling: Staging, Repairs</td>
        <td />
        <td>$?</td>
      </tr>
    </tbody>
  </table>

  <h3>(a) Deductible Expenses Estimate</h3>
  <table>
    <thead>
      <tr>
        <th />
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mortgage Interest</td>
        <td>{currency((monthlyPayment * loanTerm * 12 - loanAmount) / loanTerm)}</td>
        <td />
      </tr>
      <tr>
        <td>Home Improvements?</td>
        <td>$?</td>
        <td />
        <td>May be recovered in sale price</td>
      </tr>
      <tr>
        <td>Home Value Appreciation</td>
        <td />
        <td>{currency(housePrice * (1 + 0.015) ** 5 - housePrice)}</td>
      </tr>
      <tr>
        <td>Cost of Selling: Agent Commision</td>
        <td />
        <td>{currency(housePrice * (1 + 0.015) ** 5 * 0.055)}</td>
      </tr>
      <tr>
        <td>Cost of Selling: Staging, Repairs</td>
        <td />
        <td>$?</td>
      </tr>
    </tbody>
  </table>
</div>
