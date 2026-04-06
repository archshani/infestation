window.setup = window.setup || {};

setup.exportBuild = function(playerName, selectedTraits) {
    const buildData = {
        name: playerName,
        traits: selectedTraits
    };
    const jsonStr = JSON.stringify(buildData);
    const b64Str = btoa(jsonStr);
    return b64Str;
};

setup.importBuild = function(b64Str) {
    try {
        const jsonStr = atob(b64Str);
        const buildData = JSON.parse(jsonStr);
        if (buildData && buildData.name && Array.isArray(buildData.traits)) {
            return buildData;
        }
    } catch (e) {
        console.error("Invalid build string:", e);
    }
    return null;
};
