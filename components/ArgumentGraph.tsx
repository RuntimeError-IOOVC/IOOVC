"use client";

import dagre from "@dagrejs/dagre";

import {
  ReactFlow,
  Background,
  MarkerType,
  Node,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { ArgumentData } from "@/lib/types";
import ArgumentNodeCard from "./ArgumentNodeCard";

interface ArgumentGraphProps {
  argument: ArgumentData;
  selectedId: string;
  criticalNodeIds: string[];
  onSelectNode: (id: string) => void;
}

const nodeTypes = {
  argument: ArgumentNodeCard,
};

const NODE_WIDTH = 320;
const NODE_HEIGHT = 115;

function calculatePositions(
  argument: ArgumentData
) {
  const graph =
    new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "TB",
    ranksep: 55,
    nodesep: 45,
    marginx: 25,
    marginy: 20,
});

  argument.nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  argument.edges.forEach((edge) => {
    graph.setEdge(
      edge.source,
      edge.target
    );
  });

  dagre.layout(graph);

  const positions = new Map<
    string,
    {
      x: number;
      y: number;
    }
  >();

  argument.nodes.forEach((node) => {
    const position =
      graph.node(node.id);

    positions.set(node.id, {
      x:
        position.x -
        NODE_WIDTH / 2,

      y:
        position.y -
        NODE_HEIGHT / 2,
    });
  });

  return positions;
}

export default function ArgumentGraph({
  argument,
  selectedId,
  criticalNodeIds,
  onSelectNode,
}: ArgumentGraphProps) {
  const positions =
    calculatePositions(argument);

  const nodes: Node[] =
    argument.nodes.map((node) => ({
      id: node.id,

      type: "argument",

      position:
        positions.get(node.id) ?? {
          x: 0,
          y: 0,
        },

      data: {
        nodeType: node.type,
        text: node.text,
        diagnostic:
          node.diagnostic,
        selected:
          selectedId === node.id,
        critical:
          criticalNodeIds.includes(
            node.id
          ),
      },
    }));

  const edges: Edge[] =
    argument.edges.map((edge) => {
      const critical =
        criticalNodeIds.includes(
          edge.source
        ) ||
        criticalNodeIds.includes(
          edge.target
        );

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,

        animated: critical,

        markerEnd: {
          type:
            MarkerType.ArrowClosed,

          color: critical
            ? "#f87171"
            : "#71717a",
        },

        style: {
          strokeWidth:
            critical ? 3 : 2,

          stroke: critical
            ? "#f87171"
            : "#52525b",
        },
      };
    });

  return (
    <div className="h-[calc(100vh-360px)] min-h-[320px] w-full">

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.08,
          maxZoom: 1.15,
        }}
        minZoom={0.3}
        proOptions={{
          hideAttribution: true,
        }}
        onNodeClick={(_, node) =>
          onSelectNode(node.id)
        }
      >
        <Background />

      </ReactFlow>

    </div>
  );
}