import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Contact, ContactDocument } from "./schemas/contact.schema";
import { Model } from "mongoose";
import { CreateContactDto } from "./dto/create-contact.dto";

import * as nodemailer from "nodemailer";

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      // ===============================
      // Save to Database
      // ===============================

      const contact = await this.contactModel.create(createContactDto);

      // ===============================
      // Mail Configuration
      // ===============================

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // ===============================
      // Mail to Admin
      // ===============================

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: process.env.SENDER_EMAIL,
        subject: "📩 New Contact Inquiry",

        html: `
        <h2>New Contact Form Submission</h2>

        <table border="1" cellpadding="10" cellspacing="0">
          <tr>
            <td><strong>Name</strong></td>
            <td>${createContactDto.name}</td>
          </tr>

          <tr>
            <td><strong>Email / Phone</strong></td>
            <td>${createContactDto.emailOrPhone}</td>
          </tr>

          <tr>
            <td><strong>Organization</strong></td>
            <td>${createContactDto.school || "N/A"}</td>
          </tr>

          <tr>
            <td><strong>Message</strong></td>
            <td>${createContactDto.message}</td>
          </tr>
        </table>
        `,
      });

      // ===============================
      // Confirmation Mail to User
      // ===============================

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,

        to: createContactDto.emailOrPhone,

        subject: "Thank you for contacting STEM Innovation Nepal",

        html: `
        <h2>Hello ${createContactDto.name},</h2>

        <p>
        Thank you for contacting
        <strong>STEM Innovation Nepal.</strong>
        </p>

        <p>
        We have received your inquiry and our team
        will contact you shortly.
        </p>

        <br/>

        <b>Your Submitted Details</b>

        <ul>
          <li>Name : ${createContactDto.name}</li>
          <li>Organization : ${createContactDto.school || "N/A"}</li>
          <li>Message : ${createContactDto.message}</li>
        </ul>

        <br/>

        Regards,
        <br/>
        STEM Innovation Nepal
        `,
      });

      return {
        success: true,
        message: "Inquiry submitted successfully.",
        contact,
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        "Failed to submit inquiry",
      );
    }
  }
}