export const shuffle = (array: string[]) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 

export const sum = (notes: {name: string; length: number}[]) => {
  if (!notes) return 0;
  let sum = 0;

  notes.forEach(note => {
    sum += note.length;
  });

  return sum;
}

export const getFraction = (decimal: number) => {
  let denominator;
  for(denominator = 1; (decimal * denominator) % 1 !== 0; denominator++);
  return {numerator: decimal * denominator, denominator: denominator};
}