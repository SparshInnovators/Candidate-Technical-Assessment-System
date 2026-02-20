export default function Loader({ text = 'Loading...', fullscreen = false }) {
  const wrapper = fullscreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-50'
    : 'flex flex-col items-center justify-center py-20';

  return (
    <div className={wrapper}>
      <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-indigo-600 animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}
