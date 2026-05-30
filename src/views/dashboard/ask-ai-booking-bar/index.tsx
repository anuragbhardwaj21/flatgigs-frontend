import { useState } from "react";
import BrandIcon from "@/components/atoms/brand-icon";
import RenderInput from "@/components/molecules/render-input";
import { Button } from "@mui/material";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";

const AI_PLACEHOLDER =
  "Describe your trip — city, dates, budget, vibe… e.g. quiet 1-bed in Lisbon under €130 with a balcony";

const AskAiBookingBar = ({ className }: { className?: string }) => {
  const IconSend = useIcon("send");
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    console.log({ aiQuery: trimmed });
  };

  return (
    <div
      className={cn(
        "flex h-12 w-full max-w-[64%] items-center gap-1.5 rounded-2xl border-2 border-main/10 bg-background-paper px-2 py-1",
        className,
      )}
    >
      <div className="shrink-0 [&_p]:p-1.5! [&_svg]:text-base!">
        <BrandIcon />
      </div>
      <RenderInput
        render="search"
        className="min-h-0! h-full! min-w-0 flex-1 rounded-none bg-transparent px-0 py-0 hover:bg-transparent [&_.MuiInputBase-input]:text-sm [&_.MuiInputBase-input]:placeholder:text-black/45"
        placeholder={AI_PLACEHOLDER}
        value={query}
        onValueChange={setQuery}
        onSubmit={handleSubmit}
      />
      <Button
        variant="text"
        color="primary"
        onClick={handleSubmit}
        className="h-9! min-w-9! shrink-0 bg-main/50! px-2! text-black/70! rounded-lg!"
      >
        <IconSend size={20} />
      </Button>
    </div>
  );
};

export default AskAiBookingBar;
