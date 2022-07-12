import React from "react";

export default function SmallView(idx, setActive) {
  return (
    <li
      key={idx}
      className={idx == activeIdx ? "click" : ""}
      onClick={() => setActive(idx)}
    >
      <div className="imgbox" style={{ position: "relative" }}>
        <img />
        <div
          className="centered"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "15px",
          }}
        >
          {idx + 1}
        </div>
      </div>
    </li>
  );
}
