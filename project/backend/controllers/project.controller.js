import Project from "../models/project.js";
import User from "../models/User.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      equity,
      category,
      targetAmount,
      startDate,
      endDate,
    } = req.body;

    if (!title || !description || !equity || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    let image = "";
    if (req.file) {
      image = `/uploads/projects/${req.file.filename}`;
    }

    const project = await Project.create({
      title,
      description,
      equity,
      category: category || "Other",
      targetAmount,
      startDate,
      endDate,
      image,
      campaignImages: [],
      creator: req.user.id,
      status: "pending",
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdProjects: project._id },
    });

    const io = req.app.get("io");
    io.emit("newProject", project);

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "approved" })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "creator",
      "name email bio",
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.isLocked) {
      return res.status(403).json({
        success: false,
        message: "This campaign is locked and cannot be updated",
      });
    }

    if (project.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const updateData = req.body;

    if (req.file) {
      updateData.image = `/uploads/projects/${req.file.filename}`;
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    const io = req.app.get("io");
    io.emit("projectUpdated", project);

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadCampaignImages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images to this project'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    const imageUrls = req.files.map(file => `/uploads/projects/${file.filename}`);
    
    project.campaignImages = [...(project.campaignImages || []), ...imageUrls];
    await project.save();

    const io = req.app.get("io");
    io.emit("projectUpdated", project);

    res.status(200).json({
      success: true,
      message: "Campaign images uploaded successfully",
      campaignImages: project.campaignImages,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCampaignImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete images from this project'
      });
    }

    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL required",
      });
    }

    project.campaignImages = project.campaignImages.filter(img => img !== imageUrl);
    await project.save();

    const io = req.app.get("io");
    io.emit("projectUpdated", project);

    res.status(200).json({
      success: true,
      message: "Campaign image deleted successfully",
      campaignImages: project.campaignImages,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const lockExpiredProjects = async () => {
  try {
    const now = new Date();
    const result = await Project.updateMany(
      { endDate: { $lt: now }, isLocked: false },
      { $set: { isLocked: true } },
    );
    if (result.modifiedCount > 0) {
      console.log(`Locked ${result.modifiedCount} expired projects.`);
    }
  } catch (error) {
    console.error("Error locking expired projects:", error);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.creator.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(project.creator, {
      $pull: { createdProjects: req.params.id },
    });

    const io = req.app.get("io");
    io.emit("projectDeleted", req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
