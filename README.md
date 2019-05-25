# Data Marketplace 

We are moving towards an economy where data is the king. Users should have control of their own data. They should have the right to decide with whom they want to share their data. Data marketplace will allow users to sell their data and earn a living. They could also sell any other digital product. This will also help the companies or users who want to purchase the data. I built a prototype of Data Marketplace using Algorand JS SDK. This prototype uses multisignature account transactions.


## Use Case Scenario
The Data Marketplace consists of 3 participants:

* Buyer
* Seller
* Escrow (Platform)

### Flow
* Buyer decides to buy data from Seller.
* A multisig account is created between buyer, seller and escrow.
* A multisig account transaction is created for the purchase with the metadata included in the note.
* Buyer signs the multisig transaction.
* Seller signs the multisig transaction and shares the data with escrow.
* Buyer sends the amount to multisig account for the purchase.
* Escrow signs the transaction once it verifies that the buyer has transferred the amount to the multisig address and then shares the data with the buyer.
* Seller gets the payment