// Debate format definitions.
// poiWindow = [low, high] bounds on the REMAINING seconds during which
// Points of Information are open (null = no POIs, e.g. reply speeches).

const WSDC_MAIN = 8 * 60;
const WSDC_REPLY = 4 * 60;
const BP_SPEECH = 7 * 60;

function wsdcMain(label, side) {
  return { label, side, seconds: WSDC_MAIN, poiWindow: [60, WSDC_MAIN - 60] };
}

function bpSpeech(label, side) {
  return { label, side, seconds: BP_SPEECH, poiWindow: [60, BP_SPEECH - 60] };
}

export const FORMATS = {
  wsdc: {
    id: "wsdc",
    name: "World Schools (WSDC)",
    speeches: [
      wsdcMain("Proposition - 1st speaker", "prop"),
      wsdcMain("Opposition - 1st speaker", "opp"),
      wsdcMain("Proposition - 2nd speaker", "prop"),
      wsdcMain("Opposition - 2nd speaker", "opp"),
      wsdcMain("Proposition - 3rd speaker", "prop"),
      wsdcMain("Opposition - 3rd speaker", "opp"),
      {
        label: "Opposition - reply speech",
        side: "opp",
        seconds: WSDC_REPLY,
        poiWindow: null,
      },
      {
        label: "Proposition - reply speech",
        side: "prop",
        seconds: WSDC_REPLY,
        poiWindow: null,
      },
    ],
  },
  bp: {
    id: "bp",
    name: "British Parliamentary (BP)",
    speeches: [
      bpSpeech("OG - Prime Minister", "gov"),
      bpSpeech("OO - Leader of Opposition", "opp"),
      bpSpeech("OG - Deputy Prime Minister", "gov"),
      bpSpeech("OO - Deputy Leader of Opposition", "opp"),
      bpSpeech("CG - Member of Government", "gov"),
      bpSpeech("CO - Member of Opposition", "opp"),
      bpSpeech("CG - Government Whip", "gov"),
      bpSpeech("CO - Opposition Whip", "opp"),
    ],
  },
};

export function getFormat(id) {
  return FORMATS[id] ?? FORMATS.wsdc;
}
