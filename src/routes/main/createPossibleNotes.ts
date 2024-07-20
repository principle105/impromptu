export const majorTriads = {
  C: ["C3", "E3", "G3"],
  "C#": ["C#3", "F3", "G#3"],
  D: ["D3", "F#3", "A3"],
  "D#": ["D#3", "G3", "A#3"],
  E: ["E3", "G#3", "B3"],
  F: ["F3", "A3", "C4"],
  "F#": ["F#3", "A#3", "C#4"],
  G: ["G3", "B3", "D4"],
  "G#": ["G#3", "C4", "D#4"],
  A: ["A3", "C#4", "E4"],
  "A#": ["A#3", "D4", "F4"],
  B: ["B3", "D#4", "F#4"],

  C3: ["C3", "E3", "G3"],
  "C#3": ["C#3", "F3", "G#3"],
  D3: ["D3", "F#3", "A3"],
  "D#3": ["D#3", "G3", "A#3"],
  E3: ["E3", "G#3", "B3"],
  F3: ["F3", "A3", "C4"],
  "F#3": ["F#3", "A#3", "C#4"],
  G3: ["G3", "B3", "D4"],
  "G#3": ["G#3", "C4", "D#4"],
  A3: ["A3", "C#4", "E4"],
  "A#3": ["A#3", "D4", "F4"],
  B3: ["B3", "D#4", "F#4"],

  C4: ["C4", "E4", "G4"],
  "C#4": ["C#4", "F4", "G#4"],
  D4: ["D4", "F#4", "A4"],
  "D#4": ["D#4", "G4", "A#4"],
  E4: ["E4", "G#4", "B4"],
  F4: ["F4", "A4", "C5"],
  "F#4": ["F#4", "A#4", "C#5"],
  G4: ["G4", "B4", "D5"],
  "G#4": ["G#4", "C5", "D#5"],
  A4: ["A4", "C#5", "E5"],
  "A#4": ["A#4", "D5", "F5"],
  B4: ["B4", "D#5", "F#5"],
};

export function createPossibleNotes(root: string) {
  if (root.substring(1, 2) == "#") {
      root = root.substring(0, 2);
  } else {
      root = root.substring(0, 1);
  }
  console.log(root);
  //get original triad
  const rootTriad = majorTriads[root];
  if (!rootTriad) {
      return ["", "", "", "", "", "", "", "", ""];
  }

  //get triad of triad
  let result: any[] = [];
  rootTriad.forEach((note) => {
      result = result.concat(majorTriads[note]);
  });
  return result;
}

//returns first 3 are recommended notes, last 3 are the root of the triad
export function selectQuarterNotesRandom(possibleNotes: string[]) {
  let pickedNotes = [];
  let indexChosen = new Set();
  let rootNotes = [];
  while (pickedNotes.length < 3) {
      let index = Math.floor(Math.random() * possibleNotes.length);

      if (indexChosen.has(index)) {
          continue;
      }
      indexChosen.add(index);
      if (index <= 2) {
          rootNotes.push(possibleNotes[0]);
      } else if (index <= 5) {
          rootNotes.push(possibleNotes[3]);
      } else if (index <= 8) {
          rootNotes.push(possibleNotes[6]);
      }
      pickedNotes.push(possibleNotes[index]);
  }
  // console.log(rootNotes);
  return pickedNotes.concat(rootNotes);
}

//#region Generating Notes
const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// SCALES
function generateMajorScale(key: string) {
  const majorIntervals = [2, 2, 1, 2, 2, 2, 1]; // Whole, Whole, Half, Whole, Whole, Whole, Half
  const scale = [];
  const startIndex = noteNames.indexOf(key);
  let currentIndex = startIndex;

  for (const interval of majorIntervals) {
      scale.push(noteNames[currentIndex]);
      currentIndex = (currentIndex + interval) % noteNames.length;
  }

  console.log(scale);
  return scale;
}

function generateMinorScale(key: string) {
  const minorIntervals = [2, 1, 2, 2, 1, 2, 2]; // Whole, Half, Whole, Whole, Half, Whole, Whole
  const scale = [];
  const startIndex = noteNames.indexOf(key);
  let currentIndex = startIndex;

  for (const interval of minorIntervals) {
      scale.push(noteNames[currentIndex]);
      currentIndex = (currentIndex + interval) % noteNames.length;
  }

  return scale;
}

// INTERVALS
export const generateIntervals = (key: string) => {
  const majorScale = generateMajorScale(key);
  const minorScale = generateMinorScale(key);

  return {
      I: [majorScale[0], majorScale[2], majorScale[4]],
      II: [majorScale[1], majorScale[3], majorScale[5]],
      III: [majorScale[2], majorScale[4], majorScale[6]],
      IV: [majorScale[3], majorScale[5], majorScale[0]],
      V: [majorScale[4], majorScale[6], majorScale[1]],
      VI: [majorScale[5], majorScale[0], majorScale[2]],
      VII: [majorScale[6], majorScale[1], majorScale[3]],

      i: [minorScale[0], minorScale[2], minorScale[4]],
      ii: [minorScale[1], minorScale[3], minorScale[5]],
      iii: [minorScale[2], minorScale[4], minorScale[6]],
      iv: [minorScale[3], minorScale[5], minorScale[0]],
      v: [minorScale[4], minorScale[6], minorScale[1]],
      vi: [minorScale[5], minorScale[0], minorScale[2]],
      vii: [minorScale[6], minorScale[1], minorScale[3]],
  };
};

// CADENCES
const DOMINANT_CADENCE = ["V", "I"];

// PROGRESSION SNIPPETS
const IV_V_vi_IV = ["IV", "V", "VI", "IV"];
const possibleProgressions = [
  ["I", "IV", "I", "I", "IV", "IV", "I", "V", "IV", "I", "V"],
  ["I", "IV", "I", "IV", "I", "V", "IV", "V", "I"],
  ["I", "IV", "I", "IV", "I", "V", "I"],
  ["I", "IV", "I", "V", "IV", "I", "V", "I"],
];

// CHORD PROGRESSIONS
let rand = Math.floor(Math.random() * possibleProgressions.length);
console.log(possibleProgressions[rand] + " progression");
export let realProgression = possibleProgressions[rand];
export const exampleProgression = [
  ...possibleProgressions[rand],
  ...DOMINANT_CADENCE,
];

//#endregion

/* For initializing session */
/* ------------------------ */

export class Note {
  note: string;
  octave: string;
  length: number;

  constructor(note: string = "C", octave: string = "3", length: number = 1) {
      this.note = note;
      this.octave = octave;
      this.length = length;
  }

  name = () => {
      return this.note + this.octave;
  };
}

export class Measure {
  notes: Note[];

  constructor(notes: Note[] = []) {
      this.notes = notes;
  }
}

export function generateEmptyMeasure(noteLengths: number[]) {
  const notes: Note[] = [];

  for (let i = 0; i < noteLengths.length; i++) {
      notes.push(new Note("", "", noteLengths[i]));
  }

  return notes;
}

export function allNotes() {
  return [
      new Note("C", "3"),
      new Note("C#", "3"),
      new Note("D", "3"),
      new Note("D#", "3"),
      new Note("E", "3"),
      new Note("F", "3"),
      new Note("F#", "3"),
      new Note("G", "3"),
      new Note("G#", "3"),
      new Note("A", "3"),
      new Note("A#", "3"),
      new Note("B", "3"),
      new Note("C", "4"),
      new Note("C#", "4"),
      new Note("D", "4"),
      new Note("D#", "4"),
      new Note("E", "4"),
      new Note("F", "4"),
      new Note("F#", "4"),
      new Note("G", "4"),
      new Note("G#", "4"),
      new Note("A", "4"),
      new Note("A#", "4"),
      new Note("B", "4"),
      new Note("C", "5"),
  ];
}

/* ------------------------ */
