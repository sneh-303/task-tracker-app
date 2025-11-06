import { ClipLoader } from "react-spinners";

export default function Loader({ size = 28, color = "#2563EB" }) {
  return (
    <div className="flex justify-center items-center py-4">
      <ClipLoader color={color} size={size} />
    </div>
  );
}
