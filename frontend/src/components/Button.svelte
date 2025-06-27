<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary',
    children?: any,
    fullWidth?: boolean,
    disabled?: boolean,
    type?: HTMLButtonElement['type']
  }

  const {
    children,
    disabled,
    fullWidth,
    variant = 'primary',
  }: Props = $props();
</script>

{#if variant === 'primary'}
  <button
    class="font-bold py-2 px-4 rounded border transition-colors font-mono"
    class:w-full={fullWidth}
    disabled={disabled}
  >
    {@render children()}
  </button>
{:else}
  <button
    class="font-bold py-2 px-4 rounded border transition-colors font-mono"
    class:w-full={fullWidth}
    disabled={disabled}
  >
    {@render children()}
  </button>
{/if}

<style>
  :root {
    --background-color: white;
    --text-color: black;
    --border-color: black;
    --hover-background-color: #f0f0f0;
    --hover-text-color: black;
    --hover-border-color: black;
    --font-size: 20px;
    --disabled-background-color: #555555;
    --disabled-text-color: #a0a0a0;
    --disabled-border-color: #a0a0a0;
  }

  button {
    color: var(--text-color);
    background-color: var(--background-color);
    border-color: var(--border-color);
    font-size: var(--font-size);
  }

  button:hover {
    color: var(--hover-text-color);
    background-color: var(--hover-background-color);
    border-color: var(--hover-border-color);
  }

  button:disabled {
    color: var(--disabled-text-color);
    background-color: var(--disabled-background-color);
    border-color: var(--disabled-border-color);
    cursor: not-allowed;
  }
</style>