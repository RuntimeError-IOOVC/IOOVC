# Argument Engine - Product Specification

**Identity:** A debugger for human arguments.
**Tagline:** Humans debug code. Why don't we debug reasoning?

## The metaphor

Programming: source code -> execution path -> bug -> debugger.
Argument Engine: argument -> reasoning path -> logical weakness -> engine.

Everything - the UI language, the feature set, the demo - hangs off this one
metaphor. The product is compiled reasoning, not "AI analysis".

## Example: argument -> compiled graph

Input:

> Social media should be banned for teenagers because studies show that
> teenagers who use more social media report more depression.

The engine does not answer with an essay. It compiles:

    [CLAIM]
    Social media should be banned for teenagers
            ^
    [INFERENCE] (warning)
    If social media contributes to depression,
    banning it is justified
            ^
    [PREMISE]
    Higher social-media use is associated
    with higher reported depression
            ^
    [EVIDENCE]
    "Studies show..."

Then the debugger layer kicks in:

**Breakpoint detected: Association -> Causation**

    This premise establishes an association.
    The inference requires a causal relationship.
    REQUIRED TO CONTINUE -> Evidence that social-media exposure
    causes the observed increase.

## Signature features

### Destroy My Argument - find the minimum logical cut

Not "list ten counterarguments". The question is:

> What is the smallest number of assumptions/premises that must fail for the
> conclusion to become unsupported?

    A --+                      A --+
        +-- C -- D      -->        +-- [C] --X   D  (red, chain collapses)
    B --+                      B --+

    Critical failure point
    Destroying this inference disconnects the conclusion
    from all currently supplied evidence.

### Steelman - the repair graph

Steelman is the opposite of Destroy. It does not rewrite prose; it shows the
structure the argument is missing:

    Before                    After Steelman
    A ---(warn)---> C         A --> B
                                  |
                                  v
                                  E
                                  |
                                  v
                                  C

Reported as a structural diff: **Added premise** B, **Narrowed claim** C,
**Required evidence** E, **Removed assumption** X.

## Diagnostics taxonomy

Warnings are compiler-style, each with a code, a severity
(critical / evidential / semantic) and a REQUIRED TO CONTINUE line:

| Code   | Name                    | Severity   |
|--------|-------------------------|------------|
| ARG001 | Unsupported Assumption  | critical   |
| ARG002 | Correlation != Causation| critical   |
| ARG003 | Ambiguous Definition    | semantic   |
| ARG004 | Missing Evidence        | evidential |
| ARG005 | Alternative Explanation | evidential |
| ARG006 | Circular Reasoning      | critical   |
| ARG007 | Burden Shift            | semantic   |
| ARG008 | False Dichotomy         | critical   |
| ARG009 | Non Sequitur            | critical   |
| ARG010 | Scope Leap              | critical   |

Burden-of-proof detection is one diagnostic (ARG007), not a gimmick button.
The taxonomy is what turns "AI analysed my argument" into a reasoning engine
with its own representation, diagnostic system and interaction model.

    Argument compiled with 4 warnings.
    2 critical / 1 evidential / 1 semantic

## Interface

VS Code / debugger / circuit-board hybrid. Four panes:

    ARGUMENT ENGINE                                   Analysis Complete

    SOURCE              REASONING GRAPH               INSPECTOR
    Social media...     [Evidence]                    Correlation ->
                             |                         Causation
                             v                         Severity: HIGH
                        [Premise]
                             |
                         (warn ARG002)
                             |
                             v
                        [Conclusion]
    -------------------------------------------------------------
    DIAGNOSTICS
    (warn) ARG002  Causal inference unsupported
    (warn) ARG004  Evidence source unspecified
    (info) ARG005  Alternative explanation available

    [ DESTROY MY ARGUMENT ]        [ STEELMAN ]

## Demo story (90 seconds)

1. Hook (5 s): "Humans debug code. Why don't we debug reasoning?"
2. Paste an argument. COMPILE.
3. Graph appears; warnings fire.
4. DESTROY MY ARGUMENT - the critical node turns red, the chain collapses.
5. STEELMAN - the repair diff is grafted onto the graph.
6. Card: "Argument Engine - a debugger for human arguments."

## Guardrail

This must not collapse into a fallacy detector
("paste text -> Strawman / Ad hominem / False dilemma"). That would make it an
LLM wrapper. The core loop is:

    argument -> structured graph -> dependency analysis -> diagnostics
             -> attack / repair

Fallacy labels are one family inside the diagnostics, never the headline.
