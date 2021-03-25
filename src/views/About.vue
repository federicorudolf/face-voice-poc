<template>
  <div class="about">
    <h1>Welcome to the Face Recognition API Proof of Concept!</h1>
    <p>Navigate to the different sections above to discover some possibilities.</p>
    <p>Before starting, make sure your webcam and your face are being properly recognized by the browser (below).</p> 
    <Cam :width=640 :height=420 />
  </div>
</template>

<script>
// @ is an alias to /src
import Cam from '@/components/Cam.vue';

export default {
  name: 'Home',
  components: {
    Cam,
  }
};
</script>

<style lang="scss">
.camContainer {
  margin: 40px auto;
  border: 3px solid #666;
}
</style>
