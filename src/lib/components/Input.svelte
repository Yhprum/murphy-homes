<script lang="ts">
  import { Input, Label } from "flowbite-svelte";

  export let label: string;
  export let left = null;
  export let value: string;
</script>

<Label class="block">
  {#if label}
    <span>{label}</span>
  {/if}
  <Input type="number" class="mt-1 block w-full" bind:value>
    <!-- <span slot="left" /> -->
  </Input>
</Label>
