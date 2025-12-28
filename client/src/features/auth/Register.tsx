import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import showToast from "../../utils/toast";
import { User, Mail, Lock, ArrowRight, Sparkles, Shield, Eye, EyeOff, Zap } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";



export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      showToast.success("Account created successfully! Welcome aboard 🎉");
      navigate("/");
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Registration failed. Please try again."
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

          <h1 className="text-5xl font-extrabold mb-8 leading-tight text-white tracking-tight drop-shadow-sm">
            Start hosting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
              amazing events
            </span>
          </h1>
          <p className="text-xl text-indigo-100 leading-relaxed font-medium mb-12 max-w-lg mx-auto">
            Join thousands of event organizers who trust EventHub to deliver exceptional experiences.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-white">Secure & Reliable</div>
                <div className="text-sm text-indigo-100/80">Enterprise-grade security standards</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-white">Lightning Fast</div>
                <div className="text-sm text-indigo-100/80">Instant event setup and deployment</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[480px] py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EventHub</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create account</h2>
            <p className="text-gray-500 text-lg">Get started with your free account today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              leftIcon={<User className="h-5 w-5" />}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail className="h-5 w-5" />}
            />



            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onRightIconClick={() => setShowPassword(!showPassword)}
              />

              <Input
                label="Confirm"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full h-12 text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 mt-4"
              isLoading={loading}
            >
              Create account
            </Button>
          </form>

          <div className="text-center space-y-6 mt-8">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors hover:underline decoration-2 underline-offset-4">
                Sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400">
                By creating an account, you agree to our{" "}
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
