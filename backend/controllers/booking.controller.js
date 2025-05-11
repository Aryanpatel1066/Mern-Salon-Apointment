const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Service = require("../models/Service.model");
const {transporter} = require("../utils/sendEmail");
   
  const STATIC_LOCATION = "382860 city:vijapur house number 123"; // Or use process.env.SALON_LOCATION

// exports.createBooking = async (req, res) => {
//     try {
//         const { service, date, timeSlot } = req.body;
//         const user = req.user.id;

//         const existingService = await Service.findById(service);
//         if (!existingService) {
//             return res.status(404).json({ message: "Service not found" });
//         }

//         const booking = new Booking({ user, service, date, timeSlot });
//         await booking.save();

//         // ✅ Proper population after save
//         const populatedBooking = await Booking.findById(booking._id)
//             .populate('user', 'name email')
//             .populate('service', 'name description');

//         res.status(201).json(populatedBooking);
//     } catch (error) {
//         res.status(500).json({ message: "Error creating booking", error: error.message });
//     }
// };
exports.createBooking = async (req, res) => {
    try {
      const { service, date, timeSlot } = req.body;
      const user = req.user.id;
  
      const existingService = await Service.findById(service);
      if (!existingService) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      // ❗Check for time conflict
      const existingBooking = await Booking.findOne({date, timeSlot });
      if (existingBooking) {
        return res.status(409).json({ message: "Selected time slot is already booked" });
      }
  
      const booking = new Booking({ user, service, date, timeSlot });
      await booking.save();
  
      const populatedBooking = await Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('service', 'name description');
  
      res.status(201).json(populatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error creating booking", error: error.message });
    }
  };
  



// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("user service");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// get all booking (user )
const mongoose = require("mongoose");

exports.getBookingsByUser = async (req, res) => {
    try {
        console.log("Received Params:", req.params);

        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing in request" });
        }

        console.log("Fetching bookings for user:", userId);

        const bookings = await Booking.find({ user: new mongoose.Types.ObjectId(userId) })
            .populate("user service");

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

         
        const sanitizedBookings = bookings.map(booking => {
            const user = { ...booking.user._doc };
            delete user.password;  
            return { ...booking._doc, user };
        });

        res.status(200).json(sanitizedBookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};
 


// Update a booking (User can update only their own, Admin can update any)
// exports.updateBooking = async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.id);
//         if (!booking) return res.status(404).json({ message: "Booking not found" });

//         // User can update only their own booking
//         if (req.user.role !== "admin" && booking.user.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized" });
//         }

//         Object.assign(booking, req.body);
//         await booking.save();
//         res.status(200).json(booking);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating booking", error });
//     }
// };



// Update booking status (Admin only)
// exports.updateBookingStatus = async (req, res) => {
//     try {
//         if (req.user.role !== "admin") {
//             return res.status(403).json({ message: "Only admins can update booking status" });
//         }

//         const booking = await Booking.findById(req.params.id);
//         if (!booking) return res.status(404).json({ message: "Booking not found" });

//         booking.status = req.body.status;
//         await booking.save();
//         res.status(200).json({ message: "Booking status updated", booking });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating booking status", error });
//     }
// };

 
exports.updateBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update booking status" });
    }

    const booking = await Booking.findById(req.params.id).populate("user").populate("service");  

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status;
    await booking.save();

    // Send email based on status
    const { email, name } = booking.user;
     const { name: serviceName } = booking.service;
    const date = new Date(booking.date).toLocaleDateString();
    const time = booking.timeSlot;


    let subject, text;

  if (booking.status === "confirmed") {
      subject = "Your Booking is Confirmed!";
      text = `Hi ${name || "User"},\n
      \nYour booking for "${serviceName}" has been confirmed.\n
      \n📅 Date: ${date}\n⏰ Time: ${time}
      \n📍 Location: ${STATIC_LOCATION}\n
      \n✅ Check your status in your profile
      \n💫"Time is Money so please come on time , without someone else on your sloat"
      \nThank you for booking with us!\n
      \nSalonBlis App Team`;
    } else if (booking.status === "cancelled") {
      subject = "Your Booking Has Been Cancelled";
      text = `Hi ${name || "User"},\n
      \nYour booking for "${serviceName}" on 📅${date} at⏰ ${time} has been cancelled.\n
      \nIf this was unexpected, please reach out to our support team.\n
      \nSalonBlis App Team`;
    }

    if (subject && text) {
      await transporter.sendMail({
        from: `"Salon App Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text,
      });
    }


    res.status(200).json({ message: "Booking status updated and email sent", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status", error });
  }
};

// Delete a booking ADmin only
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // User can delete only their own booking
        if (req.user.role !== "admin" && booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await booking.deleteOne();
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error });
    }
};

exports.countBooking = async(req,res)=>{
    try{
     const bookingCount = await Booking.countDocuments();
     res.json({
        count:bookingCount
     })
    }
    catch(err){
        res.status(500).json({
            message:"faild to count booking"
        })
    }
}