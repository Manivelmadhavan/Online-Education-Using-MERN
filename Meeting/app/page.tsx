"use client";
import Landing from "@/components/landing";
import { Button } from "@/components/ui/button";
import VideoCall from "@/components/video-call";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [startMeeting, setStartMeeting] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("personal link");
  return (
    <main>
      {startMeeting ? (
      

      <VideoCall
      meetingTitle={meetingTitle}
      />
      ) : (
        <Landing
          meetingTitle={meetingTitle}
          setMeetingTitle={setMeetingTitle}
          setStartMeeting={setStartMeeting}
        />
      )}
    </main>
  );
}
