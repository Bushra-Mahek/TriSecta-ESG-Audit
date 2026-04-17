import crypto from "crypto";

export const generateMerkleRoot = (hashes) => {
  if (hashes.length === 0) return null;

  let currentLevel = hashes;

  while (currentLevel.length > 1) {
    let nextLevel = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1] || left;

      const combined = crypto
        .createHash("sha256")
        .update(left + right)
        .digest("hex");

      nextLevel.push(combined);
    }

    currentLevel = nextLevel;
  }

  return currentLevel[0];
};