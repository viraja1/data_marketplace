# Data Marketplace 

We are moving towards an economy where data is the king. Users should have control of their own data. They should have the right to decide with whom they want to share their data. Data marketplace will allow users to sell their data and earn a living. They could also sell any other digital product. This will also help the companies or users who want to purchase the data. I built a prototype of Data Marketplace using Algorand JS SDK. This prototype uses multisignature account transactions.


## Use Case Scenario
The Data Marketplace consists of 3 participants:

* Buyer
* Seller
* Escrow (Platform)

### Flow
* Buyer decides to buy the data from Seller.
* A multisig account is created between buyer, seller and escrow.
* A multisig account transaction is created for the purchase with the metadata included in the note.
* Buyer signs the multisig transaction.
* Seller signs the multisig transaction and shares the data with the escrow.
* Buyer sends the amount to multisig account for the purchase.
* Escrow signs the transaction once it verifies that the buyer has transferred the amount to the multisig address and then shares the data with the buyer.
* Seller gets the payment.

## Getting Started

1. Clone Repo

    ```
    $ git clone https://github.com/viraja1/data_marketplace.git
    ```

2. Change directory

    ```
    $ cd data_marketplace
    ```

3. Install packages

    ```
    npm install
    ```
    
4. Update constants

   Change the value of firstRound in app/routes.js.
   The value of firstRound should be the latest block shown in https://algoexplorer.io/

5. Start the server

    ```
    npm start
    ```
    
6. Note down the buyer address in the console

    ```
    buyer address: LMTVEYXHUGAH5OOX4PM623M75JN6BCQP62SUAVJXUOBRJFFEEDGXP32UDA
    ```
    
7. Add amount to the buyer account using Algorand faucet.

    Fill the buyer address in the below link and click on "Dispense".
    ```
    https://bank.testnet.algorand.network/
    ```

8.  Wait till the previous transaction is successful. 

    You can verify it from the Algoexplorer using the transaction hash returned by the faucet.  
    ```
    https://algoexplorer.io/tx/CCZBN7ZEIA7R6KXR6P4K4DYUPI4AFPU4L4COMX4F5RZRDPVBWUZA
    ```
    
9. Simulate the multisig transaction described in the `Flow` section using REST API.

    ```
    curl -XPOST localhost:9000/transact -d '{"data": "climate"}' -H "Content-Type: application/json"
    ```
    
10. Note down the transaction hash in the console.
    ```
    { txId: 'KBRXQ6KPZEZAYRJYY7QF25H6E4Y5L5LG3J5BOMNG7LPSKN47P7EQ' }
    ```
   
11. Verify multisig transaction details from Algoexplorer using transaction hash
    ```
    https://algoexplorer.io/tx/KBRXQ6KPZEZAYRJYY7QF25H6E4Y5L5LG3J5BOMNG7LPSKN47P7EQ
    ```

12. View transactions involving buyer using Algoexplorer
    ```
    https://algoexplorer.io/address/LMTVEYXHUGAH5OOX4PM623M75JN6BCQP62SUAVJXUOBRJFFEEDGXP32UDA
    ```
    
13. View transactions involving multisig account address
    ```
    https://algoexplorer.io/address/LQLYKRFSTGS7KC4DUULOMGW5IT55G3UVXQ4MGQ4ONO6YXKNWCWNMZ43SXE
    ```
     
14. View transactions involving seller account address
    ```
    https://algoexplorer.io/address/AHTTIBSUY3Q44REPTMHREZ53ES2GKKGOR4F4YKXCYOH3DHYJR34WSL2SMY
    ```