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
    title: "KUNTAL",
    logo: "https://media.licdn.com/dms/image/D4E03AQFVTayGix2sjw/profile-displayphoto-shrink_400_400/0/1698928533374?e=1720051200&v=beta&t=cxZdCy8gcVFMjq6AJBs6GfcI_B0o4yxWLYxuCSJc030",
    subscriberCount: "48K",
    viewCount: "665,595",
    createdDate: "6 Apr 2019",
    recentVideo: {
      thumbnail: "https://img.youtube.com/vi/7pko2OaaVcM/maxresdefault.jpg",
      videoId: "7pko2OaaVcM",
    },
    popularVideo: {
      thumbnail: "https://img.youtube.com/vi/02Zjz1TY1yc/maxresdefault.jpg",
      videoId: "02Zjz1TY1yc",
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
      const apiKey = "AIzaSyBJMU1kXx6f4cTjbEE1Jbcqu879wiA_ICc";
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
        logo: channelData.items[0].snippet.thumbnails.high.url,
        subscriberCount: formatSubscriberCount(parseInt(channelData.items[0].statistics.subscriberCount)),
        viewCount: formatViewCount(viewCount),
        createdDate: new Date(channelData.items[0].snippet.publishedAt),
        recentVideo: {
          thumbnail: recentVideoData.items.length > 0 ? recentVideoData.items[0].snippet.thumbnails.high.url : "",
          videoId: recentVideoData.items.length > 0 ? recentVideoData.items[0].id.videoId : "",
        },
        popularVideo: {
          thumbnail: popularVideoData.items.length > 0 ? popularVideoData.items[0].snippet.thumbnails.high.url : "",
          videoId: popularVideoData.items.length > 0 ? popularVideoData.items[0].id.videoId : "",
        },
        income: incomeRange,
      });
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };

  // Render UI
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type="text"
          id="input"
          value={channelID}
          onChange={handleChange}
          placeholder="Enter YouTube channel ID.."
        />
        <button type="submit" id="btn">
          Search
        </button>
      </form>
      <h2>Preview :</h2>
      <div className="details">
        <img src={channelData.logo} alt="Channel Logo" />
        <h3>{channelData.title}</h3>
        <div className="detail">
          <p>
            <RiUserFollowFill /> <span>{channelData.subscriberCount} </span>
            Subscribers
          </p>
          <p>
            <FaPlay /> <span>{channelData.viewCount}</span> Views
          </p>
          <p>
            <BsFillInfoCircleFill /> Joined{" "}
            <span>
              {new Date(channelData.createdDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
        <div className="videos">
          <div className="recent">
            <p>Recent video</p>
            <a
              href={`https://www.youtube.com/watch?v=${channelData.recentVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={channelData.recentVideo.thumbnail} alt="Recent Video" />
            </a>
          </div>
          <div className="popular">
            <p>Popular video</p>
            <a
              href={`https://www.youtube.com/watch?v=${channelData.popularVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={channelData.popularVideo.thumbnail} alt="Popular Video" />
            </a>
          </div>
        </div>
      </div>
      <div className="income">
        <p>Estimated Income(if Monetized) :</p>
        <p id="rs">
          <FaRupeeSign />
          <span>{incomeRange}</span>
        </p>
      </div>
    </div>
  );
}

export default App;
