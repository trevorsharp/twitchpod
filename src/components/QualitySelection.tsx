import { Quality } from '../types';
import RadioButton from './RadioButton';

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

export default QualitySelection;
