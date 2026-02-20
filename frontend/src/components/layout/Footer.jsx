import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <Container>
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900">TechAssess</span>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} TechAssess &middot; Built for candidate assessment
          </p>
        </div>
      </Container>
    </footer>
  );
}
