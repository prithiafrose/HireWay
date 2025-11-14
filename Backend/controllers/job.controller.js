import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";

// POST JOB
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId)
      return res.status(400).json({ message: "All fields are required", success: false });

    const job = await Job.create({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel: experience,
      position,
      companyId,
      createdBy: req.id,
    });

    return res.status(201).json({ message: "Job posted", job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET ALL JOBS (with optional keyword)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const jobs = await Job.findAll({
      where: {
        title: { [Job.sequelize.Op.like]: `%${keyword}%` },
      },
      include: [Company],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET JOB BY ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, { include: [Company, { model: Application }] });
    if (!job) return res.status(404).json({ message: "Job not found", success: false });
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET ADMIN JOBS
export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { createdBy: req.id }, include: [Company], order: [["createdAt", "DESC"]] });
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
