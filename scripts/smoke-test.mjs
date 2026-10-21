const samples = [
  {
    name: "SOCIAL MEDIA",
    text: "Social media should be banned for teenagers because teenagers who use more social media report more depression.",
  },
  {
    name: "LECTURE RECORDING",
    text: "University lectures should be recorded because students may be sick and miss class, international students may need to replay difficult explanations, and recordings allow students to revise before exams. Therefore all university lectures should be recorded.",
  },
  {
    name: "BURDEN OF PROOF",
    text: "Unless you prove that friends-with-benefits relationships reduce a person's capacity to commit, we should assume they have no negative effect on commitment.",
  },
];

async function compile(argument) {
  const response = await fetch(
    "http://localhost:3000/api/compile",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        argument,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.details ||
        data.error ||
        "Compile failed"
    );
  }

  return data;
}

async function steelman(argument, graph) {
  const response = await fetch(
    "http://localhost:3000/api/steelman",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        argument,
        graph,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.details ||
        data.error ||
        "Steelman failed"
    );
  }

  return data;
}

function inspectGraph(graph) {
  const nodeTypes = graph.nodes.map(
    (node) => node.type
  );

  const warnings = graph.nodes.filter(
    (node) => node.diagnostic !== null
  );

  return {
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    conclusions: nodeTypes.filter(
      (type) => type === "conclusion"
    ).length,
    inferences: nodeTypes.filter(
      (type) => type === "inference"
    ).length,
    warnings: warnings.length,
    warningCodes: warnings.map(
      (node) => node.diagnostic.code
    ),
  };
}

async function main() {
  console.log(
    "\nARGUMENT ENGINE — SMOKE TEST\n"
  );

  for (const sample of samples) {
    console.log(
      `▶ ${sample.name}`
    );

    try {
      const compiled = await compile(
        sample.text
      );

      const stats =
        inspectGraph(compiled);

      console.log("  COMPILE: PASS");
      console.log(
        `  Nodes: ${stats.nodes}`
      );
      console.log(
        `  Edges: ${stats.edges}`
      );
      console.log(
        `  Conclusions: ${stats.conclusions}`
      );
      console.log(
        `  Inferences: ${stats.inferences}`
      );
      console.log(
        `  Warnings: ${stats.warnings}`
      );
      console.log(
        `  Codes: ${
          stats.warningCodes.join(", ") ||
          "none"
        }`
      );

      if (
        stats.conclusions < 1
      ) {
        console.log(
          "  ⚠ NO CONCLUSION"
        );
      }

      if (
        stats.inferences < 1
      ) {
        console.log(
          "  ⚠ NO INFERENCE"
        );
      }

      const repaired =
        await steelman(
          sample.text,
          compiled
        );

      console.log(
        "  STEELMAN: PASS"
      );

      console.log(
        `  Repairs: ${repaired.changes.length}`
      );

      console.log(
        `  Repaired warnings: ${
          inspectGraph(
            repaired.repaired
          ).warnings
        }`
      );
    } catch (error) {
      console.log(
        "  ❌ FAIL"
      );

      console.log(
        `  ${error.message}`
      );
    }

    console.log("");
  }
}

main();