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

export default {
  getRandomEmoji
};
