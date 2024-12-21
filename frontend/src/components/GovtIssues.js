import React, { useState } from "react";

function GovtIssues() {
  // Initial states for upvotes, downvotes, and comments
  const [upvotes, setUpvotes] = useState([0, 0, 0]);
  const [downvotes, setDownvotes] = useState([0, 0, 0]);
  const [comments, setComments] = useState([[], [], []]); // Array of arrays for comments
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [currentIssueIndex, setCurrentIssueIndex] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Handlers for upvotes and downvotes
  const handleUpvote = (index) => {
    const newUpvotes = [...upvotes];
    newUpvotes[index] += 1;
    setUpvotes(newUpvotes);
  };

  const handleDownvote = (index) => {
    const newDownvotes = [...downvotes];
    newDownvotes[index] += 1;
    setDownvotes(newDownvotes);
  };

  // Handlers for comments
  const handleOpenCommentBox = (index) => {
    setCurrentIssueIndex(index);
    setIsCommentBoxOpen(true);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComments = [...comments];
    newComments[currentIssueIndex].push(commentText);
    setComments(newComments);
    setCommentText(""); // Reset comment box
    setIsCommentBoxOpen(false); // Close the pop-up
  };

  // Random image URLs
  const images = [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1329361/pexels-photo-1329361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  return (
    <div className="govt-issues">
      <style>
        {`
      .comment-box-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .comment-box {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        width: 400px;
        max-width: 90%;
      }
    `}
      </style>
      <h1 className="mt-4">Government Issues</h1>
      <div className="actions">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search issues..."
          onClick={() => alert("Search functionality coming soon!")}
        />
        <button className="btn btn-outline-secondary">Filter / Sort</button>
      </div>
      <div className="issue-list">
        {[1, 2, 3].map((issue, index) => (
          <div key={index} className="issue-card card mb-3">
            <div className="card-body d-flex">
              <img
                src={images[index % images.length]}
                alt={`Issue ${issue}`}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
                className="mr-3"
              />
              <div className="content ml-3">
                <h4>Issue Title {issue}</h4>
                <p>
                  Issue description: Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Vestibulum ante ipsum primis...
                </p>
                <div className="actions d-flex justify-content-between">
                  <button
                    className="btn btn-success"
                    onClick={() => handleUpvote(index)}
                  >
                    Upvote Count: {upvotes[index]}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDownvote(index)}
                  >
                    Downvote Count: {downvotes[index]}
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => handleOpenCommentBox(index)}
                  >
                    Comments [{comments[index].length}]
                  </button>
                  <button className="btn btn-warning">Location</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Pop-up Box */}
      {isCommentBoxOpen && (
        <div className="comment-box-overlay">
          <div className="comment-box">
            <h4>Add Comment</h4>
            <textarea
              className="form-control mb-2"
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment..."
            ></textarea>
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary" onClick={handleAddComment}>
                Submit
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsCommentBoxOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GovtIssues;
