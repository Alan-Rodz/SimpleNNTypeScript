// ********************************************************************************
// == Input =======================================================================
export type InputOutputPair = [number, number];

// == Training ====================================================================
export type TrainingDataEntry = { input: InputOutputPair; output: number[]; };
export type TrainingPreset = { name: string; data: TrainingDataEntry[]; };
