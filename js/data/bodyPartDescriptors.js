const bodyPartDescriptors = {
  // Female Descriptors
  breasts: ['flat', 'tiny', 'small', 'pert', 'modest', 'ample', 'large', 'heavy', 'massive', 'huge'],
  nipples: ['inverted', 'tiny', 'small', 'puffy', 'protruding', 'large'],
  vagina: ['very tight', 'tight', 'snug', 'loose', 'gaping'],
  // Male Descriptors
  penis: ['tiny', 'small', 'slender', 'average', 'thick', 'large', 'huge', 'massive'],
  // Universal Descriptors
  face: ['soft', 'oval', 'round', 'heart-shaped', 'delicate', 'chiseled', 'freckled'],
  eyes: ['almond-shaped', 'round', 'upturned', 'large', 'doe-eyed', 'soulful', 'bright'],
  lips: ['thin', 'slender', 'average', 'full', 'plump', 'pillowy'],
  arms: ['thin', 'slender', 'average', 'thick', 'burly'],
  hands: ['tiny', 'small', 'delicate', 'average-sized', 'large', 'huge'],
  belly: ['washboard', 'flat', 'soft', 'pudgy', 'pot-bellied', 'bloated'],
  buttocks: ['flat', 'small', 'pert', 'rounded', 'large', 'ample', 'huge'],
  thighs: ['thin', 'slender', 'average', 'sturdy', 'thick', 'massive'],
  calves: ['thin', 'slender', 'average', 'strong', 'thick'],
  feet: ['tiny', 'small', 'dainty', 'average-sized', 'large', 'huge'],
};

// Define which descriptors are gender-specific to allow for filtering
const femaleOnlyDescriptors = ['breasts', 'nipples', 'vagina'];
const maleOnlyDescriptors = ['penis'];
