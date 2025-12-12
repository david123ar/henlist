// src/components/SauceSlab.js
'use client';

import React, { useState, useCallback } from 'react';

const STORAGE_KEY = 'henpro_unlocked_titles';

function getUnlockedTitles() {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

function setUnlockedTitle(title) {
    if (typeof window === 'undefined') return;
    const unlocked = getUnlockedTitles();
    unlocked[title] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
}

function copyToClipboard(text, container, originalBg) {
    navigator.clipboard.writeText(text).then(() => {
        const originalShadow = container.style.boxShadow;
        container.style.background =
            'linear-gradient(to right, #00CC00, #008000)';
        container.style.boxShadow = '0 0 15px rgba(0, 204, 0, 0.7)';

        setTimeout(() => {
            container.style.background = originalBg;
            container.style.boxShadow = originalShadow;
        }, 500);
    });
}

export default function SauceSlab({
    title,
    index,
    totalPosts,
    theme,
    isVisible,
    isNextUpcoming,
    onUnlock
}) {
    const [isRevealed, setIsRevealed] = useState(false);

    const isPermanentlyUnlocked = !!getUnlockedTitles()[title];
    const postNumber = totalPosts - index;
    const originalBg = theme.linkBg;
    const linkColor = theme.linkColor;
    const postNumberColor = theme.avatarBorder;

    const finalDisplayState = isVisible && (isPermanentlyUnlocked || isRevealed);

    const handleClick = useCallback(
        (e) => {
            const container = e.currentTarget;

            if (!isVisible || finalDisplayState) {
                if (finalDisplayState) {
                    copyToClipboard(title, container, originalBg);
                }
                return;
            }

            if (!isRevealed) {
                setIsRevealed(true);
                setTimeout(() => {
                    setUnlockedTitle(title);
                    onUnlock(title);
                }, 3000);
            }
        },
        [
            isVisible,
            finalDisplayState,
            isRevealed,
            title,
            originalBg,
            onUnlock
        ]
    );

    let content,
        linkStyle,
        isClickable = false;

    if (!isVisible && isNextUpcoming) {
        linkStyle = {
            background: 'rgba(0, 0, 0, 0.4)',
            opacity: 0.5,
            cursor: 'default',
            boxShadow: 'none'
        };
        content = (
            <div
                style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: linkColor
                }}
            >
                <span style={{ color: postNumberColor, marginRight: 5 }}>
                    #{postNumber}
                </span>
                Coming Soon...
            </div>
        );
    } else if (isVisible) {
        isClickable = true;

        if (finalDisplayState) {
            linkStyle = {
                background: originalBg,
                boxShadow: theme.linkShadow
            };
            content = (
                <div
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: linkColor
                    }}
                >
                    <span style={{ color: postNumberColor, marginRight: 5 }}>
                        #{postNumber}:
                    </span>
                    {title}
                    <span
                        style={{
                            display: 'block',
                            fontSize: '0.8rem',
                            opacity: 0.8
                        }}
                    >
                        (Click to Copy)
                    </span>
                </div>
            );
        } else {
            linkStyle = {
                background: originalBg,
                boxShadow: theme.linkShadow
            };
            content = (
                <div
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: linkColor
                    }}
                >
                    <span style={{ color: postNumberColor, marginRight: 5 }}>
                        #{postNumber}
                    </span>
                    Sauce (Click to Reveal)
                </div>
            );

            if (isRevealed) {
                linkStyle = {
                    background: theme.linkHoverBg,
                    boxShadow: theme.linkHoverShadow
                };
                content = (
                    <div
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: linkColor
                        }}
                    >
                        <span
                            style={{
                                display: 'block',
                                marginBottom: 4
                            }}
                        >
                            #{postNumber} The Sauce is:
                        </span>
                        <span
                            style={{
                                fontSize: '1.2rem',
                                color: postNumberColor
                            }}
                        >
                            {title}
                        </span>
                    </div>
                );
            }
        }
    } else {
        return null;
    }

    return (
        <div
            className="bio-link"
            data-post-number={postNumber}
            data-title={title.toLowerCase()}
            style={{
                ...linkStyle,
                cursor: isClickable ? 'pointer' : 'default'
            }}
            onClick={isClickable ? handleClick : null}
        >
            {content}
        </div>
    );
}
