import React, { Component } from "react";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adList: [],
    };
  }

  componentDidMount() {
    this.refreshAdList();
  }

  //gets a list of all the ads so it can display them on the site
  refreshAdList = () => {
    fetch("/ads")
      .then((response) => response.json())
      .then((data) => this.setState({ adList: data }));

  };


//viewAd is used to open in a new tab the ad but in full resolution and size
  viewAd = (item) => {
    window.open('ad/'.concat(item), '_blank', 'noreferrer');


  };

  //sends out a message suggesting this ad be deleted to the proxy
  deleteAd = (item) => {
    fetch(`/ad/${item}`, {
      method: "DELETE",
    });
    window.location.reload();

  }

  //function for uploading an image to your own peer client
  uploadAd = (item) => {
    item.preventDefault();
    let input = document.querySelector('#ad_picker')
    const formData = new FormData();
  

    const adFile = input.files[0];
    console.log(adFile.name);

      
    formData.append('ad', adFile);
    
    
    fetch("/ad", {
      method: "POST",
      body: formData,
    
    })

    window.location.reload();
  };


  renderItems = () => {
    return this.state.adList.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>
        <img src= {`/ad/${item}`} alt="logo" style={{maxWidth:"100px",width:"auto",maxHeight:"100px",height:"auto"}}/>
        </span>
        <span
          className={`todo-title mr-2`}
          title={item.description}
        > 

          {item}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.viewAd(item)}
          >
            View
          </button>
          
          <button
            className="btn btn-danger"
            onClick={() => this.deleteAd(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {

    return (

      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4"></h1>
        <div className="row">
          <div className="col-xl-10 mx-auto p-0">
            <div className="card p-4 mx-auto w-100">
              
              <form action="/ad" method="post" encType="multipart/form-data" >
                <div className="mb-4">

                  <input type="file"
                    id="ad_picker" name="ad"
                    accept='image/*'
                  />

                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={this.uploadAd}
                  
                >
                  Upload Ad
                </button>
              </form>
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Home;