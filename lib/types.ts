export type ArgumentNodeType =
  | "evidence"
  | "premise"
  | "inference"
  | "conclusion";

export type Severity = "LOW" | "MEDIUM" | "HIGH";

export interface Diagnostic {
  code: string;
  issue: string;
  explanation: string;
  severity: Severity;
}

export interface ArgumentNode {
  id: string;
  type: ArgumentNodeType;
  text: string;
  diagnostic: Diagnostic | null;
}

export interface ArgumentEdge {
  id: string;
  source: string;
  target: string;
  relation: "supports" | "depends_on" | "contradicts";
}

export interface ArgumentData {
  source: string;
  nodes: ArgumentNode[];
  edges: ArgumentEdge[];
}