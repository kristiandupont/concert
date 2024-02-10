import { Context, Element } from "@b9g/crank";

// Config:
const framerate = 30;
const springConstant = 0.035;
const damping = 0.998;

const rows = 14;
const cols = 20;

type Node = {
  // x: number;
  // y: number;
  z: number;
  velocity: number;
};

function initializeNodes(rows: number, cols: number, initialZ = 0): Node[][] {
  const nodes = new Array(rows)
    .fill(0)
    .map(() =>
      new Array(cols).fill(0).map(() => ({ z: initialZ, velocity: 0 })),
    );

  return nodes;
}

function updateNodes(nodes: Node[][]) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      const distances = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const ni = i + dx;
          const nj = j + dy;
          if (ni < 0 || ni >= nodes.length || nj < 0 || nj >= nodes[i].length)
            continue;

          const neighbor = nodes[ni][nj];
          const difference = nodes[i][j].z - neighbor.z;
          distances.push(difference);
        }
      }

      const force =
        (distances.reduce((a, b) => a + b, 0) / distances.length) *
        -springConstant;

      nodes[i][j].velocity += force;
      nodes[i][j].velocity *= damping;
      nodes[i][j].z += nodes[i][j].velocity;

      if (nodes[i][j].z < -10) {
        nodes[i][j].z = -10;
        nodes[i][j].velocity *= -0.1;
      }

      if (nodes[i][j].z > 10) {
        nodes[i][j].z = 10;
        nodes[i][j].velocity *= -0.1;
      }
    }
  }
}

export function* Wave(this: Context): Generator<Element> {
  const nodes = initializeNodes(rows, cols);

  while (true) {
    setTimeout(() => this.refresh(), 1000 / framerate);

    // Irritate the waters now and then
    if (Math.random() < 0.1) {
      nodes[Math.floor(Math.random() * rows)][
        Math.floor(Math.random() * cols)
      ].z = 100;
    }
    updateNodes(nodes);

    yield (
      <svg
        className="absolute h-full w-full"
        viewBox={`0 0 ${cols * 5} ${rows * 5}`}
      >
        {nodes.map((row, y) =>
          row.map((node, x) => (
            <circle
              cx={x * 5}
              cy={y * 5}
              r={node.z / 8 + 0.1}
              fill="rgb(14 116 144)" // Tailwind cyan-700
              stroke="white"
              stroke-width={0.02 * node.z + 0.1}
            />
          )),
        )}
      </svg>
    );
  }
}
