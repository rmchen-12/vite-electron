<template>
  <input
    type="checkbox"
    v-bind:checked="checked"
    v-on:change="$emit('change', $event.target.checked)"
  />
</template>

<script>
export default {};
</script>

<style></style>
