window.setup = window.setup || {};

setup.calculateAttributeCost = function(score) {
    if (score <= 13) return 1;
    if (score <= 15) return 2;
    return 0;
};

setup.getAttributeCost = function(current, target) {
    let cost = 0;
    if (target > current) {
        for (let i = current + 1; i <= target; i++) {
            cost += setup.calculateAttributeCost(i);
        }
    } else {
        for (let i = current; i > target; i--) {
            cost -= setup.calculateAttributeCost(i);
        }
    }
    return cost;
};

setup.canAffordAttribute = function(currentPoints, currentScore, targetScore) {
    const cost = setup.getAttributeCost(currentScore, targetScore);
    return currentPoints >= cost;
};
