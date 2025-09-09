/* ==============================================================
   CHARACTER WINDOW
   ============================================================== */
function showCharTab(tabName) {
    document.querySelectorAll('.char-tab').forEach(t => t.style.display = 'none');
    const tab = document.getElementById(`char-${tabName}`);
    if (tab) tab.style.display = 'block';

    if (state.ui) {
        state.ui.lastCharTab = tabName;
    }

    if (tabName === 'status') updateCharStatusTab();
    else if (tabName === 'skills') updateCharSkillsTab();
    else if (tabName === 'stats') updateCharStatsTab();
    else if (tabName === 'equipment') buildEquipmentTab();
    else if (tabName === 'inventory') buildInventoryTab();
}

function showItemTooltip(event, item, unequipConfig = null) {
    // Prevent the click from propagating to the document and closing the tooltip immediately
    event.stopPropagation();

    const tooltip = document.getElementById('sub-overlay');
    const header = tooltip.querySelector('.overlayHeader');
    const body = tooltip.querySelector('.overlayBody');

    // --- 1. Populate Content ---
    const template = clothingTemplates[item.templateId];
    const templateName = template ? template.name : 'Custom Item';
    header.innerHTML = `
        ${item.name}
        <span style="font-size: 0.8em; color: grey;">(${templateName})</span>
    `;

    let bodyHtml = '<h4>Covers:</h4>';
    if (item.covers && item.covers.length > 0) {
        bodyHtml += '<ul style="list-style-position: inside; padding-left: 1.2rem; margin-top: 0.2rem;">';
        item.covers.forEach(partId => {
            const partName = state.playerBody[partId] ? state.playerBody[partId].name : partId;
            bodyHtml += `<li>${partName}</li>`;
        });
        bodyHtml += '</ul>';
    } else {
        bodyHtml += '<p>Nothing.</p>';
    }

    bodyHtml += '<h4 style="margin-top: 1rem;">Tags:</h4>';
    if (item.tags && item.tags.length > 0) {
        bodyHtml += `<p style="padding: 0 0.5rem; margin-top: 0.2rem;">${item.tags.join(', ')}</p>`;
    } else {
        bodyHtml += '<p>No tags.</p>';
    }

    body.innerHTML = bodyHtml;

    // Add unequip and replace buttons if callback is provided
    if (unequipConfig) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '1rem';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '0.5rem';

        const unequipBtn = document.createElement('button');
        unequipBtn.textContent = 'Unequip';
        unequipBtn.className = 'overlayBtn';
        unequipBtn.style.flexGrow = '1';
        unequipBtn.onclick = () => {
            unequipItem(unequipConfig.slotId, unequipConfig.subSlot);
            tooltip.style.display = 'none';
        };

        buttonContainer.appendChild(unequipBtn);
        body.appendChild(buttonContainer);
    }

    // --- 2. Position Tooltip ---
    tooltip.style.display = 'block';
    positionTooltip(tooltip, event.target);
}

function positionTooltip(tooltipEl, targetEl) {
    const parentOverlay = document.getElementById('btnChar-overlay');
    // If the parent overlay isn't open, something is wrong. Don't position.
    if (!parentOverlay || parentOverlay.style.display !== 'block') {
        tooltipEl.style.display = 'none';
        return;
    }

    const parentRect = parentOverlay.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();

    // Default position: below the target
    let top = targetRect.bottom + 5;
    let left = targetRect.left;

    // If it doesn't fit below, try to fit it above
    if (top + tooltipRect.height > parentRect.bottom) {
        top = targetRect.top - tooltipRect.height - 5;
    }

    // Now, clamp the vertical position to be within the parent
    if (top < parentRect.top) {
        top = parentRect.top + 5;
    }
    if (top + tooltipRect.height > parentRect.bottom) {
        top = parentRect.bottom - tooltipRect.height - 5;
    }

    // Clamp the horizontal position
    if (left < parentRect.left) {
        left = parentRect.left + 5;
    }
    if (left + tooltipRect.width > parentRect.right) {
        left = parentRect.right - tooltipRect.width - 5;
    }

    tooltipEl.style.top = `${top + window.scrollY}px`;
    tooltipEl.style.left = `${left + window.scrollX}px`;
}


function openItemSelectionOverlay(event, slotId, subSlot = null) {
    event.stopPropagation();
    const subOverlay = document.getElementById('sub-overlay');
    const header = subOverlay.querySelector('.overlayHeader');
    const body = subOverlay.querySelector('.overlayBody');

    // Logic change: filter by slot only, not layer.
    const compatibleItems = state.inventory.filter(item => item.slot === slotId);

    let headerText;
    const slot = state.equipment[slotId];
    const slotName = slot ? slot.name : slotId;

    if (slot instanceof EquipmentSlot) { // Layered slots
        headerText = `Select Item for ${slotName} (${subSlot} layer)`;
    } else if (slot instanceof HandHeldSlot) {
        headerText = `Select Item for ${subSlot} hand`;
    } else if (slot instanceof BackSlot) {
        headerText = `Select Item for Back`;
    } else {
        headerText = `Select Item for ${slotName}`; // Fallback
    }

    header.textContent = headerText;
    body.innerHTML = '';

    if (compatibleItems.length === 0) {
        body.innerHTML = '<p>No compatible items in inventory.</p>';
    } else {
        const list = document.createElement('ul');
        compatibleItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.name;

            const equipBtn = document.createElement('button');
            equipBtn.className = 'overlayBtn';
            equipBtn.style.marginLeft = '1rem';
            equipBtn.textContent = 'Equip';
            equipBtn.onclick = () => {
                equipItem(item.id, subSlot);
                // Manually refresh UI since equipItem doesn't
                buildEquipmentTab();
                updateCharDesc();
                document.getElementById('sub-overlay').style.display = 'none';
            };

            listItem.appendChild(equipBtn);
            list.appendChild(listItem);
        });
        body.appendChild(list);
    }

    // --- Position Tooltip ---
    subOverlay.style.display = 'block';
    positionTooltip(subOverlay, event.target);
}

function buildEquipmentTab() {
    const equipmentDiv = document.getElementById('char-equipment');
    equipmentDiv.innerHTML = ''; // Clear previous content

    // Main container for positioning context
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    // --- ASCII Art as background ---
    const asciiArt = `
                                                                                                                ████████
                                                                                                             ███        ███████████
                                                                                                          ███                      ██
                                                                                                        ███                          ██
                                                                                                      ████                             ██
                                                                                                     ████                               ██
                                                                                                    █████                                ██
                                                                                                   █████                                  ██
                                                                                                  ██████                                   ██
                                                                                                 ██████                                     █
                                                                                                 █████    █                                 ██
                                                                                                ██████   ██                                 ██
                                                                                                ██████   ██                                  ██
                                                                                               ███████  ███                     █             █
                                                                                               ███████ █████                     █            ██
                                                                                              ███████████████                     █            ██
                                                                                             ██████████████████                    █             █
                                                                                            ████████████████████                    ██            █
                                                                                           █████████████████████                    ████          ██
                                                                                           ██████████████    ███                     ████          █
                                                                                           ███████████████   ███                     █████         █
                                                                                           ██████  █████████████                      ███          ██
                                                                                           ████ █  █████████████                    ████          ██
                                                                                            ████ ████████████████                   ███           ██
                                                                                             ██████████████████                    ███            █
                                                                                              █████████████████                   ████           ██
                                                                                              █████████████████                   ███            ██
                                                                                              ██████████████████                  ██             ██
                                                                                         ███ ███████████████████                  ██             ███ ██
                                                                                          ███████████████████████         █       ██           ███████
                                                                                           █████████████████████████████           █           █████
                                                                                              ███████████████████████              ██    █████████
                                                                                                █████████████████                 ████████████████
                                                                                                     ███████████                   ████████████
                                                                                                         ██████                    █
                                                                                                      █████████                     ██
                                                                                                  ████████████                        ██
                                                                                             █████                                      ██████
                                                                                    ███████████                                               ████████
                                                                                 ████                                                                 ████
                                                                              ████                                                                        ██
                                                                             ███                                                                            ██
                                                                            ███                                                                               █
                                                                          ████                                                                                ██
                                                                         ████                                                                                 ██
                                                                        ████                                                                                   ██
                                                                       ████                                                                                    ██
                                                                      ████                                                                                      █
                                                                     ████                                                                                       █
                                                                    ████             ██████                                                                     ██
                                                                  ██████            ████████                                                                    ██
                                                                 █████              █████████                                                        █          █
                                                               ██████              ███████████                                                       █          ██
                                                              ██████               ███████████                                                       █          ██
                                                             █████               █████████████                                                                  █
                                                           █████               ██████ ██████████                                                                █
                                                          ████               ██████    ██████████                                                               ██
                                                        █████               █████       █████████                                                               ██
                                                       ████                ████         ██████████                                                   ██         ██
                                                      ████                ████           ██████████                                                 ███         ██
                                                    █████               ████             ███████████                                                ███         ███
                                                   █████               ████              █████████████                                             ████          ██
                                                  █████              ████                 ███████████████                                       ███████          █
                                                 ████              █████                  ███████████████                                     █████████          ██
                                                ████             █████                     ████████                                               █████          ██
                                               ████             ████                        ███████                                               ██████         █
                                               ███            █████                         ███████                                             ████████          ██
                                              ████            ███                           ███████                                             ████████          █
                                              █████           ██                             ███████                                            ████████          ██
                                              ██████           ██                             ███████                                           ██ █████           █
                                              ██████            ██                            ███████                                           ██  ████           █
                                               ██████            ██                            ██████                                           ██  █████          █
                                                ███████           ██                           ██████                                           ██  █████           █
                                                 ███████           ██                          ██████                                           ██  ██████          █
                                                  ███████           ███                         █████                                           ██  ██████           █
                                                    ██████            ██                        ████                                             ██  ████            █
                                                     ███████           ██                       ████                                              █  ████             █
                                                       ███████          ██                     █████                                              ██ ███              █
                                                        ████████          ██                   █████                                               █████              █
                                                          ████████          ██               ████                                                   █████             ██
                                                            ████████          ██           ███████                           █                       █████             █
                                                              ████████          ██        ███ █████████                                               ████             █
                                                                ███████           ██    ███           ██                                               ███             █
                                                                  ███████           ██████   ██████                                                    ████            ██
                                                                    ██████          █████         ████                                                  ████           ██
                                                                      ██████       ██████   ████     ███                                                 ████          ██
                                                                         █████   ███████    ███████     ███                                              █████         █
                                                                           █████████████████       ████                                                   ████         █
                                                                             ████████████████████                                                          ████        ██
                                                                               █████████████████████                                                       █████       ██
                                                                                 ██████  █████                                                              ████       ██
                                                                                        ██████                                                              █████      █
                                                                                        █████                                                               █████      ██
                                                                                       █████                                                                 ████       █
                                                                                       ████                                                                  █████      █
                                                                                       ████                                                                   ████      █
                                                                                      █████                                                                   ████      █
                                                                                      █████                                                                   █████     ██
                                                                                      █████                                                                   █████     ██
                                                                                     ██████                                                                   █████     ██
                                                                                     ██████                                                                   █████      █
                                                                                    ██████                                                                    █████      ██
                                                                                    ██████                      █                      █                      ██ ██      ██
                                                                                    █████                        █                    █                       ██ ██      ██
                                                                                   ██████                         █  ████         █ ██                        ██ ██      █
                                                                                   ██████                          ██████████████████                         ███        ██
                                                                                  ██████                             ███████████████                          ███        ██
                                                                                  ██████                              █████████████                          ████        ██
                                                                                  █████                               ███   ███████                          ███          █
                                                                                 ██████                               ███   ███████                          ███          ██
                                                                                 ██████                               ███   ███████                         ████          ██
                                                                                 ██████                               ██   █████████                        ████          ██
                                                                                 █████                               ███   █████████                        █████   █      ██
                                                                                ██████                               ███   ████████                        ███ ██  ███     ██
                                                                                ██████                              ███    █████████                       ███ ██    ██   ███
                                                                                ██████                              ███    █████████                      ███  ██  █ ██  ███
                                                                                ██████                             ███     ████████                       ███  ███ ███   ██
                                                                                ██████                            ███      ████████                      ████  ██  ███   ██
                                                                               ██████                             ███      █████████                     ███   █  ███   ██
                                                                               ███████                           ███        ███████                     ████  █████  ████
                                                                               ██████                           ███         ████████                    ███  ████ █████
                                                                               ██████                          ████         ████████                    ███  ███████
                                                                               ██████                          ███          ████████                   ███   ███
                                                                               ██████                         ███           ████████                   ███
                                                                               ██████                        ████           ████████                  ████
                                                                               ██████                       ████            ████████                 ████
                                                                              ███████                      ████             ████████                 ███
                                                                              ███████                      ███              ████████                 ███
                                                                              ███████                     ████              ████████                ███
                                                                              ███████                    ████               ████████                ███
                                                                              ███████                    ████               ████████               ███
                                                                              ███████                   ████               █████████              ████
                                                                              ███████                    ██                ████████               ███
                                                                              ███████                   ███                ████████              ████
                                                                              ███████                   ██                 █████████             ███
                                                                              ████████                 ███                ██████████            ████
                                                                              ████████                 ███                ██████████            ███
                                                                              ███████                 ███                 ███████████          ████
                                                                              ███████                ████                 ███████████          ████
                                                                              ███████                ███                  ███████████         █████
                                                                             ███████                 ███                  ███████████        █████
                                                                             ███████              █  ██                   ███████████       ██████
                                                                            ████████           ███  ███                   ████████████     ███████
                                                                            ████████          ███   ███                   █████████████  █████████
                                                                            ███████          ███    ██                    █████████████ █████████
                                                                           ████████         ██     ███                     ██████████      ██████
                                                                           ████████               ███                      ███████████      █████
                                                                          █████████              ███                       ███████████     ██████
                                                                         ██████████        █    ███                        ████████████   ██  ███
                                                                         ████████              ███                         █████████           ██
                                                                        ██████████            ███                          ████████            ██
                                                                        ████████              ██                          █████████           ███
                                                                       ████████              ███                          █████████           ███
                                                                       ███████              ████                          █████████           ███
                                                                      ███████                ██                          ██████████           ███
                                                                      ███████                ██                          ███████████          ███
                                                                      ██████                 ██                          ██████████          ████
                                                                     ███████                 ██                         █████  ███           ███
                                                                     ███████                ███                         █████  ██            ███
                                                                     ██████                 ██                          █████  ██           ████
                                                                     ██████                 ██                          █████  ██           ███
                                                                     ██████                 ██                          █████  ██           ███
                                                                     █████                 ██                           ██████ ██          ███
                                                                     █████                 ██                           █████████          ███
                                                                     █████                ██                            ████████          ███
                                                                     █████               ██                             █████  █          ███
                                                                     ████                ██                             █████            ███
                                                                     █████              ██                              █████            ███
                                                                    █████             ███                               █████           ███
                                                                    █████             ██                                █████           ███
                                                                    █████            ███                                █████          ███
                                                                    █████            ██                                 █████          ███
                                                                    █████           ██                                  ████          ███
                                                                    █████          ███                                  ████          ███
                                                                    ████           ██                                   ████         ███
                                                                    █████          ██                                   ████         ███
                                                                    █████         ██                                    ████         ██
                                                                    ████          █                                     ████        ██
                                                                     ███         ██                                     ███         ██
                                                                     ███         ██                                     ███        ██
                                                                    ████        ██                                     ████        ██
                                                                    ████        ██                                    ████         ██
                                                                    ████       ██                                     ████        ███
                                                                   █████       ██                                     ████        ██
                                                                   ████        ██                                     ████        ██
                                                                   ████        ██                                     ████        ██
                                                                  ████        ███                                     ████         ██
                                                                 ███          ███                                     █████         █
                                                                ███          ███                                     ███████         ██
                                                              ████           ███                                     ███████          ██
                                                             ████           █████                                    ████████         ███
                                                           █████          ███████                                     ████████          ███
                                                        ██████           ███████                                         █████           █████
                                                      ██████             █████                                             ███                █
                                                    █████               ███                                                ████               ██
                                                    ███                 ██                                                  ██████            ██
                                                   ████               ███                                                    █████            ██
                                                    ████             ███                                                       ████        ███
                                                     █████          ██                                                           ███████████
                                                       █████████████
`;
    const pre = document.createElement('pre');
    pre.textContent = asciiArt;
    pre.style.position = 'absolute';
    pre.style.top = '50%';
    pre.style.left = '45%';
    pre.style.transform = 'translate(-50%, -50%)';
    pre.style.fontSize = '3.55px';
    pre.style.lineHeight = '0.85';
    pre.style.fontFamily = 'monospace';
    pre.style.color = '#0c0';
    pre.style.zIndex = '-1'; // Put it behind the widgets
    container.appendChild(pre);

    // Container for the slot columns
    const slotContainer = document.createElement('div');
    slotContainer.style.display = 'flex';
    slotContainer.style.justifyContent = 'space-between';
    slotContainer.style.width = '100%';
    slotContainer.style.height = '100%';
    slotContainer.style.gap = '1rem';

    // Define columns
    const leftCol = document.createElement('div');
    leftCol.style.flexBasis = '12rem';
    leftCol.style.flexShrink = '0';
    leftCol.style.display = 'flex';
    leftCol.style.flexDirection = 'column';
    leftCol.style.justifyContent = 'flex-start';
    leftCol.style.overflowY = 'auto';
    leftCol.style.gap = '0.5rem'; // Add gap between widgets

    const leftCol2 = document.createElement('div');
    leftCol2.style.flexBasis = '12rem';
    leftCol2.style.flexShrink = '0';
    leftCol2.style.display = 'flex';
    leftCol2.style.flexDirection = 'column';
    leftCol2.style.justifyContent = 'flex-start';
    leftCol2.style.overflowY = 'auto';
    leftCol2.style.gap = '0.5rem'; // Add gap between widgets

    const rightCol = document.createElement('div');
    rightCol.style.flexBasis = '12rem';
    rightCol.style.flexShrink = '0';
    rightCol.style.display = 'flex';
    rightCol.style.flexDirection = 'column';
    rightCol.style.justifyContent = 'flex-start';
    rightCol.style.gap = '0.5rem'; // Add gap between widgets
    rightCol.style.overflowY = 'auto';

    // --- Create and Place Slot Widgets ---
    const createSlotWidget = (slotId) => {
        const slot = state.equipment[slotId];
        const widget = document.createElement('div');
        widget.style.border = '0 solid #444';
        widget.style.padding = '0';
        widget.style.width = '9.375rem';

        const nameDiv = document.createElement('div');
        nameDiv.style.fontWeight = 'bold';
        nameDiv.style.color = '#00ff00';
        nameDiv.style.marginBottom = '0.1rem';
        nameDiv.textContent = slot.name;
        widget.appendChild(nameDiv);

        const createLayerButton = (subSlot, subSlotName) => {
            const item = (slot instanceof BackSlot) ? slot.item : slot[subSlot];
            const button = document.createElement('button');

            // New Styling Logic
            button.style.background = '#222';
            button.style.border = '1px solid transparent'; // Dark border, no outline
            button.style.borderRadius = '4px';
            button.style.padding = '.15rem .6rem';
            button.style.cursor = 'pointer';
            button.style.width = '100%';
            button.style.textAlign = 'left';
            button.style.marginBottom = '0.05rem';
            button.style.whiteSpace = 'nowrap';
            button.style.overflow = 'hidden';
            button.style.textOverflow = 'ellipsis';

            const originalColor = item ? 'lightblue' : 'grey';
            button.style.color = originalColor;

            button.innerHTML = `<small>[${subSlotName} - ${item ? item.name : 'empty'}]</small>`;

            button.onmouseover = () => {
                button.style.color = '#00ff00'; // Green on hover
                button.style.borderColor = '#00ff00';
            };
            button.onmouseout = () => {
                button.style.color = originalColor; // Revert to original color
                button.style.borderColor = 'transparent';
            };

            button.onclick = (event) => {
                if (item) {
                    // Show the new tooltip for equipped items
                    showItemTooltip(event, item, { slotId: slotId, subSlot: subSlot });
                } else {
                    // Open the item selection overlay for empty slots
                    openItemSelectionOverlay(event, slotId, subSlot);
                }
            };

            // Add middle-click to unequip
            if (item) {
                button.onauxclick = (event) => {
                    if (event.button === 1) { // Middle mouse button
                        event.preventDefault();
                        unequipItem(slotId, subSlot);
                        document.getElementById('sub-overlay').style.display = 'none'; // Close tooltip
                    }
                };
            }
            widget.appendChild(button);
        };

        if (slot instanceof EquipmentSlot) {
            createLayerButton('skin', 'Skin');
            createLayerButton('middle', 'Middle');
            createLayerButton('outer', 'Outer');
        } else if (slot instanceof HandHeldSlot) {
            createLayerButton('left', 'Left Hand');
            createLayerButton('right', 'Right Hand');
        } else if (slot instanceof BackSlot) {
            createLayerButton('item', 'Back');
        }
        return widget;
    };

    // Add widgets to columns
    leftCol.appendChild(createSlotWidget('neck'));
    leftCol.appendChild(createSlotWidget('arms'));
    leftCol.appendChild(createSlotWidget('hands'));
    leftCol.appendChild(createSlotWidget('legs'));
    leftCol.appendChild(createSlotWidget('hand-held'));

    leftCol2.appendChild(createSlotWidget('back'));

    rightCol.appendChild(createSlotWidget('head'));
    rightCol.appendChild(createSlotWidget('upper'));
    rightCol.appendChild(createSlotWidget('lower'));
    rightCol.appendChild(createSlotWidget('waist'));
    rightCol.appendChild(createSlotWidget('feet'));


    // Create a wrapper for the left columns to group them
    const leftGroup = document.createElement('div');
    leftGroup.style.display = 'flex';
    leftGroup.style.gap = '1rem';
    leftGroup.appendChild(leftCol);
    leftGroup.appendChild(leftCol2);

    // Append the left group and the right column to the main slot container
    slotContainer.appendChild(leftGroup);
    slotContainer.appendChild(rightCol);
    container.appendChild(slotContainer);
    equipmentDiv.appendChild(container);
}

function buildInventoryTab() {
    const inventoryDiv = document.getElementById('char-inventory');
    inventoryDiv.innerHTML = ''; // Clear previous content

    if (state.inventory.length === 0) {
        inventoryDiv.innerHTML = '<p style="padding: 1rem;">Your inventory is empty.</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'inventory-grid';

    // Sort inventory alphabetically before displaying
    const sortedInventory = [...state.inventory].sort((a, b) => a.name.localeCompare(b.name));

    sortedInventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.textContent = item.name;
        itemDiv.title = item.name; // Show full name on hover if it's truncated
        itemDiv.onclick = (event) => showItemTooltip(event, item);
        grid.appendChild(itemDiv);
    });

    inventoryDiv.appendChild(grid);
}

function updateCharStatusTab() {
    const statusDiv = document.getElementById('char-status');
    if (!statusDiv) return;

    let html = '<h4>Appearance</h4>';
    html += generateCharacterDescription(state.appearance, state.playerBody, false);

    html += '<h4 style="margin-top: 1.5rem;">Tattoos & Piercings</h4>';
    const coverageMap = getCoverageInfo();
    const piercingDescriptions = [];
    const tattooDescriptions = [];

    // Iterate through all body parts to gather piercings.
    Object.values(state.playerBody).forEach(part => {
        if (part.piercings && part.piercings.length > 0) {
            part.piercings.forEach(piercing => {
                const isVisible = !coverageMap.has(part.id);
                const visibleBlue = '#ADD8E6';
                const hiddenBlue = 'lightblue';
                let visibilityHtml = isVisible
                    ? `<span style="color: ${visibleBlue};">It is currently visible.</span>`
                    : `<span style="color: ${hiddenBlue};">It isn't currently visible.</span>`;
                piercingDescriptions.push(`<li>Your ${part.name.toLowerCase()} is pierced with a ${piercing.name}. ${visibilityHtml}</li>`);
            });
        }
    });

    // Iterate through all body parts again to gather tattoos.
    Object.values(state.playerBody).forEach(part => {
        if (part.tattoos && part.tattoos.length > 0) {
            part.tattoos.forEach(tattoo => {
                const isVisible = !coverageMap.has(part.id);
                const isSexual = tattoo.tags.some(t => tattooThemeTags.includes(t) && t !== 'none');
                const exposureRed = '#ff4d4d';
                const visibleBlue = '#ADD8E6';
                const hiddenBlue = 'lightblue';

                let nameHtml = isSexual
                    ? `<span style="color: ${exposureRed};">"${tattoo.name}"</span>`
                    : `<span style="color: ${hiddenBlue};">"${tattoo.name}"</span>`;

                let visibilityHtml = '';
                if (isVisible) {
                    const color = isSexual ? exposureRed : visibleBlue;
                    visibilityHtml = `<span style="color: ${color};">It is currently visible.</span>`;
                } else {
                    visibilityHtml = `<span style="color: ${hiddenBlue};">It isn't currently visible.</span>`;
                }
                tattooDescriptions.push(`<li>${nameHtml} has been tattooed on your ${part.name.toLowerCase()}. ${visibilityHtml}</li>`);
            });
        }
    });

    const allModsHtml = piercingDescriptions.join('') + tattooDescriptions.join('');

    if (allModsHtml.length > 0) {
        html += '<ul>' + allModsHtml + '</ul>';
    } else {
        html += '<p>You have no body modifications.</p>';
    }

    statusDiv.innerHTML = html;
}

function updateCharSkillsTab() {
    const skillsDiv = document.getElementById('char-skills');
    if (!skillsDiv) return;
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">';

    for (const skillName in state.skills) {
        const skill = state.skills[skillName];
        const expForNextLevel = getExpForLevel(skill.level);
        const progress = skill.level >= 20 ? 100 : Math.round((skill.exp / expForNextLevel) * 100);

        html += `
            <div style="border: 1px solid #444; padding: 0.5rem; width: 120px; box-sizing: border-box; text-align: center;">
                <div style="font-size: 0.8rem;">${skillName}<br>(Lvl ${skill.level})</div>
                <div style="background: #333; height: 10px; margin-top: 5px; border-radius: 2px; overflow: hidden;">
                    <div style="width: ${progress}%; height: 100%; background: lightblue; border-radius: 2px;"></div>
                </div>
            </div>
        `;
    }
    html += '</div>';
    skillsDiv.innerHTML = html;
}

function updateCharStatsTab() {
    const statsDiv = document.getElementById('char-stats');
    if (!statsDiv) return;

    const generalStats = [
        'timesSlept', 'questsCompleted', 'itemsCrafted', 'distanceWalked',
        'timesCollapsedFromStress', 'timesClimaxed'
    ];

    const sexualStats = [
        'vaginalSexCount', 'analSexCount', 'oralSexGivenCount', 'oralSexReceivedCount',
        'vaginalCreampiesReceived', 'analCreampiesReceived', 'oralCreampiesReceived',
        'timesSwallowedSemen', 'totalGirlCumExpelled', 'uniqueSexualPartners'
    ];

    const formatStatName = (statName) => {
        return statName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    let html = '<h4>General</h4><ul style="list-style-position: inside; margin-top: 0.5rem;">';
    generalStats.forEach(statName => {
        if (state.stats.hasOwnProperty(statName)) {
            html += `<li>${formatStatName(statName)}: ${state.stats[statName]}</li>`;
        }
    });
    html += '</ul>';

    html += '<h4 style="margin-top: 1.5rem;">Sexual</h4><ul style="list-style-position: inside; margin-top: 0.5rem;">';
    sexualStats.forEach(statName => {
        if (state.stats.hasOwnProperty(statName)) {
            html += `<li>${formatStatName(statName)}: ${state.stats[statName]}</li>`;
        }
    });
    html += '</ul>';

    statsDiv.innerHTML = html;
}
