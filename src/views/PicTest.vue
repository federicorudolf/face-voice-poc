<template>
  <div class="pictest">
    <Cam :width=width :height=height />
    <div class="pictest__buttons">
      <button
        class="pictest__buttons--button"
        v-for="button of buttons"
        v-bind:key="button.id"
        v-on:click="buttonPressed(button.id)"> {{ button.tag }} </button>
    </div>
  </div>
</template>
<script>
import Cam from '@/components/Cam.vue';

export default {
  name: 'PicTest',
  components: {
    Cam,
  },
  data() {
    return {
      width: 640,
      height: 420,
      buttons: [
        {
          tag: 'Hat',
          id: 'hat',
        },
        {
          tag: 'Mustache',
          id: 'mustache',
        },
        {
          tag: 'Glasses',
          id: 'glasses',
        },
        {
          tag: 'Sunglasses',
          id: 'sunglasses',
        },
      ],
    };
  },
  methods: {
    buttonPressed(id) {
      console.log(id);
    },
  },
};
</script>
<style lang="scss" scoped>
.pictest {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: auto;

  &__buttons {
    
    &--button {

    }
  }
}

</style>
