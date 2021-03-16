<template>
  <h2 class="title">Imitate the Emoji</h2>
  <p>You have {{ roundTime / 1000 }} seconds to score the maximum points possible, by imitating the emoticon on screen. Each successful imitation will net you 100 points and show another emoticon.</p>
  <div class="emoji-game">
    <div class="cam-wrapper"> 
      <Cam 
        :width=width 
        :height=height 
        :onExpressionsChange=onExpressionsChange 
        :showDetectionResultsOnCanvas=false
      />
      <div v-if="!state.started" class="start-banner">
        <h2>Score: {{ state.score }}</h2>
        <h2>High Score: {{ state.highScore }}</h2>
        <button v-on:click="startGame()" class="start-button">
          Start Game
        </button>
      </div>
      <div v-if="state.started" class="time-left">
        {{ state.timeLeft / 1000 }}
      </div>
      <div v-if="!!currentEmoji" class="current-emoji">
        {{ currentEmoji.char }}
      </div>
    </div>
  </div>
  <a href="#/emoji_game" v-on:click="resetHighScore()" class="reset-high">
    Reset High Score
  </a>
</template>

<script>
// @ is an alias to /src
import Cam from '@/components/Cam.vue';
import utils from '../utils';

const ROUND_TIME_MS = 30000;

export default {
  name: 'EmojiGame',
  components: {
    Cam
  },
  methods: {
    expressionMatchesEmoji() {
      if (!this.currentExpression || !this.currentEmoji) {
        return false;
      }

      const emojiExpressions = Object.values(this.currentEmoji.expressions);
      const expressionsDetected = Object.keys(this.currentExpression).filter(exp => this.currentExpression[exp] >= 0.5);
      
      return !!emojiExpressions && emojiExpressions.some(exp => expressionsDetected.includes(exp));
    },
    startGame() {
      this.state.started = true;
      this.state.score = 0;
      this.currentEmoji = utils.getRandomEmoji();

      const roundInterval = setInterval(() => {
        if (this.state.started) {
          this.state.timeLeft -= 1000;
          if (this.state.timeLeft === 0) {
            this.finishGame();
            window.clearInterval(roundInterval);
          }
        }
      }, 1000);
    },
    finishGame() {
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
        localStorage.setItem('highScore', this.state.highScore);
      }
      this.resetGameState();
    },
    resetGameState() {
      this.state.timeLeft = ROUND_TIME_MS;
      this.state.started = false;
      this.currentEmoji = null;
    },
    resetHighScore() {
      localStorage.removeItem('highScore');
      this.state.highScore = 0;
    }
  },
  data() {
    return {
      width: 640,
      height: 420,
      state: {
        started: false,
        score: 0,
        highScore: localStorage.getItem('highScore') || 0,
        timeLeft: ROUND_TIME_MS
      },
      roundTime: ROUND_TIME_MS,
      currentEmoji: null,
      currentExpression: {},
      onExpressionsChange: expression => {
        this.currentExpression = expression;

        if (this.state.started && this.expressionMatchesEmoji()) {
          this.state.score += 100;
          this.currentEmoji = utils.getRandomEmoji(this.currentEmoji.char);
        }
      }
    };
  }
};
</script>

<style lang="scss">
@import url('http://fonts.cdnfonts.com/css/heavyrust-rough');

.title {
  margin-top: 0;
}

.emoji-game {
  display: flex;
  padding: 10px 0 30px 0;
  flex-direction: column;

  > .cam-wrapper {
    margin: auto;
    position: relative;
    background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
    padding: 10px;
    box-shadow: 6px 6px 3px 0px rgba(0,0,0,0.70);
    -webkit-box-shadow: 6px 6px 0px 3px rgba(0,0,0,0.70);
    -moz-box-shadow: 6px 6px 0px 3px rgba(0,0,0,0.70);

    .time-left {
      font-family: 'HEAVYRUST', sans-serif;
      font-size: 60px;
      color: white;
      position: absolute;
      bottom: 10px;
      right: 112px;
      -webkit-text-stroke: 1px #333;
      z-index: 10;
    }

    .current-emoji {
      font-family:'Segoe UI Emoji';
      font-size: 120px;
      position: absolute;
      bottom: 0;
      right: 25px;
    }

    .start-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      color: white;
      -webkit-text-stroke: 0.5px #008CBA;

      > .start-button {
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
    }
  }
}

.reset-high {
  padding-bottom: 20px;
}
</style>
