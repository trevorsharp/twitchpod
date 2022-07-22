import { useState, forwardRef, useEffect } from 'react';

const topStreamers = [
  'HasanAbi',
  'GeorgeNotFound',
  'Mizkif',
  'tommyinnit',
  'shroud',
  'Sykkuno',
  'DisguisedToast',
  'pokimane',
  'Amouranth',
  'dakotaz',
  'GMHikaru',
  'Myth',
];

const SearchInput = forwardRef<HTMLInputElement>((props, ref) => {
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('');

  const animationTimeouts: NodeJS.Timeout[] = [];

  const animatePlaceholderText = () => {
    const streamerList = topStreamers.sort(() => 0.5 - Math.random());
    let timeout = 0;
    streamerList.forEach((streamer) => {
      streamer.split('').forEach((_, i) => {
        animationTimeouts.push(
          setTimeout(() => setInputPlaceholder(streamer.substring(0, i + 1)), timeout)
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
      className="appearance-none text-xl w-50 rounded-lg p-3 border-solid border-2 border-twitch outline-none bg-inherit"
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

export default SearchInput;
