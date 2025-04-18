/**
 * Converts a hex color string to an RGB object
 * 
 * @param hex Hex color string (e.g. '#FBEC5D' or 'FBEC5D')
 * @returns Object with r, g, b values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const sanitized = hex.startsWith('#') ? hex.slice(1) : hex;
  
  // Default fallback for primary yellow
  const defaultColor = { r: 251, g: 236, b: 93 }; // #FBEC5D
  
  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(sanitized)) return defaultColor;
  
  try {
    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    return { r, g, b };
  } catch (e) {
    console.error('Error parsing hex color', e);
    return defaultColor;
  }
} 