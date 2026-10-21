"use client";

import { ArgumentData } from "@/lib/types";

interface DiagnosticsConsoleProps {
  argument: ArgumentData;
  selectedId: string;
  onSelectNode: (id: string) => void;
}

function severityClass(severity: string) {
  if (severity === "HIGH") return "text-red-400";
  if (severity === "MEDIUM") return "text-orange-300";
  return "text-yellow-300";
}

export default function DiagnosticsConsole({
  argument,
  selectedId,
  onSelectNode,
}: DiagnosticsConsoleProps) {
  const diagnostics = argument.nodes.filter(
    (node) => node.diagnostic !== null
  );

  return (
    <div className="border-t border-white/10 bg-[#0d0d0d]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="font-mono text-[10px] tracking-widest text-white/40">
          DIAGNOSTICS
        </p>

        <p className="font-mono text-[10px] text-white/30">
          {diagnostics.length} WARNING
          {diagnostics.length === 1 ? "" : "S"}
        </p>
      </div>

      <div className="max-h-[190px] overflow-y-auto">
        {diagnostics.length === 0 ? (
          <div className="px-4 py-6">
            <p className="font-mono text-xs text-green-400">
              ✓ NO DIAGNOSTICS
            </p>

            <p className="mt-2 text-xs text-white/30">
              No obvious reasoning weaknesses detected.
            </p>
          </div>
        ) : (
          diagnostics.map((node) => {
            const diagnostic = node.diagnostic!;
            const isSelected = selectedId === node.id;

            return (
              <button
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`
                  grid w-full
                  grid-cols-[90px_1fr_90px]
                  items-center gap-3
                  border-b border-white/5
                  px-4 py-3
                  text-left
                  transition
                  ${
                    isSelected
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }
                `}
              >
                <span
                  className={`font-mono text-[10px] ${severityClass(
                    diagnostic.severity
                  )}`}
                >
                  {diagnostic.code}
                </span>

                <div>
                  <p className="text-xs text-white/80">
                    {diagnostic.issue}
                  </p>

                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/25">
                    {node.type}
                  </p>
                </div>

                <span
                  className={`text-right font-mono text-[9px] ${severityClass(
                    diagnostic.severity
                  )}`}
                >
                  ● {diagnostic.severity}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}