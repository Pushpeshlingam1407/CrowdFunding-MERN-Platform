import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, attachments } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      attachments
    });

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name profileImage')
    .populate('receiver', 'name profileImage');

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
