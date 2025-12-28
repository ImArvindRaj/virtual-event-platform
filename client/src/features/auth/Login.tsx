import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import showToast from "../../utils/toast";
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      showToast.success("Welcome back! Login successful");
      navigate("/");
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center p-16 bg-[#4F46E5] relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-500/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-indigo-400/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-violet-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '5s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center gap-3 mb-12 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">EventHub</span>
          </div>

          <h1 className="text-6xl font-extrabold mb-8 leading-tight text-white tracking-tight drop-shadow-sm">
            Welcome back to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
              your events
            </span>
          </h1>
          <p className="text-xl text-indigo-100 leading-relaxed font-medium max-w-lg mx-auto">
            Connect with thousands of attendees and host amazing virtual experiences with our premium platform.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[440px] space-y-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EventHub</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sign in</h2>
            <p className="text-gray-500 text-lg">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail className="h-5 w-5" />}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  leftIcon={<Lock className="h-5 w-5" />}
                  rightIcon={showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
              />
              <label htmlFor="remember" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full h-12 text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
              isLoading={loading}
            >
              Sign in
            </Button>
          </form>

          <div className="text-center space-y-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors hover:underline decoration-2 underline-offset-4">
                Create account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400">
                By continuing, you agree to our{" "}
                <a href="#" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
                {" "}and{" "}
                <a href="#" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
