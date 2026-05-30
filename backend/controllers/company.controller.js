import Company from "../models/company.model.js";

/* ================= Register Company ================= */
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    // Check if company already exists
    let company = await Company.findOne({ name: companyName });

    if (company) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

    // Create new company
    company = await Company.create({
      name: companyName,
      userId: req.id, // comes from isAuthenticated middleware
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


/* ================= Get All Companies (Logged-in User) ================= */
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


/* ================= Get Company By ID ================= */
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


/* ================= Update Company ================= */
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // 🔐 Optional: Ownership check (Highly Recommended)
    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "Unauthorized to update this company",
        success: false,
      });
    }

    // Update fields
    company.name = name || company.name;
    company.description = description || company.description;
    company.website = website || company.website;
    company.location = location || company.location;

    await company.save();

    return res.status(200).json({
      message: "Company updated successfully",
      company,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};