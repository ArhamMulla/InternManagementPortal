const Intern = require('../models/Intern');

// Get all interns
exports.getAllInterns = async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interns', error });
  }
};

// Create new intern
exports.createIntern = async (req, res) => {
  try {
    const newIntern = new Intern(req.body);
    await newIntern.save();
    res.status(201).json({ message: 'Intern added', intern: newIntern });
  } catch (error) {
    res.status(500).json({ message: 'Error adding intern', error });
  }
};

// Update intern
// exports.updateIntern = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedIntern = await Intern.findOneAndUpdate(
//       { id },
//       req.body,
//       { new: true }
//     );
//     if (!updatedIntern) {
//       return res.status(404).json({ message: 'Intern not found' });
//     }
//     res.json({ message: 'Intern updated successfully', intern: updatedIntern });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating intern', error });
//   }
// };

exports.updateIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedIntern = await Intern.findOneAndUpdate(
      { id: id },        // find by custom id
      updatedData,
      { new: true, runValidators: true, upsert: false }  // ✅ important
    );

    if (!updatedIntern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json(updatedIntern);
  } catch (error) {
    console.error("Error updating intern:", error);
    res.status(500).json({ message: "Error updating intern", error: error.message });
  }
};

// Delete intern
// exports.deleteIntern = async (req, res) => {
//   try {
//     const { id } = req.params.id;
//     const deletedIntern = await Intern.findOneAndDelete({ id });
//     if (!deletedIntern) {
//       return res.status(404).json({ message: 'Intern not found' });
//     }
//     res.json({ message: 'Intern deleted successfully', intern: deletedIntern });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting intern', error });
//   }
// };

exports.deleteIntern = async (req, res) => {
  const internId = req.params.id;  // <-- this comes from the URL
  try {
    // ✅ delete by your own 'id' field, not Mongo's '_id'
    const deletedIntern = await Intern.findOneAndDelete({ id: internId });

    if (!deletedIntern) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    res.json({ message: 'Intern deleted successfully' });
  } catch (error) {
    console.error("Error deleting intern:", error);
    res.status(500).json({ message: 'Error deleting intern', error: error.message });
  }
};
