<script lang="ts">
  import { formatRoomCode } from '$lib/utils/roomCode';
  import { socket } from '$lib/utils/socket';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  const { roomCode } = data;
  let isLoading = $state(true);
  let errorMessage: string | null = $state(null);

  socket.on('connect', () => {
    socket.emit('player:join', { code: roomCode });
  });

  socket.on('player:join_success', () => {
    isLoading = false;
  });

  socket.on('player:join_error', (error: { message: string }) => {
    isLoading = false;
    errorMessage = error.message;
  });
</script>

<div class="flex flex-col items-center gap-10 w-full max-w-md">
  {#if isLoading}
    <p>Loading...</p>
  {:else if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {:else}
    <h1 class="text-4xl font-bold">Welcome to
      room {formatRoomCode(roomCode)}</h1>
    <p class="text-center">You have successfully joined the room.</p>
  {/if}
</div>