'use client';

import { useState } from 'react';
import { Quality } from '~/types';
import QualitySelection from './QualitySelection';
import RssLinks from './RssLinks';

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
