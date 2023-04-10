class ProxyReplica {
    /**
     * Circular linked list for defined server URLs 
     */
    constructor() {
        this._index = 0; 
        this._backups = [
            "https://amazing-limiter-378022.uw.r.appspot.com",
           // "http://aspxy1.bhodrolok.xyz",
            //"http://aspxy2.bhodrolok.xyz",
            //"http://aspxy3.bhodrolok.xyz",
            //"http://aspxy4.bhodrolok.xyz",
            //"http://aspxy5.bhodrolok.xyz",
            "https://amazing-limiter-378022.uw.r.appspot.com"
        ]
    }

    get current() {
        return this._backups[this._index];
    }

    next() {
        let current = this._backups[this._index];
        this._index = ++this._index % this._backups.length;
        return current;
    }
}

const proxy = new ProxyReplica();

document.getElementById('listOfPeers').innerText = `${proxy.current}/peers`




document.querySelectorAll('.ad').forEach((ad, i) => {
    ad.setAttribute('src', `${proxy.current}/ad?i=${i}`);
    ad.addEventListener('error', () => {
        if (i === 0) {
            // only advance to next replica once if this is the first ad
            proxy.next();
        }
        ad.setAttribute('src', `${proxy.current}/ad?i=${i}`);
    });
});

function switchAd() {
    document.getElementById('switcher').src = "script.js";
}



