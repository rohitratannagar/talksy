import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningup } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email is not valid");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success) {
      signup(formData);
      setFormData({
        fullName: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-10 py-10">
        <div className="w-[90%] max-w-md space-y-6">
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-12 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Start your journey with us</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <label className="input w-full input-bordered flex items-center gap-2">
              <svg className="h-5 w-5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Username"
                className="grow"
              />
            </label>

            {/* Email */}
            <label className="input w-full input-bordered flex items-center gap-2">
              <svg className="h-5 w-5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="grow"
              />
            </label>

            {/* Password */}
            <label className="input w-full input-bordered flex items-center gap-2">
              <svg className="h-5 w-5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="grow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </label>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningup}>
              {isSigningup ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-sm text-center mt-4 text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hidden on Mobile */}
      <div className="hidden md:flex w-1/2 items-center justify-center px-4 md:px-10">
        <AuthImagePattern
          title="Join the community"
          subtitle="Connect with others and share your thoughts."
        />
      </div>
    </div>
  );
};

export default SignupPage;
