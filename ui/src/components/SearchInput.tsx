import { forwardRef } from "react";

const SearchInput = forwardRef<HTMLInputElement>((props, ref) => (
  <input
    className="border-twitch w-64 appearance-none rounded-lg border-2 border-solid bg-inherit p-3 text-xl text-white outline-none placeholder:text-neutral-400"
    ref={ref}
    type="text"
    placeholder="Channel Name"
    autoComplete="off"
    autoCorrect="off"
    autoCapitalize="off"
    spellCheck="false"
    {...props}
  />
));

SearchInput.displayName = "SearchInput";

export default SearchInput;
