interface Props {
  text?: string;
}

function Loader({ text }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-slate-200 rounded-full"></div>

        <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <p className="mt-4 text-slate-600 font-medium animate-pulse">{text}</p>
    </div>
  );
}

export default Loader;
