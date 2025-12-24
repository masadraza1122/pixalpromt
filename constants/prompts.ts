/**
 * Dummy prompts for AI prompt generation
 * In production, these would be replaced with actual AI API calls
 */

export const DUMMY_PROMPTS = [
  "A photorealistic portrait of a person with cinematic lighting, shallow depth of field, professional studio setup, high detail, 8k resolution, dramatic shadows, warm color grading",
  "Ultra-realistic cyberpunk cityscape at night, neon lights reflecting on wet streets, volumetric fog, futuristic architecture, flying vehicles, vibrant purple and blue tones, highly detailed",
  "Professional headshot photo, natural lighting, clean background, confident expression, sharp focus on eyes, business casual attire, Canon 85mm f/1.4 lens style",
  "Dreamy artistic portrait with soft bokeh background, golden hour lighting, ethereal atmosphere, pastel colors, gentle smile, flowing hair, fine art photography style",
  "Epic cinematic scene with dramatic composition, wide angle shot, atmospheric lighting, moody color palette, film grain texture, anamorphic lens flare, blockbuster movie quality",
  "Modern minimalist portrait, clean aesthetic, high contrast, professional color grading, studio lighting, sharp details, elegant pose, fashion photography style",
  "Artistic digital painting style portrait, vibrant colors, painterly brush strokes, creative composition, expressive features, contemporary art aesthetic, museum quality",
  "Vintage film photography look, grainy texture, nostalgic mood, warm faded colors, analog camera aesthetic, timeless composition, classic portrait style",
  "High fashion editorial photography, dramatic pose, luxury styling, professional makeup, soft box lighting, magazine cover quality, sophisticated elegance",
  "Atmospheric street photography style, natural candid moment, urban background, authentic emotion, documentary feel, real life storytelling aesthetic",
];

/**
 * Get a random prompt from the collection
 */
export const getRandomPrompt = (): string => {
  return DUMMY_PROMPTS[Math.floor(Math.random() * DUMMY_PROMPTS.length)];
};

