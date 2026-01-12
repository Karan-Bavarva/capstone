
// import { Request, Response } from "express";
// import PDFDocument from "pdfkit";
// import User from "../models/User";
// import Course from "../models/Course";
// import Enrollment from "../models/Enrollment";
// import { failure } from "../utils/response";

// export const downloadCertificate = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?._id;
//     const courseTitle = req.query.course;
//     if (!userId || !courseTitle) {
//       return failure(res, "Missing user or course info");
//     }
//     // Find course by title
//     const course = await Course.findOne({ title: courseTitle });
//     if (!course) return failure(res, "Course not found");
//     // Find enrollment and check completion
//     const enrollment = await Enrollment.findOne({ student: userId, course: course._id });
//     if (!enrollment || enrollment.progressPercent !== 100) {
//       return failure(res, "Certificate not available. Course not completed.");
//     }
//     // Get user
//     const user = await User.findById(userId);
    
//     // Generate Professional PDF Certificate
//     const doc = new PDFDocument({ 
//       size: 'A4', 
//       layout: 'landscape',
//       margins: { top: 50, bottom: 50, left: 50, right: 50 }
//     });
    
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="certificate-${course._id}.pdf"`);

//     // Colors
//     const primaryColor = '#10b981'; // Green
//     const secondaryColor = '#047857'; // Dark green
//     const textColor = '#1f2937';
//     const lightGray = '#9ca3af';

//     // Decorative border
//     doc.lineWidth(3);
//     doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
//        .stroke(primaryColor);
    
//     doc.lineWidth(1);
//     doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
//        .stroke(secondaryColor);

//     // Header with logo placeholder
//     doc.fontSize(16)
//        .fillColor(primaryColor)
//        .font('Helvetica-Bold')
//        .text('EduPlatform', 60, 70, { align: 'left' });

//     // Certificate Title
//     doc.fontSize(48)
//        .fillColor(secondaryColor)
//        .font('Helvetica-Bold')
//        .text('Certificate of Completion', 0, 150, { 
//          align: 'center',
//          width: doc.page.width
//        });

//     // Decorative line under title
//     const lineY = 215;
//     const lineWidth = 200;
//     const centerX = doc.page.width / 2;
//     doc.moveTo(centerX - lineWidth / 2, lineY)
//        .lineTo(centerX + lineWidth / 2, lineY)
//        .lineWidth(2)
//        .stroke(primaryColor);

//     // Certification text
//     doc.fontSize(18)
//        .fillColor(textColor)
//        .font('Helvetica')
//        .text('This is to certify that', 0, 260, { 
//          align: 'center',
//          width: doc.page.width
//        });

//     // Student name (prominent)
//     doc.fontSize(36)
//        .fillColor(secondaryColor)
//        .font('Helvetica-Bold')
//        .text(user?.name || 'Student Name', 0, 300, { 
//          align: 'center',
//          width: doc.page.width
//        });

//     // Underline for name
//     doc.moveTo(250, 345)
//        .lineTo(doc.page.width - 250, 345)
//        .lineWidth(1)
//        .stroke(lightGray);

//     // Completion text
//     doc.fontSize(18)
//        .fillColor(textColor)
//        .font('Helvetica')
//        .text('has successfully completed the course', 0, 370, { 
//          align: 'center',
//          width: doc.page.width
//        });

//     // Course title (highlighted)
//     doc.fontSize(28)
//        .fillColor(primaryColor)
//        .font('Helvetica-Bold')
//        .text(`"${course.title}"`, 100, 410, { 
//          align: 'center',
//          width: doc.page.width - 200
//        });

//     // Footer section
//     const footerY = 490;
    
//     // Date
//     doc.fontSize(14)
//        .fillColor(textColor)
//        .font('Helvetica')
//        .text(`Completion Date: ${new Date(enrollment.updatedAt || Date.now()).toLocaleDateString('en-US', { 
//          year: 'numeric', 
//          month: 'long', 
//          day: 'numeric' 
//        })}`, 0, footerY, { 
//          align: 'center',
//          width: doc.page.width
//        });

//     // Signature line
//     const signatureY = 520;
//     const signatureWidth = 150;
    
//     doc.moveTo(150, signatureY)
//        .lineTo(150 + signatureWidth, signatureY)
//        .stroke(lightGray);
    
//     doc.fontSize(12)
//        .fillColor(lightGray)
//        .font('Helvetica-Oblique')
//        .text('Authorized Signature', 150, signatureY + 5, {
//          width: signatureWidth,
//          align: 'center'
//        });

//     // Platform branding
//     doc.moveTo(doc.page.width - 300, signatureY)
//        .lineTo(doc.page.width - 150, signatureY)
//        .stroke(lightGray);
    
//     doc.fontSize(12)
//        .fillColor(lightGray)
//        .font('Helvetica-Bold')
//        .text('EduPlatform', doc.page.width - 300, signatureY + 5, {
//          width: 150,
//          align: 'center'
//        });

//     doc.end();
//     doc.pipe(res);
//   } catch (err: any) {
//     return failure(res, 'Error generating certificate', err?.message || err);
//   }
// };


import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import User from "../models/User";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import { failure } from "../utils/response";

export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const courseTitle = req.query.course;
    if (!userId || !courseTitle) {
      return failure(res, "Missing user or course info");
    }
    // Find course by title
    const course = await Course.findOne({ title: courseTitle });
    if (!course) return failure(res, "Course not found");
    // Find enrollment and check completion
    const enrollment = await Enrollment.findOne({ student: userId, course: course._id });
    if (!enrollment || enrollment.progressPercent !== 100) {
      return failure(res, "Certificate not available. Course not completed.");
    }
    // Get user
    const user = await User.findById(userId);
    
    // Generate Professional PDF Certificate
    const doc = new PDFDocument({ 
      size: 'A4', 
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${course._id}.pdf"`);

    // Colors
    const primaryColor = '#10b981'; // Green
    const secondaryColor = '#047857'; // Dark green
    const textColor = '#1f2937';
    const lightGray = '#9ca3af';

    // Decorative border
    doc.lineWidth(3);
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
       .stroke(primaryColor);
    
    doc.lineWidth(1);
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
       .stroke(secondaryColor);

    // Header with logo placeholder
    doc.fontSize(16)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text('EduPlatform', 60, 70, { align: 'left' });

    // Certificate Title
    doc.fontSize(48)
       .fillColor(secondaryColor)
       .font('Helvetica-Bold')
       .text('Certificate of Completion', 0, 150, { 
         align: 'center',
         width: doc.page.width
       });

    // Decorative line under title
    const lineY = 215;
    const lineWidth = 200;
    const centerX = doc.page.width / 2;
    doc.moveTo(centerX - lineWidth / 2, lineY)
       .lineTo(centerX + lineWidth / 2, lineY)
       .lineWidth(2)
       .stroke(primaryColor);

    // Certification text
    doc.fontSize(18)
       .fillColor(textColor)
       .font('Helvetica')
       .text('This is to certify that', 0, 260, { 
         align: 'center',
         width: doc.page.width
       });

    // Student name (prominent)
    doc.fontSize(36)
       .fillColor(secondaryColor)
       .font('Helvetica-Bold')
       .text(user?.name || 'Student Name', 0, 300, { 
         align: 'center',
         width: doc.page.width
       });

    // Underline for name
    doc.moveTo(250, 345)
       .lineTo(doc.page.width - 250, 345)
       .lineWidth(1)
       .stroke(lightGray);

    // Completion text
    doc.fontSize(18)
       .fillColor(textColor)
       .font('Helvetica')
       .text('has successfully completed the course', 0, 370, { 
         align: 'center',
         width: doc.page.width
       });

    // Course title (highlighted)
    doc.fontSize(28)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text(`"${course.title}"`, 100, 410, { 
         align: 'center',
         width: doc.page.width - 200
       });

    // Footer section
    const footerY = 490;
    
    // Date
    doc.fontSize(14)
       .fillColor(textColor)
       .font('Helvetica')
       .text(`Completion Date: ${new Date(enrollment.updatedAt || Date.now()).toLocaleDateString('en-US', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       })}`, 0, footerY, { 
         align: 'center',
         width: doc.page.width
       });

     // 🔹 Digital Certificate Notice (BOTTOM CENTERED)
    doc.fontSize(12)
    .fillColor("#6B7280")
    .font("Helvetica-Oblique")
    .text(
      "* This is a Digital Certificate. Signature is not required.",
      doc.page.margins.left,                      // ⬅ start after left margin
      doc.page.height - 70,                       // ⬇ bottom position
      {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        align: "center"
      }
    );

    doc.end();
    doc.pipe(res);
  } catch (err: any) {
    return failure(res, 'Error generating certificate', err?.message || err);
  }
};
