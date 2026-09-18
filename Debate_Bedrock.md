我覺得呢個已經由「其中一個候選 idea」去到 **可以正式定做 Argument Engine**。

而真正令我覺得值得定案嘅，唔係因為佢 academic，而係你而家呢個版本已經有一個非常清晰嘅 **product identity**：

> **Argument Engine — A debugger for human arguments.**

最重要係個 metaphor 非常完整。Programming 入面有 source code → execution path → bug → debugger；你將佢映射成 argument → reasoning path → logical weakness → Argument Engine。甚至連 UI language 都可以圍住 debugging 做，而唔係普通「AI analysis」。

例如 user 貼：

> Social media should be banned for teenagers because studies show that teenagers who use more social media report more depression.

Engine 唔係吐一篇 essay，而係 compile 成：

```text
[CLAIM]
Social media should be banned for teenagers
        ↑
[INFERENCE] ⚠️
If social media contributes to depression,
banning it is justified
        ↑
[PREMISE]
Higher social-media use is associated
with higher reported depression
        ↑
[EVIDENCE]
"Studies show..."
```

跟住真正精彩係 debugger layer：

**⚠️ Breakpoint detected**

`Association → Causation`

再撳個 node：

> This premise establishes an association.
> The inference requires a causal relationship.

然後甚至可以有：

**REQUIRED TO CONTINUE → Evidence that social-media exposure causes the observed increase.**

呢一下已經唔似 ChatGPT。

### 「Destroy My Argument」應該成為招牌 feature 😂

我甚至會將佢正式定義做：

**Find the minimum logical cut.**

唔係叫 AI 列十個 counterarguments，而係問：

> **What is the smallest number of assumptions/premises that must fail for the conclusion to become unsupported?**

例如：

```text
A ──┐
    ├── C ─── D
B ──┘
```

AI 發現 C 係成條 reasoning chain 嘅 single point of failure：

```text
A ──┐
    ├── 🟥 C ─╳─ D
B ──┘
```

> **Critical failure point**
>
> Destroying this inference disconnects the conclusion
> from all currently supplied evidence.

呢個畫面我已經可以想像到 demo video：成張 graph 仲喺度，撳 **DESTROY MY ARGUMENT**，然後 node C 變紅，後面條線逐段 collapse。😂

而 **Steelman** 又啱啱相反。

Destroy = attack graph。

Steelman = repair graph。

所以可以做到：

```text
             ARGUMENT ENGINE

        ┌────── ATTACK ──────┐
        │                     │
   Destroy Argument      Find Weakness
        │
     original
       graph
        │
   Steelman Argument
        │
        ↓
     repaired
       graph
```

Steelman 唔應該只係 rewrite text，而係直接顯示 **AI 加咗咩結構**：

```text
Before

A ──────⚠️──────> C


After Steelman

A ──> B
      ↓
      E
      ↓
      C
```

例如：

> **Added premise:** B
> **Narrowed claim:** C
> **Required evidence:** E
> **Removed assumption:** X

咁就非常 visual。

---

而你提出嘅 **Burden-of-Proof Detector** 我會保留，而且唔會獨立做一粒 gimmick button；我會將佢變成其中一種 debugger warning。

即係整個 engine 有一套類似 compiler warnings：

```text
ARG001  Unsupported Assumption
ARG002  Correlation ≠ Causation
ARG003  Ambiguous Definition
ARG004  Missing Evidence
ARG005  Alternative Explanation
ARG006  Circular Reasoning
ARG007  Burden Shift
ARG008  False Dichotomy
ARG009  Non Sequitur
ARG010  Scope Leap
```

呢樣好重要。

因為一有呢套 taxonomy，成件嘢就由：

> 「AI 幫我分析 argument」

變成：

> **一個有自己 representation、diagnostic system 同 interaction model 嘅 reasoning engine。**

甚至可以玩到好似 IDE：

```text
Argument compiled with 4 warnings.

2 critical
1 evidential
1 semantic
```

😂

### 仲有一樣我覺得會令佢非常符合 vibe-coding competition

**個 interface 可以型到癲。**

唔需要整成 academic website。

我反而想像係 VS Code / debugger / circuit-board hybrid：

左邊：
**Argument Source**

中間：
**Reasoning Graph**

右邊：
**Inspector**

底：
**Diagnostics Console**

例如：

```text
ARGUMENT ENGINE                         ● Analysis Complete

SOURCE              REASONING GRAPH             INSPECTOR

Social media...       [Evidence]
                          │
                          ▼
                     [Premise]
                          │
                       ⚠ ARG002
                          │
                          ▼
                     [Conclusion]          Correlation → Causation
                                           Severity: HIGH

──────────────────────────────────────────────────────────
DIAGNOSTICS

⚠ ARG002  Causal inference unsupported
⚠ ARG004  Evidence source unspecified
ⓘ ARG005  Alternative explanation available

[ DESTROY MY ARGUMENT ]       [ STEELMAN ]
```

**呢個係有 visual identity 嘅。**

而且 submission video 非常容易做到一個完整故事：

開頭 5 秒：

> **Humans debug code. Why don't we debug reasoning?**

貼一段 argument。

**Compile.**

Graph 爆出嚟。

Warnings 出現。

撳 **Destroy My Argument**。

其中一條 reasoning chain collapse。

撳 **Steelman**。

AI rebuild。

最後：

> **Argument Engine**
> **A debugger for human arguments.**

完。

呢個比「AI study assistant」「AI research helper」有記憶點好多。

唯一一個我會非常小心嘅問題係：**唔好變成 fallacy detector。**

如果最後只係「貼句嘢 → AI話 Strawman / Ad hominem / False dilemma」，個 idea 會立即跌返去普通 LLM wrapper。

真正嘅核心應該係：

> **Argument → structured graph → dependency analysis → diagnostics → attack/repair**

Fallacy detection只係 diagnostics 嘅其中一部分。

所以如果由我哋而家所有候選入面定，我會揀 **Argument Engine**。下一步唔係再 brainstorm 第二個 project，而係開始定 **MVP 到底有邊 4–5 個功能，邊啲 deliberately 唔做**。呢一步會直接決定 11 月整唔整得切。