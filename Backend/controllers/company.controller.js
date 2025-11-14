import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

// REGISTER COMPANY
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) return res.status(400).json({ message: "Company name required", success: false });

    const existing = await Company.findOne({ where: { name: companyName } });
    if (existing) return res.status(400).json({ message: "Company exists", success: false });

    const company = await Company.create({ name: companyName, userId: req.id });
    return res.status(201).json({ message: "Company registered", company, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET ALL COMPANIES
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ where: { userId: req.id } });
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET COMPANY BY ID
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found", success: false });
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// UPDATE COMPANY
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found", success: false });

    if (name) company.name = name;
    if (description) company.description = description;
    if (website) company.website = website;
    if (location) company.location = location;

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      company.logo = cloudResponse.secure_url;
    }

    await company.save();
    return res.status(200).json({ message: "Company updated", company, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
