import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";

export default function Header({
  setStartMeeting,
  meetingTitle,
  setMeetingTitle,
}: {
  setStartMeeting: (value: boolean) => void;
  meetingTitle: string;
  setMeetingTitle: (value: string) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = () => {
    window.open(`${searchQuery}`, "_blank");
  };

  return (
    <>
      <header className="h-screen justify-center flex items-center flex-col relative">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
        >
          <source src="bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="flex flex-col items-center space-y-4 mt-10 p-6 bg-black bg-opacity-50 shadow-lg rounded-lg max-w-2xl relative z-10">
          {/* Search Functionality */}
          <div className="flex flex-col items-center space-y-4">
            <Input
              placeholder="Paste the Meeting url"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button
              onClick={handleSearch}
              className="bg-black dark:bg-white rounded w-64 text-white dark:text-black px-4 py-2"
              variant="outline"
            >
              Join Meeting
            </Button>
          </div>

          <div className="mt-10 w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-black dark:bg-white rounded w-full text-white dark:text-black px-4 py-2"
                  variant="outline"
                >
                  Start meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-black bg-opacity-50 shadow-lg rounded-lg p-4 text-white">
                <DialogHeader>
                  <DialogTitle>Meeting Details</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4 text-white">
                    <Label htmlFor="username" className="text-right">
                      Title
                    </Label>
                    <Input
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      id="title"
                      value={meetingTitle}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setStartMeeting(true)} color="white">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </header>
    </>
  );
}
