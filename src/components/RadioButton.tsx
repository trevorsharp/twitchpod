const RadioButton = ({ label, ...props }: any) => (
  <label className="flex items-center cursor-pointer">
    <input
      className="appearance-none peer rounded-full h-4 w-4 border-2 border-neutral-500 cursor-pointer checked:border-twitch normal:checked:ring-3 checked:ring-2 checked:ring-inset checked:ring-twitch"
      type="radio"
      name="quality"
      onChange={() => {}}
      {...props}
    />
    <span className="m-1" />
    <span className="peer-checked:text-twitch">{label}</span>
  </label>
);

export default RadioButton;
