<script lang="ts">
  import '../app.css';
  import BackgroundImage from '$lib/components/BackgroundImage.svelte';
  import type { LayoutProps } from './$types';

  let { children, data }: LayoutProps = $props();
</script>

<main class="min-w-screen min-h-screen flex flex-col items-center justify-center text-white relative">
  {@render children()}

  {#if data.backgroundImage}
    <BackgroundImage src={data.backgroundImage} />
  {/if}
</main>
