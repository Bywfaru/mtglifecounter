<script lang="ts">
  import Button from '../components/Button.svelte';

  let podId = $state('');
  let enableButtons = $state(false);

  /**
   * Format the Pod ID by removing non-alphanumeric characters,
   * converting to uppercase, and adding a hyphen after the first 3 characters.
   * @param value - The Pod ID string to format.
   */
  const formatPodId = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6);

    if (cleaned.length <= 3) return cleaned;

    return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
  };

  /**
   * Unformat the Pod ID by removing non-alphanumeric characters,
   * @param value - The formatted Pod ID string.
   */
  const unformatPodId = (value: string) => {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  };

  const isValidPodId = (value: string) => {
    return /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(value);
  };

  const handleInput = () => {
    podId = formatPodId(podId);
    enableButtons = isValidPodId(podId);
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();

    console.log('Pod ID submitted:', unformatPodId(podId));
  };
</script>

<div class="flex flex-col items-center gap-10 w-full max-w-md">
  <div class="flex flex-col items-center gap-2 text-center">
    <h1 class="text-4xl font-bold">Upkeep</h1>
    <p>The only Magic: The Gathering life tracker you will need</p>
  </div>

  <div class="flex flex-col items-center gap-5 w-full">
    <Button
      --background-color="#512A6B"
      --border-color="white"
      --text-color="white"
      fullWidth
    >
      HOST
    </Button>

    <div class="flex items-center gap-4 w-full px-2">
      <div class="flex-1 h-[1px] bg-white"></div>
      <p class="leading-4">or</p>
      <div class="flex-1 h-[1px] bg-white "></div>
    </div>

    <form
      class="flex flex-col items-center gap-2 w-full"
      onsubmit={handleSubmit}
    >
      <input
        autocomplete="off"
        bind:value={podId}
        class="border p-2 rounded placeholder:text-center text-center w-full text-xl font-mono"
        oninput={handleInput}
        placeholder="ENTER POD ID"
        spellcheck={false}
        type="text"
      />

      <Button
        --background-color="#0A4168"
        --border-color="white"
        --text-color="white"
        disabled={!enableButtons}
        fullWidth
      >
        JOIN
      </Button>
    </form>
  </div>
</div>