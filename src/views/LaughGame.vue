<template>
  <h2 class="title">Do not laugh!</h2>
  <p>You'll be presented with funny videos. If you laugh, you lose!</p>
  <div class="laugh-game">
    <div class="video-wrapper" v-show="state.started">
      <div id="video-player"></div>
      <div class="cam-wrapper">
        <Cam 
          :width=width 
          :height=height 
          :onExpressionsChange=onExpressionsChange 
          :showDetectionResultsOnCanvas=false
        />
      </div>
    </div>
    <button v-on:click="startGame()" v-if="!state.started" class="start-button">
      Start Game
    </button>
  </div>
  <div class="end-screen popout" v-if="!state.started && state.timeElapsed">
    <span class="emoji">😂</span>
    <p class="text">You lost! But you lasted {{ getElapsedTimeLabel() }} without laughing!</p>
    <button v-on:click="startGame()" class="start-button">
      Restart
    </button>
  </div>
</template>

<script>
import Cam from '@/components/Cam.vue';
import YouTubePlayer from 'youtube-player';
import utils from '../utils';

export default {
  name: 'LaughGame',
  components: {
    Cam
  },
  methods: {
    startGame() {
      this.videoPlayer = YouTubePlayer('video-player', {
        videoId: utils.getRandomFunnyVideo(),
        playerVars: {
          autoplay: 1,
          controls: 0,
          enablejsapi: 1,
          modestbranding: 1,
          rel: 0
        }
      });
      
      this.videoPlayer.playVideo();
      this.state.started = true;
      
      const startTime = Date.now();
      this.timer = setInterval(() => {
        this.updateElapsedTime(Date.now() - startTime);
      }, 1000);
    },
    finishGame() {
      this.videoPlayer.destroy();
      this.state.started = false;
      clearInterval(this.timer);
    },
    updateElapsedTime(current) {
      this.state.timeElapsed = current;
    },
    getElapsedTimeLabel() {
      return utils.millisecondsToTime(this.state.timeElapsed);
    }
  },
  data() {
    return {
      width: 640,
      height: 360,
      state: {
        started: false,
        timeElapsed: 0
      },
      timer: null,
      videoPlayer: null,
      onExpressionsChange: expression => {
        const happiness = expression.happy;

        if (this.state.started && happiness > 0.5) {
          this.finishGame();
        }
      }
    };
  }
};
</script>

<style lang="scss">
.laugh-game {
  .video-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px;
    background: #333;

    iframe,
    .cam-wrapper {
      border: 3px solid #222;
    }
  }
}

.end-screen {
  position: absolute;
  margin: auto;
  width: 100%;
  height: 100%;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.9);

  > .emoji {
    font-size: 15em;
  }

  > .text {
    color: #DDD;
  }
  
  &.popout {
    animation: popout 1s ease;
    -webkit-animation: popout 1s ease;
  }

  @keyframes popout {
    from{transform:scale(0)}
    80%{transform:scale(1.2)}
    to{transform:scale(1)}
  }

  @-webkit-keyframes popout {
    from{-webkit-transform:scale(0)}
    80%{-webkit-transform:scale(1.2)}
    to{-webkit-transform:scale(1)}
  }
}

.start-button {
  background-color: white;
  border: 1px solid #008CBA;
  color: black;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.2s;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    background-color: #008CBA;
    color: white;
  }
}
</style>
