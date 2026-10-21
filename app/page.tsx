"use client";

import { useState } from "react";

import { mockArgument } from "@/lib/mockArgument";
import { ArgumentData } from "@/lib/types";

import {
  findMinimumLogicalCut,
  DestroyResult,
} from "@/lib/graphAnalysis";

import ArgumentGraph from "@/components/ArgumentGraph";
import DiagnosticsConsole from "@/components/DiagnosticsConsole";

interface SteelmanChange {
  type:
    | "ADDED_PREMISE"
    | "EXPLICIT_ASSUMPTION"
    | "NARROWED_CLAIM"
    | "REPAIRED_INFERENCE"
    | "EVIDENCE_REQUIREMENT";

  description: string;
}

interface SteelmanResponse {
  repaired: ArgumentData;
  changes: SteelmanChange[];
}

const sampleArguments = [
  {
    label: "SOCIAL MEDIA",
    text: "Social media should be banned for teenagers because teenagers who use more social media report more depression.",
  },

  {
    label: "LECTURE RECORDING",
    text: "University lectures should be recorded because students may be sick and miss class, international students may need to replay difficult explanations, and recordings allow students to revise before exams. Therefore all university lectures should be recorded.",
  },

  {
    label: "BURDEN OF PROOF",
    text: "Unless you prove that friends-with-benefits relationships reduce a person's capacity to commit, we should assume they have no negative effect on commitment.",
  },
];

export default function Home() {
  const [argumentText, setArgumentText] =
    useState(mockArgument.source);

  const [argument, setArgument] =
    useState<ArgumentData>(
      mockArgument
    );

  const [
    selectedId,
    setSelectedId,
  ] = useState("inference-1");

  const [
    isCompiling,
    setIsCompiling,
  ] = useState(false);

  const [
    isSteelmanning,
    setIsSteelmanning,
  ] = useState(false);

  const engineBusy =
  isCompiling || isSteelmanning;

const engineStatus = isCompiling
  ? "COMPILING REASONING GRAPH"
  : isSteelmanning
    ? "REBUILDING ARGUMENT"
    : "";

  const [
    compileError,
    setCompileError,
  ] = useState("");

  const [
    criticalNodeIds,
    setCriticalNodeIds,
  ] = useState<string[]>([]);

  const [
    destroyResult,
    setDestroyResult,
  ] =
    useState<DestroyResult | null>(
      null
    );

  const [
    originalArgument,
    setOriginalArgument,
  ] =
    useState<ArgumentData | null>(
      null
    );

  const [
    steelmanResult,
    setSteelmanResult,
  ] =
    useState<SteelmanResponse | null>(
      null
    );

  const [
    showingSteelman,
    setShowingSteelman,
  ] = useState(false);

  const selected =
    argument.nodes.find(
      (node) =>
        node.id === selectedId
    );

  const warningCount =
    argument.nodes.filter(
      (node) =>
        node.diagnostic !== null
    ).length;

  async function compileArgument() {
    if (!argumentText.trim()) {
      setCompileError(
        "Enter an argument first."
      );

      return;
    }

    try {
      setIsCompiling(true);
      setCompileError("");

      setCriticalNodeIds([]);
      setDestroyResult(null);

      setOriginalArgument(null);
      setSteelmanResult(null);
      setShowingSteelman(false);

      const response =
        await fetch(
          "/api/compile",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              argument:
                argumentText,
            }),
          }
        );

      const data =
        await response.json();

      const engineBusy = isCompiling || isSteelmanning;

const engineStatus = isCompiling
  ? "COMPILING REASONING GRAPH"
  : isSteelmanning
    ? "REBUILDING ARGUMENT"
    : "";

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            "Compilation failed."
        );
      }

      const newArgument =
        data as ArgumentData;

      setArgument(newArgument);

      if (
        newArgument.nodes
          .length > 0
      ) {
        setSelectedId(
          newArgument.nodes[0].id
        );
      }
    } catch (error) {
      console.error(error);

      setCompileError(
        error instanceof Error
          ? error.message
          : "Compilation failed."
      );
    } finally {
      setIsCompiling(false);
    }
  }

  function destroyArgument() {
    const result =
      findMinimumLogicalCut(
        argument
      );

    if (!result) return;

    setDestroyResult(result);

    setCriticalNodeIds(
      result.nodeIds
    );

    if (
      result.nodeIds.length > 0
    ) {
      setSelectedId(
        result.nodeIds[0]
      );
    }
  }

  async function steelmanArgument() {
    try {
      setIsSteelmanning(true);
      setCompileError("");

      const baseArgument =
        showingSteelman &&
        originalArgument
          ? originalArgument
          : argument;

      const response =
        await fetch(
          "/api/steelman",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              argument:
                argumentText,

              graph:
                baseArgument,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            "Steelman failed."
        );
      }

      const result =
        data as SteelmanResponse;

      setOriginalArgument(
        baseArgument
      );

      setSteelmanResult(
        result
      );

      setArgument(
        result.repaired
      );

      setShowingSteelman(true);

      setCriticalNodeIds([]);
      setDestroyResult(null);

      if (
        result.repaired.nodes
          .length > 0
      ) {
        setSelectedId(
          result.repaired.nodes[0]
            .id
        );
      }
    } catch (error) {
      console.error(error);

      setCompileError(
        error instanceof Error
          ? error.message
          : "Steelman failed."
      );
    } finally {
      setIsSteelmanning(false);
    }
  }

  function showOriginal() {
    if (!originalArgument) {
      return;
    }

    setArgument(
      originalArgument
    );

    setShowingSteelman(false);

    setCriticalNodeIds([]);
    setDestroyResult(null);

    if (
      originalArgument.nodes
        .length > 0
    ) {
      setSelectedId(
        originalArgument
          .nodes[0].id
      );
    }
  }

  function showSteelman() {
    if (!steelmanResult) {
      return;
    }

    setArgument(
      steelmanResult.repaired
    );

    setShowingSteelman(true);

    setCriticalNodeIds([]);
    setDestroyResult(null);

    if (
      steelmanResult.repaired
        .nodes.length > 0
    ) {
      setSelectedId(
        steelmanResult.repaired
          .nodes[0].id
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      <header className="flex h-14 items-center justify-between border-b border-white/10 px-6">
       <div className="flex items-center gap-3">
  <div className="h-3 w-3 rounded-full bg-green-400" />

  <div className="flex items-baseline gap-4">
    <h1 className="font-mono text-sm font-semibold tracking-widest">
      ARGUMENT ENGINE
    </h1>

    <span className="hidden text-[10px] text-white/25 lg:inline">
      A debugger for human arguments.
    </span>
  </div>
</div>

        <div className="flex items-center gap-4">
          {showingSteelman && (
            <span className="font-mono text-[10px] text-green-300">
              ● STEELMAN MODE
            </span>
          )}

          <span className="font-mono text-[10px] text-orange-300">
            ⚠ {warningCount} WARNING
            {warningCount === 1
              ? ""
              : "S"}
          </span>

          <span className="font-mono text-xs text-white/40">
            v0.0.1
          </span>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-56px)] grid-cols-[320px_minmax(0,1fr)_320px]">

        {/* LEFT */}

        <section className="border-r border-white/10 p-5">
          <div className="mb-4">
  <p className="font-mono text-xs tracking-widest text-white/40">
    ARGUMENT SOURCE
  </p>

  <p className="mt-2 text-xs leading-5 text-white/30">
    Paste an argument. Compile its reasoning.
    Find where it breaks.
  </p>
</div>

<div className="mb-3 flex flex-wrap gap-2">
  {sampleArguments.map((sample) => (
    <button
      key={sample.label}
      disabled={engineBusy}
      onClick={() => {
        setArgumentText(sample.text);
        setCompileError("");
      }}
      className="
        rounded-md
        border border-white/10
        bg-white/[0.03]
        px-2.5 py-1.5
        font-mono text-[8px]
        tracking-wider
        text-white/40
        transition
        hover:border-white/20
        hover:bg-white/[0.06]
        hover:text-white/70
        disabled:cursor-not-allowed disabled:opacity-30
      "
    >
      {sample.label}
    </button>
  ))}
</div>

          <textarea
            value={argumentText}
            disabled={engineBusy}
            onChange={(event) =>
              setArgumentText(
                event.target.value
              )
            }
            placeholder="Enter an argument..."
            className="h-64 w-full resize-none rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-6 outline-none placeholder:text-white/20 focus:border-white/30 disabled:opacity-50"
          />

          <button
            onClick={
              compileArgument
            }
            disabled={
              isCompiling ||
              isSteelmanning
            }
            className="mt-4 w-full rounded-lg bg-white px-4 py-3 font-mono text-sm font-bold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isCompiling
              ? "COMPILING..."
              : "COMPILE ARGUMENT"}
          </button>

          <button
            onClick={
              destroyArgument
            }
            disabled={
              isCompiling ||
              isSteelmanning ||
              argument.nodes
                .length === 0
            }
            className="mt-3 w-full rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-3 font-mono text-xs font-bold tracking-wider text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            DESTROY MY ARGUMENT
          </button>

          <button
            onClick={
              steelmanArgument
            }
            disabled={
              isCompiling ||
              isSteelmanning ||
              argument.nodes
                .length === 0
            }
            className="mt-3 w-full rounded-lg border border-green-400/30 bg-green-400/5 px-4 py-3 font-mono text-xs font-bold tracking-wider text-green-300 transition hover:bg-green-400/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {isSteelmanning
              ? "REBUILDING..."
              : "STEELMAN"}
          </button>

          {compileError && (
            <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/5 p-3">
              <p className="font-mono text-xs text-red-400">
                ENGINE ERROR
              </p>

              <p className="mt-2 text-sm leading-5 text-white/60">
                {compileError}
              </p>
            </div>
          )}

          {destroyResult && (
            <div className="mt-4 rounded-lg border border-red-400/20 bg-red-400/5 p-4">
              <p className="font-mono text-[9px] tracking-widest text-red-400">
                DESTRUCTION REPORT
              </p>

              <p className="mt-3 font-mono text-xs text-white/80">
                {destroyResult.fullCollapse
                  ? `${destroyResult.cutSize}-NODE LOGICAL CUT`
                  : "STRONGEST ATTACK"}
              </p>

              <p className="mt-3 text-xs leading-5 text-white/50">
                {
                  destroyResult.explanation
                }
              </p>

              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] text-white/30">
                  SUPPORT DESTROYED
                </p>

                <p className="mt-1 font-mono text-sm text-red-300">
                  {
                    destroyResult.impactCount
                  }
                  {" / "}
                  {
                    destroyResult.totalSupport
                  }
                </p>
              </div>
            </div>
          )}

          {steelmanResult && (
            <div className="mt-4 rounded-lg border border-green-400/20 bg-green-400/5 p-4">
              <p className="font-mono text-[9px] tracking-widest text-green-300">
                REPAIR REPORT
              </p>

              <div className="mt-3 space-y-3">
                {steelmanResult.changes.map(
                  (
                    change,
                    index
                  ) => (
                    <div
                      key={index}
                    >
                      <p className="font-mono text-[9px] text-green-300/70">
                        {change.type.replaceAll(
                          "_",
                          " "
                        )}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/50">
                        {
                          change.description
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>

        {/* CENTER */}

        <section className="flex min-w-0 flex-col">
          <div className="relative p-6 pb-0">

            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs tracking-widest text-white/40">
                REASONING GRAPH
              </p>

              <div className="flex items-center gap-3">

                {steelmanResult &&
                  originalArgument && (
                    <div className="flex rounded-md border border-white/10 p-1">

                      <button
                        onClick={
                          showOriginal
                        }
                        className={`rounded px-3 py-1 font-mono text-[9px] transition ${
                          !showingSteelman
                            ? "bg-white text-black"
                            : "text-white/40 hover:text-white"
                        }`}
                      >
                        ORIGINAL
                      </button>

                      <button
                        onClick={
                          showSteelman
                        }
                        className={`rounded px-3 py-1 font-mono text-[9px] transition ${
                          showingSteelman
                            ? "bg-green-300 text-black"
                            : "text-white/40 hover:text-white"
                        }`}
                      >
                        STEELMAN
                      </button>

                    </div>
                  )}

                {criticalNodeIds.length >
                  0 && (
                  <span className="font-mono text-[9px] tracking-widest text-red-400">
                    ● ARGUMENT COMPROMISED
                  </span>
                )}

              </div>
            </div>

              {engineBusy && (
  <div className="absolute inset-6 z-20 flex items-center justify-center rounded-lg bg-[#0a0a0a]/85 backdrop-blur-[2px]">
    <div className="flex flex-col items-center">

      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border border-white/10" />

        <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-green-400" />

        <div className="absolute inset-[9px] rounded-full bg-green-400/10" />
      </div>

      <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-green-300">
        {engineStatus}
      </p>

      <p className="mt-2 font-mono text-[9px] text-white/25">
        ANALYSING STRUCTURE · INFERENCES · DIAGNOSTICS
      </p>

    </div>
  </div>
)}
            <ArgumentGraph
              key={JSON.stringify(
                argument
              )}
              argument={argument}
              selectedId={
                selectedId
              }
              criticalNodeIds={
                criticalNodeIds
              }
              onSelectNode={
                setSelectedId
              }
            />
          </div>

          <DiagnosticsConsole
            argument={argument}
            selectedId={
              selectedId
            }
            onSelectNode={
              setSelectedId
            }
          />
        </section>

        {/* RIGHT */}

        <section className="border-l border-white/10 p-5">
          <p className="mb-6 font-mono text-xs tracking-widest text-white/40">
            INSPECTOR
          </p>

          {!selected && (
            <p className="font-mono text-xs text-white/30">
              SELECT A NODE
            </p>
          )}

          {selected && (
            <div
              className={`rounded-lg border p-4 ${
                criticalNodeIds.includes(
                  selected.id
                )
                  ? "border-red-400/30 bg-red-400/5"
                  : "border-white/10 bg-white/5"
              }`}
            >

              {criticalNodeIds.includes(
                selected.id
              ) && (
                <div className="mb-4 border-b border-red-400/20 pb-3">
                  <p className="font-mono text-[9px] font-bold tracking-widest text-red-400">
                    ● CRITICAL FAILURE POINT
                  </p>
                </div>
              )}

              {selected.diagnostic ? (
                <>
                  <p className="font-mono text-xs text-orange-300">
                    {
                      selected
                        .diagnostic
                        .code
                    }
                  </p>

                  <h2 className="mt-2 font-semibold">
                    {
                      selected
                        .diagnostic
                        .issue
                    }
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {
                      selected
                        .diagnostic
                        .explanation
                    }
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono text-xs text-green-400">
                    NO DIAGNOSTIC
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/50">
                    No obvious reasoning
                    weakness was detected
                    on this node.
                  </p>
                </>
              )}

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-mono text-[9px] tracking-widest text-white/30">
                  SELECTED NODE
                </p>

                <p className="mt-1 font-mono text-sm">
                  {selected.type.toUpperCase()}
                </p>
              </div>

              {selected.diagnostic && (
                <div className="mt-4">
                  <p className="font-mono text-[9px] tracking-widest text-white/30">
                    SEVERITY
                  </p>

                  <p
                    className={`mt-1 font-mono text-sm ${
                      selected
                        .diagnostic
                        .severity ===
                      "HIGH"
                        ? "text-red-400"
                        : selected
                              .diagnostic
                              .severity ===
                            "MEDIUM"
                          ? "text-orange-300"
                          : "text-yellow-300"
                    }`}
                  >
                    {
                      selected
                        .diagnostic
                        .severity
                    }
                  </p>
                </div>
              )}

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-mono text-[9px] tracking-widest text-white/30">
                  CLAIM
                </p>

                <p className="mt-2 text-xs leading-5 text-white/60">
                  {
                    selected.text
                  }
                </p>
              </div>

            </div>
          )}
        </section>

      </div>
    </main>
  );
}