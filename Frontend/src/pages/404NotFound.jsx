import React, { useState, useEffect } from "react";
import "../styles/404NotFound.css";

const useDocumentEvent = (event, handler) => {
    useEffect(() => {
        document.addEventListener(event, handler);
        return () => document.removeEventListener(event, handler);
    }, [event, handler]);
};

const useMouseParallax = (...depths) => {
    const [coords, setCoords] = useState(depths.map(() => ({ x: 0, y: 0 })));

    useDocumentEvent("mousemove", (e) => {
        requestAnimationFrame(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const x = e.clientX / width - 0.5;
            const y = e.clientY / height - 0.5;

            setCoords(
                depths.map((depth) => ({
                    x: depth * x,
                    y: depth * y,
                }))
            );
        });
    });

    return coords;
};

const Cactus = ({ x, y, scale }) => (
    <g
        className="cactus"
        style={{
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            transformOrigin: "center",
            transformBox: "fill-box",
        }}
    >
        <path d="m276.5 542.8c0 0-51.3-1.1-86-35.8c-38.6-38.6-38.9-75.8-38.9-75.8v-94.2c0 0-0.3-27.7 28.6-27.7c28.9 0 28.7 27.7 28.7 27.7v69.6c0 0 2 22.9 19.5 44.1c17.4 21.1 49.1 19.4 49.1 19.4v-287.8c0 0 0.2-43.7 42-43.7c37.4 0 44.1 38.6 44.1 38.6v264.2c0 0 29.4-4.3 48.1-22.5c18.7-18.1 19.5-44 19.5-44v-103.5c0 0-2.5-31.2 27.3-31.2c28.2 0 29 27.1 29 27.1v130.1c0 0 1.5 40.8-38.9 79.4c-38.2 36.6-86.1 37.4-86.1 37.4v120.9c-14.2 1.9-28.7 2.9-43.5 2.9c-14.1 0-28-0.9-41.6-2.7z" />
    </g>
);

const Canyon = () => {
    const [p1, p2, p3, p4] = useMouseParallax(-200, -100, 50, 120);

    return (
        <svg viewBox="0 0 2000 720">
            <text
                x="1000"
                y="400"
                textAnchor="middle"
                style={{
                    transform: `translate(${p4.x}px, ${p4.y}px)`,
                }}
            >
                404
            </text>

            <g
                style={{
                    transform: `translate(${p1.x}px, ${p1.y}px)`,
                }}
            >
                <Cactus x={200} y={200} scale={0.4} />
                <Cactus x={1200} y={200} scale={0.5} />
            </g>
        </svg>
    );
};

const NotFound = () => {
    return (
        <div className="app404">
            <div className="text-container">
                <h1>Page Not Found</h1>
                <p>Sorry, this page does not exist.</p>
                <a href="/home">Go Back Home</a>
            </div>

            <Canyon />
        </div>
    );
};

export default NotFound;