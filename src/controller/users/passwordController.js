import crypto from "crypto";
import UserModel from "../../models/user.model.js";
import sgMail from "../../config/sendgrid.js";

export const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;

        user.resetPasswordExpires = Date.now() + 1000 * 60 * 15;
        await user.save();

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

           const result = await sgMail.send({
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: "Reset Password",
        html: `
            <h2>Reset Password</h2>
            <p>Click below to reset your password:</p>

            <a href="${resetLink}">
                Reset Password
            </a>

            <p>This link expires in 15 minutes.</p>
        `,
    });
        return res.json({
            message: "Reset link sent successfully"
        });

    } catch (err) {
    return res.status(500).json({
      message: err.message,
      sendgrid: err.response?.body || null,
    });
  }

};

export const resetPassword = async (req, res) => {

    try {

        const { token, password } = req.body;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await UserModel.findOne({

            resetPasswordToken: hashedToken,

            resetPasswordExpires: {
                $gt: Date.now()
            }

        });

        if (!user) {

            return res.status(400).json({
                message: "Invalid or expired token"
            });

        }

        const hashPassword = await bcrypt.hash(password, 10);

        user.password = hashPassword;

        user.resetPasswordToken = "";

        user.resetPasswordExpires = null;

        await user.save();

        return res.json({
            message: "Password reset successful"
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

};