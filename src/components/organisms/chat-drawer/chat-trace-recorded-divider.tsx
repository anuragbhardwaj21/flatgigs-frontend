import { Link } from "react-router-dom";

const ChatTraceRecordedDivider = () => (
  <div
    className="flex w-full items-center gap-3 py-1"
    role="status"
    aria-live="polite"
  >
    <hr className="min-w-0 flex-1 border-0 border-t border-black/10" />
    <p className="shrink-0 text-center text-[11px] font-medium tracking-wide text-black/45">
      Trace recorded ·{" "}
      <Link
        to="/traces"
        className="text-main/90 underline-offset-2 hover:text-main hover:underline"
      >
        View traces
      </Link>
    </p>
    <hr className="min-w-0 flex-1 border-0 border-t border-black/10" />
  </div>
);

export default ChatTraceRecordedDivider;
