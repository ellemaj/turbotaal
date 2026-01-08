export default interface RaceResult {
  totalTime: number; // Total racetime in ms (incl pitstops)
  pitstopCount: number; // Number of pitstops
  pitstopPenaltyTime: number; // Total pitstoptime in ms

  correctAnswers?: number; // Not in use
  wrongAnswers?: number; // Not in use
}
