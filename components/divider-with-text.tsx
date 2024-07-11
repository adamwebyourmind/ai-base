import { cn } from "lib/utils";

const DividerWithText = ({ className = "" }: { className?: string }) => {
  return (
    <div className={cn(`my-4 flex items-center justify-center`, className)}>
      <div className="mr-3 flex-grow border-t"></div>
      <span className="text-muted">or</span>
      <div className="ml-3 flex-grow border-t"></div>
    </div>
  );
};

export default DividerWithText;
