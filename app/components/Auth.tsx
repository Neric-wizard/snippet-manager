"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, Sparkles, Eye, EyeOff } from "lucide-react";

const supabase = createClient(
  "https://uxinmkincruczosbqjwl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aW5ta2luY3J1Y3pvc2JxandsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTQ0NDIsImV4cCI6MjA5MzQ5MDQ0Mn0.XrbhL1Zrk3yA05MJszfR3gRd_jVAxxqBZXWeKRGwBWI"
);

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) setMessage(error.message);
    else if (isSignUp) setMessage("Check your email to confirm!");
    else setMessage("Welcome back!");
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Enter your email address first");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setMessage(error.message);
    else setMessage("Password reset email sent!");
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 shadow-2xl"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 mb-3">
          <Sparkles size={24} className="text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {isSignUp
            ? "Sign up to save and manage your snippets"
            : "Sign in to access your saved snippets"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Field */}
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition" size={18} />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Password Field with Toggle */}
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] focus:border-transparent transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-400 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
            />
            Remember me
          </label>
          {!isSignUp && (
            <button
              onClick={handleForgotPassword}
              className="text-sm text-purple-400 hover:text-purple-300 transition"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isSignUp ? (
            <>
              <UserPlus size={18} />
              Sign Up
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign In
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Toggle Sign In / Sign Up */}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-gray-400 hover:text-purple-400 transition"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>

        {/* Message Feedback */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm text-center py-2 rounded-lg ${
              message.includes("check your email") || message.includes("Welcome") || message.includes("sent")
                ? "text-green-400 bg-green-500/10"
                : "text-red-400 bg-red-500/10"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Security Badge */}
        <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2 pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Secured by Supabase</span>
          <span>•</span>
          <span>AES-256 Encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}