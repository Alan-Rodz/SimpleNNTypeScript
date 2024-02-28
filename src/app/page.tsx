'use client';

import { Button, Center, Input, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useState } from 'react';

import { NeuralNetwork_1_1_1 } from '@/class/NeuralNetwork_1_1_1';
import { TrainingPreset, TrainingDataEntry } from '@/math/type';

// ********************************************************************************
// == Constant ====================================================================
const INPUT_NODES = 2;
const OUTPUT_NODES = 1;

const DEFAULT_HIDDEN_NODES = 3;
const DEFAULT_ITERATIONS = 100000;
const DEFAULT_LEARNING_RATE = 0.1;

const orPreset: TrainingPreset = {
  name: 'OR',
  data: [
    { input: [0, 0], output: [0] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [1] },
  ],
};

const andPreset: TrainingPreset = {
  name: 'AND',
  data: [
    { input: [0, 0], output: [0] },
    { input: [0, 1], output: [0] },
    { input: [1, 0], output: [0] },
    { input: [1, 1], output: [1] },
  ],
};

const xorPreset: TrainingPreset = {
  name: 'XOR',
  data: [
    { input: [0, 0], output: [0] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] },
  ],
};

const nandPreset: TrainingPreset = {
  name: 'NAND',
  data: [
    { input: [0, 0], output: [1] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] },
  ],
};

const presets: TrainingPreset[] = [orPreset, andPreset, xorPreset, nandPreset];

// == Component ===================================================================
const SimpleNeuralNetwork = () => {
  // -- State ---------------------------------------------------------------------
  const [inputX1, setInputX1] = useState<number>(0);
  const [inputX2, setInputX2] = useState<number>(0);
  const [outputY, setOutputY] = useState<number>(0);

  const [hiddenNodes, setHiddenNodes] = useState<number>(DEFAULT_HIDDEN_NODES);
  const [iterations, setIterations] = useState<number>(DEFAULT_ITERATIONS);
  const [learningRate, setLearningRate] = useState<number>(DEFAULT_LEARNING_RATE);

  const [hasBeenTrained, setHasBeenTrained] = useState<boolean>(false);
  const [trainingDataEntries, setTrainingDataEntries] = useState<TrainingDataEntry[]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);

  const nn = new NeuralNetwork_1_1_1(INPUT_NODES, hiddenNodes, OUTPUT_NODES, learningRate);

  // -- Handler -------------------------------------------------------------------
  const handleSetPreset = (preset: TrainingDataEntry[]) => () => {
    setTrainingDataEntries(preset);
    setHasBeenTrained(false);
  };

  const handleAddTrainingDataEntry = (entry: TrainingDataEntry) => setTrainingDataEntries([...trainingDataEntries, entry]);
  const handleRemoveTrainingData = (entry: TrainingDataEntry) => () => setTrainingDataEntries(trainingDataEntries.filter((data) => data !== entry));

  const handleTrain = () => {
    for (let i = 0; i < iterations; i++) {
      // randomly pick a training data
      const data = trainingDataEntries[Math.floor(Math.random() * trainingDataEntries.length)];

      nn.train(data.input, data.output);
    }

    const predictions: number[] = [];
    for (let i = 0; i < trainingDataEntries.length; i++) {
      predictions.push(nn.predict(trainingDataEntries[i].input)[0]);
    }

    setHasBeenTrained(true);
    setPredictions(predictions);
  };
  const handleReset = () => {
    setTrainingDataEntries([]);
    setHasBeenTrained(false);
  };

  // -- UI ------------------------------------------------------------------------
  const isTrainDisabled = trainingDataEntries.length === 0 || hasBeenTrained || hiddenNodes < 1 || iterations < 1 || learningRate < 0.1;
  const arePresetsDisabled = hasBeenTrained;
  const isAddDataDisabled = hasBeenTrained;
  const isRemoveDataDisabled = hasBeenTrained;
  const isResetDisabled = !hasBeenTrained;
  return (
    <Center flexDir='column' gap='1em' padding='1em'>
      {/* == NN Architecture .................................................. */}
      <Center flexDir='column'>
        <Center><Text>Input layer nodes</Text><Input isDisabled type='number' value={INPUT_NODES} /></Center>
        <Center><Text>Hidden layer nodes</Text><Input type='number' value={hiddenNodes} onChange={(e) => setHiddenNodes(Number(e.target.value))} /></Center>
        <Center><Text>Output layer nodes</Text><Input isDisabled type='number' value={OUTPUT_NODES} /></Center>
        <Center><Text>Learning Rate</Text><Input max={0.99} min={0.1} type='number' value={learningRate} onChange={(e) => setLearningRate(Number(e.target.value))} /></Center>
        <Center><Text>Iterations</Text><Input type='number' value={iterations} onChange={(e) => setIterations(Number(e.target.value))} /></Center>
      </Center>

      {/* == Presets .......................................................... */}
      <Center gap='2em'>
        <Text fontWeight='bold'>Presets</Text>
        <Center gap='1em'>{presets.map((preset, i) => (<Button isDisabled={arePresetsDisabled} key={i} onClick={handleSetPreset(preset.data)}>{preset.name}</Button>))}</Center>
      </Center>

      {/* == Add Data ......................................................... */}
      <Center gap='2em'>
        <Center><Text>Input X1</Text><Input onChange={(e) => setInputX1(Number(e.target.value))} type='number' value={inputX1} /></Center>
        <Center><Text>Input X2</Text><Input onChange={(e) => setInputX2(Number(e.target.value))} type='number' value={inputX2} /></Center>
        <Center><Text>Output Y</Text> <Input onChange={(e) => setOutputY(Number(e.target.value))} type='number' value={outputY} /></Center>
        <Button isDisabled={isAddDataDisabled} onClick={() => handleAddTrainingDataEntry({ input: [inputX1, inputX2], output: [outputY] })}>Add Training Data</Button>
      </Center>

      {/* == Train and Reset .................................................. */}
      <Button isDisabled={isTrainDisabled} onClick={() => handleTrain()}>Train</Button>
      <Button isDisabled={isResetDisabled} onClick={handleReset}>Reset</Button>

      {/* == Data Visualization ............................................... */}
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Input X1</Th>
              <Th>Input X2</Th>
              <Th>Desired Output</Th>
              {hasBeenTrained && (<Th>Prediction</Th>)}
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              trainingDataEntries.map((dataEntry, i) =>
              (
                <Tr key={i}>
                  <Td>{dataEntry.input[0]}</Td>
                  <Td>{dataEntry.input[1]}</Td>
                  <Td>{dataEntry.output}</Td>
                  {hasBeenTrained && (<Td>{predictions[i]}</Td>)}
                  <Td><Button isDisabled={isRemoveDataDisabled} onClick={handleRemoveTrainingData(dataEntry)}>Remove</Button></Td>
                </Tr>
              )
              )
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Center >
  );
};

// == Export ======================================================================
export default SimpleNeuralNetwork;
