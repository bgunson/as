import React from "react";

function About() {
  return (
    <div className="about">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src="/adshare.png"
              alt=""
            />
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light">About</h1>
            <p>
             This local website is designed to allow you to upload and view ads for AdShare. It additionally allows you to delete ads,
             and send a request to others to also delete that ad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;