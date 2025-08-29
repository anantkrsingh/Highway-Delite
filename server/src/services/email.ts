import nodemailer from "nodemailer";

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}


export async function sendEmail(options: EmailOptions): Promise<void> {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Highway Delite" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });

        console.log(`✅ Email sent to ${options.to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email could not be sent");
    }
}
