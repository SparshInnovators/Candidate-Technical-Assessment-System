import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (email, password, name) => {
    await register(email, password, name);
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex flex-1 bg-indigo-950 items-center justify-center p-12">
        <div className="max-w-sm text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Start Your Journey Today</h2>
          <p className="text-indigo-300 text-sm leading-relaxed mb-8">
            Create your account and take your first technical assessment in minutes.
          </p>
          <ul className="space-y-3">
            {['Free to get started', 'Multiple language support', 'Instant performance feedback'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-indigo-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900">Create Account</h1>
            <p className="text-sm text-slate-500 mt-1.5">Register to take technical assessments</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <RegisterForm onSubmit={handleRegister} />
          </div>
        </div>
      </div>
    </div>
  );
}
