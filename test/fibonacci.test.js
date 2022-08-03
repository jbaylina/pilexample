const assert = require("assert");
const path = require("path");
const { FGL, starkSetup, starkGen, starkVerify } = require("pil-stark");
const { newConstantPolsArray, newCommitPolsArray, compile, verifyPil } = require("pilcom");

const smFibonacci = require("../src/fibonacci.js");

describe("test fibonacci sm", async function () {
    let constPols;
    let cmPols;
    let pil;

    this.timeout(10000000);

    it("It should create the pols main", async () => {

        pil = await compile(FGL, path.join(__dirname, "..", "src", "fibonacci.pil"));
        constPols =  newConstantPolsArray(pil);

        await smFibonacci.buildConstants(constPols.Fibonacci);

        cmPols = newCommitPolsArray(pil);

        const result = await smFibonacci.execute(cmPols.Fibonacci, [1,2]);
        console.log("Result: " + result);

        const res = await verifyPil(FGL, pil, cmPols , constPols);

        if (res.length != 0) {
            console.log("Pil does not pass");
            for (let i=0; i<res.length; i++) {
                console.log(res[i]);
            }
            assert(0);
        }

    });

    it("It should generate and verify the stark", async () => {
        const starkStruct = {
            nBits: 10,
            nBitsExt: 14,
            nQueries: 32,
            verificationHashType : "GL",
            steps: [
                {nBits: 14},
                {nBits: 9},
                {nBits: 4}
            ]
        };

        const setup = await starkSetup(constPols, pil, starkStruct);
        const resP = await starkGen(cmPols, constPols, setup.constTree, setup.starkInfo);

        const resV = await starkVerify(resP.proof, resP.publics, setup.constRoot, setup.starkInfo);
        assert(resV==true);
});

});
