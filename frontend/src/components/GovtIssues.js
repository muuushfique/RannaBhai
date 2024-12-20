import React from 'react';

function GovtIssues() {
  return (
    <div className="govt-issues">
      <h1 className="mt-4">Current Issues</h1>
      <div className="actions">
        <button className="btn btn-outline-primary">Search Box</button>
        <button className="btn btn-outline-secondary">Filter / Sort</button>
      </div>
      <div className="issue-list">
        {[1, 2, 3].map((issue, index) => (
          <div key={index} className="issue-card card mb-3">
            <div className="card-body d-flex">
              <div className="image-placeholder" style={{ width: "150px", height: "150px", backgroundColor: "#ccc" }}></div>
              <div className="content ml-3">
                <h4>Issue Title {issue}</h4>
                <p>Issue description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis...</p>
                <div className="actions d-flex justify-content-between">
                  <button className="btn btn-success">Upvote Count</button>
                  <button className="btn btn-danger">Downvote Count</button>
                  <button className="btn btn-info">Comment Count</button>
                  <button className="btn btn-warning">Location</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GovtIssues;
