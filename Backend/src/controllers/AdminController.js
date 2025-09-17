const { ApprovedUser } = require("../models/userModels");

const approveUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const UserId = ApprovedUser(userId)
        if (UserId) {
            res.status(200).json({ message: "User approved successfully" });
        }

    } catch (error) {
        console.error("Approve error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports ={approveUser}