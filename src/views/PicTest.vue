/* eslint-disable global-require */
<template>
  <div class="pictest">
    <Cam 
      :width=width
      :height=height
      :picId=picId />
    <div class="pictest__buttons">
      <button
        class="pictest__buttons--button mt-2 mb-2 p-2"
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
          tag: 'Moustache',
          id: 'moustache',
        },
        {
          tag: 'Glasses',
          id: 'glasses',
        },
        {
          tag: 'Sunglasses',
          id: 'sunglasses',
        },
        {
          tag: 'Clear',
          id: 'clear',
        },
      ],
      picId: '',
      picIndex: 0,
    };
  },
  methods: {
    // TODO: Assign pic url to variable and pass to prop
    buttonPressed(id) {
      const images = require.context('../assets/img/', false, /\.png$/);
      if (id === 'clear') {
        this.picId = '';
        this.picIndex = 0;
        return;
      }
      this.picIndex += 1;
      this.picId = images(`./${id}_${(this.picIndex % 3)}.png`);
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 1em 0;

    &--button {
      border: 1px solid red;
      background: none;
      padding: 1em;
      margin: 1em;
      color: red;
      border-radius: 0.2em;
      font-weight: bold;
      font-family: 'Poppins', Helvetica, Arial, sans-serif !important;

    }
  }
}

</style>
