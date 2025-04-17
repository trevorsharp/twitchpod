"use client";

import { forwardRef } from "react";

const SearchInput = forwardRef<HTMLInputElement>((props, ref) => (
  <input
    className="w-50 appearance-none rounded-lg border-2 border-solid border-twitch bg-inherit p-3 text-xl outline-none"
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
