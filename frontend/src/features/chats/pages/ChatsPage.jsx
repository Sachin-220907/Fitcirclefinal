import { useState } from "react";
import "./ChatsPage.css";

const CONVERSATIONS = [
  {
    id: "c1",
    name: "Coach Alex",
    role: "Head Fitness Trainer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    status: "online",
    unread: 2,
    messages: [
      { id: 1, sender: "them", text: "Hey Alex! Reviewed your squat footage from yesterday. Stance width was spot on.", time: "10:15 AM" },
      { id: 2, sender: "them", text: "Remember to brace hard 360° into your lifting belt before initiating the descent.", time: "10:16 AM" },
      { id: 3, sender: "me", text: "Got it coach! Felt much stronger on the 135kg set with that cue.", time: "10:22 AM" },
      { id: 4, sender: "them", text: "Awesome. Let's aim for 4 reps at 140kg on Thursday's heavy lower session!", time: "10:24 AM" }
    ]
  },
  {
    id: "c2",
    name: "Sarah Jenkins",
    role: "Marathon Partner",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    status: "online",
    unread: 0,
    messages: [
      { id: 1, sender: "them", text: "Are you running the 10K riverside trail this Saturday morning?", time: "Yesterday" },
      { id: 2, sender: "me", text: "Yes! Planning to start around 7:00 AM before the heat kicks in.", time: "Yesterday" },
      { id: 3, sender: "them", text: "Perfect, I'll meet you near the north trail entrance with electrolytes!", time: "Yesterday" }
    ]
  },
  {
    id: "c3",
    name: "Dr. Maya Patel",
    role: "Sports Nutritionist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    status: "offline",
    unread: 0,
    messages: [
      { id: 1, sender: "them", text: "Your hydration levels are improving nicely. Keep targeting the 3.0L threshold on high volume training days.", time: "Nov 15" }
    ]
  },
  {
    id: "c4",
    name: "NYC Run & Fitness Club",
    role: "Group (24 members)",
    avatar: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80",
    status: "online",
    unread: 5,
    messages: [
      { id: 1, sender: "them", text: "Marcus: Track workout starts at 6:30 PM tomorrow at East River Track!", time: "Nov 16" },
      { id: 2, sender: "them", text: "Chloe: 400m repeats on deck 🏃‍♂️💨", time: "Nov 16" }
    ]
  }
];

export function ChatsPage() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState("c1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  function handleSendMessage(e) {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    setMessageText("");

    // Simulate quick coach reply
    setTimeout(() => {
      const replyMsg = {
        id: Date.now() + 1,
        sender: "them",
        text: `Received! That sounds like a solid plan. Keep up the dedication! 💪`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        })
      );
    }, 1200);
  }

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chats-page">
      <div className="chats-shell">
        {/* Left Side: Conversations Roster */}
        <div className="chats-sidebar">
          <div className="chats-sidebar-header">
            <h2>Messages & Buddies 💬</h2>
            <div className="chat-search-wrap">
              <input
                type="text"
                placeholder="Search trainers & friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="conversations-list">
            {filteredConversations.map((c) => {
              const lastMsg = c.messages[c.messages.length - 1];
              const isActive = c.id === activeChatId;

              return (
                <div
                  key={c.id}
                  className={`convo-row ${isActive ? "active" : ""}`}
                  onClick={() => setActiveChatId(c.id)}
                >
                  <div className="convo-avatar-wrapper">
                    <img src={c.avatar} alt={c.name} className="convo-avatar" />
                    <span className={`status-indicator ${c.status}`}></span>
                  </div>

                  <div className="convo-text-meta">
                    <div className="convo-top-line">
                      <h4>{c.name}</h4>
                      <small>{lastMsg ? lastMsg.time : ""}</small>
                    </div>
                    <p className="convo-last-msg">
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>
                  </div>

                  {c.unread > 0 && (
                    <span className="unread-counter">{c.unread}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Dialogue */}
        <div className="chats-main-pane">
          {/* Active Chat Header */}
          <div className="active-chat-header">
            <div className="active-user-info">
              <img src={activeChat.avatar} alt={activeChat.name} className="active-avatar" />
              <div>
                <h3>{activeChat.name}</h3>
                <span className="active-role-status">
                  {activeChat.role} • <strong className={activeChat.status}>{activeChat.status}</strong>
                </span>
              </div>
            </div>

            <div className="active-chat-tools">
              <button className="chat-tool-btn" title="Call">📞</button>
              <button className="chat-tool-btn" title="Video">📹</button>
              <button className="chat-tool-btn" title="Info">ℹ️</button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-thread-stream">
            {activeChat.messages.map((m) => (
              <div key={m.id} className={`chat-message-item ${m.sender}`}>
                <div className="chat-speech-bubble">
                  <p>{m.text}</p>
                  <span className="chat-time-stamp">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Chat Suggestions */}
          <div className="quick-chat-pills">
            {["Are we training tomorrow?", "What do you think of my split?", "Sent my PR video!"].map((pill, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-reply-pill"
                onClick={() => setMessageText(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="chat-input-bar">
            <button type="button" className="chat-attach-btn" title="Attach workout log">
              📎
            </button>
            <input
              type="text"
              placeholder={`Message ${activeChat.name}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button type="submit" className="chat-send-submit" disabled={!messageText.trim()}>
              Send ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;
