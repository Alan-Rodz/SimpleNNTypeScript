import { generateRandomNumber, computeVectorTimesMatrix, computeVectorTimesTransposedMatrix, sigmoidFn } from '@/math/function';

// ********************************************************************************
// == Constant ====================================================================
const RANDOM_NUMBER_THRESHOLD = 0.5;

// == Class =======================================================================
/**
 * Simple neural network class with one input layer,
 * one hidden layer and one output layer
 */
export class NeuralNetwork_1_1_1 {
    // -- Attribute ---------------------------------------------------------------
    private hiddenLayerInputWeights: number[][];
    private hiddenLayerOutputWeights: number[][];

    // -- Lifecycle ---------------------------------------------------------------
    constructor(private inputNodes: number, private hiddenNodes: number, private outputNodes: number, private learningRate: number) {
        // initialize weights randomly
        this.hiddenLayerInputWeights = this.initializeWeights(this.inputNodes, this.hiddenNodes);
        this.hiddenLayerOutputWeights = this.initializeWeights(this.hiddenNodes, this.outputNodes);
    }

    private initializeWeights(rows: number, cols: number): number[][] {
        const weights: number[][] = [];
        for (let i = 0; i < rows; i++) {
            weights[i] = [/*default empty*/];
            for (let j = 0; j < cols; j++) {
                weights[i][j] = generateRandomNumber(-RANDOM_NUMBER_THRESHOLD, RANDOM_NUMBER_THRESHOLD);
            }
        }
        return weights;
    }

    // -- Usage -------------------------------------------------------------------
    public train(inputData: number[], targetData: number[]): void {
        // .. forward pass ........................................................
        // compute the inputs to the hidden layer by performing matrix
        // multiplication between the input data and the weights of the hidden layer
        const hiddenLayerInputs = computeVectorTimesMatrix(inputData, this.hiddenLayerInputWeights);

        // apply the sigmoid function to the hidden layer inputs to
        // get the hidden layer outputs
        const hiddenLayerOutputs = hiddenLayerInputs.map((hiddenInput) => sigmoidFn(hiddenInput));

        // compute the inputs to the output layer by performing matrix
        // multiplication between the hidden layer outputs and the weights of the output layer
        const outputLayerInputs = computeVectorTimesMatrix(hiddenLayerOutputs, this.hiddenLayerOutputWeights);

        // apply the sigmoid function to the output layer inputs to
        // get the output layer outputs
        const outputLayerOutputs = outputLayerInputs.map((outputLayerInput) => sigmoidFn(outputLayerInput));

        // .. backpropagation .....................................................
        // compute the error at the output layer by taking the element wise
        // difference between the target data and the output layer outputs
        const outputLayerErrors = targetData.map((target, i) => target - outputLayerOutputs[i]);

        // compute the error at the hidden layer by performing matrix
        // multiplication between the output layer errors and the transposed
        // weights of the output layer
        const hiddenLayerErrors = computeVectorTimesTransposedMatrix(outputLayerErrors, this.hiddenLayerOutputWeights);

        // .. weights update ......................................................
        // update weights of the output layer by adjusting them based on
        // the output errors and the gradients of the sigmoid function
        // at the output layer
        for (let i = 0; i < this.hiddenLayerOutputWeights.length; i++) {
            for (let j = 0; j < this.hiddenLayerOutputWeights[0].length; j++) {
                this.hiddenLayerOutputWeights[i][j] += this.learningRate * outputLayerErrors[j] * outputLayerOutputs[j] * (1 - outputLayerOutputs[j]) * hiddenLayerOutputs[i];
            }
        }

        // update weights of the hidden layer by adjusting them based on
        // the hidden errors and the gradients of the sigmoid function
        // at the hidden layer
        for (let i = 0; i < this.hiddenLayerInputWeights.length; i++) {
            for (let j = 0; j < this.hiddenLayerInputWeights[0].length; j++) {
                this.hiddenLayerInputWeights[i][j] += this.learningRate * hiddenLayerErrors[j] * hiddenLayerOutputs[j] * (1 - hiddenLayerOutputs[j]) * inputData[i];
            }
        }
    }

    public predict(inputData: number[]): number[] {
        const hiddenLayerInputs = computeVectorTimesMatrix(inputData, this.hiddenLayerInputWeights);
        const hiddenLayerOutputs = hiddenLayerInputs.map(hiddenInput => sigmoidFn(hiddenInput));

        const outputLayerInputs = computeVectorTimesMatrix(hiddenLayerOutputs, this.hiddenLayerOutputWeights);
        const outputLayerOutputs = outputLayerInputs.map(outputLayerInput => sigmoidFn(outputLayerInput));

        return outputLayerOutputs;
    }
}
