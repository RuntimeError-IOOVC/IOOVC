"use client";

import {
  Handle,
  Position,
  Node,
  NodeProps,
} from "@xyflow/react";

import {
  ArgumentNodeType,
  Diagnostic,
} from "@/lib/types";

type ArgumentNodeData = {
  nodeType: ArgumentNodeType;
  text: string;
  diagnostic: Diagnostic | null;
  selected: boolean;
  critical: boolean;
};

type ArgumentFlowNode = Node<
  ArgumentNodeData,
  "argument"
>;

const styles = {
  evidence: {
    border: "border-blue-400/50",
    label: "text-blue-300",
  },

  premise: {
    border: "border-green-400/50",
    label: "text-green-300",
  },

  inference: {
    border: "border-orange-400/50",
    label: "text-orange-300",
  },

  conclusion: {
    border: "border-purple-400/50",
    label: "text-purple-300",
  },
};

function severityStyle(
  severity: Diagnostic["severity"]
) {
  if (severity === "HIGH") return "text-red-400";
  if (severity === "MEDIUM") return "text-orange-300";
  return "text-yellow-300";
}

export default function ArgumentNodeCard({
  data,
}: NodeProps<ArgumentFlowNode>) {
  const style = styles[data.nodeType];

  return (
    <div
      className={`
        relative w-[320px]
        rounded-lg border
        bg-[#111111]
        px-4 py-3
        text-white
        shadow-lg
        transition
        ${
          data.critical
            ? "border-red-400 shadow-xl shadow-red-500/20 ring-2 ring-red-500/30"
            : style.border
        }
        ${
          data.selected && !data.critical
            ? "ring-2 ring-white/30"
            : ""
        }
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-white/30 !bg-[#111]"
      />

      {data.critical && (
        <div className="mb-3 flex items-center gap-2 border-b border-red-400/20 pb-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />

          <span className="font-mono text-[9px] font-bold tracking-widest text-red-400">
            CRITICAL FAILURE POINT
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <span
          className={`font-mono text-[10px] tracking-widest ${style.label}`}
        >
          {data.nodeType.toUpperCase()}
        </span>

        {data.diagnostic && (
          <span className="font-mono text-[10px] text-orange-300">
            {data.diagnostic.code} ⚠
          </span>
        )}
      </div>

      <p className="mt-3 text-[13px] leading-5 text-white/85">
        {data.text}
      </p>

      {data.diagnostic && (
        <div className="mt-3 border-t border-white/10 pt-2">
          <span
            className={`font-mono text-[9px] tracking-widest ${severityStyle(
              data.diagnostic.severity
            )}`}
          >
            ● {data.diagnostic.severity}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-white/30 !bg-[#111]"
      />
    </div>
  );
}