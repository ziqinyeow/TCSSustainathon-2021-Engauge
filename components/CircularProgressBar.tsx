import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

interface Props {
  percentage: number;
  pathColor?: string;
  trailColor?: string;
}

const CircularProgressBar = ({ percentage, pathColor, trailColor }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full h-full">
      {mounted && (
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: pathColor ? pathColor : "#E5E7EB",
            textColor: "black",
            trailColor: trailColor ? trailColor : "#F9FAFB",
            backgroundColor: "#1E1F23",
          })}
        />
      )}
    </div>
  );
};

export default CircularProgressBar;
