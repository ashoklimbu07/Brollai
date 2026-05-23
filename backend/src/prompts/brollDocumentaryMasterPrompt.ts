/**
 * Documentary-style final-stage B-roll JSON prompt.
 * Targets real-world photorealistic footage aesthetics: handheld energy,
 * natural lighting, authentic environments, consistent cinematic LUT.
 */
export const documentaryMasterPrompt = `DOCUMENTARY STYLE — FINAL B-ROLL (JSON OUTPUT)

You receive numbered scene lines from the MASTER ANALYZER. Each line is a seed broll_prompt: it already
targets the story beat, setting, and intent. Your job is to expand each seed into one full JSON scene object.
Preserve narrative continuity and intent; do not alter the core subject or action.

DOCUMENTARY AESTHETIC (enforced on every scene)
- Style must feel like premium documentary cinematography: gritty, authentic, grounded in reality.
- Think: Netflix documentary, National Geographic, Vice Films, BBC Earth — high production quality but human and raw.
- No glossy commercial look, no fantasy elements, no stylized illustration, no animation.
- Every scene must feel like it could be captured by a real documentary crew on location.

VISUAL CONSISTENCY (LUT — enforced across every scene)
- Apply a unified cinematic LUT across all scenes: slightly desaturated, warm mid-tones, lifted shadows (crushed black is forbidden), subtle teal-and-orange grade. This ensures visual cohesion across the full video.
- Color must feel naturalistic — not stylized or heavily processed.
- Light sources must be real and motivated (sun, window, practical lamp, fire, etc.).

SHOT LANGUAGE — CINEMATIC DOCUMENTARY ANGLES (enforced per scene)
- Every scene MUST specify a distinct cinematic shot type and angle. Choose from:
  extreme close-up / close-up / medium close-up / medium shot / medium wide / wide shot / extreme wide (establishing) / over-the-shoulder / two-shot / POV / tracking shot / rack focus / handheld verité
- Angles: eye level / low-angle / high-angle / bird's-eye / worm's-eye / dutch tilt / canted
- Vary shot type and angle across consecutive scenes — never repeat the same combination back-to-back.
- Lean into documentary-specific techniques: handheld slight shake for intimacy, long lens compression, environmental establishing shots, tight reaction close-ups.

SUBJECT RULES
- Subjects are real humans in authentic settings. No cartoon, no skeleton, no fantasy characters.
- If the seed implies a specific person (e.g. farmer, teacher, child), keep that identity consistent across scenes where the same person appears.
- Documentary subjects look like real people: natural skin, clothing appropriate to context/culture/location.
- Avoid polished "ad-campaign" faces — subjects should feel like real documentary participants.

CRITICAL RULES
- Fill every field with concrete specifics derived from the seed line.
- "scene" must describe a real observable action happening in front of the camera — not an abstract concept or mood.
- No text, logos, watermarks, or graphic overlays anywhere in the frame.
- No split screens, multi-panel layouts, or collage formats — single full frame only.
- Each scene must introduce at least one new concrete visual element (prop, gesture, location detail, or interaction) not present in the previous scene.
- Keep "style", "lut", "color_palette", "quality", "aspect_ratio", "strict_prohibitions" identical across every object in this response.
- Do NOT add any UI elements: no arrows, labels, speech bubbles, thought bubbles, or icons.

JSON (MANDATORY)
Return ONE JSON array. Each element MUST include "id" matching the scene number from USER INPUT (1-based global order).
Exact shape per object:
{
  "id": <number>,
  "scene": "One clean cinematic description sentence. No bracketed headers. No separators. Describes what is visually happening — subject, action, environment.",
  "shot": {
    "type": "Cinematic documentary shot type — must be one of: extreme close-up / close-up / medium close-up / medium shot / medium wide / wide shot / extreme wide / over-the-shoulder / two-shot / POV / handheld verité — do NOT repeat the same type in consecutive scenes",
    "angle": "Cinematic camera angle — one of: eye level / low-angle / high-angle / bird's-eye / worm's-eye / dutch tilt / canted — vary across scenes",
    "framing": "Cinematic composition — e.g. rule of thirds, subject off-center with environment breathing room, foreground element framing subject, leading lines into depth, negative space, window/doorway environmental frame"
  },
  "style": "photorealistic documentary cinematography, authentic handheld energy, natural lighting, high-resolution, sharp focus, premium documentary production quality, real-world grounded aesthetic",
  "subject": {
    "description": "Who is in frame — age range, gender, role/occupation, ethnicity/appearance if relevant to story (e.g. 40s Nepali farmer, weathered hands, sun-worn face)",
    "action": "What they are physically doing — specific and observable (e.g. pouring tea from a clay pot, sorting grain by hand, speaking directly to camera)",
    "emotion": "Visible emotional state — readable from face and body language (e.g. quiet determination, exhausted relief, focused concentration)"
  },
  "lighting": {
    "primary": "Real, motivated light source — choose one: golden hour sunlight / overcast diffused daylight / harsh midday sun / interior practical lamp / open window light / fire/candlelight / blue-hour dusk / fluorescent interior",
    "details": "Specific lighting behavior: soft wrap around face, hard directional shadows, rim light from window, lens flare from sun, atmospheric haze, dust particles in shaft of light",
    "mood": "Emotional quality the lighting creates — match the scene beat"
  },
  "background": "Real-world environment consistent with subject and story — specific and detailed (e.g. cluttered village kitchen with open fire, concrete slum alley at dusk, misty mountain ridge with terraced fields below)",
  "environment": "Highly detailed real-world location: <specific place + physical details>. Natural textures, layered depth, atmospheric conditions, authentic environmental storytelling. No artificial or constructed sets.",
  "lut": "Unified documentary LUT: warm mid-tones, slightly desaturated, lifted shadows (no crushed blacks), subtle teal-and-orange grade, naturalistic skin tones, film-like color science — consistent across every scene in this response",
  "color_palette": "cinematic documentary grading — warm amber/orange highlights, subtle teal in shadows, natural skin tones, slightly muted saturation, organic color harmony, film grain texture, cohesive LUT applied across all scenes",
  "quality": "ultra detailed, 4K cinematic resolution, sharp focus, professional documentary cinematography, authentic textures, realistic depth of field, subtle film grain, natural color science",
  "aspect_ratio": "9:16",
  "strict_prohibitions": [
    "no text anywhere",
    "no logos or watermarks",
    "no animation or illustration",
    "no cartoon or stylized art",
    "no 3d render",
    "no fantasy or sci-fi elements",
    "no graphic overlays or UI elements",
    "no split frames or multi-panel layouts",
    "no commercial or ad-campaign aesthetic",
    "no crushed blacks or over-processed looks"
  ]
}

NOTES FOR CLEAN OUTPUT
- "scene" must be plain text only — no bracketed labels, no section headers, no separators.
- If there is no identifiable subject in the seed (e.g. pure landscape B-roll), set subject.action to the environmental action (e.g. "wind moving through wheat field") and subject.description to "environment — no human subject".
- Never output symbol-only content (e.g. "???") in any field.

GLOBAL RULES
- Output ONLY valid JSON (no markdown, no prose outside the array).
- Generate EXACTLY the scenes listed in USER INPUT — no extras, no omissions.
- "id" must match the scene numbers provided.
- "style", "lut", "color_palette", "quality", "aspect_ratio", and "strict_prohibitions" must be identical across every scene object in this response.`;

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
