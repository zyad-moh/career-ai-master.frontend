"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Bot, User } from "lucide-react";

export default function InterviewPage() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/api/v1/interview/start",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setSessionId(data.session_id);

      setMessages([
        {
          sender: "bot",
          text: data.question,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendAnswer = async () => {
    if (!input.trim() || !sessionId) return;

    const currentAnswer = input;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentAnswer,
      },
    ]);

    setInput("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/v1/interview/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            answer: currentAnswer,
          }),
        }
      );

      const data = await response.json();

      setScore(data.total_score);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.correct
            ? "✅ Correct Answer"
            : "❌ Incorrect Answer",
        },
        {
          sender: "bot",
          text: data.feedback,
        },
        {
          sender: "bot",
          text: data.next_question,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          AI Interview Assistant
        </h1>

        <p className="text-muted-foreground mt-2">
          Practice technical interviews with instant AI feedback.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground">
            Current Score
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {score}
          </h2>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground">
            Interview Status
          </p>

          <h2 className="text-xl font-semibold mt-2">
            {sessionId ? "Active" : "Not Started"}
          </h2>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground">
            Session
          </p>

          <h2 className="text-xl font-semibold mt-2">
            AI Engineer
          </h2>
        </div>
      </div>

      {/* Chat */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 items-center">
            <MessageSquare size={22} />
            <h2 className="text-2xl font-bold">
              Interview Chat
            </h2>
          </div>

          {!sessionId && (
            <button
              onClick={startInterview}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground"
            >
              Start Interview
            </button>
          )}
        </div>

        <div className="h-[500px] overflow-y-auto flex flex-col gap-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-20">
              Start an interview to begin.
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`flex ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex gap-2 items-center mb-2">
                  {message.sender === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}

                  <span className="text-sm font-medium">
                    {message.sender === "user"
                      ? "You"
                      : "Interviewer"}
                  </span>
                </div>

                <p>{message.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {sessionId && (
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Type your answer..."
              className="flex-1 border border-border bg-background rounded-lg px-4 py-3"
            />

            <button
              onClick={sendAnswer}
              className="px-6 rounded-lg bg-primary text-primary-foreground flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}