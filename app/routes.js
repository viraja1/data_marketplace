// require express
var express = require('express');
var path    = require('path');
const algosdk = require("algosdk");

// create our router object
var router = express.Router();

// export our router
module.exports = router;

const config= {
    token : "b967f37046bd85dae75ff1d50715f14f8928e8adcc3f3cc7869edeae9f98e578",
    server : "http://buidlboston.algorand.network",
    port : 4181
};
const algoClient = new algosdk.Algod(config.token, config.server, config.port);


createAccount = function() {
    let data = algosdk.generateAccount();
    data["mnemonic"] = algosdk.secretKeyToMnemonic(data.sk);
    return data;
};
buyer_account = createAccount()
seller_account = createAccount()
escrow_account = createAccount()
console.log("buyer address: " + buyer_account.addr);


(async () => {
    let tx = (await algoClient.accountInformation(buyer_account.addr));
    console.log(tx);
 })().catch(e => {
    console.log(e.error);
 });

 function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const simulateMultisigTransaction = async function(data, buyer, seller,
                                                   escrow){
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
    multisigAddress = algosdk.multisigAddress(params);
    console.log("multi sig address: " + multisigAddress);

    // multisig account transaction for the purchase
    let txn = {
        "to": seller.addr,
        "fee": 10,
        "amount": 100000,
        "firstRound": 1180208,
        "lastRound": 1181208,
        "note": algosdk.encodeObj(data),
    };

    // buyer signs the multisig transaction
    let rawSignedTxn = algosdk.signMultisigTransaction(txn, params,
      buyer.sk).blob;

    // seller signs the transaction and shares the digital product with escrow
    let appendedMsigTxn = algosdk.appendSignMultisigTransaction(rawSignedTxn,
      params, seller.sk).blob;

    // buyer sends the amount to multisig account for purchase
    let payment = {
          "to": multisigAddress,
          "fee": 10,
          "amount": 202000,
          "firstRound": 1180208,
          "lastRound": 1181208,
          "note": algosdk.encodeObj(data),
    };
    var paymentTxn = algosdk.signTransaction(payment, buyer.sk);
    //submit the transaction

    try{
      let ptx = await algoClient.sendRawTransaction(paymentTxn.blob);
    }
    catch(err) {
     console.log("payment error");
     console.log(err.error);
    }

    await sleep(10000);

    // escrow signs the transaction once it verifies that the buyer has
    // transferred the amount to the multisig address and then shares the
    // digital good with the buyer
    let finalMsigTxn = algosdk.appendSignMultisigTransaction(appendedMsigTxn,
      params, escrow.sk).blob;

    //submit the multi sig transaction
    try{
     let tx = (await algoClient.sendRawTransaction(finalMsigTxn));
     console.log(tx);
    }
    catch(err) {
     console.log("multisig error");
     console.log(err.error);
    }
}

router.post('/transact', function(req, res) {
   var data = req.body;
   console.log(req.body);
   simulateMultisigTransaction(data, buyer_account, seller_account,
                                     escrow_account)
   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify({ submitted: true }));

});
