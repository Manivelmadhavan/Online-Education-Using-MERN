"use client";
import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function randomID(len: number) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall({ meetingTitle }: { meetingTitle?: string }) {
  const params = useParams<{ title: string }>();
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const roomID = getUrlParams().get("roomID") || randomID(5);

  const handleConnectionError = async (error: any) => {
    console.error('Connection error:', error);
    const errorCode = error.code || (error.msg && parseInt(error.msg.match(/\d+/)?.[0]));
    
    if (errorCode === 20021 || errorCode === 200101) {
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        setError(`Connection failed. Retrying in ${delay/1000}s... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          initializeCall();
        }, delay);
      } else {
        setError('Failed to connect after multiple attempts. Please check your network connection and try again later.');
      }
    } else {
      setError(`Connection error (${errorCode}). Please try again or contact support if the issue persists.`);
    }
  };

  const initializeCall = async (element?: HTMLElement) => {
    if (!element) return;
    try {
      const appID = process.env.NEXT_PUBLIC_APP_ID;
      const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRET;
      
      if (!appID || !serverSecret) {
        setError('Missing required environment variables. Please configure NEXT_PUBLIC_APP_ID and NEXT_PUBLIC_SERVER_SECRET in .env.local');
        return;
      }
      
      const numericAppID = parseInt(appID);
      if (isNaN(numericAppID)) {
        setError('Invalid APP_ID format. Please ensure NEXT_PUBLIC_APP_ID is a valid number.');
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        numericAppID,
        serverSecret,
        roomID,
        randomID(5),
        randomID(5)
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      if (!zp) {
        setError('Failed to create ZegoUIKitPrebuilt instance. Please check your configuration.');
        return;
      }

      await zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: meetingTitle || params.title.replace(/%20/g, ' '),
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "join" +
              "/" +
              meetingTitle +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
      });

      setError(null);
      setRetryCount(0);
    } catch (err) {
      handleConnectionError(err);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div
        className="myCallContainer w-full h-full"
        ref={initializeCall as unknown as React.LegacyRef<HTMLDivElement>}
      />
    </div>
  );
}
