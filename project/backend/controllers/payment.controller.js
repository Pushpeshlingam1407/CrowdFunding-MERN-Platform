import Investment from "../models/Investment.js";
import Project from "../models/project.js";

// Demo/mock payment system — no external Razorpay API calls needed
export const createOrder = async (req, res) => {
  try {
    const { amount, projectId, paymentMethod } = req.body;

    if (!amount || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Amount and project ID are required",
      });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Generate a mock order (no real Razorpay call)
    const mockOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100,
      currency: "INR",
      receipt: `project_${projectId}_${Date.now()}`,
      status: "created",
      projectId,
      paymentMethod,
    };

    res.status(201).json({
      success: true,
      order: mockOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, projectId, amount } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !projectId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // In demo mode we skip real signature verification.
    // The order ID prefix confirms it was created by our own createOrder.
    if (!razorpayOrderId.startsWith("order_")) {
      return res.status(400).json({
        success: false,
        message: "Invalid order reference",
      });
    }

    // Check for existing completed investment to prevent duplicates
    const existingInvestment = await Investment.findOne({
      project: projectId,
      investor: req.user.id,
      status: "completed",
    });

    if (existingInvestment) {
      // Already invested — still return success so UI is not blocked
      const project = await Project.findById(projectId);
      return res.status(200).json({
        success: true,
        message: "Investment already recorded",
        investment: existingInvestment,
        project,
      });
    }

    // Create investment record
    const investment = await Investment.create({
      project: projectId,
      investor: req.user.id,
      amount: Number(amount),
      status: "completed",
      paymentId: razorpayPaymentId,
    });

    // Update project currentAmount
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $inc: { currentAmount: Number(amount) } },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and investment recorded successfully",
      investment,
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
