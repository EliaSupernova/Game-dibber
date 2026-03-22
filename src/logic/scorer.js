export function pickCuisine(answers) {
  const tally = {};
  for (const tags of answers) {
    for (const tag of tags) {
      tally[tag] = (tally[tag] || 0) + 1;
    }
  }
  const maxScore = Math.max(...Object.values(tally));
  const winners = Object.keys(tally).filter((k) => tally[k] === maxScore);
  return winners[Math.floor(Math.random() * winners.length)];
}

export function groupTally(allResults) {
  const counts = {};
  for (const cuisine of allResults) {
    counts[cuisine] = (counts[cuisine] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const winners = Object.keys(counts).filter((k) => counts[k] === maxCount);
  return {
    counts,
    winner: winners[Math.floor(Math.random() * winners.length)],
    isTie: winners.length > 1,
    tiedOptions: winners,
  };
}
