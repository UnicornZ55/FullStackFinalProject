export const submitFeedback = async (req, res) => {
  console.log("Feedback:", req.body);
  res.json({ message: "Feedback received" });
};