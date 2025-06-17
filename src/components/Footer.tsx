import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full text-center py-6  border-t border-black-500 bg-white-500 shadow-inner">
      <p className="text-sm text-teal-600 flex items-center justify-center gap-1">
        Made with <Heart className="w-4 h-4 text-red-500" fill="red" /> by <strong className="ml-1 text-teal-600">Iqbal</strong>, Full Stack Developer
      </p>
    </footer>
  );
}
