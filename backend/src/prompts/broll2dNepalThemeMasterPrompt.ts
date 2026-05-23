/**
 * Cinematic Nepali Theme — final-stage B-roll JSON prompt.
 * Photorealistic. Nepali character fully described by AI per scene.
 * Authentic Nepali settings mandatory. Cinematic angles enforced.
 */
export const nepalCinematicMasterPrompt = `CINEMATIC NEPALI THEME — FINAL B-ROLL (JSON OUTPUT)

You receive numbered scene lines from the MASTER ANALYZER. Each line is a seed broll_prompt: it already
targets the Nepali character, resolved setting, and story beat. Your job is to expand each seed into one
full JSON scene object — preserve narrative intent; do not change the core action or setting.

STEP 1 — Character lock (enforced across all scenes in this batch)
The main character is a Nepali person established in the first seed. Once you define their identity in
scene 1, keep it IDENTICAL across every scene:
- Same face: South Asian Nepali features, specific ethnicity (e.g. Newar, Tamang, Brahmin, Sherpa),
  defined dark eyebrows, warm medium-brown skin tone, realistic skin texture, age-appropriate detail.
- Same hair: style, length, and color — do not change between scenes unless seed explicitly says so.
- Same outfit: authentic Nepali clothing set in scene 1, consistent throughout unless seed implies a change.
- Same body type and height proportions.
Treat the character as a locked real actor across this batch.

STEP 2 — Nepali setting (mandatory on every scene)
Every scene MUST be grounded in a specific, real, named Nepali environment. No abstract spaces.
Choose from: Kathmandu old city streets, Newari brick courtyards, Boudhanath stupa, Swayambhu hilltop,
Pashupatinath ghats, Nyatapola temple steps, Durbar squares, terraced rice paddies, Himalayan ridge,
mountain village paths, suspension bridges, trekking teahouses, river ghats, Dashain/Tihar festival grounds.
Always include at least one authentic Nepali cultural prop:
  prayer flags | diyo oil lamps | marigold garlands | brass/copper vessels | dhaka fabric |
  incense sticks | clay pottery | doko/nanglo baskets | thanka paintings | wooden prayer wheels |
  khukuri | sel roti | momo steamers | chiya cups

STEP 3 — Cinematic shot language (enforced on every scene)
Every scene MUST use a distinct shot type AND angle. Vary both — never repeat the same combination
in consecutive scenes.
Shot types: extreme close-up | close-up | medium close-up | medium shot | medium wide |
  wide shot | extreme wide (establishing) | over-the-shoulder | two-shot | low-angle hero shot |
  high-angle overhead | dutch tilt | bird's-eye | worm's-eye | tracking shot | rack-focus | POV
Angles: eye level | low-angle | high-angle | bird's-eye | worm's-eye | dutch tilt | canted
Composition: rule of thirds, foreground Nepali element framing subject, leading lines (temple steps,
ridge, alley walls, bridge cables), environmental framing through carved window or stone archway.

STEP 4 — JSON (MANDATORY)
Return ONE JSON array. Each element MUST include "id" matching the scene number from USER INPUT.
Exact shape per object:
{
  "id": <number>,
  "scene": "Full cinematic description — the Nepali character, their action, and the specific Nepali environment. Weave the shot angle naturally into the prose. Plain text, no brackets, no separators.",
  "shot": {
    "type": "one of the listed shot types — do NOT repeat same type consecutively",
    "angle": "one of the listed angles — vary across scenes",
    "framing": "specific cinematic composition — e.g. 'character off-center right, marigold garland arch in foreground, Newari courtyard receding behind', 'low angle looking up temple steps with character silhouetted against sky'"
  },
  "style": "photorealistic cinematic photography, documentary film quality, real human skin and fabric texture, natural lighting, sharp focus, National Geographic / cinematic portrait style, grounded in reality",
  "characters": {
    "main": {
      "summary": "Nepali person — same age, gender, ethnicity, and body type established in scene 1 (e.g. '34-year-old Newar woman, lean build, porter')",
      "appearance": "Exact same face as scene 1 — South Asian Nepali features, specific ethnicity, warm medium-brown skin, dark eyebrows, realistic age detail, natural hair — do NOT change between scenes",
      "outfit": "Authentic Nepali clothing consistent with scene 1 — e.g. daura suruwal, dhaka topi, sari, gunyu cholo, labeda suruwal, shawl — realistic fabric texture and drape — only change if seed implies new setting or time",
      "pose": "Natural, grounded posture matching the scene action — physically specific",
      "emotion": "Subtle, realistic expression matching the scene beat — understated and human"
    },
    "secondary": [],
    "consistency_rules": "STRICT: same face, same hair, same body proportions, same outfit logic, same photorealistic rendering across all scenes in this batch — treat as a locked real actor"
  },
  "lighting": {
    "primary": "one of: golden hour sunlight / overcast diffused daylight / harsh midday sun / interior diyo or candle light / open window light / blue-hour dusk / festival fire glow / moonlight",
    "details": "specific behavior — e.g. 'warm golden rim light on character's shoulder from sun behind Himalayan ridge', 'soft diyo flame illuminating face from below with deep shadows behind', 'morning light through carved wooden lattice casting grid shadows on stone floor'",
    "mood": "emotional quality of the light — match the scene beat"
  },
  "background": "specific real Nepali environment with cultural detail — e.g. 'Boudhanath stupa courtyard at dawn, white dome catching first light, butter lamps burning at the base, pilgrims in white shawls circling clockwise' or 'terraced rice paddies stepping down to a river valley, stone farmhouse with prayer flags on roof, Himalayan peaks in morning haze'",
  "environment": "highly detailed real Nepali location: specific place + physical materials (carved wood, ancient brick, hand-woven fabric, stone, brass) + atmospheric conditions + layered depth. Cultural storytelling in the environment. No abstract or non-Nepali spaces.",
  "color_palette": "cinematic Nepali grading — warm amber/orange highlights, subtle teal in shadows, natural warm-brown skin tones, slightly desaturated mid-tones, rich contrast, organic color harmony, teal-and-orange LUT applied consistently across all scenes",
  "quality": "ultra detailed, 4K cinematic resolution, photorealistic, sharp focus, professional cinematography, authentic skin and fabric textures, realistic depth of field, subtle film grain, natural color science",
  "aspect_ratio": "9:16",
  "strict_prohibitions": [
    "no text anywhere",
    "no logos or watermarks",
    "no illustration or 2D art",
    "no cartoon or animation aesthetics",
    "no cel shading or line art",
    "no 3d render",
    "no low quality or blurry images",
    "no messy anatomy",
    "no non-nepali cultural elements",
    "no western fast-food or chain-store props",
    "no character design changes between scenes",
    "no abstract or non-Nepali backgrounds",
    "no split frames or multi-panel layouts"
  ]
}

NOTES FOR CLEAN OUTPUT
- "scene" plain text only — no bracketed labels, no section headers, no separators.
- If no secondary characters, set "characters.secondary" to an empty array.
- Never output symbol-only content (e.g. "???") in any field.
- background must always name a real Nepali location — never abstract.
- Do not include: speech bubble, thought bubble, split screen, split frame, multi-panel, triptych, collage.

GLOBAL RULES
- Output ONLY valid JSON (no markdown, no prose outside the array).
- Generate EXACTLY the scenes listed in USER INPUT — no extras, no omissions.
- "id" must match the scene numbers provided.
- style, aspect_ratio, quality, strict_prohibitions must be identical across every scene object.`;

/**
 * @param sceneLines — broll_prompt strings from master analyzer chunks (one batch)
 * @param startIndex — zero-based global index of first scene in this batch
 */
export const generate2dNepalThemeBrollPrompt = (sceneLines: string[], startIndex: number): string => {
  return `${nepalCinematicMasterPrompt}

USER INPUT — expand each into one JSON object with matching id:
${sceneLines.map((line, idx) => `Scene id ${startIndex + idx + 1}: ${line}`).join('\n')}

Return a JSON array of exactly ${sceneLines.length} objects, ids ${startIndex + 1} through ${startIndex + sceneLines.length}.`;
};

export const twoDNepalThemeBrollGeneratorConfig = {
  // model is read from TWO_D_NEPAL_THEME_MODEL in .env via CONFIG
  temperature: 0.6,
  batchSize: 5,
  batchDelayMs: 1000,
};
