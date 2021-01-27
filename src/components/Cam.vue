<template>
  <div class="camContainer">
    <video class="camContainer--video" ref="camera" autoplay muted playsinline></video>
    <canvas class="camContainer--canvas" ref="canvas"></canvas>
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
  methods: {
    async loadModels() {
      Promise.all([
        faceapi.loadTinyFaceDetectorModel('/models/weights'),
        faceapi.loadFaceLandmarkModel('/models/weights'),
        faceapi.loadFaceRecognitionModel('/models/weights'),
        faceapi.loadFaceDetectionModel('/models/weights'),
        faceapi.loadFaceExpressionModel('/models/weights'),
      ]);
      console.log(faceapi.nets);
    },
    async askPermissions() {
      await this.loadModels();
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

      this.detectFaces(video);
    },
    async detectFaces(camera) {
      let result;
      faceapi.detectSingleFace(camera, new faceapi.TinyFaceDetectorOptions(
        { inputSize: 512, scoreThreshold: 0.5 },
      ))
        .then(
          (res) => {
            result = res;
            console.log(result);
            const { canvas } = this.$refs;
            canvas.width = this.$props.width;
            canvas.height = this.$props.height;
            this.drawBoxes(canvas, result);
          },
          (err) => console.log('error', err),
        )
        .catch(() => {
          // Catch any exception that's thrown and log this
          console.warn('faceAPI promise errored out i');
        });
    },
    drawBoxes(canvas, result) {
      const detectionsForSize = faceapi
        .resizeResults(result, { width: this.$props.width, height: this.$props.height });

      faceapi.drawDetection(canvas, detectionsForSize, { withScore: true });

      console.log('Drawing', canvas);

      const boxesWithText = [
        new faceapi.BoxWithText(new faceapi.Rect(0, 0, 50, 50, false), 'some text'),
      ];
      faceapi.drawDetection(canvas, boxesWithText);
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
