import React, { Component } from "react";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adList: [],
    };
  }

  componentDidMount(){
    this.refreshAdList();
  }

  refreshAdList = () => {
    fetch("http://localhost:3669/ads")
      .then((response) => response.json())
      .then((data) => this.setState( { adList : data} ));
     
  };

  

  viewAd = (item) => {
    window.open('http://localhost:3669/ad/'.concat(item), '_blank', 'noreferrer');
    

  };

  uploadAd = (item) => {
    const adFile = item.files[0];
    console.log(adFile.name);

    const formData = new FormData();
    formData.append('ad', adFile);

    fetch("http://localhost:3669/ad", {
      method: "POST",
      body: formData,
    })
    

  };


  renderItems = () => {

    
    
    return this.state.adList.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
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
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                
                <input type="file"
                  id="ad_picker" name="ad_picker"
                  accept = 'image/*'
                />
                
              </div>
              <button
                  className="btn btn-primary"
                  onClick={() => this.uploadAd(document.getElementById('ad_picker'))}
                >
                  Upload Ad
                </button>
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