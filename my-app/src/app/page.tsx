import Link from "next/link";
import { getAllVideos } from "./utils/videoUtils";
import QRCodeGenerator from "./components/QRCodeGenerator";
import styles from "./page.module.css";

export default function Home() {
  const videos = getAllVideos();

  if (videos.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>No videos found</h1>
        <p>Add videos to the public/videos/[country] folders</p>
      </div>
    );
  }

  const videosByCountry = videos.reduce(
    (acc, video) => {
      if (!acc[video.country]) {
        acc[video.country] = [];
      }
      acc[video.country].push(video);
      return acc;
    },
    {} as Record<string, typeof videos>
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <div style={{ padding: "2rem" }}>
          <h1>Video Gallery</h1>
          
          <QRCodeGenerator />
          
          {Object.entries(videosByCountry).map(([country, countryVideos]) => (
            <div key={country} style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  textTransform: "capitalize",
                  borderBottom: "2px solid #ddd",
                  paddingBottom: "0.5rem",
                }}
              >
                {country}
              </h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {countryVideos.map((video) => (
                  <li key={`${video.country}-${video.name}`} style={{ margin: "1rem 0" }}>
                    <Link
                      href={`/${video.country}/${video.name}`}
                      style={{
                        textDecoration: "none",
                        color: "#0070f3",
                        fontSize: "1.1rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {video.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
