async function analyzeToxicity(message) {

  const toxicWords = ["idiot","stupid","hate"];

  let score = 0;

  toxicWords.forEach(word=>{
    if(message.toLowerCase().includes(word)){
      score += 0.5;
    }
  });

  return {
    toxicity_score: score,
    allowed: score < 0.7
  };
}

module.exports = { analyzeToxicity };