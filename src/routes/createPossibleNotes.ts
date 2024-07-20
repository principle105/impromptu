import { writable } from "svelte/store";

export interface recording {
  name: string;
  duration: number;
}
let empty_recording: recording = {
  name: "",
  duration: -1,
};

export let cntIndex = [0];
export let fullNoteLength = 2;

export let noteChoices = writable([["", "", "", "", "", ""]]);
export let noteLength = writable([fullNoteLength/4, fullNoteLength/4, fullNoteLength/4]);
export let playbackArr: recording[] = Array.from({ length: 10000 }, () => empty_recording);

// very bad implementation whatever
export const majorTriads = {
  "C": ["C3", "E3", "G3"],
  "C#": ["C#3", "F3", "G#3"],
  "D": ["D3", "F#3", "A3"],
  "D#": ["D#3", "G3", "A#3"],
  "E": ["E3", "G#3", "B3"],
  "F": ["F3", "A3", "C4"],
  "F#": ["F#3", "A#3", "C#4"],
  "G": ["G3", "B3", "D4"],
  "G#": ["G#3", "C4", "D#4"],
  "A": ["A3", "C#4", "E4"],
  "A#": ["A#3", "D4", "F4"],
  "B": ["B3", "D#4", "F#4"],

  "C3": ["C3", "E3", "G3"],
  "C#3": ["C#3", "F3", "G#3"],
  "D3": ["D3", "F#3", "A3"],
  "D#3": ["D#3", "G3", "A#3"],
  "E3": ["E3", "G#3", "B3"],
  "F3": ["F3", "A3", "C4"],
  "F#3": ["F#3", "A#3", "C#4"],
  "G3": ["G3", "B3", "D4"],
  "G#3": ["G#3", "C4", "D#4"],
  "A3": ["A3", "C#4", "E4"],
  "A#3": ["A#3", "D4", "F4"],
  "B3": ["B3", "D#4", "F#4"],

  "C4": ["C4", "E4", "G4"],
  "C#4": ["C#4", "F4", "G#4"],
  "D4": ["D4", "F#4", "A4"],
  "D#4": ["D#4", "G4", "A#4"],
  "E4": ["E4", "G#4", "B4"],
  "F4": ["F4", "A4", "C5"],
  "F#4": ["F#4", "A#4", "C#5"],
  "G4": ["G4", "B4", "D5"],
  "G#4": ["G#4", "C5", "D#5"],
  "A4": ["A4", "C#5", "E5"],
  "A#4": ["A#4", "D5", "F5"],
  "B4": ["B4", "D#5", "F#5"],
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
  rootTriad.forEach(note => {
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