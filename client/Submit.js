// The source account is the account we will be sending from.
var sourceSecretKey = 'SCC2GLOCQLDIJPTQB6O2K2GVUXW52IWLSCKE76EMU5ILMED3CYQFHUFC';
var receiverPublicKey = 'GAIRISXKPLOWZBMFRPU5XRGUUX3VMA3ZEWKBM5MSNRU3CHV6P4PYZ74D';

// This is where the fun begins.

// Calculate the source account's public key
var sourceKeypair = StellarSdk.Keypair.fromSeed(sourceSecretKey);
var sourcePublicKey = sourceKeypair.address()

// Configure StellarSdk to talk to the horizon instance hosted by Stellar.org
// To use the public (live) network, set the hostname to 'horizon.stellar.org'
var server = new StellarSdk.Server({
  hostname: 'horizon-testnet.stellar.org',
  secure: true,
  port: 443
});

// Uncomment the following line to build transactions for the public network. Be
// sure to also change the horizon hostname.
// StellarSdk.Network.usePublicNetwork();

// Transactions need a valid sequence number inside the transaction to prevent
// the transaction from being included in the ledger twice.
// We can fetch the current sequence number for the source account by getting
// info from Horizon.
server.loadAccount(sourcePublicKey)
  .then(function(account) {
    var transaction = new StellarSdk.TransactionBuilder(account)
      // Add a payment operation to the transaction
      .addOperation(StellarSdk.Operation.payment({
        destination: receiverPublicKey,
        // The term native asset refers to lumens
        asset: StellarSdk.Asset.native(),
        // Specify 350.1234567 lumens. Lumens are divisible to seven digits past
        // the decimal. They are represented in JS Stellar SDK in string format
        // to avoid errors from the use of the JavaScript Number data structure.
        amount: '350.1234567',
      }))
      // .addMemo(StellarSdk.Memo.text('Hello world!'))
      .build()

    // Sign this transaction with the secret key
    transaction.sign(sourceKeypair)

    // Let's see the XDR (encoded in base64) of the transaction we just built
    console.log(transaction.toEnvelope().toXDR('base64'))

    // Submit the transaction to the Horizon server. The Horizon server will then
    // submit the transaction into the network for us.
    server.submitTransaction(transaction)
      .then(function(transactionResult) {
        console.log('Success!')
        console.log(transactionResult);
      })
      .catch(function (err){
        console.log('error')
        console.log(err);
      });
  })