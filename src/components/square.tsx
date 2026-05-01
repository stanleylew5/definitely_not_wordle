interface SquareProps {
  color: string;
  letter: string;
}

const Square = ({ color, letter }: SquareProps) => {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center text-white font-bold ${color === "green" ? "bg-wordle-green" : color === "yellow" ? "bg-wordle-yellow" : "bg-wordle-gray"}`}
    >
      {letter}
    </div>
  );
};

export default Square;
