/* ==============================================================
   PALETTE UTILITIES (SHARED)
   ============================================================== */
const paletteUtils = {
    hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        return { r: +r, g: +g, b: +b };
    },
    rgbToHex(r, g, b) {
        r = Math.round(r).toString(16);
        g = Math.round(g).toString(16);
        b = Math.round(b).toString(16);
        if (r.length == 1) r = "0" + r;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;
        return "#" + r + g + b;
    },
    interpolateLinear(start, end, factor) {
        return start + (end - start) * factor;
    },
    interpolateRgb(color1, color2, factor) {
        const r = this.interpolateLinear(color1.r, color2.r, factor);
        const g = this.interpolateLinear(color1.g, color2.g, factor);
        const b = this.interpolateLinear(color1.b, color2.b, factor);
        return { r, g, b };
    },
    mapIdsToCoords(shape) {
        const coordMap = new Map();
        let id = 1;
        const numRows = shape.length;
        const r_offset = Math.floor(numRows / 2);

        for (let i = 0; i < numRows; i++) {
            const rowSize = shape[i];
            const r = i - r_offset;
            const q_start = -Math.floor(rowSize / 2) + (rowSize % 2 === 0 ? 0 : 0);
            for (let j = 0; j < rowSize; j++) {
                let q = q_start + j;
                if (rowSize % 2 === 0 && q >= 0) {
                    q += 1;
                }
                coordMap.set(id++, { q, r });
            }
        }
        return coordMap;
    },
    getAxialDistance(coord1, coord2) {
        return (Math.abs(coord1.q - coord2.q)
              + Math.abs(coord1.q + coord1.r - coord2.q - coord2.r)
              + Math.abs(coord1.r - coord2.r)) / 2;
    }
};

/* ==============================================================
   NATURAL HAIR PALETTE GENERATOR
   ============================================================== */
const naturalHairPaletteGenerator = {
    // --- Main Generator Function ---
    generate() {
        const shape = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];
        const totalSlots = shape.reduce((a, b) => a + b, 0);
        const coordMap = paletteUtils.mapIdsToCoords(shape);
        const palette = new Array(totalSlots).fill(null);

        const regions = {
            blonde: {
                name: 'Blonde',
                center: { q: -4, r: -2 },
                light: paletteUtils.hexToRgb('#FCF6D5'), // Platinum Blonde
                dark: paletteUtils.hexToRgb('#A5833B')   // Darkest Dirty Blonde
            },
            brown: {
                name: 'Brown',
                center: { q: 4, r: -2 },
                light: paletteUtils.hexToRgb('#B58A6F'), // Warmer Light Brown
                dark: paletteUtils.hexToRgb('#2F0F05')   // Darkest Reddish Brown
            },
            red: {
                name: 'Red',
                center: { q: -4, r: 3 },
                light: paletteUtils.hexToRgb('#D38D5F'), // Strawberry Blonde
                dark: paletteUtils.hexToRgb('#3D0D00')   // Deepest Auburn
            },
            black: {
                name: 'Black/Gray',
                center: { q: 4, r: 3 },
                light: paletteUtils.hexToRgb('#505050'), // Dark Gray
                dark: paletteUtils.hexToRgb('#010101')   // Near Black
            }
        };

        const maxDist = 5.5; // Max distance for interpolation scaling

        for (let id = 1; id <= totalSlots; id++) {
            const coord = coordMap.get(id);

            // Find closest region
            let closestRegionName = null;
            let minDistance = Infinity;
            for (const regionName in regions) {
                const distance = paletteUtils.getAxialDistance(coord, regions[regionName].center);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestRegionName = regionName;
                }
            }

            const region = regions[closestRegionName];

            // Calculate interpolation factor based on distance from the region's center
            // Clamp factor between 0 and 1
            const factor = Math.min(1, minDistance / maxDist);

            const finalRgb = paletteUtils.interpolateRgb(region.light, region.dark, factor);
            const finalHex = paletteUtils.rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);

            // Generate a name
            let colorName = '';
            if (factor < 0.33) colorName = 'Light ';
            else if (factor > 0.66) colorName = 'Dark ';
            colorName += region.name.split('/')[0]; // Use "Black" from "Black/Gray"

            palette[id - 1] = { name: colorName, hex: finalHex };
        }

        return palette;
    }
};

/* ==============================================================
   NATURAL EYE PALETTE GENERATOR
   ============================================================== */
const naturalEyePaletteGenerator = {
    // --- Main Generator ---
    generate() {
        const shape = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];
        const coordMap = paletteUtils.mapIdsToCoords(shape);
        const palette = new Array(shape.reduce((a, b) => a + b, 0)).fill(null);

        const regions = {
            blue:   { name: 'Blue',   center: { q: 0, r: -3 }, light: paletteUtils.hexToRgb('#ADD8E6'), dark: paletteUtils.hexToRgb('#00004B') },
            brown:  { name: 'Brown',  center: { q: 5,  r: 0 }, light: paletteUtils.hexToRgb('#B8860B'), dark: paletteUtils.hexToRgb('#452301') },
            green:  { name: 'Green',  center: { q: 0,  r: 3 },  light: paletteUtils.hexToRgb('#98FB98'), dark: paletteUtils.hexToRgb('#002400') },
            // rare region is manually placed, so we use the 4th quadrant for hazel
            hazel:  { name: 'Hazel',  center: { q: -5, r: 0 },  light: paletteUtils.hexToRgb('#D3D3D3'), dark: paletteUtils.hexToRgb('#354B0F') }
        };
        const maxDist = 5.5;

        for (let id = 1; id <= palette.length; id++) {
            const coord = coordMap.get(id);
            let closestRegionName = null;
            let minDistance = Infinity;
            for (const regionName in regions) {
                const distance = paletteUtils.getAxialDistance(coord, regions[regionName].center);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestRegionName = regionName;
                }
            }
            const region = regions[closestRegionName];
            const factor = Math.min(1, minDistance / maxDist);
            const finalRgb = paletteUtils.interpolateRgb(region.light, region.dark, factor);

            let colorName = '';
            if (factor < 0.33) colorName = 'Light ';
            else if (factor > 0.66) colorName = 'Dark ';
            palette[id - 1] = { name: colorName + region.name, hex: paletteUtils.rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b) };
        }

        // Manually overwrite hexes for the 3x3 rare colors
        // Amber shades
        palette[70] = { name: 'Light Amber', hex: '#FFD700' }; // ID 71
        palette[71] = { name: 'Amber', hex: '#FFBF00' };       // ID 72
        palette[72] = { name: 'Dark Amber', hex: '#B8860B' };  // ID 73
        // Crimson shades
        palette[78] = { name: 'Light Crimson', hex: '#F08080' };// ID 79
        palette[79] = { name: 'Crimson', hex: '#DC143C' };      // ID 80
        palette[80] = { name: 'Dark Crimson', hex: '#8B0000' }; // ID 81
        // Violet shades
        palette[85] = { name: 'Light Violet', hex: '#D8BFD8' }; // ID 86
        palette[86] = { name: 'Violet', hex: '#9932CC' };       // ID 87
        palette[87] = { name: 'Dark Violet', hex: '#4B0082' };  // ID 88

        return palette;
    }
};

/* ==============================================================
   PALETTE GENERATOR
   ============================================================== */
// Note: A block of helper functions to programmatically generate the complex 91-color hexagonal palette.
// This ensures the color logic is maintainable and accurate.

const unnaturalPaletteGenerator = {
    // --- Color Naming ---
    getColorName(h, s, l) {
        let name = '';
        // Handle grayscales first, as they have low saturation
        if (s < 0.15) {
            if (l > 0.95) return 'White';
            if (l < 0.05) return 'Black';
            if (l < 0.3) return 'Dark Gray';
            if (l > 0.7) return 'Light Gray';
            return 'Gray';
        }

        // Add lightness descriptors
        if (l > 0.8) name += 'Pale ';
        else if (l < 0.3) name += 'Dark ';

        // Add saturation/vibrancy descriptors
        if (s > 0.8 && l >= 0.4 && l <= 0.6) name += 'Vivid ';

        // Determine the base hue name
        const hue = h * 360;
        if (hue < 15) name += 'Red';
        else if (hue < 35) name += 'Orange';
        else if (hue < 60) name += 'Yellow';
        else if (hue < 90) name += 'Lime';
        else if (hue < 150) name += 'Green';
        else if (hue < 210) name += 'Cyan';
        else if (hue < 255) name += 'Blue';
        else if (hue < 285) name += 'Purple';
        else if (hue < 335) name += 'Magenta';
        else name += 'Red'; // Wrap around

        return name.trim();
    },

    // --- Color Conversion Utilities ---
    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h, s, l };
    },
    hslToRgb(h, s, l) {
        let r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: r * 255, g: g * 255, b: b * 255 };
    },

    // --- Main Generator Function ---
    generate() {
        const shape = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];
        const totalSlots = shape.reduce((a, b) => a + b, 0);
        const coordMap = paletteUtils.mapIdsToCoords(shape);
        const centerCoord = { q: 0, r: 0 };
        const palette = new Array(totalSlots).fill(null);

        // Define the 6 corner hues AND their angular positions (in degrees)
        // This layout matches the user's request: Red(right), Green(top-left), Blue(bottom-left)
        const corners = [
            { name: 'Red',     h: 0,     s: 1, l: 0.5, angle: 0 },
            { name: 'Yellow',  h: 1/6,   s: 1, l: 0.5, angle: 60 },
            { name: 'Green',   h: 1/3,   s: 1, l: 0.5, angle: 125 },
            { name: 'Cyan',    h: 1/2,   s: 1, l: 0.5, angle: 180 },
            { name: 'Blue',    h: 2/3,   s: 1, l: 0.5, angle: 240 },
            { name: 'Magenta', h: 5/6,   s: 1, l: 0.5, angle: 300 }
        ];

        // Generate colors for each slot
        for (let id = 1; id <= totalSlots; id++) {
            const coord = coordMap.get(id);
            const ring = paletteUtils.getAxialDistance(coord, centerCoord);

            // Handle colors
            // 1. Calculate angle of the current hexagon in degrees (0-360)
            // We convert from axial coordinates (q, r) to cartesian (x, y) to get the angle.
            // The y-axis for atan2 is positive upwards, while our r-coordinate is positive downwards, so we use -r.
            const x_cart = Math.sqrt(3) * coord.q + Math.sqrt(3) / 2 * coord.r;
            const y_cart = -(3 / 2 * coord.r);
            let angle = Math.atan2(y_cart, x_cart) * 180 / Math.PI;
            if (angle < 0) angle += 360;

            // 2. Find the two corners the angle is between
            let c1, c2;
            for (let i = 0; i < corners.length; i++) {
                c1 = corners[i];
                c2 = corners[(i + 1) % corners.length];
                let angle1 = c1.angle;
                let angle2 = c2.angle;
                if (angle2 < angle1) angle2 += 360; // Handle wrap-around for Red (300 -> 0 becomes 300 -> 360)

                if (angle >= angle1 && angle <= angle2) {
                    break;
                }
            }

            // 3. Calculate interpolation factor
            let angle1 = c1.angle;
            let angle2 = c2.angle;
            if (angle2 < angle1) angle2 += 360;
            // Avoid division by zero if angles are the same
            const factor = (angle2 - angle1 === 0) ? 0 : (angle - angle1) / (angle2 - angle1);

            // 4. Interpolate hue using the shortest path logic
            const h1 = c1.h;
            const h2 = c2.h;
            let diff = h2 - h1;
            if (diff > 0.5) diff -= 1;
            if (diff < -0.5) diff += 1;
            const finalH = (h1 + diff * factor + 1) % 1;

            // 5. Interpolate lightness based on ring distance in a non-linear fashion
            const finalS = 1.0;
            let finalL;
            if (ring <= 3) {
                // From ring 1 (L=0.9) to ring 3 (L=0.5)
                finalL = paletteUtils.interpolateLinear(0.9, 0.5, (ring - 1) / 2);
            } else {
                // From ring 3 (L=0.5) to ring 5 (L=0.2)
                finalL = paletteUtils.interpolateLinear(0.5, 0.33, (ring - 3) / 2);
            }

            const {r, g, b} = this.hslToRgb(finalH, finalS, finalL);
            const colorName = this.getColorName(finalH, finalS, finalL);
            palette[id - 1] = { name: colorName, hex: paletteUtils.rgbToHex(r, g, b) };
        }

        // Manually set the center hex (ID 46) to white to act as the grayscale picker button
        palette[45] = { name: 'Grays...', hex: '#FFFFFF' };

        return palette;
    }
};

const colorPalettes = {
    skin: {
        "Pale": ["#F2E5D9", "#F0D4C2", "#E8BEAC"],
        "Tan": ["#C68642", "#B87333", "#A48B70"],
        "Brown": ["#8D5524", "#6D4C41", "#5D4037"],
        "Dark": ["#4E342E", "#3B2F2F", "#2C170E"]
    },
    hair: {
        natural: naturalHairPaletteGenerator.generate(),
        unnatural: unnaturalPaletteGenerator.generate()
    },
    eyes: {
        natural: naturalEyePaletteGenerator.generate(),
        unnatural: unnaturalPaletteGenerator.generate()
    }
};
