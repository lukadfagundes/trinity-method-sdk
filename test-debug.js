const { DependencyResolver } = require('./dist/coordination/DependencyResolver.js');

const resolver = new DependencyResolver();

const tasks = [
  { id: 'task1', dependencies: [], status: 'pending' },
  { id: 'task2', dependencies: ['task1'], status: 'pending' },
  { id: 'task3', dependencies: ['task2'], status: 'pending' },
];

const graph = resolver.buildDependencyGraph(tasks);
console.log('Initial ready tasks:', resolver.getNextReadyTasks(graph));

// Simulate task1 completion
graph.nodes.get('task1').status = 'completed';
console.log('After task1 completion:', resolver.getNextReadyTasks(graph));

// Simulate task2 completion
graph.nodes.get('task2').status = 'completed';
console.log('After task2 completion:', resolver.getNextReadyTasks(graph));
