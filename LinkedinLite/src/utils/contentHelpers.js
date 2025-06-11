export function getContentPrompt(level, content) {
  const prompts = {
    simplified: `Rephrase the following achievement in a simplified, professional manner (3-5 lines):`,
    minimal: `Condense the following achievement into a single, impactful sentence:`
  };
  
  return `${prompts[level]} "${content}"`;
}