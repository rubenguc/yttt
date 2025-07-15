"use server";
import axios from "axios";

const base = axios.create({
  baseURL: "https://api.xl8.ai/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.XL8_API_KEY}`,
  },
});

export const requestTranscription = async (url: string) => {
  try {
    const response = await base.post("/autotemplate/request", {
      language: "en",
      media_url: url,
      quick_sync: true,
    });

    return response.data;
  } catch (err) {
    console.error("requestTranscription error:", err?.response?.data);
    throw new Error("Failed to request transcription");
  }
};

export const getTranscriptionStatus = async (request_id) => {
  try {
    const response = await base.get(
      `https://api.xl8.ai/v1/autotemplate/requests/${request_id}`,
    );

    return response.data;
  } catch (err) {
    console.error("getTranscriptionStatus error:", err?.response?.data);
    throw new Error("Failed to request transcription");
  }
};

export const getEncodedTranscription = async (request_id: string) => {
  try {
    const response = await base.get(
      `https://api.xl8.ai/v1/autotemplate/request/file/srt/${request_id}`,
    );

    return response.data.encoded_subtitle;
  } catch (err) {
    console.error("getEncodedTranscription error:", err?.response?.data);
    throw new Error("Failed to request transcription");
  }
};
