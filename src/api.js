import { promise } from "./lib";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getStory(storyId) {
  return promise(fetch(`${API_BASE_URL}/stories/${storyId}`));
}

export function getReadStats() {
  return promise(fetch(`${API_BASE_URL}/reads?_embed=user`));
}

export function addReadStat(data) {
  const randomReader = Math.floor(Math.random() * 20) + 101;
  const body = {
    story: data.family,
    start_reading_at: new Date(),
    end_reading_at: null,
    userId: randomReader.toString(),
  };

  return promise(
    fetch(`${API_BASE_URL}/reads`, {
      method: "POST",
      body: JSON.stringify(body),
    })
  );
}

export function updateReadStat(readId) {
  const options = {
    method: "PATCH",
    body: JSON.stringify({
      end_reading_at: new Date(),
    }),
  };
    
  return promise(fetch(`${API_BASE_URL}/reads/${readId}`, options));
}
