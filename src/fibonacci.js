
const { FGL } = require("pil-stark");

module.exports.buildConstants = async function (pols) {

    const N = pols.ISLAST.length;

    for ( let i=0; i<N; i++) {
        pols.ISLAST[i] = (i == N-1) ? 1n : 0n;
    }
}

module.exports.execute = async function (pols, input) {

    const N = pols.aLast.length;

    pols.aBeforeLast[0] = BigInt(input[0]);
    pols.aLast[0] = BigInt(input[1]);

    for (let i=1; i<N; i++) {
        pols.aBeforeLast[i] =pols.aLast[i-1];
        pols.aLast[i] = FGL.add(pols.aBeforeLast[i-1], pols.aLast[i-1]);
    }

    return pols.aLast[N-1];
}