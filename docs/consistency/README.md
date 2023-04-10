# Adshare Consistency

### Gossip Animations
![as-gossip-deletions](https://user-images.githubusercontent.com/47361247/230993933-d469ee93-c31b-4724-8070-c9cece7bf957.gif)
![as-gossip-uploads](https://user-images.githubusercontent.com/47361247/230993970-25497087-63e7-4e78-a21c-66a630bba3fa.gif)
### Deletion Flowchart
![deletion-flow_1](https://user-images.githubusercontent.com/47361247/230994060-c8a496f7-0518-44af-b369-e36ea670ef8c.png)
### Upload (w/ EC) Flowchart
![upload-flow-w-ec](https://user-images.githubusercontent.com/47361247/230994078-65fc7da9-21b0-49b0-91d0-371e11ea46f9.png)
> This diagram shows how eventual consistency of assets is acheived across all peers when clients interact with the GET /ad endpoint. When a client hails an advertisment, the peers funnel all responses through the same 'give-ad' mechanism which begins a new gossip interaction as seen in the gif above. Note that the peers who respon with an ad may or may not win the transaction (ad served to client) but will result in that ad potentially being propogated to other peers.
