import { useState } from "react";
import { Quality } from "@ui/types";
import QualitySelection from "@ui/components/QualitySelection";
import RssLinks from "@ui/components/RssLinks";

type AddFeedProps = {
  username: string;
  hostname: string;
};

const AddFeed = ({ username, hostname }: AddFeedProps) => {
  const [qualitySelection, setQualitySelection] = useState<Quality>(Quality.Maximum);

  return (
    <>
      <QualitySelection selection={qualitySelection} onSelect={setQualitySelection} />
      <RssLinks username={username} quality={qualitySelection} hostname={hostname} />
    </>
  );
};

export default AddFeed;
