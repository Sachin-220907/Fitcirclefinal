import { useState, useEffect } from "react";
import { useAuth } from "../../authentication/context/AuthContext";
import { useSocket } from "../../../app/providers/SocketProvider";
import "./CommunityPage.css";

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Sarah Jenkins",
    handle: "@sarah_fit",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    badge: "Marathon Finisher",
    timeAgo: "2 hours ago",
    content: "Just completed my long run Sunday! 18.5 km in crisp morning weather. Hydrated with electrolytes and finished strong with negative splits. Remember: consistency beats intensity every single time! 🏃‍♀️💨",
    tag: "#MarathonTraining",
    likes: 42,
    isLiked: false,
    comments: [
      { id: 101, user: "Coach Alex", text: "Incredible pacing Sarah! Keep protecting those recovery days." },
      { id: 102, user: "Liam Brooks", text: "Super inspiring! What shoes did you run with?" }
    ]
  },
  {
    id: 2,
    author: "David Chen",
    handle: "@dchen_lifts",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    badge: "100kg Club",
    timeAgo: "5 hours ago",
    content: "New Personal Record today! Finally locked out 180kg (400 lbs) conventional deadlift after 3 months of plateauing. Tweaked my starting hip position and squeezed the glutes through. We move! 🏋️‍♂️💪",
    tag: "#PersonalRecord",
    likes: 68,
    isLiked: true,
    comments: [
      { id: 103, user: "Sachin", text: "Massive lift David! Form looked clean as well." }
    ]
  },
  {
    id: 3,
    author: "Maya Patel",
    handle: "@maya_eats",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    badge: "Nutrition Guru",
    timeAgo: "Yesterday",
    content: "Sunday meal prep locked in for the week: Lemon Garlic Chicken Breast with Roasted Sweet Potatoes and Charred Asparagus. Macro breakdown: 48g Protein, 50g Carbs, 10g Healthy Fats. Fueling the body right! 🥗🥑",
    tag: "#MealPrep",
    likes: 54,
    isLiked: false,
    comments: []
  }
];

const CHALLENGES = [
  { id: "c1", title: "10,000 Daily Steps Streak", participants: "3,840 joined", daysLeft: "12 days left", icon: "👟", joined: true, progress: 75 },
  { id: "c2", title: "30-Day Core & Mobility Sprint", participants: "1,920 joined", daysLeft: "18 days left", icon: "🧘", joined: false, progress: 0 },
  { id: "c3", title: "Gallon-a-Day Hydration Quest", participants: "2,410 joined", daysLeft: "5 days left", icon: "💧", joined: true, progress: 90 }
];

const LEADERBOARD = [
  { rank: 1, name: "Marcus Vance", points: 3420, streak: "28 days", badge: "🥇 Diamond" },
  { rank: 2, name: "Sarah Jenkins", points: 3180, streak: "24 days", badge: "🥈 Platinum" },
  { rank: 3, name: "Sachin (You)", points: 2890, streak: "14 days", badge: "🥉 Gold" },
  { rank: 4, name: "David Chen", points: 2650, streak: "19 days", badge: "⭐ Silver" },
  { rank: 5, name: "Chloe Dupont", points: 2410, streak: "11 days", badge: "⭐ Silver" }
];

export function CommunityPage() {
  const { user } = useAuth();
  const { emit, on } = useSocket();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("#FitnessJourney");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  // Listen for real-time community posts and comments
  useEffect(() => {
    const unsubPost = on("COMMUNITY_POST_CREATED", (newPost) => {
      setPosts((prev) => {
        if (prev.some((p) => p.id === newPost.id)) return prev;
        return [newPost, ...prev];
      });
    });

    const unsubLike = on("COMMUNITY_POST_LIKED", ({ postId, likes }) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes } : p))
      );
    });

    return () => {
      unsubPost();
      unsubLike();
    };
  }, [on]);

  function handleCreatePost(e) {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: user?.displayName || "Sachin",
      handle: `@${user?.username || "sachin"}`,
      avatar: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      badge: "Active Member",
      timeAgo: "Just now",
      content: newPostContent.trim(),
      tag: selectedTag,
      likes: 1,
      isLiked: true,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");

    emit("COMMUNITY_POST_CREATED", newPost);
  }

  function handleToggleLike(postId) {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.isLiked;
          const nextLikes = nextLiked ? post.likes + 1 : post.likes - 1;

          emit("COMMUNITY_POST_LIKED", { postId, likes: nextLikes });

          return {
            ...post,
            isLiked: nextLiked,
            likes: nextLikes
          };
        }
        return post;
      })
    );
  }

  function handleAddComment(postId) {
    if (!commentInput.trim()) return;

    const newComment = {
      id: Date.now(),
      user: user?.displayName || "Sachin",
      text: commentInput.trim()
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    setCommentInput("");
  }

  function handleToggleChallenge(challengeId) {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          return {
            ...c,
            joined: !c.joined,
            progress: !c.joined ? 10 : 0
          };
        }
        return c;
      })
    );
  }

  return (
    <div className="community-page">
      <header className="community-header">
        <div>
          <h1>Community & Feed 👥</h1>
          <p>Share progress, motivate peers, conquer team challenges, and celebrate wins.</p>
        </div>
      </header>

      <div className="community-layout-grid">
        {/* Left Column: Feed & Post Composer */}
        <div className="feed-column">
          {/* Create Post Card */}
          <div className="create-post-card">
            <div className="composer-top">
              <div className="composer-avatar">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "S"}
              </div>
              <textarea
                placeholder="Share your workout win, meal prep, or fitness milestone..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />
            </div>

            <div className="composer-bottom">
              <div className="tag-selector">
                {["#WorkoutDone", "#PersonalRecord", "#MealPrep", "#MarathonTraining", "#Consistency"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-chip ${selectedTag === tag ? "active" : ""}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-submit-post"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
              >
                Post to Feed
              </button>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="posts-stream">
            {posts.map((post) => (
              <article key={post.id} className="feed-post-card">
                <div className="post-header">
                  <div className="post-author-area">
                    <img src={post.avatar} alt={post.author} className="post-author-avatar" />
                    <div>
                      <div className="author-name-row">
                        <h4>{post.author}</h4>
                        <span className="author-badge">{post.badge}</span>
                      </div>
                      <span className="post-handle-time">{post.handle} • {post.timeAgo}</span>
                    </div>
                  </div>

                  <span className="post-topic-tag">{post.tag}</span>
                </div>

                <div className="post-body">
                  <p>{post.content}</p>
                </div>

                <div className="post-actions-bar">
                  <button
                    className={`post-action-btn ${post.isLiked ? "liked" : ""}`}
                    onClick={() => handleToggleLike(post.id)}
                  >
                    <span>{post.isLiked ? "❤️" : "🤍"}</span>
                    <strong>{post.likes} Likes</strong>
                  </button>

                  <button
                    className="post-action-btn"
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  >
                    <span>💬</span>
                    <span>{post.comments.length} Comments</span>
                  </button>

                  <button className="post-action-btn">
                    <span>↗️ Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="post-comments-wrapper">
                  {post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((c) => (
                        <div key={c.id} className="comment-bubble">
                          <strong>{c.user}</strong>
                          <p>{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeCommentPostId === post.id && (
                    <div className="add-comment-row">
                      <input
                        type="text"
                        placeholder="Write a supportive comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                      />
                      <button
                        className="btn-send-comment"
                        onClick={() => handleAddComment(post.id)}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Challenges & Leaderboard */}
        <aside className="community-sidebar">
          {/* Active Challenges Card */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3>Community Challenges</h3>
              <span className="sidebar-icon">🏆</span>
            </div>

            <div className="challenges-list">
              {challenges.map((c) => (
                <div key={c.id} className="challenge-item">
                  <div className="challenge-top">
                    <span className="challenge-icon">{c.icon}</span>
                    <div className="challenge-info">
                      <h4>{c.title}</h4>
                      <small>{c.participants} • {c.daysLeft}</small>
                    </div>
                  </div>

                  {c.joined && (
                    <div className="challenge-progress-box">
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${c.progress}%`, background: "#2563eb" }}
                        ></div>
                      </div>
                      <span className="progress-label">{c.progress}% Completed</span>
                    </div>
                  )}

                  <button
                    className={`btn-challenge ${c.joined ? "joined" : "join"}`}
                    onClick={() => handleToggleChallenge(c.id)}
                  >
                    {c.joined ? "✓ Participating" : "+ Join Challenge"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Community Leaderboard Card */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3>Weekly Leaderboard</h3>
              <span className="sidebar-icon">🔥</span>
            </div>

            <div className="leaderboard-list">
              {LEADERBOARD.map((item) => (
                <div key={item.rank} className={`leaderboard-row ${item.rank === 3 ? "current-user" : ""}`}>
                  <span className="rank-num">#{item.rank}</span>
                  <div className="leader-info">
                    <h4>{item.name}</h4>
                    <small>{item.badge} • Streak: {item.streak}</small>
                  </div>
                  <strong className="leader-points">{item.points} pts</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CommunityPage;
