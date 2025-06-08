import React, { useState } from "react";
import { FaPlay, FaRupeeSign } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import { BsFillInfoCircleFill } from "react-icons/bs";

// Function to format subscriber count (e.g., 1000 -> 1K, 1000000 -> 1M)
function formatSubscriberCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return count.toString();
  }
}

// Function to format view count with commas (e.g., 1000 -> 1,000)
function formatViewCount(count) {
  return count.toLocaleString();
}

function App() {
  // State variables
  const [channelID, setChannelID] = useState("");
  const [channelData, setChannelData] = useState({
    title: "CodeSena",
    description:
      "👋 Welcome to CodeSena\nCodeSena is your daily dose of coding quizzes and clean, creative mini projects in HTML, CSS, JavaScript, Backend, and Full Stack development.\nWe turn simple coding concepts into real, usable UI components you can actually build — perfect for beginners and pros alike.\n\n\n🎬 What You'll Get Here\n🚀 Shorts with tricky coding questions & answers\n🎨 Frontend UI/UX ideas (pure HTML & CSS)\n🧠 Backend & Full Stack logic projects\n💡 Real-world code tips with no fluff\n\n\n🧠 Why Subscribe?\nSkip the 1-hour tutorials.\nWe deliver smart, short, and practical projects to level up your skills — one video at a time.\n",
    logo: "https://yt3.ggpht.com/dGozE56v1cnvf4DXJuE6rnJLJpEwqwXs6Q6dA86Jm9HFmkIjUYAcx0PLmP05ZUE_4Txj4JB_=s800-c-k-c0x00ffffff-no-rj",
    subscriberCount: "17",
    viewCount: "25,260",
    createdDate: "4 May 2025",
    recentVideo: {
      thumbnail: "https://img.youtube.com/vi/HisgSKzIPtM/maxresdefault.jpg",
      videoId: "HisgSKzIPtM",
    },
    popularVideo: {
      thumbnail: "https://img.youtube.com/vi/lqUhA430VAs/maxresdefault.jpg",
      videoId: "lqUhA430VAs",
    },
  });
  const [incomeRange, setIncomeRange] = useState(`4900 - 5600`);

  // Function to update income range based on view count
  const updateIncomeRange = (views) => {
    // Calculate income range
    let lowerBound = Math.round(views / 10000) * 75;
    let upperBound = Math.round(views / 10000) * 84;

    // Format upper bound for readability
    if (upperBound >= 10000000) {
      upperBound = Math.ceil(upperBound / 10000000) + "Cr";
    } else if (upperBound >= 100000) {
      upperBound = Math.ceil(upperBound / 100000) + "L";
    } else if (upperBound >= 1000) {
      upperBound = Math.ceil(upperBound / 1000) + "K";
    }

    // Format lower bound for readability
    if (lowerBound >= 10000000) {
      lowerBound = Math.floor(lowerBound / 10000000) + "Cr";
    } else if (lowerBound >= 100000) {
      lowerBound = Math.floor(lowerBound / 100000) + "L";
    } else if (lowerBound >= 1000) {
      lowerBound = Math.floor(lowerBound / 1000) + "K";
    }

    // Set income range
    setIncomeRange(`${lowerBound} - ${upperBound}`);
  };

  // Handle input change
  const handleChange = (e) => {
    setChannelID(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate channel ID format
    if (!channelID || !/^[a-zA-Z0-9_-]{24}$/.test(channelID)) {
      alert("Please enter a valid YouTube channel ID.");
      return;
    }

    try {
      // Fetch channel data using YouTube Data API
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${apiKey}`;
      const channelResponse = await fetch(url);
      const channelData = await channelResponse.json();

      // Update income range based on view count
      const viewCount = parseInt(channelData.items[0].statistics.viewCount);
      updateIncomeRange(viewCount);

      // Fetch recent video data
      const recentVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&type=video&order=date&maxResults=1&key=${apiKey}`;
      const recentVideoResponse = await fetch(recentVideoUrl);
      const recentVideoData = await recentVideoResponse.json();

      // Fetch popular video data
      const popularVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&type=video&order=viewCount&maxResults=1&key=${apiKey}`;
      const popularVideoResponse = await fetch(popularVideoUrl);
      const popularVideoData = await popularVideoResponse.json();

      // Set channel data
      setChannelData({
        title: channelData.items[0].snippet.title,
        description: channelData.items[0].snippet.description,
        logo: channelData.items[0].snippet.thumbnails.high.url,
        subscriberCount: formatSubscriberCount(
          parseInt(channelData.items[0].statistics.subscriberCount)
        ),
        viewCount: formatViewCount(viewCount),
        createdDate: new Date(channelData.items[0].snippet.publishedAt),
        recentVideo: {
          thumbnail:
            recentVideoData.items.length > 0
              ? recentVideoData.items[0].snippet.thumbnails.high.url
              : "",
          videoId:
            recentVideoData.items.length > 0
              ? recentVideoData.items[0].id.videoId
              : "",
        },
        popularVideo: {
          thumbnail:
            popularVideoData.items.length > 0
              ? popularVideoData.items[0].snippet.thumbnails.high.url
              : "",
          videoId:
            popularVideoData.items.length > 0
              ? popularVideoData.items[0].id.videoId
              : "",
        },
        income: incomeRange,
      });
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };

  // Render UI
  return (
    <div className="min-h-screen bg-zinc-800 mx-auto md:p-6 p-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-center mb-8"
      >
        <input
          autoFocus
          type="text"
          value={channelID}
          onChange={handleChange}
          placeholder="Enter YouTube channel ID..."
          className=" px-4 py-2 w-full rounded-lg border dark:border-zinc-700 dark:bg-zinc-800 shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700
                 bg-red-900 text-red-100 placeholder-red-400"
        />
        <button
          type="submit"
          className="bg-red-800 hover:bg-red-900 text-red-100 px-6 py-2 rounded-lg shadow-sm transition"
        >
          Search
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-red-900 dark:text-zinc-100">
        Channel Preview
      </h2>

      <div
        className="dark:bg-zinc-900 rounded-2xl p-6 shadow-md space-y-6
                  bg-red-900 text-red-100"
      >
        <div className="flex items-center gap-4">
          <img
            src={channelData.logo}
            alt="Channel Logo"
            className="w-16 h-16 rounded-full object-cover border dark:border-zinc-700"
          />
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-red-900 dark:text-white">
              {channelData.title}
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-zinc-300 max-w-xl leading-relaxed line-clamp-2 text-wrap">
              {channelData.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-red-700 dark:text-zinc-300">
          <p className="flex items-center gap-2">
            <RiUserFollowFill className="text-red-500" />
            <span>{channelData.subscriberCount}</span> Subscribers
          </p>
          <p className="flex items-center gap-2">
            <FaPlay className="text-red-500" />
            <span>{channelData.viewCount}</span> Views
          </p>
          <p className="flex items-center gap-2">
            <BsFillInfoCircleFill className="text-red-500" />
            Joined{" "}
            <span>
              {new Date(channelData.createdDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-red-600 dark:text-zinc-400">
              Recent Video
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${channelData.recentVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={channelData.recentVideo.thumbnail}
                alt="Recent Video"
                className="w-full rounded-lg shadow"
              />
            </a>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-red-600 dark:text-zinc-400">
              Popular Video
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${channelData.popularVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={channelData.popularVideo.thumbnail}
                alt="Popular Video"
                className="w-full rounded-lg shadow"
              />
            </a>
          </div>
        </div>

        <div className="mt-6 bg-red-800 dark:bg-zinc-800 rounded-lg p-4 flex items-center justify-between flex-wrap">
          <p className="text-sm font-medium text-red-300 dark:text-zinc-300">
            Estimated Income (if monetized):
          </p>
          <p className="text-lg font-bold text-green-600 flex items-center gap-1">
            <FaRupeeSign />
            <span>{incomeRange}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
