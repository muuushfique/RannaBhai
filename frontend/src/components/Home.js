import React, { useState } from 'react';

function Home() {
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "School Infrastructure Issues",
      description: "Many schools in rural Bangladesh lack proper infrastructure.",
      upvotes: 50,
      downvotes: 10,
      comments: 3,
      location: "Dhaka",
      image: "https://www.unicef.org/bangladesh/sites/unicef.org.bangladesh/files/styles/hero_desktop/public/UN0743047.jpg.webp",
    },
  ]);

  const [showCommentBox, setShowCommentBox] = useState(false);

  const toggleVote = (issueId, type) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              [type]: issue[type] + (issue[type + "Clicked"] ? -1 : 1),
              [type + "Clicked"]: !issue[type + "Clicked"],
            }
          : issue
      )
    );
  };

  const handleCommentSubmit = () => {
    const updatedIssues = [...issues];
    updatedIssues[0].comments += 1; // Update the appropriate issue's comment count
    setIssues(updatedIssues);
    setShowCommentBox(false);
  };

  return (
    <div className="current-issues">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mt-4">Current Issues</h1>
        <div className="actions d-flex align-items-center">
          <input
            type="text"
            placeholder="Search issues..."
            className="form-control mr-2"
            style={{ width: "200px" }}
          />
          <select className="form-control" style={{ width: "150px" }}>
            <option value="most-upvoted">Most Upvoted</option>
            <option value="least-upvoted">Least Upvoted</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <div className="issue-list">
        {issues.map((issue) => (
          <div key={issue.id} className="issue-card card mb-3">
            <div className="card-body d-flex">
              <div
                className="image-placeholder"
                style={{
                  width: "150px",
                  height: "150px",
                  backgroundColor: "#ccc",
                  backgroundImage: `url(${issue.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div className="content ml-3">
                <h4>{issue.title}</h4>
                <p>{issue.description}</p>
                <div
                  className="actions d-flex justify-content-start align-items-center mt-4"
                  style={{ gap: "8px", flexWrap: "wrap" }}
                >
                  <button
                    className="btn btn-success"
                    style={{ marginRight: "4px" }}
                    onClick={() => toggleVote(issue.id, "upvotes")}
                  >
                    Upvote {issue.upvotes}
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: "4px" }}
                    onClick={() => toggleVote(issue.id, "downvotes")}
                  >
                    Downvote {issue.downvotes}
                  </button>
                  <button
                    className="btn btn-light"
                    style={{
                      border: "1px solid #ddd",
                      color: "#000",
                      marginRight: "8px",
                    }}
                    onClick={() => setShowCommentBox(!showCommentBox)}
                  >
                    Comments {issue.comments}
                  </button>
                  <span style={{ fontWeight: "bold" }}>Location: {issue.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showCommentBox && (
        <div className="comment-box mt-4">
          <textarea
            placeholder="Write your comment here..."
            className="form-control mb-3"
          ></textarea>
          <button className="btn btn-primary" onClick={handleCommentSubmit}>
            Submit Comment
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;