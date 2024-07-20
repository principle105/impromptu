<script lang="ts">
    let cookies = 0;
</script>

<h1 class="text-xl">Cookie Clicker</h1>

<div>Cookies: {cookies}</div>

<button
    class="h-20 w-20 rounded-full bg-[#eaddca] hover:brightness-90 transition-all duration-200 ease-in-out"
    on:click={() => cookies++}
>
</button>
