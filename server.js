
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }
});

const jobs = new Map();

app.get("/", (req, res) => {
  res.json({
    app: "Super Yodha AI",
    status: "online"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "connected" });
});

app.post(
  "/api/generate",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  (req, res) => {
    const { prompt } = req.body;

    if (
      !prompt &&
      !req.files?.audio &&
      !req.files?.image
    ) {
      return res.status(400).json({
        error: "Story or media required"
      });
    }

    const jobId = crypto.randomUUID();

    jobs.set(jobId, {
      status: "failed",
      progress: 0,
      error: "AI video model is not connected yet."
    });

    res.status(202).json({ jobId });
  }
);

app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.get(req.params.id);

  if (!job) {
    return res.status(404).json({
      error: "Job not found"
    });
  }

  res.json(job);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Super Yodha Backend Running");
});
