interface SquareProps {
  color: string;
  letter: string;
}

const Square = ({ color, letter }: SquareProps) => {
  return (
    <div
      className={`w-16 h-16 flex items-center justify-center text-white text-2xl font-bold ${
        color === "green"
          ? "bg-wordle-green"
          : color === "yellow"
            ? "bg-wordle-yellow"
            : color === "blank"
              ? "bg-wordle-black border-2 border-wordle-gray"
              : "bg-wordle-gray"
      }`}
    >
      {letter}
    </div>
  );
};

export default Square;
