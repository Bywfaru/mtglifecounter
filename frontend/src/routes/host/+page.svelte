<script lang="ts">
  import { formatRoomCode } from '$lib/utils/roomCode';
  import { socket } from '$lib/utils/socket';

  let roomCode: string | null = $state(null);

  socket.on('connect', () => {
    socket.emit('host:create');

  });
  socket.on('host:create_success', ({ code }: { code: string }) => {
    roomCode = code;
  });
</script>

<div class="flex flex-col items-center gap-10 w-full max-w-md">
  {#if roomCode}
    <h1 class="text-4xl font-bold">Your Room Code</h1>
    <p class="text-center">Share this code with your friends to join your
      room.</p>
    <div class="text-2xl font-mono">{formatRoomCode(roomCode)}</div>
    <p class="text-center">or share this link instead</p>
    <a
      href={`${window.location.origin}/join/${roomCode}`}
      class="text-blue-500 hover:underline"
    >
      {window.location.origin}/join/{roomCode}
    </a>
  {:else}
    <p>Creating room...</p>
  {/if}
</div>

