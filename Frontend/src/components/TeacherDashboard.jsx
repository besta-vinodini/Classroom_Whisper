import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // change for prod

export default function TeacherDashboard() {
  const [doubts, setDoubts] = useState([]);
  const [answerInputs, setAnswerInputs] = useState({});

  const fetchDoubts = async () => {
    try {
      const res = await axios.get("/api/doubts/default");
      setDoubts(res.data);
    } catch (err) {
      console.error("Failed to fetch doubts:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchDoubts();

    socket.on("receiveDoubt", (data) => {
      setDoubts((prev) => [...prev, data]);
    });

    socket.on("doubtResolved", (id) => {
      setDoubts((prev) =>
        prev.map((d) => (d._id === id ? { ...d, isResolved: true } : d))
      );
    });

    return () => {
      socket.off("receiveDoubt");
      socket.off("doubtResolved");
    };
  }, []);

  const handleResolve = async (id) => {
    try {
      await axios.put(`/api/doubts/${id}/resolve`);
      socket.emit("resolveDoubt", id);
      setDoubts((prev) =>
        prev.map((d) => (d._id === id ? { ...d, isResolved: true } : d))
      );
    } catch (err) {
      console.error("Failed to resolve doubt:", err.response?.data || err.message);
    }
  };

  const handleAnswer = async (id) => {
    const answer = answerInputs[id];
    if (!answer) return;

    try {
      await axios.put(`/api/doubts/${id}/answer`, { answer });
      fetchDoubts();
      setAnswerInputs((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Failed to send answer:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-purple-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-800 to-indigo-700 text-transparent bg-clip-text mb-8">
          👩‍🏫 Teacher Dashboard
        </h1>

        {doubts.length === 0 ? (
          <p className="text-gray-500 text-center">No doubts submitted yet.</p>
        ) : (
          <div className="space-y-5">
            {doubts.map((doubt) => (
              <div
                key={doubt._id}
                className={`p-5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                  doubt.isResolved ? "bg-green-100" : "bg-white"
                }`}
              >
                <p className="text-lg font-semibold text-gray-800">❓ {doubt.text}</p>

                <p className="text-sm mt-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      doubt.isResolved ? "text-green-700" : "text-red-700"
                    }
                  >
                    {doubt.isResolved ? "Resolved" : "Pending"}
                  </span>
                </p>

                {doubt.answer && (
                  <p className="text-sm mt-2 text-blue-800">
                    <span className="font-semibold">Answer:</span> {doubt.answer}
                  </p>
                )}

                {!doubt.isResolved && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      value={answerInputs[doubt._id] || ""}
                      onChange={(e) =>
                        setAnswerInputs((prev) => ({
                          ...prev,
                          [doubt._id]: e.target.value,
                        }))
                      }
                      placeholder="Type your answer..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleAnswer(doubt._id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                      >
                        ✅ Send Answer
                      </button>
                      <button
                        onClick={() => handleResolve(doubt._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        ✔ Mark as Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
