import MidiWriter from 'midi-writer-js';

const TICKS_PER_QUARTER = 128;

// Builds a single-track MIDI file. Note times are seconds; bpm sets the tempo
// (120 is used when the tempo is unknown). Returns the file bytes.
export function exportMidi(notes, bpm) {
  const track = new MidiWriter.Track();
  track.setTempo(bpm ?? 120);
  const secondsToTicks = seconds => Math.round((seconds * (bpm ?? 120) * TICKS_PER_QUARTER) / 60);
  for (const note of notes) {
    const startTick = secondsToTicks(note.start);
    const durationTicks = Math.max(1, secondsToTicks(note.end) - startTick);
    track.addEvent(
      new MidiWriter.NoteEvent({
        pitch: [note.pitch],
        duration: `T${durationTicks}`,
        startTick,
        velocity: Math.round(Math.min(1, Math.max(0, note.velocity)) * 100),
      }),
    );
  }
  return new MidiWriter.Writer([track]).buildFile();
}
