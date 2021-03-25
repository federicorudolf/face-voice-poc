/* eslint-disable func-names */
<template>
  <div class="camContainer" :style="styleProps">
    <video class="camContainer--video" ref="camera" autoplay muted playsinline></video>
    <canvas class="camContainer__canvas" ref="canvas"></canvas>
    <span
      v-if="gender && age"
      class="camContainer--text"> {{ gender + `, ${age} years old` }}
    </span>
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
    onExpressionsChange: Function,
    picId: String,
    showDetectionResultsOnCanvas: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    styleProps() {
      return {
        '--canvas-width': `${this.width}px`,
        '--canvas-height': `${this.height}px`,
      };
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    // eslint-disable-next-line object-shorthand
    picId: function (newVal) {
      this.drawPic(newVal);
    },
  },
  data() {
    return {
      title: 'Camera',
      minConfidenceFace: 0.5,
      result: null,
      intervals: [],
      faceapiOptions: new faceapi.SsdMobilenetv1Options({
        minConfidenceFace: this.minConfidenceFace,
      }),
      age: null,
      gender: '', 
      eyesPosition: {
        x: 0,
        y: 0
      },
      mouthPosition: {
        x: 0,
        y: 0
      },
    };
  },
  mounted() {
    this.askPermissions().then(
      res => this.setVideoStream(res)
    );
  },
  unmounted() {
    this.intervals.forEach(el => clearInterval(el));
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
          width: this.width,
          height: this.height,
        }
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
        }, 1000);
        this.intervals.push(interval);
      };
    },
    async detectFaces(camera) {
      const result = await faceapi.detectSingleFace(camera, this.faceapiOptions)
        .withFaceLandmarks()
        .withFaceDescriptor()
        .withFaceExpressions()
        .withAgeAndGender();
      if (!result) {
        throw new Error('No faces detected');
      } else {
        this.result = result;
        this.setEyesMouthPositions(result);
        const { canvas } = this.$refs;
        const { 
          width,
          height,
          onExpressionsChange,
          showDetectionResultsOnCanvas
        } = this.$props;
        canvas.width = width;
        canvas.height = height;
        // eslint-disable-next-line no-unused-expressions
        this.picId ? this.drawPic(this.picId, canvas) : null;
        const text = this.detectEmotion(result);
        this.detectAgeGender(result);
        
        if (showDetectionResultsOnCanvas) this.drawBoxes(canvas, result, text);
        if (onExpressionsChange) onExpressionsChange(result.expressions);
      }
    },
    async drawBoxes(canvas, result, text) {
      const { 
        x, y, width, height 
      } = result.detection.box;
      const box = new faceapi.Box(new faceapi.Rect(x, y, width, height), false);
      const labeledBox = new faceapi.LabeledBox(box, text);
      faceapi.draw.drawDetections(canvas, labeledBox);
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
      return (text.split('')[0].toUpperCase() + text.substring(1));
    },
    detectAgeGender(result) {
      if (!this.age && !this.gender) {
        this.age = Math.round(result.age);
        this.gender = result.gender.split('')[0].toUpperCase() + result.gender.substring(1);
      }
    },
    drawPic(pic, canvas) {
      let x; let y; let cx;
      if (canvas) cx = canvas.getContext('2d');
      const img = document.createElement('img');
      const {
        width, height,
      } = this.result.detection.box;
      img.src = this.$props.picId;
      if (pic.includes('moustache')) {
        x = this.mouthPosition.x - (width / 2);
        y = this.mouthPosition.y - (height / 2);
      } else if (pic.includes('glasses')) {
        x = this.eyesPosition.x - (width / 2);
        y = this.eyesPosition.y - (height / 2);
      } else {
        x = this.result.detection.box.x;
        y = this.result.detection.box.y - height;
      }

      img.addEventListener('load', () => {
        if (canvas) cx.drawImage(img, x, y, width, height);
      });
    },
    setEyesMouthPositions(result) {
      this.eyesPosition.x = (this.getAverage(result.landmarks.getLeftEye(), 'x') + this.getAverage(result.landmarks.getRightEye(), 'x')) / 2;
      this.eyesPosition.y = (this.getAverage(result.landmarks.getLeftEye(), 'y') + this.getAverage(result.landmarks.getRightEye(), 'y')) / 2;

      this.mouthPosition.y = this.getAverage(result.landmarks.getMouth(), 'y');
      this.mouthPosition.x = this.getAverage(result.landmarks.getMouth(), 'x');
    },
    getAverage(array, position) {
      return array.map(el => el[position]).reduce((acc, curr) => acc + curr) / array.length;
    }
  },
};

</script>

<style lang="scss">
.camContainer {
  position: relative;
  width: var(--canvas-width);
  height: var(--canvas-height);

  &--video {
    position: absolute;
    top: 0;
    left: 0;
  }

  &__canvas {
    position: absolute;
    left: calc((100% - 640px) / 2);
    top: 0;

    &--image {
      position: relative;
      top: 0;
      left: 0;
    }
  }

  &--text {
    margin-top: 3em;
    text-transform: capitalize;
  }
}
</style>
