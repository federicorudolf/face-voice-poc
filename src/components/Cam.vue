<template>
  <div class="camContainer">
    <video class="camContainer--video" ref="camera" autoplay muted playsinline></video>
    <canvas class="camContainer--canvas" ref="canvas"></canvas>
    <!-- <img id="chiqui" src="../assets/chiqui_tapia_1.jpg_970625494.jpg" alt=""> -->
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
      const result = await faceapi.detectAllFaces(camera).withFaceLandmarks();
      if (!result) {
        throw new Error('No faces detected');
      } else {
        console.log('Face detection result:', result);
        const { canvas } = this.$refs;
        canvas.width = this.$props.width;
        canvas.height = this.$props.height;
        this.drawBoxes(canvas, result);
      }
    },
    async drawBoxes(canvas, result) {
      faceapi.draw.drawDetections(canvas, result);
      console.log('Drawing', canvas);
    },
  },
};

</script>

<style lang="scss">
.camContainer {
  position: relative;
  &--video {
    position: absolute;
    top: 0;
    left: 0;
  }
  &--canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
