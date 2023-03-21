import React, { Component } from "react";

const adItems = [
  {
    id: 1,
    title: "Go to Market",
    description: "Buy ingredients to prepare dinner",
  },
  {
    id: 2,
    title: "Study",
    description: "Read Algebra and History textbook for the upcoming test",
  },
  {
    id: 3,
    title: "Sammy's books",
    description: "Go to library to return Sammy's books",
  },
  {
    id: 4,
    title: "Article",
    description: "Write article on how to use Django with React",
  },
];

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
                <button
                  className="btn btn-primary"
                >
                  Upload Ad
                </button>
              </div>
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