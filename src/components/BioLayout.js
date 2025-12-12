// src/components/BioLayout.js
"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import SauceSlab from "./SauceSlab";

export default function BioLayout({ appData, adScripts }) {
  const { allPosts, visibleCount, totalPosts, user, theme } = appData;
  const [searchQuery, setSearchQuery] = useState("");
  const [unlockedState, setUnlockedState] = useState({});

  useEffect(() => {
    const STORAGE_KEY = "henpro_unlocked_titles";
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      setUnlockedState(stored ? JSON.parse(stored) : {});
    } catch {
      setUnlockedState({});
    }
  }, []);

  const handleUnlock = (title) => {
    setUnlockedState((prev) => ({ ...prev, [title]: true }));
  };

  const filteredPosts = allPosts.filter((title, index) => {
    const titleText = title.toLowerCase();
    const search = searchQuery.toLowerCase().trim();

    if (search === "") return true;

    const postNumber = totalPosts - index;
    const isExactNumeric =
      !isNaN(parseInt(search)) && parseInt(search).toString() === search;

    return isExactNumeric
      ? postNumber.toString() === search
      : titleText.includes(search);
  });

  const slabsToRender = [];
  let upcomingCount = 0;

  allPosts.forEach((title, index) => {
    const sequentialNumber = totalPosts - index;
    const isVisible = sequentialNumber <= visibleCount;

    if (!filteredPosts.includes(title) && searchQuery.trim() !== "") return;

    if (isVisible) {
      slabsToRender.push({
        title,
        index,
        isVisible: true,
        isNextUpcoming: false,
      });
    } else if (searchQuery.trim() === "") {
      const isNextUpcoming =
        sequentialNumber > visibleCount &&
        sequentialNumber <= visibleCount + 2 &&
        upcomingCount < 2;

      if (isNextUpcoming) {
        slabsToRender.push({
          title,
          index,
          isVisible: false,
          isNextUpcoming: true,
        });
        upcomingCount++;
      }
    }
  });

  const getCssVars = () => {
    return Object.keys(theme)
      .map((key) => `--theme-${key}: ${theme[key]};`)
      .join(" ");
  };

  return (
    <div
      className="page-wrapper"
      style={{
        [getCssVars()]: "",
        maxHeight: "100vh",
        overflowY: "hidden",
      }}
    >
      {/* SAFE Script injection */}

      <div className="bio-page">
        <img
          src={`/${user.design}`}
          alt="background"
          className="bio-background"
        />

        <div className="bio-content">
          <div
            className="bio-ad ad-top"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3px 0",
              backgroundColor: "#201f31",
            }}
          >
            <iframe
              src="/ad"
              title="Sponsored Ad"
              scrolling="no"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                width: "100%",
                maxWidth: "728px",
                height: "90px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#201f31",
              }}
            />
          </div>

          <div className="bio-avatar">
            <img src={user.avatar} alt="avatar" />
          </div>

          <div className="bio-username">{user.username}</div>

          <div className="bio-description">
            {user.bio}
            <br />({visibleCount} of {totalPosts} Posts Visible)
          </div>

          <div className="bio-search-container">
            <input
              type="text"
              id="bio-search-input"
              className="bio-search-input"
              placeholder="Search by Exact Post # (e.g., 10) or Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bio-links" id="bio-links-container">
            {slabsToRender.map((post) => (
              <SauceSlab
                key={post.index}
                title={post.title}
                index={post.index}
                totalPosts={totalPosts}
                theme={theme}
                isVisible={post.isVisible}
                isNextUpcoming={post.isNextUpcoming}
                onUnlock={handleUnlock}
              />
            ))}
          </div>

          <div
            className="bio-ad ad-bottom"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3px 0",
              backgroundColor: "#201f31",
            }}
          >
            <iframe
              src="/ad"
              title="Sponsored Ad"
              scrolling="no"
              style={{
                width: "100%",
                maxWidth: "728px",
                height: "90px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#201f31",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
