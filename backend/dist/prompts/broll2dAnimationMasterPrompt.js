/**
 * 2D Animation (hand-drawn) final-stage B-roll JSON prompt.
 * Mirrors the transparent skeleton pipeline, but enforces a classic 2D look.
 */
export const twoDAnimationMasterPrompt = `2D ANIMATION FINAL B-ROLL (JSON OUTPUT)

You receive numbered scene lines from the MASTER ANALYZER. Each line is a seed broll_prompt: it already
targets the story beat, setting, and intent. Your job is to expand each seed into one full JSON scene object.
Preserve narrative continuity and intent; do not replace the core action.

CRITICAL RULES
- Keep the "style" string EXACTLY as written (character-for-character).
- Fill every field with concrete specifics derived from the seed line.
- Character is REQUIRED for every scene:
  - Always include exactly one clear on-screen human main character in "characters.main" (male or female) with specific role when implied (e.g. USA service agent, nurse, mechanic, student, etc.).
  - "scene" must explicitly describe what the main character is doing (an observable action), not just a mood or abstract concept.
- No photorealism, no 3D render, no text/logos/watermarks in the visual.
- Keep character design consistent across the batch (same protagonist identity, outfit logic, and facial features unless the seed explicitly changes them).
- Keep these fields consistent across every object in this response (do not rewrite them): "style", "line_render", "color_palette", "quality", "aspect_ratio", "strict_prohibitions".
- Avoid repetitive B-roll:
  - Each scene must introduce at least one new concrete visual element (prop, micro-location, gesture, or interaction) that is not the same as the previous scene.
  - Vary camera type/angle/framing across scenes; do not reuse the same shot pattern repeatedly.
  - If the seed line is vague, you must concretize it with specific action + setting detail + props while staying faithful to intent.
  - Do NOT add any graphic/comic UI elements: no question marks, no punctuation as props, no icons/arrows, no labels, no speech bubbles, no thought bubbles.
  - Single full frame only: no split frames, no multi-panel layouts, no collage/triptych.
  - Keep it catchy while keeping meaning: choose visually striking but plausible micro-actions that match the seed's intent (no random unrelated actions).

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
      "summary": "Short ID like: age, gender, body type, ethnicity (or species if needed)",
      "appearance": "Hair/face/defining features",
      "outfit": "Detailed clothing with textures/materials",
      "pose": "Natural, readable body posture",
      "emotion": "Clear facial expression"
    },
    "secondary": [
      {
        "summary": "Who they are (only if present)",
        "appearance": "",
        "outfit": "",
        "pose": "",
        "emotion": ""
      }
    ],
    "consistency_rules": "consistent character design, realistic anatomy, expressive faces, natural gestures, no exaggeration"
  },
  "line_render": "clean bold line art, sharp ink outlines, high precision linework, smooth shading, soft gradient transitions, subtle cel shading blend, realistic skin texture, fabric detail, material definition",
  "lighting": {
    "primary": "cinematic lighting: choose one: golden hour sunlight / moody ambient / night neon / dramatic contrast",
    "details": "volumetric light rays, soft glow highlights, realistic shadows, directional light source, atmospheric lighting depth",
    "mood": "Match emotional tone"
  },
  "background": "Illustrated environment consistent with setting and era, animation-ready",
  "environment": "highly detailed environment: <location description>. realistic textures, layered background, atmospheric depth, immersive setting, subtle environmental storytelling",
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
    "no messy anatomy"
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
export const generate2dAnimationBrollPrompt = (sceneLines, startIndex) => {
    return `${twoDAnimationMasterPrompt}

USER INPUT — expand each into one JSON object with matching id:
${sceneLines.map((line, idx) => `Scene id ${startIndex + idx + 1}: ${line}`).join('\n')}

Return a JSON array of exactly ${sceneLines.length} objects, ids ${startIndex + 1} through ${startIndex + sceneLines.length}.`;
};
export const twoDAnimationBrollGeneratorConfig = {
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    batchSize: 5,
    batchDelayMs: 1000,
};
//# sourceMappingURL=broll2dAnimationMasterPrompt.js.map