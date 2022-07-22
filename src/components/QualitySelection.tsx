import { Quality } from '../types';

const QualitySelection = ({
  selection,
  onSelect,
}: {
  selection: Quality;
  onSelect: (selection: Quality) => void;
}) => {
  return (
    <div className="flex gap-4">
      <RadioButton
        id="Maximum"
        label="Best Video"
        value={Quality.Maximum}
        checked={selection === Quality.Maximum}
        onClick={() => onSelect(Quality.Maximum)}
      />
      <RadioButton
        id="720p"
        label="720p"
        value={Quality.P720}
        checked={selection === Quality.P720}
        onClick={() => onSelect(Quality.P720)}
      />
      <RadioButton
        id="480p"
        label="480p"
        value={Quality.P480}
        checked={selection === Quality.P480}
        onClick={() => onSelect(Quality.P480)}
      />
      <RadioButton
        id="Audio"
        label="Audio Only"
        value={Quality.Audio}
        checked={selection === Quality.Audio}
        onClick={() => onSelect(Quality.Audio)}
      />
    </div>
  );
};

const RadioButton = ({
  label,
  ...props
}: {
  label: string;
  id: string;
  value: any;
  checked: boolean;
  onClick: () => void;
}) => (
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

export default QualitySelection;
