<template>
  <div class="home">
    <Cam :width=width :height=height />
  </div>
</template>

<script>
// @ is an alias to /src
import Cam from '@/components/Cam.vue';

export default {
  name: 'Home',
  components: {
    Cam,
  },
  data() {
    return {
      width: 640,
      height: 420,
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
