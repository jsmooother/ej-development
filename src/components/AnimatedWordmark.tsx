"use client";

import React from "react";

type AnimatedWordmarkProps = {
  text: string;
  className?: string;
};

export default function AnimatedWordmark({ text, className }: AnimatedWordmarkProps) {
  return (
    <span className={`wordmark inline-block select-none ${className ?? ""}`} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="wordmark-letter inline-block will-change-transform"
          style={{ animationDelay: `${index * 22}ms` }}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );
}
