// ********************************************************************************
// == Activation Function =========================================================
export const sigmoidFn = (x: number) => 1 / (1 + Math.exp(-x));

// == Linear Algebra ==============================================================
/**
 * Computes the dot product between two vectors
 * @param a The first vector
 * @param b The second vector
 * @returns The dot product of the two vectors
 */
const computeVectorDotProduct = (a: number[], b: number[]): number => {
  if (a.length !== b.length) throw new Error('Vectors must have the same length for dot product calculation');

  return a.reduce((acc, value, i) => acc + value * b[i], 0);
};

/**
 * Transposes a matrix
 * @param matrix The matrix to be transposed
 * @returns The transposed matrix
 */
const getTransposedMatrix = (matrix: number[][]): number[][] => {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const transposedMatrix: number[][] = [];

  for (let i = 0; i < numCols; i++) {
    const newRow: number[] = [];
    for (let j = 0; j < numRows; j++) {
      newRow.push(matrix[j][i]);
    }
    transposedMatrix.push(newRow);
  }

  return transposedMatrix;
};

/**
 * Performs matrix multiplication between a vector and a matrix.
 * @param vector The vector to be multiplied
 * @param matrix The matrix to be multiplied
 * @returns The result of the multiplication
 */
export const computeVectorTimesMatrix = (vector: number[], matrix: number[][]) => {
  const result = [];
  for (let i = 0; i < matrix[0].length; i++) {
    const column = matrix.map(row => row[i]);
    result.push(computeVectorDotProduct(vector, column));
  }
  return result;
};


/**
 * Performs matrix multiplication between a vector and the transpose of a matrix.
 * @param vector The vector to be multiplied
 * @param matrix The matrix whose transpose is to be multiplied
 * @returns The result of the multiplication
 */
export const computeVectorTimesTransposedMatrix = (vector: number[], matrix: number[][]) => {
  const transposedB = getTransposedMatrix(matrix);
  return computeVectorTimesMatrix(vector, transposedB);
};

// == Random ======================================================================
export const generateRandomNumber = (min: number, max: number) => Math.random() * (max - min) + min;
