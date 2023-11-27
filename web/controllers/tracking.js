import { getLogs, saveLog } from "../services/tracking.js";

export const trackUserData = async (req, res) => {
  const { text } = req.query;
  saveLog(text);

  return res.status(200);
};

export const getTrackingData = async (_req, res) => {
  return getLogs((logs) => res.json(logs));
};
