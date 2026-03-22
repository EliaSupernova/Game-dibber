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

export function groupTally(players) {
  const entries = Object.values(players).filter((p) => p.cuisine);
  const counts = {};
  for (const player of entries) {
    counts[player.cuisine] = (counts[player.cuisine] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const winners = Object.keys(counts).filter((k) => counts[k] === maxCount);

  const playerSummary = entries.map((p) => ({
    name: p.name,
    cuisine: p.cuisine,
  }));

  return {
    counts,
    winner: winners[Math.floor(Math.random() * winners.length)],
    isTie: winners.length > 1,
    tiedOptions: winners,
    playerSummary,
  };
}
