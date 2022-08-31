import { Quality } from '../types';

type QualitySelectionProps = {
  selection: Quality;
  onSelect: (selection: Quality) => void;
};

const QualitySelection = ({ selection, onSelect }: QualitySelectionProps) => {
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

type RadioButtonProps = {
  label: string;
  id: string;
  value: any;
  checked: boolean;
  onClick: () => void;
};

const RadioButton = ({ label, ...props }: RadioButtonProps) => (
  <label className="flex cursor-pointer items-center">
    <input
      className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-neutral-500 checked:border-twitch checked:ring-2 checked:ring-inset checked:ring-twitch normal:checked:ring-3"
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
