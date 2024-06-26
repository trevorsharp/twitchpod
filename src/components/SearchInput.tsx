"use client";

import { forwardRef, useEffect, useState } from "react";

const topStreamers = [
  "Amouranth",
  "dakotaz",
  "DisguisedToast",
  "GMHikaru",
  "HasanAbi",
  "ironmouse",
  "itsHafu",
  "Kyedae",
  "Mizkif",
  "Northernlion",
  "pokimane",
  "QTCinderella",
  "shroud",
  "theneedledrop",
  "theo",
  "TinaKitten",
];

const SearchInput = forwardRef<HTMLInputElement>((props, ref) => {
  const [inputPlaceholder, setInputPlaceholder] = useState<string>("");

  const animationTimeouts: NodeJS.Timeout[] = [];

  const animatePlaceholderText = () => {
    const streamerList = topStreamers.sort(() => 0.5 - Math.random());
    let timeout = 0;
    streamerList.forEach((streamer) => {
      streamer.split("").forEach((_, i) => {
        animationTimeouts.push(
          setTimeout(() => setInputPlaceholder(streamer.substring(0, i + 1)), timeout),
        );
        timeout += 200;
      });
      timeout += 2000;
    });
    animationTimeouts.push(setTimeout(() => animatePlaceholderText(), timeout));
  };

  useEffect(() => {
    animatePlaceholderText();
    return () => animationTimeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  return (
    <input
      className="w-50 appearance-none rounded-lg border-2 border-solid border-twitch bg-inherit p-3 text-xl outline-none"
      ref={ref}
      type="text"
      placeholder={inputPlaceholder}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      {...props}
    />
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;
