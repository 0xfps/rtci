import { LuLoaderCircle } from "react-icons/lu";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <LuLoaderCircle className="loader text-bright text-4xl" />
    </div>
  );
}
