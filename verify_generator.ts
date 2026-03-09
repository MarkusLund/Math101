import { generateTasks } from './services/taskGenerator';
import { Operator } from './types';

const runTest = () => {
    console.log("Starting verification...");

    const iterations = 1000;
    let zeroCount = 0;
    let totalOperands = 0;
    let duplicateCount = 0;

    const allOperators = [Operator.ADDITION, Operator.SUBTRACTION, Operator.MULTIPLICATION, Operator.DIVISION];

    for (let i = 0; i < iterations; i++) {
        const tasks = generateTasks(10, 5, false, allOperators);

        tasks.forEach(task => {
            if (task.operand1 === 0) zeroCount++;
            if (task.operand2 === 0) zeroCount++;
            totalOperands += 2;
        });

        // Verify uniqueness within the batch
        const batchProblems = new Set<string>();
        tasks.forEach(task => {
            const key = `${task.operand1}${task.operator}${task.operand2}`;
            if (batchProblems.has(key)) {
                console.error(`Duplicate found in batch: ${key}`);
                duplicateCount++;
            }
            batchProblems.add(key);
        });
    }

    const zeroProbability = zeroCount / totalOperands;
    console.log(`Total operands generated: ${totalOperands}`);
    console.log(`Zero count: ${zeroCount}`);
    console.log(`Zero probability: ${zeroProbability.toFixed(4)}`);

    if (duplicateCount === 0) {
        console.log("PASSED: No duplicates found within batches.");
    } else {
        console.error(`FAILED: ${duplicateCount} duplicates found.`);
    }

    if (zeroProbability < 0.15) {
        console.log("PASSED: Zero probability is low.");
    } else {
        console.warn("WARNING: Zero probability might be too high.");
    }
};

runTest();
