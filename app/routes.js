// require express
const express = require('express');
const algosdk = require("algosdk");

// create our router object
const router = express.Router();

// export our router
module.exports = router;

// Algorand config
const config = {
    token : "b967f37046bd85dae75ff1d50715f14f8928e8adcc3f3cc7869edeae9f98e578",
    server : "http://buidlboston.algorand.network",
    port : 4181
};
const algoClient = new algosdk.Algod(config.token, config.server, config.port);
const firstRound = 1181867;
const lastRound = firstRound + 1000;

createAccount = function() {
    let data = algosdk.generateAccount();
    data["mnemonic"] = algosdk.secretKeyToMnemonic(data.sk);
    return data;
};

let buyer_account = createAccount();
let seller_account = createAccount();
let escrow_account = createAccount();
console.log("buyer address: " + buyer_account.addr);
console.log("seller address: " + seller_account.addr);
console.log("escrow address: " + escrow_account.addr);


(async () => {
    let tx = (await algoClient.accountInformation(buyer_account.addr));
    console.log(tx);
 })().catch(e => {
    console.log(e.error);
 });

 function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const simulateMultisigTransaction = async function(data, buyer, seller, escrow){
    const params = {
        version: 1,
        threshold: 3,
        addrs: [
            buyer.addr,
            seller.addr,
            escrow.addr
        ],
    };

    // create multisig account between buyer, seller and escrow
    let multisigAddress = algosdk.multisigAddress(params);
    console.log("multisig address: " + multisigAddress);

    // multisig account transaction for the purchase
    let txn = {
        "to": seller.addr,
        "fee": 10,
        "amount": 100000,
        "firstRound": firstRound,
        "lastRound": lastRound,
        "note": algosdk.encodeObj(data),
    };

    // buyer signs the multisig transaction
    let rawSignedTxn = algosdk.signMultisigTransaction(txn, params, buyer.sk).blob;

    // seller signs the multisig transaction and shares the data with the escrow
    let appendedMsigTxn = algosdk.appendSignMultisigTransaction(rawSignedTxn, params, seller.sk).blob;

    // buyer sends the amount to the multisig account for purchase
    let payment = {
          "to": multisigAddress,
          "fee": 10,
          "amount": 302000,
          "firstRound": firstRound,
          "lastRound": lastRound,
          "note": algosdk.encodeObj(data),
    };
    let paymentTxn = algosdk.signTransaction(payment, buyer.sk).blob;

    //submit the payment transaction
    try{
      let ptx = await algoClient.sendRawTransaction(paymentTxn);
    }
    catch(err) {
     console.log("payment transaction error");
     console.log(err.error);
    }

    await sleep(10000);

    // escrow signs the transaction once it verifies that the buyer has transferred the amount to the multisig address
    // and then shares the data with the buyer
    let finalMsigTxn = algosdk.appendSignMultisigTransaction(appendedMsigTxn, params, escrow.sk).blob;

    //submit the multi sig transaction
    try{
     let tx = (await algoClient.sendRawTransaction(finalMsigTxn));
     console.log(tx);
    }
    catch(err) {
     console.log("multisig transaction error");
     console.log(err.error);
    }
};

router.post('/transact', function(req, res) {
   let data = req.body;
   console.log(req.body);
   simulateMultisigTransaction(data, buyer_account, seller_account, escrow_account);
   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify({ submitted: true }));

});
