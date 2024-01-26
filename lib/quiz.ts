export type InitialAnswer = {
  [key: string]: Choice;
};

export type Answer = {
  [key: string]: number;
};

export type Archetype = "explore" | "analyze" | "design" | "optimize" | "connect" | "nurture" | "energize" | "achieve";

export type Score = {
  [key in Archetype]: number;
};

type Points = {
  [key in Archetype]?: number;
};

export type Choice = {
  option: string;
  points: Points;
};

export type DeepQuestion = {
  name: string;
  archetype: Archetype;
  statement: string;
};

export type InitialQuestion = {
  name: string;
  choices: Choice[];
  statement: string;
};

export const initialQuestions: InitialQuestion[] = [
  {
    name: "Macro/Micro Lens",
    statement:
      "Considering the saying 'not seeing the forest for the trees', where do you focus when faced with a new problem or situation?",
    choices: [
      {
        option: "Macro (I see the forest): I focus on the big picture, looking for overarching trends and patterns",
        points: {
          explore: 3,
          design: 3,
          connect: 3,
          energize: 3,
        },
      },
      {
        option: "Mostly Macro: While I consider the larger context, I do pay attention to key details",
        points: {
          explore: 2,
          design: 2,
          connect: 2,
          energize: 2,
          optimize: 1,
          analyze: 1,
          nurture: 1,
          achieve: 1,
        },
      },
      {
        option:
          "Balanced: (I see the forest and the trees) I like to see both the overall picture and the intricate details as needed",
        points: {
          explore: 1,
          design: 1,
          connect: 1,
          energize: 1,
          optimize: 1,
          analyze: 1,
          nurture: 1,
          achieve: 1,
        },
      },
      {
        option: "Mostly Micro: I tend to delve into the details, although I keep the broader implications in mind",
        points: {
          explore: 1,
          design: 1,
          connect: 1,
          energize: 1,
          optimize: 2,
          analyze: 2,
          nurture: 2,
          achieve: 2,
        },
      },
      {
        option: "Very Micro (I see the leaves): I concentrate on the specifics and fine points of the situation",
        points: {
          optimize: 3,
          analyze: 3,
          nurture: 3,
          achieve: 3,
        },
      },
    ],
  },
  {
    name: "Head/Heart Lens",
    statement: "When faced with a decision or problem, which statement aligns more with your instinctive focus?",
    choices: [
      {
        option:
          "More Head: I tend to focus on ideas, employing facts and frameworks or constructing stories to make sense of situations",
        points: {
          explore: 3,
          analyze: 3,
        },
      },
      {
        option:
          "More Heart: I prioritize relationships, connecting people, nurturing talent, and understanding emotional dynamics",
        points: {
          connect: 3,
          nurture: 3,
        },
      },
      {
        option:
          "Even: I seek a balance, considering both logical narratives and the emotional dimensions of situations and relationships",
        points: {
          explore: 1,
          connect: 1,
          analyze: 1,
          nurture: 1,
        },
      },
    ],
  },
  {
    name: "How/What Lens",
    statement:
      "In a collaborative project or when solving problems, which approach do you gravitate towards naturally?",
    choices: [
      {
        option:
          "More How: I am drawn to crafting the process, improving efficiency, and ensuring the design is effective",
        points: {
          design: 3,
          optimize: 3,
        },
      },
      {
        option:
          "More What: My focus is on achieving goals, driving results, and rallying the team around a shared objective for success",
        points: {
          achieve: 3,
          energize: 3,
        },
      },
      {
        option:
          "Blend of Both: I strike a balance, giving equal attention to design and efficiency, energy and execution",
        points: {
          design: 1,
          energize: 1,
          optimize: 1,
          achieve: 1,
        },
      },
    ],
  },
];

export const deepQuestions: DeepQuestion[] = [
  {
    name: "Macro Head",
    archetype: "explore",
    statement:
      "I thrive on discovering new ideas and conceptual frameworks; I am energized by exploring possibilities and abstract theories.",
  },
  {
    name: "Micro Head",
    archetype: "analyze",
    statement:
      "I am drawn to data and analysis; I enjoy delving into the details to understand the mechanics of how things work.",
  },
  {
    name: "Macro How",
    archetype: "design",
    statement:
      "I love to design systems and processes; I am focused on the efficiency and elegance of the overarching structure.",
  },
  {
    name: "Micro How",
    archetype: "optimize",
    statement:
      "I am constantly looking for ways to make improvements and tweaks to existing systems to optimize performance.",
  },
  {
    name: "Macro Heart",
    archetype: "connect",
    statement:
      "I prioritize building networks and fostering connections; I believe in the power of relationships to drive collaborative success.",
  },
  {
    name: "Micro Heart",
    archetype: "nurture",
    statement:
      "I focus on the individual; I am attentive to personal development and emotional well-being in my approach to relationships.",
  },
  {
    name: "Macro What",
    archetype: "energize",
    statement:
      "I am passionate about motivating others towards a common goal; I energize and mobilize teams to achieve shared objectives.",
  },
  {
    name: "Micro What",
    archetype: "achieve",
    statement:
      "I am results-driven; I set specific goals and work diligently towards achieving them, often in a hands-on manner.",
  },
];

export function calculateInitialResults(answers: InitialAnswer[]) {
  // Initialize the results object with all archetypes set to 0
  const results = {
    explore: 0,
    analyze: 0,
    design: 0,
    optimize: 0,
    connect: 0,
    nurture: 0,
    energize: 0,
    achieve: 0,
  };

  // Iterate over each answer
  Object.values(answers).forEach((answer) => {
    if (answer.points) {
      Object.entries(answer.points).forEach(([archetype, points]) => {
        if (archetype in results && typeof points === "number") {
          results[archetype as Archetype] += points;
        } else {
          console.warn(`Unrecognized archetype: ${archetype}`);
        }
      });
    }
  });
  return results;
}

export function calculateScores(answers: Answer, initialScores: Score): Score {
  // Build questionToArchetypeMap and counters dynamically from the questions array
  deepQuestions.forEach((section) => {
    initialScores[section.archetype] += answers[section.statement] || 0; // Add score or zero if not answered
  });

  // Normalize scores by dividing by the count of questions for each archetype
  Object.keys(initialScores).forEach((key) => {
    const archetype = key as Archetype;
    initialScores[archetype] *= 10;
  });

  // Return the normalized scores
  return initialScores;
}
