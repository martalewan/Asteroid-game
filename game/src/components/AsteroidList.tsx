import { useEffect, useState } from "react";

function AsteroidList() {
    const [asteroids, setAsteroids] = useState([]);

    useEffect(() => {
        fetch("https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY")
            .then((res) => res.json())
            .then((data) => {
                setAsteroids(data.near_earth_objects);
            });
    }, []);

    return (
        <div>
            <h2>Asteroids</h2>
            {asteroids.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {asteroids.slice(0, 10).map((asteroid) => (
                        <li key={asteroid.id}>
                            {asteroid.name} — Diameter:{" "}
                            {Math.round(
                                asteroid.estimated_diameter.meters.estimated_diameter_max
                            )}{" "}
                            m
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AsteroidList;