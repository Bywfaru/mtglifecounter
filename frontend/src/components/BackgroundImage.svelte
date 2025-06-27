<script lang="ts">
  interface Props {
    src: string;
  }

  const { src }: Props = $props();
</script>

<div class="size-full absolute top-0 left-0 z-[-1]">
  <img
    src={src}
    alt="Random Commander Background"
    class="size-full object-cover object-center"
    loading="lazy"
  />

  <div class="size-full bg-gradient-to-b from-transparent to-black absolute top-0 left-0 backdrop-blur-sm"></div>
</div>

