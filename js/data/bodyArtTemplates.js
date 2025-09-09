const tattooTemplates = {
    // Head & Face
    'face': { name: 'Face Tattoo', baseDesign: 'a small design on your face', baseCost: 400, allowedTags: ['tiny', 'small', 'lettering', 'linework', 'minimalist', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'forehead': { name: 'Forehead Tattoo', baseDesign: 'a design on your forehead', baseCost: 450, allowedTags: ['tiny', 'small', 'medium', 'geometric', 'lettering', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_ear': { name: 'Left Ear Tattoo', baseDesign: 'a delicate design on your left ear', baseCost: 200, allowedTags: ['tiny', 'linework', 'minimalist', 'geometric', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_ear': { name: 'Right Ear Tattoo', baseDesign: 'a delicate design on your right ear', baseCost: 200, allowedTags: ['tiny', 'linework', 'minimalist', 'geometric', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'nose': { name: 'Nose Tattoo', baseDesign: 'a subtle design on your nose', baseCost: 250, allowedTags: ['tiny', 'dotwork', 'minimalist', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'lips': { name: 'Lip Tattoo', baseDesign: 'a design on your inner lip', baseCost: 300, allowedTags: ['tiny', 'small', 'lettering', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'neck': { name: 'Neck Tattoo', baseDesign: 'a design on your neck', baseCost: 500, allowedTags: ['small', 'medium', 'tribal', 'geometric', 'lettering', 'neo traditional', 'blackwork', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    // Torso
    'chest': { name: 'Chest Tattoo', baseDesign: 'a piece covering your chest', baseCost: 1200, allowedTags: ['medium', 'large', 'american traditional', 'neo traditional', 'japanese', 'realism', 'blackwork', 'color', 'shading', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'belly': { name: 'Belly Tattoo', baseDesign: 'a design centered on your belly', baseCost: 800, allowedTags: ['small', 'medium', 'large', 'lettering', 'neo traditional', 'watercolor', 'color', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'upper_back': { name: 'Upper Back Tattoo', baseDesign: 'a large piece across your upper back', baseCost: 1500, allowedTags: ['medium', 'large', 'full-back', 'tribal', 'japanese', 'realism', 'blackwork', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'lower_back': { name: 'Lower Back Tattoo', baseDesign: 'a design on your lower back', baseCost: 700, allowedTags: ['small', 'medium', 'large', 'tribal', 'lettering', 'neo traditional', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    // Groin & Butt
    'groin': { name: 'Groin Tattoo', baseDesign: 'an intricate design above your groin', baseCost: 700, allowedTags: ['tiny', 'small', 'medium', 'tribal', 'geometric', 'minimalist', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'vagina': { name: 'Vagina Tattoo', baseDesign: 'a delicate design accenting your mound', baseCost: 900, allowedTags: ['tiny', 'small', 'watercolor', 'neo traditional', 'minimalist', 'color', 'linework', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_ass_cheek': { name: 'Left Ass Cheek Tattoo', baseDesign: 'a design on your left ass cheek', baseCost: 400, allowedTags: ['tiny', 'small', 'medium', 'lettering', 'american traditional', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_ass_cheek': { name: 'Right Ass Cheek Tattoo', baseDesign: 'a design on your right ass cheek', baseCost: 400, allowedTags: ['tiny', 'small', 'medium', 'lettering', 'american traditional', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'anus': { name: 'Anus Tattoo', baseDesign: 'a decorative pattern around your anus', baseCost: 1200, allowedTags: ['tiny', 'small', 'geometric', 'dotwork', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    // Limbs
    'left_arm': { name: 'Left Arm Tattoo', baseDesign: 'a design on your left arm', baseCost: 900, allowedTags: ['small', 'medium', 'large', 'full-sleeve', 'american traditional', 'japanese', 'realism', 'blackwork', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_arm': { name: 'Right Arm Tattoo', baseDesign: 'a design on your right arm', baseCost: 900, allowedTags: ['small', 'medium', 'large', 'full-sleeve', 'american traditional', 'japanese', 'realism', 'blackwork', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_wrist': { name: 'Left Wrist Tattoo', baseDesign: 'a small design on your left wrist', baseCost: 250, allowedTags: ['tiny', 'small', 'lettering', 'minimalist', 'linework', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_wrist': { name: 'Right Wrist Tattoo', baseDesign: 'a small design on your right wrist', baseCost: 250, allowedTags: ['tiny', 'small', 'lettering', 'minimalist', 'linework', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_hand': { name: 'Left Hand Tattoo', baseDesign: 'a design on your left hand', baseCost: 350, allowedTags: ['tiny', 'small', 'geometric', 'dotwork', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_hand': { name: 'Right Hand Tattoo', baseDesign: 'a design on your right hand', baseCost: 350, allowedTags: ['tiny', 'small', 'geometric', 'dotwork', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_thigh': { name: 'Left Thigh Tattoo', baseDesign: 'a design on your left thigh', baseCost: 1000, allowedTags: ['medium', 'large', 'neo traditional', 'watercolor', 'realism', 'color', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_thigh': { name: 'Right Thigh Tattoo', baseDesign: 'a design on your right thigh', baseCost: 1000, allowedTags: ['medium', 'large', 'neo traditional', 'watercolor', 'realism', 'color', 'blackwork', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_calf': { name: 'Left Calf Tattoo', baseDesign: 'a design on your left calf', baseCost: 600, allowedTags: ['small', 'medium', 'large', 'american traditional', 'tribal', 'blackwork', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_calf': { name: 'Right Calf Tattoo', baseDesign: 'a design on your right calf', baseCost: 600, allowedTags: ['small', 'medium', 'large', 'american traditional', 'tribal', 'blackwork', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_ankle': { name: 'Left Ankle Tattoo', baseDesign: 'a small design on your left ankle', baseCost: 250, allowedTags: ['tiny', 'small', 'minimalist', 'linework', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_ankle': { name: 'Right Ankle Tattoo', baseDesign: 'a small design on your right ankle', baseCost: 250, allowedTags: ['tiny', 'small', 'minimalist', 'linework', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'left_foot': { name: 'Left Foot Tattoo', baseDesign: 'a design on your left foot', baseCost: 400, allowedTags: ['small', 'medium', 'geometric', 'watercolor', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] },
    'right_foot': { name: 'Right Foot Tattoo', baseDesign: 'a design on your right foot', baseCost: 400, allowedTags: ['small', 'medium', 'geometric', 'watercolor', 'color', 'none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'] }
};

const piercingTemplates = {
    standard_stud: {
        name: 'Stud',
        baseCost: 100,
        baseJewelry: 'a simple stud',
        allowedTags: [
            // Location tags (these are the actual body part IDs)
            'left_ear', 'right_ear', 'nose', 'lips', 'belly', 'left_nipple', 'right_nipple', 'vagina', 'tongue', 'face', 'anus',
            // Material tags
            'stainless steel', 'titanium', 'gold', 'silver', 'blackened steel',
            // Style tags
            'stud', 'ring', 'barbell', 'horseshoe'
        ]
    }
};

const tattooStyleTags = ['american traditional', 'neo traditional', 'tribal', 'watercolor', 'realism', 'japanese', 'geometric', 'lettering', 'minimalist', 'abstract'];
const tattooFeatureTags = ['blackwork', 'color', 'linework', 'dotwork', 'shading', 'uv-ink'];
const tattooSizeTags = ['tiny', 'small', 'medium', 'large', 'full-sleeve', 'full-back'];
const piercingMaterialTags = ['stainless steel', 'titanium', 'gold', 'silver', 'blackened steel'];
const piercingStyleTags = ['stud', 'ring', 'barbell', 'horseshoe'];
const tattooThemeTags = ['none', 'promiscuous', 'prostitution', 'exhibitionism', 'deviancy', 'masochism', 'submission', 'pregnancy'];

const bodyPartOrder = [
    'face', 'forehead', 'left_ear', 'right_ear', 'nose', 'lips', 'tongue', 'neck',
    'chest', 'belly', 'upper_back', 'lower_back',
    'left_arm', 'right_arm', 'left_wrist', 'right_wrist', 'left_hand', 'right_hand',
    'groin', 'vagina', 'anus', 'left_ass_cheek', 'right_ass_cheek',
    'left_thigh', 'right_thigh', 'left_calf', 'right_calf', 'left_ankle', 'right_ankle', 'left_foot', 'right_foot'
];

const tattooTagPrices = {
    // Styles
    'american traditional': 300, 'neo traditional': 350, 'tribal': 250, 'watercolor': 400, 'realism': 500, 'japanese': 450, 'geometric': 280, 'lettering': 200, 'minimalist': 150, 'abstract': 320,
    // Features
    'blackwork': 100, 'color': 250, 'linework': 50, 'dotwork': 180, 'shading': 120, 'uv-ink': 400,
    // Sizes
    'tiny': 50, 'small': 150, 'medium': 300, 'large': 500, 'full-sleeve': 2000, 'full-back': 3500,
    // Themes
    'promiscuous': 200, 'prostitution': 500, 'exhibitionism': 250, 'deviancy': 300, 'masochism': 350, 'submission': 400, 'pregnancy': 450
};
