"use client";

import { DiscussionEmbed } from "disqus-react";

const DisqusComments = ({ post }) => {
  let currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  currentUrl = currentUrl.replace(/&?host=[^&]*/, '').replace(/&?epid=[^&]*/, '').replace(/&?type=[^&]*/, '');
  const disqusShortname = "aniplayz";
  const disqusConfig = {
    url: currentUrl,
    identifier: currentUrl,
    title: `${post.title} - Episode ${post.episode}`, // Single post title
  };

  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;
