// src/components/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-center px-4">
      <h1 className="text-4xl font-bold text-purple-800 mb-6">🎓 Classroom Whisper</h1>
      <p className="text-gray-700 max-w-lg mb-8">An anonymous real-time doubt resolution platform for students and teachers.</p>
      <div className="space-x-4">
        <Link to="/student">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">Student</button>
        </Link>
        <Link to="/teacher">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Teacher</button>
        </Link>
      </div>
    </div>
  );
}
