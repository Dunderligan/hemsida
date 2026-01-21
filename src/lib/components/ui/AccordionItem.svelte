<script lang="ts">
  import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
  import { slide } from 'svelte/transition';
  import Icon from './Icon.svelte';
 
  type Props = WithoutChildrenOrChild<Accordion.ItemProps> & {
    title: string;
    content: string;
  };
 
  let { title, content, ...restProps }: Props = $props();
</script>
 
<Accordion.Item {...restProps} class={' px-8 py-4  bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800'}>
  <Accordion.Header>
    <Accordion.Trigger class={'flex min-h-14 items-center justify-between font-display text-2xl font-semibold hover:underline'}>
      <h1>{title}</h1>
      <span class="px-2"><Icon icon="ph:caret-down"/></span>
    </Accordion.Trigger>
  </Accordion.Header>
  <Accordion.Content forceMount={true} class='overflow-hidden text-sm tracking-[-0.01em]'>
    {#snippet child({props, open})}  
    {#if open}
        <div {...props} transition:slide={{duration: 500}} class={'text-xl pt-1 pb-2'}>
          {content}
        </div>
      {/if}
    {/snippet}
  </Accordion.Content>
</Accordion.Item>

<!--
bg-gray-100 px-6 py-2.5  hover:bg-gray-200 hover:underline
-->