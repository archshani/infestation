function getHairLengthLabel(length) {
    if (length == 0) return 'shaved head';
    if (length <= 2) return 'buzzed hair';
    if (length <= 15) return 'short';
    if (length <= 30) return 'chin-length';
    if (length <= 45) return 'shoulder-length';
    if (length <= 60) return 'chest-length';
    if (length <= 80) return 'waist-length';
    return 'thigh-length';
}

const bodyPartDisplayOrder = [
    'face', 'eyes', 'lips', 'neck', 'breasts', 'nipples', 'arms', 'hands', 'belly', 'buttocks', 'vagina', 'thighs', 'calves', 'feet'
];

const descriptorGroupMap = {
    'face': { display: 'face' }, 'eye': { display: 'eyes' }, 'lips': { display: 'lips' },
    'neck': { display: 'neck' }, 'breast': { display: 'breasts' }, 'nipple': { display: 'nipples' },
    'arm': { display: 'arms' }, 'hand': { display: 'hands' }, 'belly': { display: 'belly' },
    'ass_cheek': { display: 'buttocks' }, 'vagina': { display: 'vagina' },
    'thigh': { display: 'thighs' }, 'calf': { display: 'calves' }, 'foot': { display: 'feet' }
};

function randomizeBodyDescriptors(bodyObject) {
    for (const groupName of bodyPartDisplayOrder) {
        const isFemaleOnly = femaleOnlyDescriptors.includes(groupName);
        const isMaleOnly = maleOnlyDescriptors.includes(groupName);
        if (state.sex === 'female' && isMaleOnly) continue;
        if (state.sex === 'male' && isFemaleOnly) continue;
        if (!bodyPartDescriptors[groupName]) continue;

        const descriptors = bodyPartDescriptors[groupName];
        const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];

        for (const partId in bodyObject) {
            const basePartName = partId.replace(/left_|right_/, '');
            const groupInfo = descriptorGroupMap[basePartName];
            if (groupInfo && groupInfo.display === groupName) {
                bodyObject[partId].descriptor = randomDescriptor;
            }
        }
    }
}

function generateCharacterDescription(appearance, body, includeMods = false) {
    const name = "Maya";
    let age = 18; // Default age
    if (appearance.birthDate) {
        const birth = new Date(appearance.birthDate);
        age = state.currentTime.getFullYear() - birth.getFullYear();
        const m = state.currentTime.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && state.currentTime.getDate() < birth.getDate())) {
            age--;
        }
    }

    // Helper to get a descriptor for a given group from the provided body object.
    const getDescriptor = (group, bodyObject) => {
        for (const partId in bodyObject) {
            const partInfo = bodyObject[partId];
            if (partInfo && partInfo.descriptor) {
                const basePartName = partId.replace(/left_|right_/, '');
                const groupInfo = descriptorGroupMap[basePartName];
                if (groupInfo && groupInfo.display === group) {
                    return partInfo.descriptor;
                }
            }
        }
        return ''; // Return empty string if no descriptor is found
    };

    // --- Build Paragraph 1 ---
    const hairColor = appearance.hairColor.hex;
    const hairShadowColor = getLuminance(hairColor) < 70 ? 'white' : 'black';
    const hairShadow = `0 0 9px ${hairShadowColor}`;
    const hairLengthLabel = getHairLengthLabel(appearance.hairLength);
    const hairColorName = appearance.hairColor.name.toLowerCase();
    const hairStr = `${hairLengthLabel} <span style="color: ${hairColor}; font-weight: bold; text-shadow: ${hairShadow};">${hairColorName} hair</span>`;
    let para1 = `<p><strong>${name}</strong> is an ${age}-year-old woman, standing ${appearance.height} cm tall. She has ${hairStr} and a ${appearance.skinColor.name.toLowerCase()} complexion.</p>`;

    // --- Build Paragraph 2 ---
    const eyeColor = appearance.eyeColor.hex;
    const eyeShadowColor = getLuminance(eyeColor) < 70 ? 'white' : 'black';
    const eyeShadow = `0 0 9px ${eyeShadowColor}`;
    const eyeDescriptor = getDescriptor('eyes', body);
    const eyeColorName = appearance.eyeColor.name.toLowerCase();
    const eyesStr = `${eyeDescriptor} <span style="color: ${eyeColor}; font-weight: bold; text-shadow: ${eyeShadow};">${eyeColorName} eyes</span>`;

    // Sentence parts - fetch all descriptors first
    const faceDesc = getDescriptor('face', body);
    const lipsDesc = getDescriptor('lips', body);
    const breastsDesc = getDescriptor('breasts', body);
    const nipplesDesc = getDescriptor('nipples', body);
    const bellyDesc = getDescriptor('belly', body);
    const buttocksDesc = getDescriptor('buttocks', body);
    const vaginaDesc = getDescriptor('vagina', body);
    const armsDesc = getDescriptor('arms', body);
    const handsDesc = getDescriptor('hands', body);
    const thighsDesc = getDescriptor('thighs', body);
    const calvesDesc = getDescriptor('calves', body);
    const feetDesc = getDescriptor('feet', body);

    // Assemble sentences, only including parts that have descriptors
    const faceParts = [];
    if (faceDesc) faceParts.push(`a ${faceDesc} face`);
    if (eyeDescriptor) faceParts.push(`with ${eyesStr}`);
    if (lipsDesc) faceParts.push(`and ${lipsDesc} lips`);

    const bodyParts = [];
    if (breastsDesc) bodyParts.push(`${breastsDesc} breasts`);
    if (nipplesDesc) bodyParts.push(`with ${nipplesDesc} nipples`);
    if (bellyDesc) bodyParts.push(`a ${bellyDesc} belly`);
    if (buttocksDesc) bodyParts.push(`${buttocksDesc} buttocks`);
    if (vaginaDesc) bodyParts.push(`and a ${vaginaDesc} vagina`);

    const limbsParts = [];
    if (armsDesc) limbsParts.push(`She has ${armsDesc} arms`);
    if (handsDesc) limbsParts.push(`with ${handsDesc} hands`);
    if (thighsDesc) limbsParts.push(`her thighs are ${thighsDesc}`);
    if (calvesDesc) limbsParts.push(`with ${calvesDesc} calves`);
    if (feetDesc) limbsParts.push(`and ${feetDesc} feet`);

    let para2 = `<p>She has ${faceParts.join(' ')}.`;
    if (bodyParts.length > 0) para2 += ` Her body has ${bodyParts.join(', ').replace(/, and/g, ' and')}.`;
    if (limbsParts.length > 0) para2 += ` ${limbsParts.join(', ').replace(/, her/g, ' her').replace(/, with/g, ' with').replace(/, and/g, ' and')}.`;
    para2 += `</p>`;

    // --- Build Paragraph 3 (Tattoos & Piercings) ---
    let para3 = '';
    if (includeMods) {
        const coverageMap = getCoverageInfo();
        const visibleTattoos = [];
        const visiblePiercings = [];

        for (const partId in body) {
            const part = body[partId];
            // A part is visible if it's NOT in the coverage map
            if (!coverageMap.has(partId)) {
                if (part.tattoos && part.tattoos.length > 0) {
                    part.tattoos.forEach(tattoo => {
                        visibleTattoos.push(`on her ${part.name.toLowerCase()} is ${tattoo.design}`);
                    });
                }
                if (part.piercings && part.piercings.length > 0) {
                    part.piercings.forEach(piercing => {
                        visiblePiercings.push(`her ${part.name.toLowerCase()} is pierced with ${piercing.jewelry}`);
                    });
                }
            }
        }

        if (visibleTattoos.length > 0) {
            para3 += `<p>Visible tattoos include: ${visibleTattoos.join(', ')}.</p>`;
        }
        if (visiblePiercings.length > 0) {
            // If there's no tattoo paragraph, start a new one. Otherwise, add to the existing one.
            if (para3 === '') {
                para3 += `<p>She has several piercings: ${visiblePiercings.join(', ')}.</p>`;
            } else {
                para3 = para3.slice(0, -4); // remove last </p>
                para3 += ` She also has several piercings: ${visiblePiercings.join(', ')}.</p>`;
            }
        }
    }

    return para1 + para2 + para3;
}

function applyBodyDescriptorsFromUI(bodyObject) {
    const descriptorSelects = document.querySelectorAll('#bodyShapeOptions select');
    descriptorSelects.forEach(select => {
        const group = select.dataset.partGroup;
        const descriptor = select.value;

        for (const partId in bodyObject) {
            const basePartName = partId.replace(/left_|right_/, '');
            const groupInfo = descriptorGroupMap[basePartName];
            if (groupInfo && groupInfo.display === group) {
                bodyObject[partId].descriptor = descriptor;
            }
        }
    });
}

function updateCreationPreview() {
    const previewContainer = document.getElementById('creation-preview');
    if (!previewContainer) return;

    // Build a temporary appearance object from the current UI values for the preview
    const tempAppearance = {
        birthDate: state.appearance.birthDate,
        height: parseInt(document.getElementById('heightSlider').value, 10),
        hairLength: parseInt(document.getElementById('hairLengthSlider').value, 10),
        skinColor: { name: document.querySelector('#skin-color-picker .color-swatch.selected')?.dataset.colorName || state.appearance.skinColor.name, hex: document.querySelector('#skin-color-picker .color-swatch.selected')?.dataset.colorHex || state.appearance.skinColor.hex },
        hairColor: state.appearance.hairColor, // This is updated directly from the picker
        eyeColor: state.appearance.eyeColor,   // This is updated directly from the picker
    };

    // Build a temporary body object for the preview and apply descriptors
    const tempBody = createPlayerBody(state.sex);
    applyBodyDescriptorsFromUI(tempBody);

    previewContainer.innerHTML = `<h4>Preview</h4>` + generateCharacterDescription(tempAppearance, tempBody, true);
}

function populateSkinPicker(containerId, paletteName, targetProperty) {
    const palette = colorPalettes[paletteName];
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear previous content
    container.className = 'grid-picker-container'; // Use grid styles

    for (const groupName in palette) {
        const colors = palette[groupName];
        const row = document.createElement('div');
        row.className = 'grid-picker-row';

        colors.forEach(hex => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch'; // Use the circular swatch style
            swatch.style.backgroundColor = hex;
            swatch.dataset.colorName = groupName;
            swatch.dataset.colorHex = hex;
            swatch.title = `${groupName} (${hex})`;

            swatch.onclick = () => {
                container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                state.appearance[targetProperty] = { name: groupName, hex: hex };
                updateCreationPreview();
            };
            row.appendChild(swatch);
        });
        container.appendChild(row);
    }

    // Set default selection for skin
    const currentHex = state.appearance[targetProperty].hex;
    const defaultSwatch = Array.from(container.querySelectorAll('.color-swatch')).find(s => s.dataset.colorHex === currentHex);
    if (defaultSwatch) {
        defaultSwatch.classList.add('selected');
    } else if (container.querySelector('.color-swatch')) {
        const firstSwatch = container.querySelector('.color-swatch');
        firstSwatch.classList.add('selected');
        state.appearance[targetProperty] = { name: firstSwatch.dataset.colorName, hex: firstSwatch.dataset.colorHex };
        updateCreationPreview();
    }
}

function showGrayscaleOverlay(event, targetProperty) {
    const overlay = document.getElementById('grayscale-overlay');
    const container = document.getElementById('grayscale-picker-container');
    if (!overlay || !container) return;

    container.innerHTML = ''; // Clear previous content

    const grays = [
        { name: 'Gray', hex: '#D5D5D5' }, { name: 'Gray', hex: '#AAAAAA' },
        { name: 'Gray', hex: '#808080' }, { name: 'Gray', hex: '#555555' },
        { name: 'Gray', hex: '#2A2A2A' }, { name: 'Black', hex: '#000000' }
    ];
    const white = { name: 'White', hex: '#FFFFFF' };
    const shape = [2, 3, 2];
    let grayIndex = 0;
    let swatchIndex = 0;

    shape.forEach(itemsThisRow => {
        const row = document.createElement('div');
        row.className = 'hex-row';
        for (let i = 0; i < itemsThisRow; i++) {
            let color;
            // The 4th swatch (index 3) is the center one
            if (swatchIndex === 3) {
                color = white;
            } else {
                color = grays[grayIndex++];
            }

            const swatch = document.createElement('div');
            swatch.className = 'hex-swatch';
            swatch.style.backgroundColor = color.hex;
            swatch.dataset.colorName = color.name;
            swatch.dataset.colorHex = color.hex;
            swatch.title = `${color.name} (${color.hex})`;

            // Standard selection logic
            swatch.onclick = () => {
                state.appearance[targetProperty] = { name: color.name, hex: color.hex };
                const mainPickerContainer = document.getElementById(`${targetProperty.replace('Color', '-color-picker')}`);
                if (mainPickerContainer) {
                    mainPickerContainer.querySelectorAll('.hex-swatch').forEach(s => s.classList.remove('selected'));
                    const newSelection = Array.from(mainPickerContainer.querySelectorAll('.hex-swatch')).find(s => s.dataset.colorHex === color.hex);
                    if (newSelection) {
                        newSelection.classList.add('selected');
                    } else {
                        // If the color is not in the main palette (like a gray), select the center white swatch as a visual indicator
                        mainPickerContainer.querySelector('.hex-swatch[title^="Grays"]').classList.add('selected');
                    }
                }
                updateCreationPreview();
                overlay.style.display = 'none';
            };
            row.appendChild(swatch);
            swatchIndex++;
        }
        container.appendChild(row);
    });

    // --- Dynamic Positioning ---
    // 1. Make the overlay part of the layout but invisible to measure it
    overlay.style.visibility = 'hidden';
    overlay.style.display = 'block';

    // 2. Get dimensions and calculate position
    const swatchRect = event.target.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const top = swatchRect.top + (swatchRect.height / 2) - (overlayRect.height / 2);
    const left = swatchRect.left + (swatchRect.width / 2) - (overlayRect.width / 2);

    // 3. Apply position and make it visible
    overlay.style.top = `${top}px`;
    overlay.style.left = `${left}px`;
    overlay.style.transform = 'none'; // Override the default centering transform
    overlay.style.visibility = 'visible';

    // --- Add listener to close on outside click ---
    const closeListener = (closeEvent) => {
        if (!overlay.contains(closeEvent.target)) {
            overlay.style.display = 'none';
            document.removeEventListener('click', closeListener);
        }
    };
    // Use a timeout to add the listener, preventing it from catching the same click that opened it
    setTimeout(() => {
        document.addEventListener('click', closeListener);
    }, 0);
}

function populateHexPicker(containerId, paletteName, targetProperty) {
    const useUnnatural = document.getElementById('unnaturalColorsToggle').checked;
    const palette = useUnnatural ? colorPalettes[paletteName].unnatural : colorPalettes[paletteName].natural;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear previous content
    container.className = 'hex-picker-container';
    let allColors = Array.isArray(palette) ? palette : [];

    // 2. Create the specific honeycomb shape
    const shape = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6]; // New 11-row, 91-slot shape
    let colorIndex = 0;

    shape.forEach(itemsThisRow => {
        if (colorIndex >= allColors.length) return;

        const row = document.createElement('div');
        row.className = 'hex-row';

        for (let i = 0; i < itemsThisRow && colorIndex < allColors.length; i++) {
            const color = allColors[colorIndex];

            const swatch = document.createElement('div');
            swatch.className = 'hex-swatch';
            swatch.style.backgroundColor = color.hex;
            swatch.dataset.colorName = color.name;
            swatch.dataset.colorHex = color.hex;
            swatch.title = `${color.name} (${color.hex})`;

            // If this is the special "Grays..." swatch, give it the overlay-opening function.
            // Otherwise, give it the standard color selection function.
            if (color.name === 'Grays...') {
                swatch.onclick = (event) => showGrayscaleOverlay(event, targetProperty);
            } else {
                swatch.onclick = () => {
                    container.querySelectorAll('.hex-swatch').forEach(s => s.classList.remove('selected'));
                    swatch.classList.add('selected');
                    state.appearance[targetProperty] = { name: color.name, hex: color.hex };
                    updateCreationPreview();
                };
            }

            row.appendChild(swatch);
            colorIndex++;
        }

        container.appendChild(row);
    });

    // 3. Set the default selection
    const currentHex = state.appearance[targetProperty].hex;
    const defaultSwatch = Array.from(container.querySelectorAll('.hex-swatch')).find(s => s.dataset.colorHex === currentHex);
    if (defaultSwatch) {
        defaultSwatch.classList.add('selected');
    } else if (container.querySelector('.hex-swatch')) {
        const firstSwatch = container.querySelector('.hex-swatch');
        firstSwatch.classList.add('selected');
        state.appearance[targetProperty] = {
            name: firstSwatch.dataset.colorName,
            hex: firstSwatch.dataset.colorHex
        };
        updateCreationPreview();
    }
}

function initCreationScreen() {
    // --- Randomize all values ---
    state.appearance.height = 150 + Math.floor(Math.random() * 36); // 150-185
    state.appearance.hairLength = Math.floor(Math.random() * 101); // 0-100

    const skinPalette = colorPalettes.skin;
    const skinGroups = Object.keys(skinPalette);
    const randomSkinGroup = skinGroups[Math.floor(Math.random() * skinGroups.length)];
    const randomSkinColors = skinPalette[randomSkinGroup];
    const randomSkinHex = randomSkinColors[Math.floor(Math.random() * randomSkinColors.length)];
    state.appearance.skinColor = { name: randomSkinGroup, hex: randomSkinHex };

    const naturalHairPalette = colorPalettes.hair.natural;
    state.appearance.hairColor = naturalHairPalette[Math.floor(Math.random() * naturalHairPalette.length)];

    const naturalEyePalette = colorPalettes.eyes.natural;
    state.appearance.eyeColor = naturalEyePalette[Math.floor(Math.random() * naturalEyePalette.length)];

    // --- Populate UI elements ---
    populateSkinPicker('skin-color-picker', 'skin', 'skinColor');

    const heightSlider = document.getElementById('heightSlider');
    const heightValue = document.getElementById('heightValue');
    heightSlider.value = state.appearance.height;
    heightValue.textContent = state.appearance.height;
    heightSlider.oninput = (e) => {
        heightValue.textContent = e.target.value;
        updateCreationPreview();
    };

    const hairLengthSlider = document.getElementById('hairLengthSlider');
    const hairLengthValue = document.getElementById('hairLengthValue');
    hairLengthSlider.value = state.appearance.hairLength;
    hairLengthValue.textContent = state.appearance.hairLength;
    hairLengthSlider.oninput = (e) => {
        hairLengthValue.textContent = e.target.value;
        updateCreationPreview();
    };

    // Populate Body Shape Descriptor Dropdowns and randomize them
    const bodyShapeContainer = document.getElementById('bodyShapeOptions');
    bodyShapeContainer.innerHTML = '';
    const bodyPartDisplayOrder = [
        'face', 'eyes', 'lips', 'neck', 'breasts', 'nipples', 'arms', 'hands', 'belly', 'buttocks', 'vagina', 'thighs', 'calves', 'feet'
    ];
    for (const groupName of bodyPartDisplayOrder) {
        const isFemaleOnly = femaleOnlyDescriptors.includes(groupName);
        const isMaleOnly = maleOnlyDescriptors.includes(groupName);
        if (state.sex === 'female' && isMaleOnly) continue;
        if (state.sex === 'male' && isFemaleOnly) continue;
        if (!bodyPartDescriptors[groupName]) continue;

        const descriptors = bodyPartDescriptors[groupName];
        const controlWrapper = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = groupName.charAt(0).toUpperCase() + groupName.slice(1);
        label.style.display = 'block';
        label.style.marginBottom = '0.25rem';

        const select = document.createElement('select');
        select.dataset.partGroup = groupName;
        select.style.width = '100%';
        select.onchange = updateCreationPreview;

        descriptors.forEach(desc => {
            const option = document.createElement('option');
            option.value = desc;
            option.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
            select.appendChild(option);
        });

        // Randomize selection
        select.selectedIndex = Math.floor(Math.random() * select.options.length);

        controlWrapper.appendChild(label);
        controlWrapper.appendChild(select);
        bodyShapeContainer.appendChild(controlWrapper);
    }

    // Populate color pickers
    populateHexPicker('hair-color-picker', 'hair', 'hairColor');
    populateHexPicker('eye-color-picker', 'eyes', 'eyeColor');

    // Add listener for the unnatural colors toggle
    const unnaturalToggle = document.getElementById('unnaturalColorsToggle');
    unnaturalToggle.onchange = () => {
        populateHexPicker('hair-color-picker', 'hair', 'hairColor');
        populateHexPicker('eye-color-picker', 'eyes', 'eyeColor');
        updateCreationPreview(); // Update preview after palette changes
    };

    // Initial call to populate the preview pane with all randomized values
    updateCreationPreview();
}

function finalizeCharacterFromUI() {
    // --- Step 1: Gather all UI data and update appearance state ---
    const heightSlider = document.getElementById('heightSlider');
    const hairLengthSlider = document.getElementById('hairLengthSlider');
    const selectedSkinSwatch = document.querySelector('#skin-color-picker .color-swatch.selected');

    state.appearance.height = parseInt(heightSlider.value, 10);
    state.appearance.hairLength = parseInt(hairLengthSlider.value, 10);
    if (selectedSkinSwatch) {
        state.appearance.skinColor = {
            name: selectedSkinSwatch.dataset.colorName,
            hex: selectedSkinSwatch.dataset.colorHex
        };
    }
    // Note: hair/eye color are already handled by their own event listeners and set in state directly.

    // --- Step 2: Create the base player body object ---
    state.playerBody = createPlayerBody(state.sex);

    // --- Step 3: Apply the body descriptors to the newly created body ---
    applyBodyDescriptorsFromUI(state.playerBody);
}
