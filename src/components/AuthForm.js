import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("❌ 로그인 실패: " + error.message);
      else {
        setMessage("");
        onLogin(data.user);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("❌ 회원가입 실패: " + error.message);
      else setMessage("📧 회원가입 성공! 이메일을 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "로그인" : "회원가입"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
          >
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>
        <p
          className="mt-3 text-sm text-center text-gray-600 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
        </p>
        {message && <p className="mt-3 text-sm text-red-600 text-center">{message}</p>}
      </div>
    </div>
  );
}
