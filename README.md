<h1 align="center">
    <a name="readme-top"></a>
    <img src="./docs/arch.png" style="background-color:white" width="69px">
    <b> AdShare</b>
</h1>

<h3 align="center"> CPSC 559 - Introduction to Distributed Systems </h3>
<h4 align="center"> <i>Final Project</i> - <a href="https://www.ucalgary.ca/">University of Calgary</a> (Winter 2023) </h4>


<h3> Built using </h3>

[![node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![react](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![socket.io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)](https://socket.io/)
[![google cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

<h2> Getting Started :tada: </h2>

<h3> Using Docker :whale: (recommended) </h3>

- To run the <b>Peer</b> server as a Docker container:
    - Ensure [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) is installed locally.
    - Clone the project [repository](https://github.com/bgunson/as.git) and navigate to the directory via terminal.
    - Run `docker-compose up` in the root directory.
    - Terminate the peers at any time by pressing Ctrl+C. 

<h3> Using Node and npm </h3>

- To run the <b> Peer</b> server on the command line:
    - Install Node.js and npm on your system.
    - Clone the project [repository](https://github.com/bgunson/as.git) and navigate to the directory via terminal.
    - Run `npm install` to install the project dependencies.
    - Run `npm start` to start the Peer server.
        - You can run any number of these in multiple terminals.

Once the Peer is running, you can access the GUI by visiting [http://localhost:3000](http://localhost:3000). You can <a href="#readme-customenv">change</a> the port number to be something other than 3000 too!

Then finally, open the client by going cloning the [repo](https://github.com/bgunson/as) locally and opening `docs/index.html` in your preferred web browser. 

You can also visit [https://bengunson.me/as-example-client](https://bengunson.me/as-example-client)

You should then see an iframed ad which was given by the to the client from the peer server(s) via the proxy.

<h2> Inspiration :milky_way: </h2>

Web advertising is everywhere these days, from banner ads to pop-ups and even videos. But did you know that the industry is dominated by a few big players, like Google, Amazon and Ezoic, who control all the ad hosting from their massive data centers? For small businesses, it's an uphill battle to compete with these giants and turn a meaningful profit. Introducing AdShare!

Our platform is a solution for the challenges posed by the current centralized approach to web advertising. With the rise of Web3.0 and the push towards decentralization, we believe that our decentralized advertising platform aligns with the future of the web. Anyone can use some spare computing power to host ads and earn money, making it easier and more affordable for smaller players to get their message out there. Plus, by cutting out the middleman, we're reducing the overhead costs for everyone involved. It's a win-win for advertisers and users alike!
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2> How does it work :question: </h2>

AdShare works by allowing users to download a client, called the <b>Peer</b>, that turns their computer into a peer server. Once this peer joins a <b>Swarm</b> network of other Peers, they can host and exchange ads with each other. We use Docker for improved scalability and portability, so our application can work seamlessly in different environments.

Users can upload their own ads and choose how much they want to pay to ensure their ad gets replicated and seen by more people. The more replication, the more money they can earn. Users running the peer server are paid according to how many ads they serve to clients, creating a supply and demand system in the marketplace.

A <b>Proxy</b> server is used to "broker" connections between clients and peer servers. If no peers are available, the proxy server will serve an advertisement for our service.

You can read our Proof of Concept [here](./docs/README.md#adshare-proof-of-concept) to get a better idea of what's going on under the hood!
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2> Implemented Features for the Distributed System :high_brightness: </h2>

<details>
    <summary> 
        <b>Replication</b> 
    </summary>
    Lorem Ipsum
</details>

<details>
    <summary> 
        <b>Scalability</b> 
    </summary>
    Lorem Ipsum
</details>

<details>
    <summary> 
        <b>Fault Tolerance</b> 
    </summary>
    Lorem Ipsum
</details>

<details>
    <summary> 
        <b>Consistency</b> 
    </summary>
    Lorem Ipsum
</details>

<details>
    <summary> 
        <b>Synchronization</b> 
    </summary>
    Lorem Ipsum
</details>

<details>
    <summary> 
        <b>GUI</b> 
    </summary>
    Lorem Ipsum
</details>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2 name="readme-customenv"> Setting up Environment Variables </h2>

A `.env` or `.env-cmdrc` file will contain the necessary configuration for the application to run. 

Following security best practices, it is recommended you create either of those files and place them in the `peer` folder (and the `proxy` folder as well if you want to run the <b> Proxy</b> locally!).

The general format of a `.env` file is:
```
VARIABLE=YOUR_VALUE 
```
You can read more about the environment variables [here](./docs/README.md#environment-variables).

<h2> What's next for AdShare :dart: </h2>

We would love some constructive feedback. This was a great learning experience for us all and we would love to see how we could improve the project. <br><br>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h2>Contributors :scroll: </h2>

* Bennett Gunson
* Kirill Larshin
* Steven Susanto
* Taylor Jones
* Ranadip Chatterjee 
<p align="right">(<a href="#readme-top">back to top</a>)</p>
