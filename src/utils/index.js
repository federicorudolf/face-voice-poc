function getRandomEmoji(excludeChar) {
  let emojis = [
    { char: '😃', expressions: ['happy'] },
    { char: '🙁', expressions: ['sad'] },
    { char: '😡', expressions: ['angry'] },
    { char: '😶', expressions: ['neutral'] },
    { char: '😮', expressions: ['surprised'] },
    { char: '😕', expressions: ['neutral', 'sad'] },
  ];

  if (excludeChar) {
    emojis = emojis.filter(emoji => emoji.char !== excludeChar);
  }

  return emojis[Math.floor(Math.random() * emojis.length)];
}

function getRandomFunnyVideo() {
  const videoIds = ['FFLTU9eIijw', 'iJoFN7-qPFI', 'mbbsxAiNeJg', 'hlI5zHkOl8o', 'bf2ASh5vS-s'];

  return videoIds[Math.floor(Math.random() * videoIds.length)];
}

function millisecondsToTime(ms) {
  const seconds = (ms / 1000).toFixed(1);
  const minutes = (ms / (1000 * 60)).toFixed(1);
  const hours = (ms / (1000 * 60 * 60)).toFixed(1);

  let time;
  if (seconds < 60) {
    time = `${seconds} seconds`;
  } else if (minutes < 60) {
    time = `${minutes} minutes`;
  } else {
    time = `${hours} hours`;
  }

  return time;
}

export default {
  getRandomEmoji,
  getRandomFunnyVideo,
  millisecondsToTime
};
