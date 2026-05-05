import { mockAsteroids } from "../data/asteroids.mock";

export async function fetchAsteroids() {
    try {
        const res = await fetch(
            "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY"
        );

        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        const list = data?.near_earth_objects;

        if (Array.isArray(list) && list.length > 0) {
            return list;
        }

        throw new Error("Invalid NASA data");
    } catch (e) {
        return mockAsteroids;
    }
}