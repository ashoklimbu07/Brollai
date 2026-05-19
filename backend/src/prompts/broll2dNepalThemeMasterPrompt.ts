/**
 * 2D Animation — Nepali Theme final-stage B-roll JSON prompt.
 * Identical style/LUT/line-render/quality/color_palette to twoDAnimationMasterPrompt.
 * Only character identity, environment, and background are locked to Nepal.
 */
export const twoDNepalThemeMasterPrompt = `2D ANIMATION — NEPALI THEME — FINAL B-ROLL (JSON OUTPUT)

You receive numbered scene lines from the MASTER ANALYZER. Each line is a seed broll_prompt: it already
targets the story beat, setting, and intent. Your job is to expand each seed into one full JSON scene object.
Preserve narrative continuity and intent; do not replace the core action.

CHARACTER LOCK (ABSOLUTE — enforced on every single scene)
- The main character is a Nepali person. Once their identity is established in the first scene, keep it IDENTICAL across every scene in this batch:
  - Same face structure: South Asian Nepali features, defined dark eyebrows, warm medium-brown skin tone.
  - Same hair: same style, length, and color across all scenes unless a scene seed explicitly changes it.
  - Same outfit logic: authentic Nepali clothing appropriate to the context. Once set, do not randomly change it between scenes unless the seed implies a setting/time change.
  - Same body type and height proportions.
- This is a strict consistency rule. Do NOT reinterpret the character between scenes.

NEPALI THEME RULES (enforced on every scene)
- Clothing: daura suruwal, dhaka topi, sari, gunyu cholo, labeda suruwal, nepali shawls, traditional jewelry (pote, tilhari, dhungri). Match formality to context.
- Environments: Kathmandu valley streets, Newari brick architecture with carved wooden windows, tiered pagoda temples, mountain villages, terraced rice paddies, Himalayan peaks, bazaars, suspension bridges, trekking teahouses, ghats, stupas (Boudhanath, Swayambhu), Dashain/Tihar settings.
- Props: dhaka fabric, clay pottery, brass/copper utensils, lokta paper, thanka paintings, incense sticks, diyo (oil lamps), prayer flags, marigold garlands, khukuri, doko/nanglo baskets, dhara taps, sel roti, momo, dhido, chiya.
- Never include non-Nepali cultural elements, western chain-store props, or foreign architecture.

CRITICAL RULES
- Keep the "style" string EXACTLY as written (character-for-character).
- Fill every field with concrete specifics derived from the seed line.
- Character is REQUIRED for every scene:
  - Always include exactly one clear on-screen Nepali main character in "characters.main" with specific role when implied (e.g. shopkeeper, farmer, student, porter, teacher, festival-goer, etc.).
  - "scene" must explicitly describe what the main character is doing (an observable action), not just a mood or abstract concept.
- No photorealism, no 3D render, no text/logos/watermarks in the visual.
- Keep these fields consistent across every object in this response (do not rewrite them): "style", "line_render", "color_palette", "quality", "aspect_ratio", "strict_prohibitions".
- Avoid repetitive B-roll:
  - Each scene must introduce at least one new concrete visual element (prop, micro-location, gesture, or interaction) not present in the previous scene.
  - Vary camera type/angle/framing across scenes; do not reuse the same shot pattern repeatedly.
  - If the seed line is vague, concretize it with specific Nepali action + setting detail + props while staying faithful to intent.
  - Do NOT add graphic/comic UI elements: no question marks, no punctuation as props, no icons/arrows, no labels, no speech bubbles, no thought bubbles.
  - Single full frame only: no split frames, no multi-panel layouts, no collage/triptych.

JSON (MANDATORY)
Return ONE JSON array. Each element MUST include "id" matching the scene number from USER INPUT (1-based global order).
Exact shape per object:
{
  "id": <number>,
  "scene": "One clean cinematic description sentence/paragraph. No bracketed headers like [SCENE] or [STYLE]. No '---' separators.",
  "shot": {
    "type": "Varied shot (close-up, medium, wide, OTS, macro, etc.)",
    "angle": "eye level, low, high, dutch, etc.",
    "framing": "composition (rule of thirds, centered, foreground framing, etc.)"
  },
  "style": "semi-realistic 2D illustration, modern graphic novel style, western comic + soft anime influence, cinematic digital painting, grounded realism, dramatic storytelling frame",
  "characters": {
    "main": {
      "summary": "Nepali person — repeat the same age, gender, body type, and ethnicity (e.g. 28-year-old Newar woman, athletic build) established in scene 1 of this batch",
      "appearance": "Repeat exact same face, hair style, hair color, and defining features from scene 1 — do NOT change between scenes",
      "outfit": "Authentic Nepali clothing consistent with the established outfit (daura suruwal, sari, gunyu cholo, dhaka topi, etc.) — only change if the seed explicitly implies a new setting or time",
      "pose": "Natural, readable body posture matching the action",
      "emotion": "Clear facial expression matching the scene beat"
    },
    "secondary": [
      {
        "summary": "Who they are (only if present in the seed)",
        "appearance": "",
        "outfit": "",
        "pose": "",
        "emotion": ""
      }
    ],
    "consistency_rules": "STRICT: same Nepali face, same hair, same body proportions, same outfit logic across all scenes in this batch — treat character as a locked actor, not a re-cast role"
  },
  "line_render": "clean bold line art, sharp ink outlines, high precision linework, smooth shading, soft gradient transitions, subtle cel shading blend, realistic skin texture, fabric detail, material definition",
  "lighting": {
    "primary": "cinematic lighting: choose one: golden hour sunlight / moody ambient / night neon / dramatic contrast",
    "details": "volumetric light rays, soft glow highlights, realistic shadows, directional light source, atmospheric lighting depth",
    "mood": "Match emotional tone"
  },
  "background": "Illustrated Nepali environment (Newari architecture, mountain village, terraced farmland, temple courtyard, bazaar, stupa, festival ground, etc.), animation-ready",
  "environment": "highly detailed Nepali environment: <specific location — e.g. brick-paved Kathmandu alley with carved wooden windows, terraced rice fields backed by Himalayan peaks, Dashain fairground with bamboo ping swings>. realistic textures, layered background, atmospheric depth, immersive setting, subtle cultural environmental storytelling",
  "color_palette": "cinematic color grading, film-like palette, slightly desaturated tones, rich contrast, warm highlights + cool shadows, natural greens/blues, cohesive color harmony, subtle green LUT tint (light touch) for consistency across all scenes",
  "quality": "ultra detailed, 4k resolution, masterpiece, artstation quality, professional illustration, sharp focus, cinematic composition",
  "aspect_ratio": "9:16",
  "strict_prohibitions": [
    "no text anywhere",
    "no logos or watermarks",
    "no photorealism",
    "no 3d render",
    "no low quality",
    "no blurry lines",
    "no messy anatomy",
    "no non-nepali cultural elements",
    "no western fast-food or chain-store props",
    "no character design changes between scenes"
  ]
}

NOTES FOR CLEAN OUTPUT
- Do NOT include bracketed section headers (like [SCENE], [CHARACTERS]) anywhere in any field.
- "scene" must be plain text only (no separators, no template labels).
- If there are no secondary characters, set "characters.secondary" to an empty array.
- Never output symbol-only content (e.g. "???") in any field.
- Do not include any of these anywhere: "?", "??", "???", "speech bubble", "thought bubble", "bubble", "split screen", "split frame", "multi-panel", "triptych", "collage".

GLOBAL RULES
- Output ONLY valid JSON (no markdown, no prose outside the array).
- Generate EXACTLY the scenes listed in USER INPUT — no extras, no omissions.
- "id" must match the scene numbers provided.
- strict_prohibitions, style, aspect_ratio, and quality strings must stay consistent across scenes in this response.`;

/**
 * @param sceneLines — broll_prompt strings from master analyzer chunks (one batch)
 * @param startIndex — zero-based global index of first scene in this batch (used for labels only; ids are explicit in prompt)
 */
export const generate2dNepalThemeBrollPrompt = (sceneLines: string[], startIndex: number): string => {
  return `${twoDNepalThemeMasterPrompt}

USER INPUT — expand each into one JSON object with matching id:
${sceneLines.map((line, idx) => `Scene id ${startIndex + idx + 1}: ${line}`).join('\n')}

Return a JSON array of exactly ${sceneLines.length} objects, ids ${startIndex + 1} through ${startIndex + sceneLines.length}.`;
};

export const twoDNepalThemeBrollGeneratorConfig = {
  // model is read from TWO_D_NEPAL_THEME_MODEL in .env via CONFIG
  temperature: 0.7,
  batchSize: 5,
  batchDelayMs: 1000,
};
