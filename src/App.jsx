import React, { useState } from "react";
import {
  Search,
  Users,
  Eye,
  Calendar,
  TrendingUp,
  Video,
  PlayCircle,
  Trophy,
  DollarSign,
  BarChart3,
  Clock,
  Star,
} from "lucide-react";
import LimitModal from "./LimitModal";

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

// Function to calculate engagement rate
function calculateEngagementRate(views, subscribers) {
  if (subscribers === 0) return 0;
  return ((views / subscribers) * 100).toFixed(2);
}

// Function to get channel age in days
function getChannelAge(createdDate) {
  const now = new Date();
  const created = new Date(createdDate);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Function to get user ip
const getVisitorId = () => {
  const getBrowserFingerprint = () => {
    return btoa(
      `${navigator.userAgent}-${screen.width}x${screen.height}-${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`
    );
  };
  return getBrowserFingerprint();
};

async function getClientIp() {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}

const MAX_HITS_PER_DAY = 1;

const hasExceededLimit = async () => {
  const visitorId = getVisitorId();
  const ip = await getClientIp();
  const today = new Date().toISOString().slice(0, 10);

  const key = `visitor_hits_${today}`;
  const data = JSON.parse(localStorage.getItem(key)) || {
    visitor: {},
    ip: {},
  };

  if (!data.visitor[visitorId]) {
    data.visitor[visitorId] = 1;
  } else {
    data.visitor[visitorId]++;
  }

  if (!data.ip[ip]) {
    data.ip[ip] = 1;
  } else {
    data.ip[ip]++;
  }

  localStorage.setItem(key, JSON.stringify(data));

  return (
    data.visitor[visitorId] > MAX_HITS_PER_DAY || data.ip[ip] > MAX_HITS_PER_DAY
  );
};

function App() {
  // State variables
  const [channelID, setChannelID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [channelData, setChannelData] = useState({
    title: "CodeSena",
    description:
      "👋 Welcome to CodeSena\nCodeSena is your daily dose of coding quizzes and clean, creative mini projects in HTML, CSS, JavaScript, Backend, and Full Stack development.\nWe turn simple coding concepts into real, usable UI components you can actually build — perfect for beginners and pros alike.\n\n\n🎬 What You'll Get Here\n🚀 Shorts with tricky coding questions & answers\n🎨 Frontend UI/UX ideas (pure HTML & CSS)\n🧠 Backend & Full Stack logic projects\n💡 Real-world code tips with no fluff\n\n\n🧠 Why Subscribe?\nSkip the 1-hour tutorials.\nWe deliver smart, short, and practical projects to level up your skills — one video at a time.\n",
    logo: "https://yt3.ggpht.com/dGozE56v1cnvf4DXJuE6rnJLJpEwqwXs6Q6dA86Jm9HFmkIjUYAcx0PLmP05ZUE_4Txj4JB_=s800-c-k-c0x00ffffff-no-rj",
    subscriberCount: "17",
    viewCount: "25,260",
    createdDate: "2025-05-04",
    recentVideo: {
      thumbnail: "https://img.youtube.com/vi/HisgSKzIPtM/maxresdefault.jpg",
      videoId: "HisgSKzIPtM",
    },
    popularVideo: {
      thumbnail: "https://img.youtube.com/vi/lqUhA430VAs/maxresdefault.jpg",
      videoId: "lqUhA430VAs",
    },
  });
  const [incomeRange, setIncomeRange] = useState(`₹4,900 - ₹5,600`);

  // Function to update income range based on view count
  const updateIncomeRange = (views) => {
    let lowerBound = Math.round(views / 10000) * 75;
    let upperBound = Math.round(views / 10000) * 84;

    if (upperBound >= 10000000) {
      upperBound = Math.ceil(upperBound / 10000000) + "Cr";
    } else if (upperBound >= 100000) {
      upperBound = Math.ceil(upperBound / 100000) + "L";
    } else if (upperBound >= 1000) {
      upperBound = Math.ceil(upperBound / 1000) + "K";
    }

    if (lowerBound >= 10000000) {
      lowerBound = Math.floor(lowerBound / 10000000) + "Cr";
    } else if (lowerBound >= 100000) {
      lowerBound = Math.floor(lowerBound / 100000) + "L";
    } else if (lowerBound >= 1000) {
      lowerBound = Math.floor(lowerBound / 1000) + "K";
    }

    setIncomeRange(`₹${lowerBound} - ₹${upperBound}`);
  };

  // Handle input change
  const handleChange = (e) => {
    setChannelID(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const limitReached = await hasExceededLimit();
    if (limitReached) {
      setShowLimitModal(true);
      setIsLoading(false);
      return;
    }

    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    const resolveChannelId = async (handle) => {
      const cleanedHandle = handle.replace("@", "").trim();
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${cleanedHandle}&type=channel&maxResults=1&key=${apiKey}`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        return data.items[0].snippet.channelId || data.items[0].id.channelId;
      }
      return null;
    };

    try {
      if (!channelID) {
        alert("Please enter a valid YouTube channel handle.");
        setIsLoading(false);
        return;
      }

      const channelId = await resolveChannelId(channelID);

      if (!channelId) {
        alert("Channel not found. Please check the handle.");
        setIsLoading(false);
        return;
      }

      // Fetch channel data
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
      const channelResponse = await fetch(channelUrl);
      const channelData = await channelResponse.json();

      const viewCount = parseInt(channelData.items[0].statistics.viewCount);
      updateIncomeRange(viewCount);

      // Fetch recent video
      const recentVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=1&key=${apiKey}`;
      const recentVideoResponse = await fetch(recentVideoUrl);
      const recentVideoData = await recentVideoResponse.json();

      // Fetch popular video
      const popularVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=viewCount&maxResults=1&key=${apiKey}`;
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
        createdDate: channelData.items[0].snippet.publishedAt,
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
        totalVideos: channelData.items[0].statistics.videoCount,
        rawViewCount: viewCount,
        rawSubscriberCount: parseInt(
          channelData.items[0].statistics.subscriberCount
        ),
      });
    } catch (error) {
      console.error("Error fetching channel data:", error);
      alert("Something went wrong while fetching channel info.");
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white/80 text-sm font-medium">{title}</h3>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        {subtitle && <div className="text-white/70 text-xs">{subtitle}</div>}
      </div>
    </div>
  );

  const VideoCard = ({ video, title, icon: Icon }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-4 h-4 text-blue-400" />
          <h3 className="text-slate-300 text-sm font-medium">{title}</h3>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative"
        >
          <img
            src={video.thumbnail}
            alt={title}
            className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 rounded-xl flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              YouTube Channel Tracker
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Discover detailed insights about any YouTube channel with our
              advanced analytics tracker
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                autoFocus
                type="text"
                value={channelID}
                onChange={handleChange}
                placeholder="Enter YouTube channel handle"
                className="w-full pl-12 pr-32 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Channel Header */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={channelData.logo}
                alt="Channel Logo"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-600/50 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {channelData.title}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 max-w-3xl">
                {channelData.description}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined{" "}
                    {new Date(channelData.createdDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {getChannelAge(channelData.createdDate)} days old
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Subscribers"
            value={channelData.subscriberCount}
            subtitle="Total subscribers"
            gradient="from-blue-600 to-blue-700"
          />
          <StatCard
            icon={Eye}
            title="Total Views"
            value={channelData.viewCount}
            subtitle="All-time views"
            gradient="from-purple-600 to-purple-700"
          />
          <StatCard
            icon={Video}
            title="Total Videos"
            value={channelData.totalVideos || "N/A"}
            subtitle="Published videos"
            gradient="from-pink-600 to-pink-700"
          />
          <StatCard
            icon={TrendingUp}
            title="Engagement Rate"
            value={
              channelData.rawViewCount && channelData.rawSubscriberCount
                ? `${calculateEngagementRate(
                    channelData.rawViewCount,
                    channelData.rawSubscriberCount
                  )}%`
                : "N/A"
            }
            subtitle="Views per subscriber"
            gradient="from-green-600 to-green-700"
          />
        </div>

        {/* Videos Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <VideoCard
            video={channelData.recentVideo}
            title="Latest Upload"
            icon={Clock}
          />
          <VideoCard
            video={channelData.popularVideo}
            title="Most Popular"
            icon={Trophy}
          />
        </div>

        {/* Income Estimate */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500/20 rounded-2xl">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Estimated Monthly Income
                </h3>
                <p className="text-green-300 text-sm">
                  Based on views and monetization rates (if monetized)
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {incomeRange}
              </div>
              <div className="text-green-300 text-sm">
                Per month (estimated)
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Insights */}
        <div className="mt-8 bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/30">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Quick Insights</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-700/30 rounded-xl">
              <div className="text-slate-400 text-sm mb-1">
                Avg Views per Video
              </div>
              <div className="text-white text-xl font-semibold">
                {channelData.totalVideos
                  ? formatViewCount(
                      Math.round(
                        channelData.rawViewCount / channelData.totalVideos
                      )
                    )
                  : "N/A"}
              </div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-xl">
              <div className="text-slate-400 text-sm mb-1">
                Subscriber to View Ratio
              </div>
              <div className="text-white text-xl font-semibold">
                {channelData.rawViewCount && channelData.rawSubscriberCount
                  ? `1:${Math.round(
                      channelData.rawViewCount / channelData.rawSubscriberCount
                    )}`
                  : "N/A"}
              </div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-xl">
              <div className="text-slate-400 text-sm mb-1">Growth Stage</div>
              <div className="text-white text-xl font-semibold">
                {channelData.rawSubscriberCount < 1000
                  ? "Emerging"
                  : channelData.rawSubscriberCount < 100000
                  ? "Growing"
                  : channelData.rawSubscriberCount < 1000000
                  ? "Established"
                  : "Viral"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLimitModal && <LimitModal setShowLimitModal={setShowLimitModal} />}
    </div>
  );
}

export default App;
