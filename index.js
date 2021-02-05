module.exports = function (config) {
    var gates = config.gates.map(function (gateConfig) {
        return handleGate(gateConfig, (config.defaultBehavior = 'deny'));
    });
    return new Promise(function (resolve) {
        resolve(gates.reduce(function (p, gate) {
            return p.then(function (allow) { return (allow ? gate.then() : false); });
        }, Promise.resolve(true)));
    });
};
function handleGate(gateConfig, defaultBehavior) {
    if (defaultBehavior === void 0) { defaultBehavior = 'deny'; }
    switch (gateConfig.gateType) {
        case 'geofence':
        case 'ip':
        case 'subnet':
        case 'custom':
        case 'time':
        case 'percentage':
            return BuildPercentageGate(gateConfig.percentAllowed);
        default:
            throw Error('Please set a valid gateType');
    }
}
function BuildPercentageGate(percentAllowed) {
    return new Promise(function (resolve) {
        Math.random() * 100 <= percentAllowed ? resolve(true) : resolve(false);
    });
}
// function BuildCustomGate(allow, deny, customFunction, defaultBehavior) {
//   return new Promise((resolve, reject) => {
//     customFunction.arguments;
//   });
// }
