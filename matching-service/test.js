const generateEmbedding = require("./src/utils/embedding");

async function test() {

  const emb = await generateEmbedding("Machine learning study group");

  console.log("Embedding length:", emb.length);

}

test();