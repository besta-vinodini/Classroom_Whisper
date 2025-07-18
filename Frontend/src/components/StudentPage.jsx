import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function StudentPage() {
  const [doubt, setDoubt] = useState("");
  const [doubts, setDoubts] = useState([]);
  const [subject, setSubject] = useState("OS");
  const [className, setClassName] = useState("CSE-E1");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDoubt = { text: doubt, sessionId: "default",subject,className, };

    try {
      const { data } = await axios.post("http://localhost:5000/api/doubts", newDoubt);
      socket.emit("sendDoubt", data);
      setDoubts((prev) => [...prev, data]);
      setDoubt("");
      console.log("✅ Doubt submitted and saved:", data);
    } catch (err) {
      console.error("❌ Failed to submit the doubt:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doubts/${id}`);
      setDoubts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete doubt:", err.message);
    }
  };

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doubts/default");
        setDoubts(res.data);
      } catch (err) {
        console.error("❌ Error loading doubts:", err.message);
      }
    };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-70">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text mb-8">
          🎓 Classroom Whisper
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            placeholder="Enter your doubt anonymously..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
            required
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
          >
            Submit
          </button>
        </form>

        <div className="space-y-4">
          {doubts.map((d) => (
            <div
              key={d._id}
              className={`p-4 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                d.isResolved ? "bg-green-100 hover:bg-green-200" : "bg-white hover:bg-gray-100"
              }`}
            >
              <p className="text-gray-800 font-medium">❓ {d.text}</p>

              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className={d.isResolved ? "text-green-600" : "text-red-600"}>
                  {d.isResolved ? "Resolved" : "Pending"}
                </span>
              </p>

              {d.answer && (
                <p className="text-sm text-blue-800 mt-2">
                  <strong>Answer:</strong> {d.answer}
                </p>
              )}

              {d.isResolved && (
                <button
                  onClick={() => handleDelete(d._id)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 hover:underline transition-colors duration-200"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentPage;


