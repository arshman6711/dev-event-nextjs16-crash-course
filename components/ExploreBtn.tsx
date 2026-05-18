
'use client';

import Image from "next/image";
import posthog from "posthog-js";

const ExploreBtn = () => {
  return (
     <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => { console.log('CLICK'); posthog.capture('explore_events_clicked'); }}>
   <a href="#events">
    Explore Events
    <Image src="/icons/arrow-down.svg" alt="arrow-down" width={25} height={25}/>
  </a>
    </button>
  )
}


export default ExploreBtn