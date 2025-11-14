import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// APPLY JOB
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const existing = await Application.findOne({ where: { jobId, applicantId: userId } });
    if (existing) return res.status(400).json ({ message: "Already applied", success: false });

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    await Application.create({ jobId, applicantId: userId });
    return res.status(201).json({ message: "Applied successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET APPLIED JOBS
export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.id },
      include: [{ model: Job, include: [User, Company] }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ applications, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET APPLICANTS FOR JOB
export const getApplicants = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: Application, include: [User] }],
    });
    if (!job) return res.status(404).json({ message: "Job not found", success: false });
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// UPDATE APPLICATION STATUS
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found", success: false });

    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
