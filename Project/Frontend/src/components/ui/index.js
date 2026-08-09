import React from "react";
import "./ui.css";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export const Button = ({ variant, className, ...props }) => (
  <button
    className={joinClasses("ui-button", variant === "outline" && "ui-button-outline", className)}
    {...props}
  />
);

export const Input = ({ className, ...props }) => (
  <input className={joinClasses("ui-input", className)} {...props} />
);

export const Card = ({ className, ...props }) => (
  <div className={joinClasses("ui-card", className)} {...props} />
);

export const Container = ({ className, ...props }) => (
  <div className={joinClasses("ui-container", className)} {...props} />
);

export const Flex = ({
  align = "center",
  justify = "flex-start",
  gap = "1rem",
  direction = "row",
  wrap = "nowrap",
  className,
  style,
  ...props
}) => (
  <div
    className={joinClasses("ui-flex", className)}
    style={{ alignItems: align, justifyContent: justify, gap, flexDirection: direction, flexWrap: wrap, ...style }}
    {...props}
  />
);

export const Grid = ({ cols = 1, gap = "2rem", className, style, ...props }) => {
  const gridTemplateColumns = typeof cols === "string" && cols.includes("fr")
    ? cols
    : `repeat(${cols}, 1fr)`;
  const mobileColumns = typeof cols === "number" && cols > 2 ? "repeat(2, 1fr)" : "1fr";

  return (
    <div
      className={joinClasses("ui-grid", className)}
      style={{ gridTemplateColumns, gap, "--ui-grid-tablet-columns": mobileColumns, ...style }}
      {...props}
    />
  );
};

export { default as ImageUpload } from "./ImageUpload";
