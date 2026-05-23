/**
 * Documentary-style final-stage B-roll JSON prompt.
 * Targets real-world photorealistic footage aesthetics: handheld energy,
 * natural lighting, authentic environments, consistent cinematic LUT.
 * Supports minimal motion-graphic inserts (~1 per 5 scenes) for stats/maps/titles.
 */
export const documentaryMasterPrompt = `DOCUMENTARY STYLE — FINAL B-ROLL (JSON OUTPUT)

You receive numbered scene lines from the MASTER ANALYZER. Each line is a seed broll_prompt: it already
targets the story beat, setting, and intent. Your job is to expand each seed into one full JSON scene object.
Preserve narrative continuity and intent; do not alter the core subject or action.

TWO SCENE TYPES — read carefully before generating each scene:

TYPE A — FOOTAGE (default, used for ~4 out of every 5 scenes)
Real-world photorealistic documentary shot. Subject is a real human being or real environment.
Must feel like it was captured by a documentary crew on location.

TYPE B — GRAPHIC INSERT (use for ~1 out of every 5 scenes, ONLY when the seed implies a fact, statistic,
location name, data point, timeline, map reference, or concept that benefits from visual reinforcement)
A minimal, clean motion-graphic frame. Dark background, single bold piece of information presented with
typographic clarity. Think: BBC documentary lower-thirds, Netflix doc stat cards, National Geographic
location title cards. NO photorealism in these frames — pure graphic design aesthetic.
Rules for graphic inserts:
- Use sparingly — maximum 1 graphic per 5 consecutive scenes; never two graphics back-to-back.
- Only when the seed content genuinely calls for it (a number, a place name, a year, a comparison, a map).
- Set "scene_type": "graphic_insert" in the JSON for these scenes.
- "scene" field must describe the graphic content (e.g. "Bold white stat '73% of farmland lost' centered on deep charcoal background with a thin amber underline, minimal sans-serif typography").
- "subject" fields describe the graphic element, not a human.
- "shot" type must be "graphic insert — full frame centered composition".
- "style" for graphic inserts: "minimal motion graphic, clean typographic design, dark documentary aesthetic, BBC/Netflix doc style, no photorealism".
- All other fields (lut, color_palette, quality, aspect_ratio) stay consistent with footage scenes.

DOCUMENTARY AESTHETIC — TYPE A (enforced on every footage scene)
- Style must feel like premium documentary cinematography: gritty, authentic, grounded in reality.
- Think: Netflix documentary, National Geographic, Vice Films, BBC Earth — high production quality but human and raw.
- No glossy commercial look, no fantasy elements, no stylized illustration, no animation.
- Every footage scene must feel like it could be captured by a real documentary crew on location.

VISUAL CONSISTENCY (LUT — enforced across every scene including graphic inserts)
- Apply a unified cinematic LUT across all scenes: slightly desaturated, warm mid-tones, lifted shadows
  (crushed blacks are forbidden), subtle teal-and-orange grade. This ensures visual cohesion across the video.
- Even graphic inserts adopt the same warm dark tones — deep charcoal/near-black backgrounds, amber or warm-white text.

SHOT LANGUAGE — CINEMATIC DOCUMENTARY ANGLES (enforced on every TYPE A footage scene)
Every footage scene MUST use a distinct cinematic shot type AND angle. Vary both across consecutive scenes.

Shot types — choose one per scene, do NOT repeat the same type consecutively:
  extreme close-up | close-up | medium close-up | medium shot | medium wide |
  wide shot | extreme wide (establishing) | over-the-shoulder | two-shot |
  POV | handheld verité | tracking shot | rack focus

Camera angles — choose one per scene, vary across scenes:
  eye level | low-angle (hero) | high-angle | bird's-eye | worm's-eye | dutch tilt | canted

Documentary-specific techniques to lean into:
- Handheld slight shake for intimacy and urgency
- Long lens compression to flatten depth and isolate subject
- Tight reaction close-ups on hands, eyes, or objects
- Environmental establishing shots before cutting to subjects
- Natural rack focus from foreground detail to background subject

SUBJECT RULES — TYPE A
- Subjects are real humans in authentic settings. No cartoon, no skeleton, no fantasy characters.
- If the seed implies a specific person, keep that identity consistent across their scenes.
- Documentary subjects look like real people: natural skin, clothing appropriate to context/culture/location.
- Avoid polished "ad-campaign" faces — subjects should feel like real documentary participants.

CRITICAL RULES
- Fill every field with concrete specifics derived from the seed line.
- TYPE A "scene" must describe a real observable action — not an abstract concept or mood.
- No text/logos/watermarks in footage scenes (TYPE A). Graphic inserts (TYPE B) may have text as their primary content.
- No split screens, multi-panel layouts, or collage formats — single full frame only.
- Each scene must introduce at least one new visual element not present in the previous scene.
- Keep "lut", "color_palette", "quality", "aspect_ratio", "strict_prohibitions" identical across every object.

JSON (MANDATORY)
Return ONE JSON array. Each element MUST include "id" matching the scene number from USER INPUT.
Exact shape — use for BOTH scene types (set scene_type accordingly):
{
  "id": <number>,
  "scene_type": "footage" or "graphic_insert",
  "scene": "One clean description sentence. For footage: what is visually happening — subject, action, environment. For graphic inserts: describe the graphic content and layout.",
  "shot": {
    "type": "For footage: one of: extreme close-up / close-up / medium close-up / medium shot / medium wide / wide shot / extreme wide / over-the-shoulder / two-shot / POV / handheld verité / tracking shot / rack focus — do NOT repeat consecutively. For graphic inserts: 'graphic insert — full frame centered composition'",
    "angle": "For footage: one of: eye level / low-angle / high-angle / bird's-eye / worm's-eye / dutch tilt / canted — vary across scenes. For graphic inserts: 'full frame'",
    "framing": "For footage: cinematic composition — rule of thirds, subject off-center with breathing room, foreground framing, leading lines, negative space, window/doorway frame. For graphic inserts: 'centered, single focal element, generous negative space'"
  },
  "style": "For footage: 'photorealistic documentary cinematography, authentic handheld energy, natural lighting, high-resolution, sharp focus, premium documentary production quality, real-world grounded aesthetic'. For graphic inserts: 'minimal motion graphic, clean typographic design, dark documentary aesthetic, BBC/Netflix doc style, no photorealism'",
  "subject": {
    "description": "For footage: who is in frame — age range, gender, role, ethnicity/appearance. For graphic inserts: the graphic element (e.g. 'bold statistic in large white sans-serif', 'minimal map outline with glowing location pin')",
    "action": "For footage: what they are physically doing — specific and observable. For graphic inserts: the information being communicated (e.g. '73% of farmland lost since 2001')",
    "emotion": "For footage: visible emotional state readable from face/body. For graphic inserts: the intended viewer feeling (e.g. 'stark impact', 'sobering clarity')"
  },
  "lighting": {
    "primary": "For footage — real motivated source: golden hour sunlight / overcast diffused daylight / harsh midday sun / interior practical lamp / open window light / fire/candlelight / blue-hour dusk / fluorescent interior. For graphic inserts: 'dark background with subtle ambient glow, no hard light sources'",
    "details": "For footage: specific behavior — soft wrap, hard shadows, rim light, lens flare, haze, dust particles. For graphic inserts: 'subtle vignette, warm ambient edge glow consistent with documentary LUT'",
    "mood": "Emotional quality — match the scene beat for both types"
  },
  "background": "For footage: real-world environment — specific and detailed. For graphic inserts: 'deep charcoal or near-black background, minimal texture, consistent with documentary color palette'",
  "environment": "For footage: highly detailed real-world location with physical details, textures, atmospheric depth. For graphic inserts: 'clean dark graphic space — no real-world environment'",
  "lut": "Unified documentary LUT: warm mid-tones, slightly desaturated, lifted shadows (no crushed blacks), subtle teal-and-orange grade, naturalistic tones, film-like color science — consistent across every scene in this response",
  "color_palette": "cinematic documentary grading — warm amber/orange highlights, subtle teal in shadows, natural skin tones (footage) or warm-white/amber text on deep charcoal (graphic inserts), slightly muted saturation, film grain texture, cohesive LUT applied across all scenes",
  "quality": "ultra detailed, 4K cinematic resolution, sharp focus, professional documentary quality, authentic textures (footage) or crisp vector-clean graphic (inserts), realistic depth of field (footage), subtle film grain, natural color science",
  "aspect_ratio": "9:16",
  "strict_prohibitions": [
    "no logos or watermarks",
    "no animation or illustration in footage scenes",
    "no cartoon or stylized art in footage scenes",
    "no 3d render",
    "no fantasy or sci-fi elements",
    "no split frames or multi-panel layouts",
    "no commercial or ad-campaign aesthetic",
    "no crushed blacks or over-processed looks",
    "no two graphic inserts back-to-back",
    "no more than 1 graphic insert per 5 consecutive scenes"
  ]
}

NOTES FOR CLEAN OUTPUT
- "scene" must be plain text only — no bracketed labels, no headers, no separators.
- If no human in a footage seed (pure landscape), set subject.action to the environmental motion and subject.description to "environment — no human subject".
- Never output symbol-only content (e.g. "???") in any field.
- Do not force a graphic insert if the seed content doesn't naturally call for one.

GLOBAL RULES
- Output ONLY valid JSON (no markdown, no prose outside the array).
- Generate EXACTLY the scenes listed in USER INPUT — no extras, no omissions.
- "id" must match the scene numbers provided.
- "lut", "color_palette", "quality", "aspect_ratio", and "strict_prohibitions" must be identical across every object.`;

/**
 * @param sceneLines — broll_prompt strings from master analyzer chunks (one batch)
 * @param startIndex — zero-based global index of first scene in this batch
 */
export const generateDocumentaryBrollPrompt = (sceneLines: string[], startIndex: number): string => {
  return `${documentaryMasterPrompt}

USER INPUT — expand each into one JSON object with matching id:
${sceneLines.map((line, idx) => `Scene id ${startIndex + idx + 1}: ${line}`).join('\n')}

Return a JSON array of exactly ${sceneLines.length} objects, ids ${startIndex + 1} through ${startIndex + sceneLines.length}.`;
};

export const documentaryBrollGeneratorConfig = {
  // model is read from DOCUMENTARY_MODEL in .env via CONFIG
  temperature: 0.5,
  batchSize: 5,
  batchDelayMs: 1000,
};
