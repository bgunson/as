# Adshare Syncronization

## Assumptions
- The "ledger" is a log file representing events where a particular peer won a "transaction" or event.
- A transaction happens when some connected peer returns an asset to the proxy which is then forwarded to the client.
- Transactions are noted in the ledger of a form similar to `[TS] [peerid] served [adID]`, on separate lines. This singular event message is broadcasted to all peers who store it in their local ledgers for each successful transaction.
- After each transaction, the proxy increments its logical time by one.

## Assertions
- The ledger is only updated when there are N>0 peers connected since there would be no one to win a transaction.
  - If a proxy crashes but has no peers connected, then there is no loss of either logical time nor ledger.
- If a proxy goes down, peers connect to a backup proxy. Backup proxies may have a logical time less than that of the prior leader proxy and be missing events which have taken place since the last time the new proxy was leader.
  - If peers transferring to a new proxy have logical time greater than the leader proxy's, then that is assumed to be the latest time.
  - If peers transfer to a new proxy have a greater logical time, then they will also have transactions in their local ledger which have taken place (via the older leader proxy) but need to be added to the new leader's ledger.
 - If the original proxy becomes leader again in the future, then the peers will syncronize it with events it may have missed.

### Timestamp/Ledger Sync Flowchart
![timesync (1)](https://user-images.githubusercontent.com/47361247/230995160-8ee426ce-48ce-4eaa-ade8-de9900782666.png)
