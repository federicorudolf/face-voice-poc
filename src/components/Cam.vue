<template>
  <div class="camContainer">
    <video class="camContainer--video" ref="camera" autoplay muted playsinline></video>
    <canvas class="camContainer--canvas" ref="canvas"></canvas>
    <!-- <img id="chiqui" src="../assets/chiqui_tapia_1.jpg_970625494.jpg" alt=""> -->
    <span
      v-if="gender && age"
      class="camContainer--text"> {{ gender + `, ${age} years old` }} </span>
    <div class="camContainer__buttons">
      <button class="camContainer__buttons--button">Hat</button>
      <button class="camContainer__buttons--button">Mustache</button>
      <button class="camContainer__buttons--button">Glasses</button>
      <button class="camContainer__buttons--button">Sunglasses</button>
    </div>
  </div>
</template>
<script>
import * as faceapi from 'face-api.js';

export default {
  name: 'Cam',
  components: {},
  props: {
    width: Number,
    height: Number,
  },
  data() {
    return {
      title: 'Camera',
      minConfidenceFace: 0.5,
      intervals: [],
      faceapiOptions: new faceapi.SsdMobilenetv1Options({
        minConfidenceFace: this.minConfidenceFace,
      }),
      age: null,
      gender: '',
    };
  },
  mounted() {
    this.askPermissions().then(
      (res) => this.setVideoStream(res),
    );
  },
  unmounted() {
    this.intervals.forEach((el) => clearInterval(el));
  },
  methods: {
    async loadModels() {
      await faceapi.loadTinyFaceDetectorModel('/models/weights');
      await faceapi.loadSsdMobilenetv1Model('/models/weights');
      await faceapi.loadFaceLandmarkModel('/models/weights');
      await faceapi.loadFaceRecognitionModel('/models/weights');
      await faceapi.loadFaceDetectionModel('/models/weights');
      await faceapi.loadFaceExpressionModel('/models/weights');
      await faceapi.loadAgeGenderModel('/models/weights');
    },
    async askPermissions() {
      await this.loadModels();
      console.log('Loaded Models');
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: this.$props.width,
          height: this.$props.height,
        },
      });
      return userStream;
    },
    setVideoStream(stream) {
      const video = this.$refs.camera;
      video.width = this.$props.width;
      video.height = this.$props.height;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        const interval = setInterval(() => {
          this.detectFaces(video);
        }, 200);
        this.intervals.push(interval);
      };
    },
    async detectFaces(camera) {
      const result = await faceapi.detectSingleFace(camera, this.faceapiOptions)
        .withFaceExpressions()
        .withAgeAndGender();
      if (!result) {
        throw new Error('No faces detected');
      } else {
        const { canvas } = this.$refs;
        canvas.width = this.$props.width;
        canvas.height = this.$props.height;
        const text = this.detectEmotion(result);
        this.detectAgeGender(result);
        this.drawBoxes(canvas, result, text);
      }
    },
    async drawBoxes(canvas, result, text) {
      const {
        x, y, width, height,
      } = result.detection.box;
      const box = new faceapi.Box(new faceapi.Rect(x, y, width, height), false);
      const labeledBox = new faceapi.LabeledBox(box, text);
      faceapi.draw.drawDetections(canvas, labeledBox);
      // faceapi.draw.drawFaceExpressions(canvas, result.expressions);
      const cx = canvas.getContext('2d'); cx.font = '28px Poppins';
      cx.fillStyle = 'red';
      cx.fillText(this.detectEmotion(result), 10, 50);
    },
    detectEmotion(result) {
      const emotions = Object.keys(result.expressions);
      let biggest;
      let text = '';
      emotions.forEach((e) => {
        if (!biggest) {
          biggest = result.expressions[e];
          text = e;
        } else if (result.expressions[e] > biggest) {
          biggest = result.expressions[e];
          text = e;
        }
      });
      return text;
    },
    detectAgeGender(result) {
      if (!this.age && !this.gender) {
        this.age = Math.round(result.age);
        this.gender = result.gender.toUpperCase();
      }
    },
  },
};

</script>

<style lang="scss">
.camContainer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &--canvas {
    position: absolute;
    left: calc((100% - 640px) / 2);
    top: 0;
  }

  &--text {
    margin-top: 3em;
    text-transform: capitalize;
  }
}
</style>
