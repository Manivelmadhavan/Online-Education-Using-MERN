import React from "react";
import Header from "./header";

export default function Landing({
  setStartMeeting,
  setMeetingTitle,
  meetingTitle,
}: {
  setStartMeeting: (value: boolean) => void;
  meetingTitle: string;
  setMeetingTitle: (value: string) => void;
}) {
  return (
    <>
      <Header
        meetingTitle={meetingTitle}
        setMeetingTitle={setMeetingTitle}
        setStartMeeting={setStartMeeting}
      />

      <div className="w-full p-3 flex flex-col items-center absolute space-y-4 top-40">
        <h2 className="text-5xl text-center font-extrabold mt-4 ">
          Intract Meeting
        </h2>

        <p className="my-5 text-center">
          Make it Better Learing!!!
        </p>
      </div>
    </>
  );
}
